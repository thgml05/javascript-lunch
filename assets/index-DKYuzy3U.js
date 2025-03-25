var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _list, _filteredList, _category, _sortBy;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createElement = ({
  tag,
  type = "",
  name = "",
  id = "",
  htmlFor = "",
  classList = [],
  textContent = ""
}) => {
  const element = document.createElement(tag);
  if (type !== "") element.setAttribute("type", type);
  if (name !== "") element.setAttribute("name", name);
  if (id !== "") element.setAttribute("id", id);
  if (htmlFor !== "") element.setAttribute("for", htmlFor);
  if (classList.length !== 0) element.classList.add(...classList);
  if (textContent !== "") element.textContent = textContent;
  return element;
};
const Button = (props) => {
  return createElement({
    tag: "button",
    type: props.type,
    id: props.id,
    classList: [...props.class, "text-caption", "button"],
    textContent: props.name
  });
};
const title = {
  category: "카테고리",
  distance: "거리 (도보 이동 시간)",
  name: "이름",
  description: "설명",
  link: "참고 링크"
};
const getOptionValue = (name, option) => {
  if (name === "distance") {
    return `${option}분 내`;
  }
  return option;
};
const OptionInput = (name, options2) => {
  const formItem = createElement({
    tag: "div",
    classList: ["form-item", "form-item--required"]
  });
  formItem.innerHTML = `
  <label for="${name}">${title[name]}</label>
                <select name=${name} id=${name}>
                  <option value="">선택해 주세요</option>
                ${options2.map(
    (option) => `<option value="${option}">${getOptionValue(
      name,
      option
    )}</option>`
  ).join("")}
                </select>
  `;
  return formItem;
};
const TextArea = (name, helpText2, colRow = { col: 30, row: 5 }) => {
  const formItem = createElement({ tag: "div", classList: ["form-item"] });
  formItem.innerHTML = `
  <label for="${name}">${title[name]}</label>
                <textarea
                  name="${name}"
                  id="${name}"
                  cols="${colRow.col}"
                  rows="${colRow.row}"
                ></textarea>
                <span class="help-text text-caption"
                  >${helpText2}</span
                >
  `;
  return formItem;
};
const TextInput = (name, isRequired, helpText2) => {
  const formItem = createElement({ tag: "div", classList: ["form-item"] });
  if (isRequired) formItem.classList.add("form-item--required");
  formItem.innerHTML = `
                <label for="${name}">${title[name]}</label>
                <input type="text" name="${name}" id="${name}" />
  `;
  if (helpText2) {
    const span = createElement({
      tag: "span",
      classList: ["help-text", "text-caption"]
    });
    span.innerText = helpText2;
    formItem.appendChild(span);
  }
  return formItem;
};
const helpText = {
  description: "메뉴 등 추가 정보를 입력해 주세요.",
  link: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const options = {
  category: ["한식", "중식", "일식", "양식", "아시안", "기타"],
  distance: ["5", "10", "15", "20", "25", "30"],
  sortCategory: {
    전체: "전체",
    한식: "한식",
    중식: "중식",
    일식: "일식",
    양식: "양식",
    아시안: "아시안",
    기타: "기타"
  },
  sortFilter: { name: "이름순", distance: "거리순" }
};
const formValidate = {
  MAX_NAME_LENGTH: 20,
  MIN_NAME_LENGTH: 1,
  MAX_DESC_LENGTH: 300
};
const errorMessage = {
  EMPTY_SELECTOR: "필수 입력란입니다.",
  NAME_LENGTH: "이름은 최소 1자 이상 최대 20자까지 가능합니다.",
  DESC_LENGTH: "설명은 최대 300자까지 가능합니다.",
  LINK_FORM: "참고 링크 형식에 맞게 입력해주세요."
};
const regex = {
  LINK_REGEX: /^(https?:\/\/)?www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
};
const validate = {
  emptySelector(value) {
    if (value === "") throw new Error(errorMessage.EMPTY_SELECTOR);
  },
  nameLength(name) {
    if (name.length > formValidate.MAX_NAME_LENGTH || name.length < formValidate.MIN_NAME_LENGTH)
      throw new Error(errorMessage.NAME_LENGTH);
  },
  descLength(desc) {
    if (desc.length > formValidate.MAX_DESC_LENGTH)
      throw new Error(errorMessage.DESC_LENGTH);
  },
  linkForm(link) {
    if (link.length !== 0 && !regex.LINK_REGEX.test(link))
      throw new Error(errorMessage.LINK_FORM);
  }
};
const IMG_SRC = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png",
  MODAL_ICON_SRC: "./add-button.png",
  STAR_ICON_LINED: "./favorite-icon-lined.png",
  STAR_ICON_FILLED: "./favorite-icon-filled.png"
};
const storeData = [
  {
    id: "1",
    category: "한식",
    name: "피양콩할마니",
    dist: "10",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "#",
    isFavorite: false
  },
  {
    id: "2",
    category: "중식",
    name: "친친",
    dist: "5",
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: "#",
    isFavorite: false
  },
  {
    id: "3",
    category: "양식",
    name: "이태리키친",
    dist: "20",
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "#",
    isFavorite: false
  },
  {
    id: "4",
    category: "아시안",
    name: "호아빈 삼성점",
    dist: "15",
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "#",
    isFavorite: false
  },
  {
    id: "5",
    category: "기타",
    name: "도스타코스 선릉점",
    dist: "5",
    description: "멕시칸 캐주얼 그릴",
    link: "#",
    isFavorite: false
  }
];
const storage = {
  // 초기 데이터 셋팅
  setStorage: () => {
    if (window.localStorage.length === 0) {
      storeData.forEach((store) => {
        window.localStorage.setItem(
          JSON.stringify(store.id),
          JSON.stringify(store)
        );
      });
    }
  },
  // 로컬 스토리지 아이템 가져오기
  getStorageItems: () => {
    let items = [];
    const keys = Object.keys(window.localStorage);
    for (const key of keys) {
      const item = window.localStorage.getItem(key);
      if (item) items.push(JSON.parse(item));
    }
    return items;
  },
  // 로컬 스토리지 아이템 즐겨찾기 반영
  updateIsFavorite(id) {
    const store = window.localStorage.getItem(JSON.stringify(id));
    if (store) {
      const jsonStore = JSON.parse(store);
      jsonStore.isFavorite = !jsonStore.isFavorite;
      window.localStorage.setItem(
        JSON.stringify(jsonStore.id),
        JSON.stringify(jsonStore)
      );
    }
  }
};
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = { randomUUID };
function v4(options2, buf, offset) {
  var _a;
  if (native.randomUUID && true && !options2) {
    return native.randomUUID();
  }
  options2 = options2 || {};
  const rnds = options2.random ?? ((_a = options2.rng) == null ? void 0 : _a.call(options2)) ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const storeRenderer = {
  // 식당 리스트 업데이트
  updateStore: (storeList, e) => {
    const newStore = storeRenderer.createStore(e);
    try {
      e.preventDefault();
      validate.emptySelector(newStore.category);
      validate.nameLength(newStore.name);
      validate.emptySelector(newStore.dist);
      validate.descLength(newStore.description);
      validate.linkForm(newStore.link);
      storeList.updateList(newStore);
      window.localStorage.setItem(
        JSON.stringify(newStore.id),
        JSON.stringify(newStore)
      );
      document.querySelector(".all-restaurant-button").classList.add("onMenuBar");
      document.querySelector(".favorite-restaurant-button").classList.remove("onMenuBar");
      document.querySelector(".restaurant-filter-container").classList.add("filter-open");
      storeList.applyFilterAndSort(false);
      storeRenderer.rerenderStoreList(storeList.filteredList);
      document.querySelector(".modal-form").reset();
      modalRenderer.closeModal(".modal-add-store");
    } catch (error) {
      storeRenderer.checkRequired("category", newStore.category, error);
      storeRenderer.checkRequired("name", newStore.name, error);
      storeRenderer.checkRequired("distance", newStore.dist, error);
    }
  },
  // 필수 조건 확인
  checkRequired: (inputName, value, error) => {
    if (value === "") {
      const inputElement = document.querySelector(`#${inputName}`);
      modalRenderer.addErrorText(inputElement, error);
    }
  },
  // 새로운 식당 데이터 생성
  createStore: (e) => {
    const data = new FormData(e.target);
    return {
      id: v4(),
      category: data.get("category"),
      name: data.get("name"),
      dist: data.get("distance"),
      description: data.get("description"),
      link: data.get("link"),
      isFavorite: false
    };
  },
  // 식당 리스트 요소 제거
  removeStoreElements: () => {
    document.querySelector(".restaurant-list").replaceChildren();
  },
  // 식당 필터링
  filterStore: (storeList, e) => {
    storeList.filterStoreList(e.target.value);
    storeRenderer.rerenderStoreList(storeList.filteredList);
  },
  // 식당 정렬
  sortStore: (storeList, e) => {
    storeList.sortStoreList(e.target.value);
    storeRenderer.rerenderStoreList(storeList.filteredList);
  },
  // 즐겨찾기 수정
  toggleFavorite: (storeList, starIcon, storeId) => {
    const storeInfo = storeList.list.find((store) => store.id === storeId);
    storeInfo.isFavorite = !storeInfo.isFavorite;
    starIcon.setAttribute(
      "src",
      storeInfo.isFavorite ? IMG_SRC.STAR_ICON_FILLED : IMG_SRC.STAR_ICON_LINED
    );
    const isFavorite = document.querySelector(".onMenuBar").classList.contains("favorite-restaurant-button");
    storage.updateIsFavorite(storeId);
    storeList.updateIsFavorite(storeId, isFavorite);
  },
  // 모든 음식점 / 자주 가는 음식점 메뉴바 셋팅
  setMenuBar: (storeList, e) => {
    const button = e.target.closest(".menuBar-button");
    const buttonText = button.querySelector(".button-text").textContent;
    storeList.filterByMenuBar(buttonText);
    if (buttonText === "모든 음식점") {
      document.querySelector("#category-filter").value = "전체";
      document.querySelector("#sorting-filter").value = "name";
      document.querySelector(".restaurant-filter-container").classList.add("filter-open");
      document.querySelector(".all-restaurant-button").classList.add("onMenuBar");
      document.querySelector(".favorite-restaurant-button").classList.remove("onMenuBar");
    }
    if (buttonText === "자주 가는 음식점") {
      document.querySelector(".restaurant-filter-container").classList.remove("filter-open");
      document.querySelector(".favorite-restaurant-button").classList.add("onMenuBar");
      document.querySelector(".all-restaurant-button").classList.remove("onMenuBar");
    }
    storeRenderer.rerenderStoreList(storeList.filteredList);
  },
  // 식당 삭제
  deleteStore: (storeList) => {
    const modal = document.querySelector(".modal-store-detail");
    const storeId = modal.querySelector(".modal-container").getAttribute("id");
    window.localStorage.removeItem(JSON.stringify(storeId));
    const isFavorite = document.querySelector(".onMenuBar").classList.contains("favorite-restaurant-button");
    storeList.deleteStore(storeId, isFavorite);
    modalRenderer.closeModal(".modal-store-detail");
    storeRenderer.rerenderStoreList(storeList.filteredList);
  },
  rerenderStoreList(list) {
    storeRenderer.removeStoreElements();
    list.forEach((store) => {
      Store(store);
    });
  }
};
const modalRenderer = {
  // 모달창 닫기
  closeModal: (selector) => {
    document.querySelector(selector).classList.remove("modal--open");
  },
  // **모달 입력 폼**
  // 폼 추가
  addForm: (storeList) => {
    const modal = document.querySelector(".modal-add-store");
    const modalContainer = modal.querySelector(".modal-container");
    modalContainer.innerHTML = `<h2 class="modal-title text-title">새로운 음식점</h2>
    <form class="modal-form"></form>`;
    const modalForm = document.querySelector(".modal-form");
    modalForm.appendChild(OptionInput("category", options.category));
    modalForm.appendChild(TextInput("name", true));
    modalForm.appendChild(OptionInput("distance", options.distance));
    modalForm.appendChild(TextArea("description", helpText.description));
    modalForm.appendChild(TextInput("link", false, helpText.link));
    modalForm.appendChild(
      modalRenderer.addButtons([
        {
          name: "취소하기",
          type: "button",
          class: ["button--secondary"],
          id: "cancel-button"
        },
        {
          name: "추가하기",
          type: "submit",
          class: ["button--primary"],
          id: "add-button"
        }
      ])
    );
    modalRenderer.addFormCheck();
    document.querySelector("#cancel-button").addEventListener("click", () => {
      document.querySelector(".modal-form").reset();
      modalRenderer.closeModal(".modal-add-store");
    });
    document.querySelector(".modal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      storeRenderer.updateStore(storeList, e);
    });
  },
  // 버튼 추가
  addButtons: (buttonProps) => {
    const buttonContainer = createElement({
      tag: "div",
      classList: ["button-container"]
    });
    buttonProps.forEach((props) => {
      buttonContainer.appendChild(Button(props));
    });
    return buttonContainer;
  },
  // 폼 입력 검증
  addFormCheck: () => {
    const nameInput = document.querySelector("#name");
    const descInput = document.querySelector("#description");
    const linkInput = document.querySelector("#link");
    const categorySelect = document.querySelector("#category");
    const distSelect = document.querySelector("#distance");
    modalRenderer.checkInput(nameInput, validate.nameLength);
    modalRenderer.checkInput(descInput, validate.descLength);
    modalRenderer.checkInput(linkInput, validate.linkForm);
    modalRenderer.checkInput(categorySelect, validate.emptySelector, "change");
    modalRenderer.checkInput(distSelect, validate.emptySelector, "change");
  },
  // 버튼 활성화 체크
  checkInput: (input, validate2, type = "input") => {
    const addButton = document.querySelector("#add-button");
    input.addEventListener(type, (e) => {
      try {
        validate2(e.target.value);
        modalRenderer.removeErrorText(input);
        addButton.classList.remove("disabled-button");
        addButton.disabled = false;
      } catch (e2) {
        modalRenderer.addErrorText(input, e2);
        addButton.classList.add("disabled-button");
        addButton.disabled = true;
      }
    });
  },
  // 입력 폼 에러 메시지 추가
  addErrorText: (input, e) => {
    if (!input.classList.contains("form-item--error")) {
      input.classList.add("form-item--error");
      const parentNode = input.parentNode;
      const errorText = createElement({
        tag: "span",
        classList: ["error-text"]
      });
      errorText.innerText = e.message;
      parentNode.appendChild(errorText);
    }
  },
  // 입력 폼 에러 메시지 제거
  removeErrorText: (input) => {
    if (input.parentNode.querySelector(".error-text")) {
      input.classList.remove("form-item--error");
      input.parentNode.removeChild(
        input.parentNode.querySelector(".error-text")
      );
    }
  }
  // **식당 상세 정보**
};
const Modal = (storeList, classList) => {
  const modal = createElement({
    tag: "div",
    classList: ["modal", ...classList]
  });
  const modalBackdrop = createElement({
    tag: "div",
    classList: ["modal-backdrop"]
  });
  const modalContainer = createElement({
    tag: "div",
    classList: ["modal-container"]
  });
  modal.appendChild(modalBackdrop);
  modal.appendChild(modalContainer);
  document.querySelector("main").appendChild(modal);
  document.querySelector(".modal-backdrop").addEventListener("click", () => modalRenderer.closeModal());
};
const Select = ({
  name = "",
  id = "",
  classList = [],
  options: options2,
  handleChange
}) => {
  const select = createElement({
    tag: "select",
    name,
    id,
    classList
  });
  select.innerHTML = `
  ${Object.keys(options2).map((key) => `<option value="${key}">${options2[key]}</option>`).join("")}`;
  select.addEventListener("change", handleChange);
  return select;
};
class StoreList {
  constructor(data) {
    __privateAdd(this, _list);
    __privateAdd(this, _filteredList);
    __privateAdd(this, _category);
    __privateAdd(this, _sortBy);
    __privateSet(this, _list, data);
    __privateSet(this, _filteredList, data);
    __privateSet(this, _category, Object.keys(options.sortCategory)[0]);
    __privateSet(this, _sortBy, Object.keys(options.sortFilter)[0]);
    this.sortStoreList(__privateGet(this, _sortBy));
  }
  get list() {
    return __privateGet(this, _list);
  }
  get filteredList() {
    return __privateGet(this, _filteredList);
  }
  // 식당 추가
  updateList(store) {
    __privateGet(this, _list).push(store);
    this.applyFilterAndSort(false);
  }
  // 즐겨찾기 등록
  updateIsFavorite(id, isFavoriteMenu) {
    __privateSet(this, _list, __privateGet(this, _list).map((store) => {
      if (store.id === id) !store.isFavorite;
      return store;
    }));
    if (!isFavoriteMenu) {
      this.filterStoreList(__privateGet(this, _category));
      this.sortStoreList(__privateGet(this, _sortBy));
    } else {
      __privateSet(this, _filteredList, __privateGet(this, _list).filter((store) => store.isFavorite));
    }
  }
  filterByMenuBar(menu) {
    if (menu === "모든 음식점") {
      this.filterStoreList("전체");
      this.sortStoreList("name");
    } else if (menu === "자주 가는 음식점") {
      __privateSet(this, _filteredList, __privateGet(this, _list).filter((store) => store.isFavorite));
      this.sortStoreList("name");
    }
  }
  // 식당 삭제
  deleteStore(id, isFavorite) {
    __privateSet(this, _list, __privateGet(this, _list).filter((store) => store.id !== id));
    this.applyFilterAndSort(isFavorite);
  }
  // id로 식당 정보 찾기
  filterByStoreId(id) {
    return __privateGet(this, _list).find((store) => store.id === id);
  }
  applyFilterAndSort(isFavorite) {
    if (!isFavorite) {
      this.filterStoreList(__privateGet(this, _category));
    } else {
      __privateSet(this, _filteredList, __privateGet(this, _list).filter((store) => store.isFavorite));
    }
    this.sortStoreList(__privateGet(this, _sortBy));
  }
  // 카테고리 필터 적용
  filterStoreList(category) {
    if (category === "전체") __privateSet(this, _filteredList, __privateGet(this, _list));
    else __privateSet(this, _filteredList, __privateGet(this, _list).filter((l) => l.category === category));
    __privateSet(this, _category, category);
    this.sortStoreList(__privateGet(this, _sortBy));
  }
  // 정렬 적용
  sortStoreList(sortBy) {
    if (sortBy === "name")
      __privateGet(this, _filteredList).sort(
        (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      );
    if (sortBy === "distance")
      __privateGet(this, _filteredList).sort((a, b) => Number(a.dist) - Number(b.dist));
    __privateSet(this, _sortBy, sortBy);
  }
}
_list = new WeakMap();
_filteredList = new WeakMap();
_category = new WeakMap();
_sortBy = new WeakMap();
const Store$1 = (storeProps) => {
  const imgSrc = getImgSrc(storeProps.category);
  const list = createElement({
    tag: "li",
    id: storeProps.id,
    classList: ["restaurant"]
  });
  list.innerHTML = `
    <div class="restaurant__category">
      <img src="${imgSrc}" alt=${storeProps.category} class="category-icon" />
    </div>
    <div class="restaurant__info">
      <h3 class="restaurant__name text-subtitle">${storeProps.name}</h3>
      <span class="restaurant__distance text-body">캠퍼스부터 ${storeProps.dist}분 내</span>
      <p class="restaurant__description text-body">
        ${storeProps.description}
      </p>
    </div>
    <div>
      <img src=${storeProps.isFavorite ? IMG_SRC.STAR_ICON_FILLED : IMG_SRC.STAR_ICON_LINED} alt="star-icon" class="star-icon">
    </div>
`;
  document.querySelector(".restaurant-list").appendChild(list);
};
const getImgSrc = (category) => {
  return IMG_SRC[category];
};
const initRenderer = {
  // 카테고리/정렬 드롭박스 셋팅
  setRestaurantFilter: (storeList) => {
    document.querySelector(".restaurant-filter-container").classList.add("filter-open");
    const categorySelect = Select({
      name: "category",
      id: "category-filter",
      classList: ["restaurant-filter"],
      options: options.sortCategory,
      handleChange: (e) => storeRenderer.filterStore(storeList, e)
    });
    document.querySelector(".restaurant-filter-container").appendChild(categorySelect);
    const sortSelect = Select({
      name: "sorting",
      id: "sorting-filter",
      classList: ["restaurant-filter"],
      options: options.sortFilter,
      handleChange: (e) => storeRenderer.sortStore(storeList, e)
    });
    document.querySelector(".restaurant-filter-container").appendChild(sortSelect);
  },
  setStoreList: () => {
    storage.setStorage();
    const storeList = new StoreList(storage.getStorageItems());
    storeList.list.forEach((store) => {
      Store$1(store);
    });
    return storeList;
  }
};
const uiBasicText = {
  HEADER_TEXT: "오늘 뭐 먹지",
  ALL_MENUBAR_TEXT: "모든 음식점",
  FAVORITE_MENUBAR_TEXT: "자주 가는 음식점"
};
const MenuBar = (storeList) => {
  const container = document.querySelector(".restaurant-menuBar-container");
  const allButton = createElement({
    tag: "button",
    classList: ["all-restaurant-button", "menuBar-button", "onMenuBar"]
  });
  const allButtonText = createElement({
    tag: "span",
    classList: ["all-restaurant-button-text", "button-text"],
    textContent: uiBasicText.ALL_MENUBAR_TEXT
  });
  const favoriteButton = createElement({
    tag: "button",
    classList: ["favorite-restaurant-button", "menuBar-button"]
  });
  const favoriteButtonText = createElement({
    tag: "span",
    classList: ["favorite-restaurant-button-text", "button-text"],
    textContent: uiBasicText.FAVORITE_MENUBAR_TEXT
  });
  allButton.appendChild(allButtonText);
  favoriteButton.appendChild(favoriteButtonText);
  container.append(allButton, favoriteButton);
  document.querySelector(".restaurant-menuBar-container").addEventListener("click", (e) => {
    storeRenderer.setMenuBar(storeList, e);
  });
};
const Header = (title2) => {
  const header = document.querySelector(".header");
  header.innerHTML = `
    <h1 class="gnb__title text-title">${title2}</h1>
    <button type="button" class="gnb__button" aria-label="음식점 추가">
      <img src=${IMG_SRC.MODAL_ICON_SRC} alt="음식점 추가" />
    </button>
    `;
  document.querySelector(".gnb__button").addEventListener("click", () => {
    document.querySelector(".modal-add-store").classList.add("modal--open");
  });
};
addEventListener("load", () => {
  const storeList = initRenderer.setStoreList();
  Header(uiBasicText.HEADER_TEXT);
  initRenderer.setRestaurantFilter(storeList);
  MenuBar(storeList);
  Modal(storeList, ["modal-add-store"]);
  modalRenderer.addForm(storeList);
  Modal(storeList, ["modal-store-detail"]);
  document.querySelector(".restaurant-list").addEventListener("click", (e) => {
    const starIcon = e.target.closest(".star-icon");
    if (starIcon) {
      const store2 = e.target.closest(".restaurant");
      const storeId2 = store2.getAttribute("id");
      const icon = store2.querySelector(".star-icon");
      storeRenderer.toggleFavorite(storeList, icon, storeId2);
      storeRenderer.rerenderStoreList(storeList.filteredList);
    }
    const storeInfo = e.target.closest(".restaurant__info");
    if (!storeInfo) return;
    const storeId = e.target.closest(".restaurant").getAttribute("id");
    const store = storeList.filterByStoreId(storeId);
    document.querySelector(".modal-store-detail").classList.add("modal--open");
    modalRenderer.setStoreInfoModal(store, storeList);
  });
});

"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_config_index = require("../config/index.js");
const uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("./z-paging-constant.js");
const storageKey = "Z-PAGING-REFRESHER-TIME-STORAGE-KEY";
let config = null;
let configLoaded = false;
const timeoutMap = {};
function gc(key, defaultValue) {
  return () => {
    _handleDefaultConfig();
    if (!config)
      return defaultValue;
    const value = config[key];
    return value === void 0 ? defaultValue : value;
  };
}
function getTouch(e) {
  let touch = null;
  if (e.touches && e.touches.length) {
    touch = e.touches[0];
  } else if (e.changedTouches && e.changedTouches.length) {
    touch = e.changedTouches[0];
  } else if (e.datail && e.datail != {}) {
    touch = e.datail;
  } else {
    return { touchX: 0, touchY: 0 };
  }
  return {
    touchX: touch.clientX,
    touchY: touch.clientY
  };
}
function getTouchFromZPaging(target) {
  if (target && target.tagName && target.tagName !== "BODY" && target.tagName !== "UNI-PAGE-BODY") {
    const classList = target.classList;
    if (classList && classList.contains("z-paging-content")) {
      return {
        isFromZp: true,
        isPageScroll: classList.contains("z-paging-content-page"),
        isReachedTop: classList.contains("z-paging-reached-top"),
        isUseChatRecordMode: classList.contains("z-paging-use-chat-record-mode")
      };
    } else {
      return getTouchFromZPaging(target.parentNode);
    }
  } else {
    return { isFromZp: false };
  }
}
function getParent(parent) {
  if (!parent)
    return null;
  if (parent.$refs.paging)
    return parent;
  return getParent(parent.$parent);
}
function consoleErr(err) {
  common_vendor.index.__f__("error", "at uni_modules/z-paging/components/z-paging/js/z-paging-utils.js:71", `[z-paging]${err}`);
}
function delay(callback, ms = uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime, key) {
  const timeout = setTimeout(callback, ms);
  if (!!key) {
    timeoutMap[key] && clearTimeout(timeoutMap[key]);
    timeoutMap[key] = timeout;
  }
  return timeout;
}
function setRefesrherTime(time, key) {
  const datas = getRefesrherTime() || {};
  datas[key] = time;
  common_vendor.index.setStorageSync(storageKey, datas);
}
function getRefesrherTime() {
  return common_vendor.index.getStorageSync(storageKey);
}
function getRefesrherTimeByKey(key) {
  const datas = getRefesrherTime();
  return datas && datas[key] ? datas[key] : null;
}
function getRefesrherFormatTimeByKey(key, textMap) {
  const time = getRefesrherTimeByKey(key);
  const timeText = time ? _timeFormat(time, textMap) : textMap.none;
  return `${textMap.title}${timeText}`;
}
function convertToPx(text) {
  const dataType = Object.prototype.toString.call(text);
  if (dataType === "[object Number]")
    return text;
  let isRpx = false;
  if (text.indexOf("rpx") !== -1 || text.indexOf("upx") !== -1) {
    text = text.replace("rpx", "").replace("upx", "");
    isRpx = true;
  } else if (text.indexOf("px") !== -1) {
    text = text.replace("px", "");
  }
  if (!isNaN(text)) {
    if (isRpx)
      return Number(common_vendor.index.upx2px(text));
    return Number(text);
  }
  return 0;
}
function getTime() {
  return (/* @__PURE__ */ new Date()).getTime();
}
function getInstanceId() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 10; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  }
  return s.join("") + getTime();
}
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function addUnit(value, unit) {
  if (Object.prototype.toString.call(value) === "[object String]") {
    let tempValue = value;
    tempValue = tempValue.replace("rpx", "").replace("upx", "").replace("px", "");
    if (value.indexOf("rpx") === -1 && value.indexOf("upx") === -1 && value.indexOf("px") !== -1) {
      tempValue = parseFloat(tempValue) * 2;
    }
    value = tempValue;
  }
  return unit === "rpx" ? value + "rpx" : value / 2 + "px";
}
function _handleDefaultConfig() {
  if (configLoaded)
    return;
  if (uni_modules_zPaging_components_zPaging_config_index.zLocalConfig && Object.keys(uni_modules_zPaging_components_zPaging_config_index.zLocalConfig).length) {
    config = uni_modules_zPaging_components_zPaging_config_index.zLocalConfig;
  }
  if (!config && common_vendor.index.$zp) {
    config = common_vendor.index.$zp.config;
  }
  config = config ? Object.keys(config).reduce((result, key) => {
    result[_toCamelCase(key)] = config[key];
    return result;
  }, {}) : null;
  configLoaded = true;
}
function _timeFormat(time, textMap) {
  const date = new Date(time);
  const currentDate = /* @__PURE__ */ new Date();
  const dateDay = new Date(time).setHours(0, 0, 0, 0);
  const currentDateDay = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
  const disTime = dateDay - currentDateDay;
  let dayStr = "";
  const timeStr = _dateTimeFormat(date);
  if (disTime === 0) {
    dayStr = textMap.today;
  } else if (disTime === -864e5) {
    dayStr = textMap.yesterday;
  } else {
    dayStr = _dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
  }
  return `${dayStr} ${timeStr}`;
}
function _dateDayFormat(date, showYear = true) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return showYear ? `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}` : `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
}
function _dateTimeFormat(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}
function _fullZeroToTwo(str) {
  str = str.toString();
  return str.length === 1 ? "0" + str : str;
}
function _toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, group1) => group1.toUpperCase());
}
const u = {
  gc,
  setRefesrherTime,
  getRefesrherFormatTimeByKey,
  getTouch,
  getTouchFromZPaging,
  getParent,
  convertToPx,
  getTime,
  getInstanceId,
  consoleErr,
  delay,
  wait,
  addUnit
};
exports.u = u;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/z-paging-utils.js.map

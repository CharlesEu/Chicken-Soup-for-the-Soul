"use strict";
const common_vendor = require("../common/vendor.js");
function showToast(title = "", icon = "none", mask = true) {
  let posttion = icon == "none" ? "bottom" : "center";
  common_vendor.index.showToast({
    title,
    icon,
    mask,
    posttion
  });
}
const stateLists = [
  {
    "value": 0,
    "text": "审核中",
    "color": "#F3A73F",
    "bgColor": "#FDEDD9"
  },
  {
    "value": 1,
    "text": "审核通过",
    "color": "#18BC37",
    "bgColor": "#D1F2D7"
  },
  {
    "value": 2,
    "text": "审核不通过",
    "color": "#E43D33",
    "bgColor": "#FAD8D6"
  }
];
function stateFormat(value) {
  return stateLists.find((item) => item.value == value);
}
function isAdminRole() {
  return common_vendor.nr.getCurrentUserInfo().role.includes("admin") ? true : false;
}
exports.isAdminRole = isAdminRole;
exports.showToast = showToast;
exports.stateFormat = stateFormat;
exports.stateLists = stateLists;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/common.js.map

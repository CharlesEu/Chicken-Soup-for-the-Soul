"use strict";
function getCurrentDayOfWeek() {
  const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const currentDate = /* @__PURE__ */ new Date();
  const dayOfWeekIndex = currentDate.getDay();
  return daysOfWeek[dayOfWeekIndex];
}
function removeHtmlTags(text) {
  return text.replace(/<[^>]*>/g, "");
}
function daysFromTimestamp(timestamp) {
  const now = (/* @__PURE__ */ new Date()).getTime();
  const diff = now - timestamp;
  const oneDay = 24 * 60 * 60 * 1e3;
  return Math.floor(diff / oneDay);
}
function formatDate(timestamp, format = "yyyy-MM-dd hh:mm:ss") {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return format.replace("yyyy", year).replace("MM", month).replace("dd", day).replace("hh", hours).replace("mm", minutes).replace("ss", seconds);
}
function formatGender(value) {
  const genderMap = {
    0: "保密",
    1: "男",
    2: "女"
  };
  return genderMap[value] || "保密";
}
function truncateString(str, num) {
  if (str.length > num) {
    return str.substring(0, num) + "...";
  } else {
    return str;
  }
}
exports.daysFromTimestamp = daysFromTimestamp;
exports.formatDate = formatDate;
exports.formatGender = formatGender;
exports.getCurrentDayOfWeek = getCurrentDayOfWeek;
exports.removeHtmlTags = removeHtmlTags;
exports.truncateString = truncateString;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/tools.js.map

"use strict";
function handleQuery(callback) {
  try {
    setTimeout(function() {
      _getApp().globalData.zp_handleQueryCallback = callback;
    }, 1);
  } catch (e) {
  }
}
function _handleQuery(pageNo, pageSize, from, lastItem) {
  const callback = _getApp().globalData.zp_handleQueryCallback;
  return callback ? callback(pageNo, pageSize, from, lastItem) : [pageNo, pageSize, from];
}
function handleLanguage2Local(callback) {
  try {
    setTimeout(function() {
      _getApp().globalData.zp_handleLanguage2LocalCallback = callback;
    }, 1);
  } catch (e) {
  }
}
function _handleLanguage2Local(language, local) {
  const callback = _getApp().globalData.zp_handleLanguage2LocalCallback;
  return callback ? callback(language, local) : local;
}
function _getApp() {
  return getApp();
}
const interceptor = {
  handleQuery,
  _handleQuery,
  handleLanguage2Local,
  _handleLanguage2Local
};
exports.interceptor = interceptor;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor.js.map

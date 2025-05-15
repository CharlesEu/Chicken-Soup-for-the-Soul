"use strict";
const common_vendor = require("./common/vendor.js");
const db = common_vendor.nr.database();
db.on("error", ({ code, message }) => {
  if (code == "TOKEN_INVALID_ANONYMOUS_USER") {
    common_vendor.index.__f__("log", "at permission.js:6", code);
  }
  if (code == "PERMISSION_ERROR") {
    common_vendor.index.showModal({
      title: "警告",
      content: message,
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        }
      }
    });
  }
  common_vendor.index.__f__("log", "at permission.js:22", code);
  common_vendor.index.__f__("log", "at permission.js:23", message);
});
//# sourceMappingURL=../.sourcemap/mp-weixin/permission.js.map

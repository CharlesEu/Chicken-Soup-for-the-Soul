"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_user = require("./stores/user.js");
const utils_common = require("./utils/common.js");
require("./permission.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/self/self.js";
  "./pages/detail/detail.js";
  "./pages/detail/reply.js";
  "./pages/login/login.js";
  "./pages/login/auto_login.js";
  "./pages_self/soup/edit.js";
  "./pages_self/soup/list.js";
  "./pages_self/user/edit.js";
  "./pages_self/reviewed/list.js";
  "./pages_self/score/list.js";
  "./pages_self/like/list.js";
  "./pages_coop/index/index.js";
  "./pages_coop/write/add.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.nr.importObject("uni-id-co");
    const userStore = stores_user.useUserStore();
    common_vendor.onLaunch(() => {
      if (common_vendor.nr.getCurrentUserInfo().tokenExpired - Date.now() < 1e3 * 60 * 60 * 5) {
        userStore.logout();
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:16", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:20", "App Hide");
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.showToast = utils_common.showToast;
  app.use(common_vendor.createPinia());
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map

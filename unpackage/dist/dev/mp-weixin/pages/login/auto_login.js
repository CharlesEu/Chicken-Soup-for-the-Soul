"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "auto_login",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const uniIdCo = common_vendor.nr.importObject("uni-id-co");
    let uniIdRedirectUrl;
    common_vendor.onLoad(async (e) => {
      uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
      let login = await common_vendor.index.login();
      let res = await uniIdCo.loginByWeixin({
        code: login.code
      });
      userStore.loginSuccess({
        ...res,
        showToast: false,
        uniIdRedirectUrl
      });
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/auto_login.js.map

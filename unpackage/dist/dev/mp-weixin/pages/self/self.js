"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const stores_counter = require("../../stores/counter.js");
const stores_user = require("../../stores/user.js");
const utils_common = require("../../utils/common.js");
const utils_tools = require("../../utils/tools.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "self",
  setup(__props) {
    stores_counter.useCounterStore();
    const userStore = stores_user.useUserStore();
    const db = common_vendor.nr.database();
    const dataset = common_vendor.ref({
      soup: 0,
      like: 0,
      scores: 0
    });
    const getUserDataset = async () => {
      let soup = db.collection("soup-chicken").where(`user_id == $cloudEnv_uid && status==1`).count();
      let like = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).count();
      let scores = db.collection("soup-scores").where(`user_id ==  $cloudEnv_uid`).orderBy("create_date", "desc").limit(1).get({ getOne: true });
      Promise.all([soup, like, scores]).then((res) => {
        var _a, _b;
        common_vendor.index.__f__("log", "at pages/self/self.vue:203", res);
        dataset.value.soup = res[0].result.total;
        dataset.value.like = res[1].result.total;
        dataset.value.scores = ((_b = (_a = res[2].result) == null ? void 0 : _a.data) == null ? void 0 : _b.balance) ?? 0;
      });
    };
    getUserDataset();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(utils_system.getNavBarHeight)() + "px",
        b: common_vendor.unref(userStore).userInfo.avatar || "../../static/images/defAvatar.png",
        c: common_vendor.t(common_vendor.unref(utils_tools.truncateString)(common_vendor.unref(userStore).userInfo.username, 8)),
        d: common_vendor.t(common_vendor.unref(utils_tools.daysFromTimestamp)(common_vendor.unref(userStore).userInfo.register_date)),
        e: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        f: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "xxm-highlight-fill",
          size: "18",
          color: "#fff"
        }),
        g: common_vendor.t(dataset.value.soup),
        h: common_vendor.p({
          type: "right",
          size: "18",
          color: "#999"
        }),
        i: common_vendor.unref(utils_common.isAdminRole)()
      }, common_vendor.unref(utils_common.isAdminRole)() ? {
        j: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "xxm-edit-fill",
          size: "18",
          color: "#fff"
        }),
        k: common_vendor.p({
          type: "right",
          size: "18",
          color: "#999"
        })
      } : {}, {
        l: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "xxm-heart-fill",
          color: "#fff",
          size: "18"
        }),
        m: common_vendor.t(dataset.value.like),
        n: common_vendor.p({
          type: "right",
          size: "18",
          color: "#999"
        }),
        o: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "xxm-hourglass-fill",
          size: "18",
          color: "#fff"
        }),
        p: common_vendor.t(dataset.value.scores),
        q: common_vendor.p({
          type: "right",
          size: "18",
          color: "#999"
        }),
        r: common_vendor.p({
          type: "pyq",
          color: "#fff",
          size: "18"
        }),
        s: common_vendor.p({
          type: "right",
          size: "22",
          color: "#999"
        }),
        t: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "xxm-message-fill",
          size: "18",
          color: "#fff"
        }),
        v: common_vendor.p({
          type: "right",
          size: "22",
          color: "#999"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f94a969d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/self/self.js.map

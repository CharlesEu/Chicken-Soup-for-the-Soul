"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tools = require("../../utils/tools.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_load_more2 + _component_template + _easycom_z_paging2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_z_paging)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const paging = common_vendor.ref(null);
    const scoreData = common_vendor.ref([]);
    const db = common_vendor.nr.database();
    const balance = common_vendor.computed(() => scoreData.value.length ? scoreData.value[0].balance : 0);
    const queryList = (pageNo, pageSize) => {
      getScoreList(pageNo, pageSize);
    };
    async function getScoreList(pageNo, pageSize) {
      let skip = (pageNo - 1) * pageSize;
      try {
        let { result: { data, errCode } } = await db.collection("soup-scores").where(`user_id == $cloudEnv_uid`).orderBy("create_date", "desc").skip(skip).limit(pageSize).get();
        if (errCode != 0)
          return;
        common_vendor.index.__f__("log", "at pages_self/score/list.vue:68", data);
        paging.value.complete(data);
      } catch (e) {
        paging.value.complete(false);
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          status: "loading"
        }),
        b: common_vendor.t(balance.value),
        c: common_vendor.f(scoreData.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.type == 1
          }, item.type == 1 ? {} : {}, {
            b: item.type == 2
          }, item.type == 2 ? {} : {}, {
            c: common_vendor.t(item.comment),
            d: common_vendor.t(item._id),
            e: common_vendor.t(common_vendor.unref(utils_tools.formatDate)(item.create_date)),
            f: item.type == 1
          }, item.type == 1 ? {} : {}, {
            g: common_vendor.t(item.score),
            h: item._id
          });
        }),
        d: common_vendor.sr(paging, "7be1db1b-0", {
          "k": "paging"
        }),
        e: common_vendor.o(queryList),
        f: common_vendor.o(($event) => scoreData.value = $event),
        g: common_vendor.p({
          ["default-page-size"]: 10,
          ["empty-view-text"]: "还没有积分",
          modelValue: scoreData.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7be1db1b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_self/score/list.js.map

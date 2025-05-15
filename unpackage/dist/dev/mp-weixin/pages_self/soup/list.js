"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_soup_item2 = common_vendor.resolveComponent("soup-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_load_more2 + _easycom_soup_item2 + _easycom_z_paging2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_soup_item = () => "../../components/soup-item/soup-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_soup_item + _easycom_z_paging)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    stores_user.useUserStore();
    const soupData = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    const db = common_vendor.nr.database();
    const queryList = (pageNo, pageSize) => {
      getSoupList(pageNo, pageSize);
    };
    const getSoupList = async (pageNo, pageSize) => {
      let skip = (pageNo - 1) * pageSize;
      try {
        let { result: { errCode, data } } = await db.collection("soup-chicken").where(`user_id == $cloudEnv_uid`).field("publish_date,last_modify_date,content,soup_type,like_count,collect_count,comment_count,status").orderBy("last_modify_date", "desc").skip(skip).limit(pageSize).get();
        if (errCode != 0)
          return;
        paging.value.complete(data);
      } catch (e) {
        paging.value.complete(false);
      }
    };
    common_vendor.index.$on("soupUpdate", (e) => {
      common_vendor.nextTick$1(() => {
        paging.value.reload();
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          status: "loading"
        }),
        b: common_vendor.f(soupData.value, (item, k0, i0) => {
          return {
            a: "8e58995f-2-" + i0 + ",8e58995f-0",
            b: common_vendor.p({
              item
            }),
            c: item._id
          };
        }),
        c: common_vendor.sr(paging, "8e58995f-0", {
          "k": "paging"
        }),
        d: common_vendor.o(queryList),
        e: common_vendor.o(($event) => soupData.value = $event),
        f: common_vendor.p({
          ["safe-area-inset-bottom"]: true,
          modelValue: soupData.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8e58995f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_self/soup/list.js.map

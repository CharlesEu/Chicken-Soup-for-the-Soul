"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_coop_item2 = common_vendor.resolveComponent("coop-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_uni_load_more2 + _easycom_coop_item2 + _easycom_z_paging2 + _easycom_uni_fab2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_coop_item = () => "../../components/coop-item/coop-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_coop_item + _easycom_z_paging + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const db = common_vendor.nr.database();
    const dbCmd = db.command;
    const coopData = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    async function queryList(pageNo, pageSize) {
      let skip = (pageNo - 1) * pageSize;
      let coopTemp = db.collection("chicken-coop").where({
        is_delete: dbCmd.neq(true),
        status: 1
      }).getTemp();
      let userTemp = await db.collection("uni-id-users").field("_id,username,avatar").getTemp();
      let { result: { errCode, data } } = await db.collection(coopTemp, userTemp).field("arrayElemAt(user_id,0) as userInfo,content,picurls,is_delete,publish_ip,publish_date,status,publish_address").orderBy("publish_date", "desc").skip(skip).limit(pageSize).get();
      data.forEach((item) => {
        item.picurls = item.picurls.map((pic) => pic + "?imageMogr2/thumbnail/200x");
      });
      if (data.length > 5)
        data.splice(5, 0, { ad: true });
      common_vendor.index.__f__("log", "at pages_coop/index/index.vue:47", data);
      paging.value.complete(data);
    }
    const goAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages_coop/write/add"
      });
    };
    const delRowEnv = () => {
      paging.value.refresh();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          status: "loading"
        }),
        b: coopData.value.length
      }, coopData.value.length ? {
        c: common_vendor.f(coopData.value, (item, k0, i0) => {
          return common_vendor.e({
            a: !item.ad
          }, !item.ad ? {
            b: common_vendor.o(delRowEnv, item._id),
            c: "469d434d-2-" + i0 + ",469d434d-0",
            d: common_vendor.p({
              item
            })
          } : {}, {
            e: item._id
          });
        })
      } : {}, {
        d: common_vendor.sr(paging, "469d434d-0", {
          "k": "paging"
        }),
        e: common_vendor.o(queryList),
        f: common_vendor.o(($event) => coopData.value = $event),
        g: common_vendor.p({
          ["default-page-size"]: 10,
          ["empty-view-text"]: "暂无数据",
          modelValue: coopData.value
        }),
        h: common_vendor.sr("fab", "469d434d-3"),
        i: common_vendor.o(goAdd),
        j: common_vendor.p({
          pattern: {
            icon: "compose"
          },
          horizontal: "right",
          vertical: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-469d434d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_coop/index/index.js.map

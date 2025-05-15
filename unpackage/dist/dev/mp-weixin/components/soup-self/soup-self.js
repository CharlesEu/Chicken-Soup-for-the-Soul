"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_soup_item2 = common_vendor.resolveComponent("soup-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_load_more2 + _easycom_soup_item2 + _easycom_z_paging2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_soup_item = () => "../soup-item/soup-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_soup_item + _easycom_z_paging)();
}
const _sfc_main = {
  __name: "soup-self",
  setup(__props) {
    const soupData = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    const db = common_vendor.nr.database();
    const queryList = (pageNo, pageSize) => {
      getSoupList();
    };
    const getSoupList = async (pageNo, pageSize) => {
      let likeTemp = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).getTemp();
      let soupTemp = db.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp();
      let { result: { errCode, data } } = await db.collection(likeTemp, soupTemp).field(`		
		create_date as publish_date,
		arrayElemAt(soup_id._id, 0) as _id,
		arrayElemAt(soup_id.content, 0) as content,
		arrayElemAt(soup_id.like_count, 0) as like_count,
		arrayElemAt(soup_id.collect_count, 0) as collect_count,
		arrayElemAt(soup_id.comment_count, 0) as comment_count,
		arrayElemAt(soup_id.soup_type, 0) as soup_type,
		arrayElemAt(soup_id.status, 0) as status
	`).orderBy("publish_date", "desc").get();
      if (errCode != 0)
        return utils_common.showToast("操作有误");
      if (data.length > 3)
        data.splice(3, 0, { ad: true });
      paging.value.complete(data);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          status: "loading"
        }),
        b: common_vendor.f(soupData.value, (item, k0, i0) => {
          return common_vendor.e({
            a: !item.ad
          }, !item.ad ? {
            b: "ffda5a5e-2-" + i0 + ",ffda5a5e-0",
            c: common_vendor.p({
              item,
              isEdit: false
            })
          } : {}, {
            d: item._id
          });
        }),
        c: common_vendor.sr(paging, "ffda5a5e-0", {
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ffda5a5e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/soup-self/soup-self.js.map

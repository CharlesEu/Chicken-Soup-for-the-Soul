"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "coop-item",
  props: { item: Object },
  emits: ["delRowEnv"],
  setup(__props, { emit: __emit }) {
    const current_id = common_vendor.ref(common_vendor.nr.getCurrentUserInfo().uid);
    const emit = __emit;
    const props = __props;
    const db = common_vendor.nr.database();
    function clickPic(index) {
      let picurls = props.item.picurls.map((item) => item.replace("?imageMogr2/thumbnail/200x", ""));
      common_vendor.index.previewImage({
        urls: picurls,
        current: index
      });
    }
    async function handleRemove() {
      let result = await common_vendor.index.showModal({
        title: "是否删除"
      });
      if (!result.confirm)
        return;
      await db.collection("chicken-coop").doc(props.item._id).update({
        is_delete: true
      });
      emit("delRowEnv", { msg: "删除成功" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.item.userInfo.avatar || "../../static/images/defAvatar.png",
        b: common_vendor.t(__props.item.userInfo.username),
        c: __props.item.content
      }, __props.item.content ? {
        d: common_vendor.t(__props.item.content)
      } : {}, {
        e: __props.item.picurls && __props.item.picurls.length
      }, __props.item.picurls && __props.item.picurls.length ? {
        f: common_vendor.f(__props.item.picurls, (pic, index, i0) => {
          return {
            a: common_vendor.o(($event) => clickPic(index), pic),
            b: pic,
            c: pic
          };
        })
      } : {}, {
        g: common_vendor.p({
          date: __props.item.publish_date,
          format: "MM月dd hh:mm",
          threshold: [6e4, 36e5 * 24 * 30]
        }),
        h: common_vendor.t(__props.item.publish_address || __props.item.publish_ip),
        i: common_vendor.unref(utils_common.isAdminRole)() || __props.item.userInfo._id == current_id.value
      }, common_vendor.unref(utils_common.isAdminRole)() || __props.item.userInfo._id == current_id.value ? {
        j: common_vendor.p({
          type: "trash-filled",
          size: "16",
          color: "#999"
        }),
        k: common_vendor.o(handleRemove)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4021de05"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/coop-item/coop-item.js.map

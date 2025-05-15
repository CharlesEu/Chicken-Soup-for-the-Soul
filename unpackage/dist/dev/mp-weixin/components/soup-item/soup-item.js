"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_soup_tab_group2 = common_vendor.resolveComponent("soup-tab-group");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  (_easycom_soup_tab_group2 + _easycom_uni_icons2 + _easycom_uni_dateformat2)();
}
const _easycom_soup_tab_group = () => "../soup-tab-group/soup-tab-group.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  (_easycom_soup_tab_group + _easycom_uni_icons + _easycom_uni_dateformat)();
}
const _sfc_main = {
  __name: "soup-item",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  emits: ["remove"],
  setup(__props, { emit: __emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const props = __props;
    const emits = __emit;
    const useStateFormat = common_vendor.computed(() => utils_common.stateFormat(props.item.status));
    const db = common_vendor.nr.database();
    const goEdit = () => {
      if (!props.isEdit)
        return;
      common_vendor.index.navigateTo({
        url: "/pages_self/soup/edit?id=" + props.item._id
      });
    };
    const goDetail = () => {
      common_vendor.index.__f__("log", "at components/soup-item/soup-item.vue:86", "跳转详情");
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + props.item._id
      });
    };
    const clickRemove = async (id) => {
      let res = await common_vendor.index.showModal({
        title: "是否删除此条鸡汤",
        content: "删除之后无法恢复，请谨慎操作"
      });
      if (res.confirm) {
        let { result: { errCode } } = await db.collection("soup-chicken").where(`_id == "${id}"`).update({
          is_delete: true
        });
        if (errCode != 0)
          return proxy.showToast("删除失败，请重新操作");
        proxy.showToast("删除成功");
        emits("remove");
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: __props.item.soup_type
        }),
        b: common_vendor.p({
          type: "eye",
          size: "18",
          color: "#999"
        }),
        c: common_vendor.o(goDetail),
        d: common_vendor.t(__props.item.content),
        e: common_vendor.p({
          date: __props.item.publish_date,
          format: "yyyy-MM-dd hh:mm"
        }),
        f: common_vendor.unref(utils_common.stateFormat)(__props.item.status).value == 1
      }, common_vendor.unref(utils_common.stateFormat)(__props.item.status).value == 1 ? common_vendor.e({
        g: common_vendor.p({
          type: "heart",
          color: "#a7a7a7",
          size: "16"
        }),
        h: __props.item.like_count
      }, __props.item.like_count ? {
        i: common_vendor.t(__props.item.like_count)
      } : {}, {
        j: common_vendor.p({
          type: "star",
          color: "#a7a7a7",
          size: "16"
        }),
        k: __props.item.collect_count
      }, __props.item.collect_count ? {
        l: common_vendor.t(__props.item.collect_count)
      } : {}, {
        m: common_vendor.p({
          type: "chatbubble",
          color: "#a7a7a7",
          size: "16"
        }),
        n: __props.item.comment_count
      }, __props.item.comment_count ? {
        o: common_vendor.t(__props.item.comment_count)
      } : {}) : common_vendor.e({
        p: common_vendor.t(useStateFormat.value.text),
        q: __props.item.status === 2
      }, __props.item.status === 2 ? {
        r: common_vendor.p({
          type: "trash",
          size: "16"
        }),
        s: common_vendor.o(($event) => clickRemove(__props.item._id))
      } : {}, {
        t: useStateFormat.value.color
      }), {
        v: common_vendor.o(goEdit)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6b2ce8ba"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/soup-item/soup-item.js.map

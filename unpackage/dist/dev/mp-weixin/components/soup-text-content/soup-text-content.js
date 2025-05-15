"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "soup-text-content",
  props: {
    maxline: {
      type: [String, Number],
      default: "none"
    },
    lookState: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.item.content),
        b: __props.maxline,
        c: __props.item.userInfo
      }, __props.item.userInfo ? common_vendor.e({
        d: __props.item.userInfo.avatar || "../../static/images/defAvatar.png",
        e: common_vendor.t(__props.item.userInfo.username),
        f: __props.item.from
      }, __props.item.from ? {
        g: common_vendor.t(__props.item.from)
      } : {}) : {}, {
        h: __props.lookState
      }, __props.lookState ? {
        i: common_vendor.t(__props.item.view_count)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c8dbc08"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/soup-text-content/soup-text-content.js.map

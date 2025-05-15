"use strict";
const uni_modules_limePainter_components_common_relation = require("../common/relation.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "lime-painter-view",
  mixins: [uni_modules_limePainter_components_common_relation.children("painter"), uni_modules_limePainter_components_common_relation.parent("painter")],
  props: {
    id: String,
    type: {
      type: String,
      default: "view"
    },
    css: [String, Object]
  },
  data() {
    return {
      // type: 'view',
      el: {
        css: {},
        views: []
      }
    };
  },
  mounted() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-painter/components/l-painter-view/l-painter-view.js.map

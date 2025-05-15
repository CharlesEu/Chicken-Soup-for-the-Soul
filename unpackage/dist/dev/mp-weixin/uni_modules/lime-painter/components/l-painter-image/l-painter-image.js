"use strict";
const uni_modules_limePainter_components_common_relation = require("../common/relation.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "lime-painter-image",
  mixins: [uni_modules_limePainter_components_common_relation.children("painter")],
  props: {
    id: String,
    css: [String, Object],
    src: String
  },
  data() {
    return {
      type: "image",
      el: {
        css: {},
        src: null
      }
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-painter/components/l-painter-image/l-painter-image.js.map

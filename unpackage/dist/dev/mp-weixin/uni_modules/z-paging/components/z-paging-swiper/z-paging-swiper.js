"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_modules_commonLayout = require("../z-paging/js/modules/common-layout.js");
const _sfc_main = {
  name: "z-paging-swiper",
  mixins: [uni_modules_zPaging_components_zPaging_js_modules_commonLayout.commonLayoutModule],
  data() {
    return {
      swiperContentStyle: {}
    };
  },
  props: {
    // 是否使用fixed布局，默认为是
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否开启底部安全区域适配
    safeAreaInsetBottom: {
      type: Boolean,
      default: false
    },
    // z-paging-swiper样式
    swiperStyle: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.systemInfo = common_vendor.index.getSystemInfoSync();
      setTimeout(this.updateFixedLayout, 100);
    });
    this._getCssSafeAreaInsetBottom();
    this.updateLeftAndRightWidth();
    this.swiperContentStyle = { "flex": "1" };
    this.swiperContentStyle = { width: "100%", height: "100%" };
  },
  computed: {
    finalSwiperStyle() {
      const swiperStyle = this.swiperStyle;
      if (!this.systemInfo)
        return swiperStyle;
      const windowTop = this.windowTop;
      const windowBottom = this.systemInfo.windowBottom;
      if (this.fixed) {
        if (windowTop && !swiperStyle.top) {
          swiperStyle.top = windowTop + "px";
        }
        if (!swiperStyle.bottom) {
          let bottom = windowBottom || 0;
          bottom += this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
          if (bottom > 0) {
            swiperStyle.bottom = bottom + "px";
          }
        }
      }
      return swiperStyle;
    }
  },
  methods: {
    // 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变时调用
    updateLeftAndRightWidth() {
      if (!this.isOldWebView)
        return;
      this.$nextTick(() => this._updateLeftAndRightWidth(this.swiperContentStyle, "zp-swiper"));
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.cssSafeAreaInsetBottom === -1
  }, _ctx.cssSafeAreaInsetBottom === -1 ? {} : {}, {
    b: _ctx.zSlots.top
  }, _ctx.zSlots.top ? {} : {}, {
    c: _ctx.zSlots.left
  }, _ctx.zSlots.left ? {
    d: _ctx.isOldWebView ? 1 : ""
  } : {}, {
    e: _ctx.isOldWebView ? 1 : "",
    f: common_vendor.s($data.swiperContentStyle),
    g: _ctx.zSlots.right
  }, _ctx.zSlots.right ? {
    h: _ctx.isOldWebView ? 1 : ""
  } : {}, {
    i: _ctx.zSlots.bottom
  }, _ctx.zSlots.bottom ? {} : {}, {
    j: common_vendor.n($props.fixed ? "zp-swiper-container zp-swiper-container-fixed" : "zp-swiper-container"),
    k: common_vendor.s($options.finalSwiperStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bd8ff6a5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging-swiper/z-paging-swiper.js.map

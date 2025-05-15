"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../js/z-paging-static.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../js/z-paging-enum.js");
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-load-more",
  data() {
    return {
      M: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More,
      zTheme: {
        title: { white: "#efefef", black: "#a4a4a4" },
        line: { white: "#efefef", black: "#eeeeee" },
        circleBorder: { white: "#aaaaaa", black: "#c8c8c8" },
        circleBorderTop: { white: "#ffffff", black: "#444444" },
        flower: { white: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64FlowerWhite, black: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower },
        indicator: { white: "#eeeeee", black: "#777777" }
      }
    };
  },
  props: ["zConfig"],
  computed: {
    ts() {
      return this.c.defaultThemeStyle;
    },
    // 底部加载更多配置
    c() {
      return this.zConfig || {};
    },
    // 底部加载更多文字
    ownLoadingMoreText() {
      const statusTextArr = [this.c.defaultText, this.c.loadingText, this.c.noMoreText, this.c.failText];
      return statusTextArr[this.finalStatus];
    },
    // 底部加载更多状态
    finalStatus() {
      if (this.c.defaultAsLoading && this.c.status === this.M.Default)
        return this.M.Loading;
      return this.c.status;
    },
    // 加载更多icon类型
    finalLoadingIconType() {
      return this.c.loadingIconType;
    }
  },
  methods: {
    // 点击了加载更多
    doClick() {
      this.$emit("doClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$options.c.hideContent
  }, !$options.c.hideContent ? common_vendor.e({
    b: $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    c: $options.c.unit === "rpx" ? 1 : "",
    d: $options.c.unit === "px" ? 1 : "",
    e: common_vendor.s({
      backgroundColor: $data.zTheme.line[$options.ts]
    }),
    f: common_vendor.s($options.c.noMoreLineCustomStyle)
  } : {}, {
    g: $options.finalStatus === $data.M.Loading && !!$options.c.loadingIconCustomImage
  }, $options.finalStatus === $data.M.Loading && !!$options.c.loadingIconCustomImage ? {
    h: $options.c.loadingIconCustomImage,
    i: common_vendor.s($options.c.iconCustomStyle),
    j: $options.c.loadingAnimated ? 1 : "",
    k: $options.c.unit === "rpx" ? 1 : "",
    l: $options.c.unit === "px" ? 1 : ""
  } : {}, {
    m: $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "flower" && !$options.c.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "flower" && !$options.c.loadingIconCustomImage.length ? {
    n: $options.c.unit === "rpx" ? 1 : "",
    o: $options.c.unit === "px" ? 1 : "",
    p: common_vendor.s($options.c.iconCustomStyle),
    q: $data.zTheme.flower[$options.ts]
  } : {}, {
    r: $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "circle" && !$options.c.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "circle" && !$options.c.loadingIconCustomImage.length ? {
    s: $options.c.unit === "rpx" ? 1 : "",
    t: $options.c.unit === "px" ? 1 : "",
    v: common_vendor.s({
      borderColor: $data.zTheme.circleBorder[$options.ts],
      borderTopColor: $data.zTheme.circleBorderTop[$options.ts]
    }),
    w: common_vendor.s($options.c.iconCustomStyle)
  } : {}, {
    x: !$options.c.isChat || !$options.c.chatDefaultAsLoading && $options.finalStatus === $data.M.Default || $options.finalStatus === $data.M.Fail
  }, !$options.c.isChat || !$options.c.chatDefaultAsLoading && $options.finalStatus === $data.M.Default || $options.finalStatus === $data.M.Fail ? {
    y: common_vendor.t($options.ownLoadingMoreText),
    z: $options.c.unit === "rpx" ? 1 : "",
    A: $options.c.unit === "px" ? 1 : "",
    B: common_vendor.s({
      color: $data.zTheme.title[$options.ts]
    }),
    C: common_vendor.s($options.c.titleCustomStyle)
  } : {}, {
    D: $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    E: $options.c.unit === "rpx" ? 1 : "",
    F: $options.c.unit === "px" ? 1 : "",
    G: common_vendor.s({
      backgroundColor: $data.zTheme.line[$options.ts]
    }),
    H: common_vendor.s($options.c.noMoreLineCustomStyle)
  } : {}) : {}, {
    I: $options.c.unit === "rpx" ? 1 : "",
    J: $options.c.unit === "px" ? 1 : "",
    K: common_vendor.s($options.c.customStyle),
    L: common_vendor.o((...args) => $options.doClick && $options.doClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8cc5c400"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/components/z-paging-load-more.js.map

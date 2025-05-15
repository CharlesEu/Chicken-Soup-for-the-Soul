"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../z-paging/js/z-paging-static.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-empty-view",
  data() {
    return {};
  },
  props: {
    // 空数据描述文字
    emptyViewText: {
      type: String,
      default: "没有数据哦~"
    },
    // 空数据图片
    emptyViewImg: {
      type: String,
      default: ""
    },
    // 是否显示空数据图重新加载按钮
    showEmptyViewReload: {
      type: Boolean,
      default: false
    },
    // 空数据点击重新加载文字
    emptyViewReloadText: {
      type: String,
      default: "重新加载"
    },
    // 是否是加载失败
    isLoadFailed: {
      type: Boolean,
      default: false
    },
    // 空数据图样式
    emptyViewStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 空数据图img样式
    emptyViewImgStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 空数据图描述文字样式
    emptyViewTitleStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 空数据图重新加载按钮样式
    emptyViewReloadStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 空数据图z-index
    emptyViewZIndex: {
      type: Number,
      default: 9
    },
    // 空数据图片是否使用fixed布局并铺满z-paging
    emptyViewFixed: {
      type: Boolean,
      default: true
    },
    // 空数据图中布局的单位，默认为rpx
    unit: {
      type: String,
      default: "rpx"
    }
  },
  computed: {
    emptyImg() {
      return this.isLoadFailed ? uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Error : uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Empty;
    },
    finalEmptyViewStyle() {
      this.emptyViewStyle["z-index"] = this.emptyViewZIndex;
      return this.emptyViewStyle;
    }
  },
  methods: {
    // 点击了reload按钮
    reloadClick() {
      this.$emit("reload");
    },
    // 点击了空数据view
    emptyViewClick() {
      this.$emit("viewClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.emptyViewImg.length
  }, !$props.emptyViewImg.length ? {
    b: $props.unit === "rpx" ? 1 : "",
    c: $props.unit === "px" ? 1 : "",
    d: common_vendor.s($props.emptyViewImgStyle),
    e: $options.emptyImg
  } : {
    f: $props.unit === "rpx" ? 1 : "",
    g: $props.unit === "px" ? 1 : "",
    h: common_vendor.s($props.emptyViewImgStyle),
    i: $props.emptyViewImg
  }, {
    j: common_vendor.t($props.emptyViewText),
    k: $props.unit === "rpx" ? 1 : "",
    l: $props.unit === "px" ? 1 : "",
    m: common_vendor.s($props.emptyViewTitleStyle),
    n: $props.showEmptyViewReload
  }, $props.showEmptyViewReload ? {
    o: common_vendor.t($props.emptyViewReloadText),
    p: $props.unit === "rpx" ? 1 : "",
    q: $props.unit === "px" ? 1 : "",
    r: common_vendor.s($props.emptyViewReloadStyle),
    s: common_vendor.o((...args) => $options.reloadClick && $options.reloadClick(...args))
  } : {}, {
    t: $props.emptyViewFixed ? 1 : "",
    v: common_vendor.s($options.finalEmptyViewStyle),
    w: common_vendor.o((...args) => $options.emptyViewClick && $options.emptyViewClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b7999e14"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging-empty-view/z-paging-empty-view.js.map

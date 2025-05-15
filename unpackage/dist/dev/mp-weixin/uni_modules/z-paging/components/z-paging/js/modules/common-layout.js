"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const commonLayoutModule = {
  data() {
    return {
      systemInfo: null,
      cssSafeAreaInsetBottom: -1,
      isReadyDestroy: false
    };
  },
  computed: {
    // 顶部可用距离
    windowTop() {
      if (!this.systemInfo)
        return 0;
      return this.systemInfo.windowTop || 0;
    },
    // 底部安全区域高度
    safeAreaBottom() {
      if (!this.systemInfo)
        return 0;
      let safeAreaBottom = 0;
      safeAreaBottom = Math.max(this.cssSafeAreaInsetBottom, 0);
      return safeAreaBottom;
    },
    // 是否是比较老的webview，在一些老的webview中，需要进行一些特殊处理
    isOldWebView() {
      try {
        const systemInfos = common_vendor.index.getSystemInfoSync().system.split(" ");
        const deviceType = systemInfos[0];
        const version = parseInt(systemInfos[1]);
        if (deviceType === "iOS" && version <= 10 || deviceType === "Android" && version <= 6) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    // 当前组件的$slots，兼容不同平台
    zSlots() {
      return this.$slots;
    }
  },
  beforeDestroy() {
    this.isReadyDestroy = true;
  },
  unmounted() {
    this.isReadyDestroy = true;
  },
  methods: {
    // 更新fixed模式下z-paging的布局
    updateFixedLayout() {
      this.fixed && this.$nextTick(() => {
        this.systemInfo = common_vendor.index.getSystemInfoSync();
      });
    },
    // 获取节点尺寸
    _getNodeClientRect(select, inDom = true, scrollOffset = false) {
      if (this.isReadyDestroy) {
        return Promise.resolve(false);
      }
      let res = !!inDom ? common_vendor.index.createSelectorQuery().in(inDom === true ? this : inDom) : common_vendor.index.createSelectorQuery();
      scrollOffset ? res.select(select).scrollOffset() : res.select(select).boundingClientRect();
      return new Promise((resolve, reject) => {
        res.exec((data) => {
          resolve(data && data != "" && data != void 0 && data.length ? data : false);
        });
      });
    },
    // 获取slot="left"和slot="right"宽度并且更新布局
    _updateLeftAndRightWidth(targetStyle, parentNodePrefix) {
      this.$nextTick(() => {
        let delayTime = 0;
        setTimeout(() => {
          ["left", "right"].map((position) => {
            this._getNodeClientRect(`.${parentNodePrefix}-${position}`).then((res) => {
              this.$set(targetStyle, position, res ? res[0].width + "px" : "0px");
            });
          });
        }, delayTime);
      });
    },
    // 通过获取css设置的底部安全区域占位view高度设置bottom距离（直接通过systemInfo在部分平台上无法获取到底部安全区域）
    _getCssSafeAreaInsetBottom(success) {
      this._getNodeClientRect(".zp-safe-area-inset-bottom").then((res) => {
        this.cssSafeAreaInsetBottom = res ? res[0].height : -1;
        res && success && success();
      });
    }
  }
};
exports.commonLayoutModule = commonLayoutModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/common-layout.js.map

"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../z-paging-enum.js");
const loadingModule = {
  props: {
    // 第一次加载后自动隐藏loading slot，默认为是
    autoHideLoadingAfterFirstLoaded: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideLoadingAfterFirstLoaded", true)
    },
    // loading slot是否铺满屏幕并固定，默认为否
    loadingFullFixed: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("loadingFullFixed", false)
    },
    // 是否自动显示系统Loading：即uni.showLoading，若开启则将在刷新列表时(调用reload、refresh时)显示，下拉刷新和滚动到底部加载更多不会显示，默认为false。
    autoShowSystemLoading: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoShowSystemLoading", false)
    },
    // 显示系统Loading时是否显示透明蒙层，防止触摸穿透，默认为是(H5、App、微信小程序、百度小程序有效)
    systemLoadingMask: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("systemLoadingMask", true)
    },
    // 显示系统Loading时显示的文字，默认为"加载中"
    systemLoadingText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("systemLoadingText", null)
    }
  },
  data() {
    return {
      loading: false,
      loadingForNow: false
    };
  },
  watch: {
    // loading状态
    loadingStatus(newVal) {
      this.$emit("loadingStatusChange", newVal);
      this.$nextTick(() => {
        this.loadingStatusAfterRender = newVal;
      });
      if (this.useChatRecordMode) {
        if (this.isFirstPage && (newVal === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.NoMore || newVal === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.Fail)) {
          this.isFirstPageAndNoMore = true;
          return;
        }
      }
      this.isFirstPageAndNoMore = false;
    },
    loading(newVal) {
      if (newVal) {
        this.loadingForNow = newVal;
      }
    }
  },
  computed: {
    // 是否显示loading
    showLoading() {
      if (this.firstPageLoaded || !this.loading || !this.loadingForNow)
        return false;
      if (this.finalShowSystemLoading) {
        common_vendor.index.showLoading({
          title: this.finalSystemLoadingText,
          mask: this.systemLoadingMask
        });
      }
      return this.autoHideLoadingAfterFirstLoaded ? this.fromEmptyViewReload ? true : !this.pagingLoaded : this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
    },
    // 最终的是否显示系统loading
    finalShowSystemLoading() {
      return this.autoShowSystemLoading && this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
    }
  },
  methods: {
    // 处理开始加载更多状态
    _startLoading(isReload = false) {
      if (this.showLoadingMoreWhenReload && !this.isUserPullDown || !isReload) {
        this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.Loading;
      }
      this.loading = true;
    },
    // 停止系统loading和refresh
    _endSystemLoadingAndRefresh() {
      this.finalShowSystemLoading && common_vendor.index.hideLoading();
      !this.useCustomRefresher && common_vendor.index.stopPullDownRefresh();
    }
  }
};
exports.loadingModule = loadingModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/loading.js.map

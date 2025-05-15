"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_i18n_index = require("../../i18n/index.js");
const uni_modules_zPaging_components_zPaging_js_zPagingInterceptor = require("../z-paging-interceptor.js");
const { t } = common_vendor.initVueI18n(uni_modules_zPaging_components_zPaging_i18n_index.messages);
const language = common_vendor.index.getSystemInfoSync().language;
const i18nModule = {
  data() {
    return {
      language
    };
  },
  computed: {
    finalLanguage() {
      try {
        const local = common_vendor.index.getLocale();
        const language2 = this.language;
        return local === "auto" ? uni_modules_zPaging_components_zPaging_js_zPagingInterceptor.interceptor._handleLanguage2Local(language2, this._language2Local(language2)) : local;
      } catch (e) {
        return "zh-Hans";
      }
    },
    // 最终的下拉刷新默认状态的文字
    finalRefresherDefaultText() {
      return this._getI18nText("zp.refresher.default", this.refresherDefaultText);
    },
    // 最终的下拉刷新下拉中的文字
    finalRefresherPullingText() {
      return this._getI18nText("zp.refresher.pulling", this.refresherPullingText);
    },
    // 最终的下拉刷新中文字
    finalRefresherRefreshingText() {
      return this._getI18nText("zp.refresher.refreshing", this.refresherRefreshingText);
    },
    // 最终的下拉刷新完成文字
    finalRefresherCompleteText() {
      return this._getI18nText("zp.refresher.complete", this.refresherCompleteText);
    },
    // 最终的下拉刷新上次更新时间文字
    finalRefresherUpdateTimeTextMap() {
      return {
        title: t("zp.refresherUpdateTime.title"),
        none: t("zp.refresherUpdateTime.none"),
        today: t("zp.refresherUpdateTime.today"),
        yesterday: t("zp.refresherUpdateTime.yesterday")
      };
    },
    // 最终的底部加载更多默认状态文字
    finalLoadingMoreDefaultText() {
      return this._getI18nText("zp.loadingMore.default", this.loadingMoreDefaultText);
    },
    // 最终的底部加载更多加载中文字
    finalLoadingMoreLoadingText() {
      return this._getI18nText("zp.loadingMore.loading", this.loadingMoreLoadingText);
    },
    // 最终的底部加载更多没有更多数据文字
    finalLoadingMoreNoMoreText() {
      return this._getI18nText("zp.loadingMore.noMore", this.loadingMoreNoMoreText);
    },
    // 最终的底部加载更多加载失败文字
    finalLoadingMoreFailText() {
      return this._getI18nText("zp.loadingMore.fail", this.loadingMoreFailText);
    },
    // 最终的空数据图title
    finalEmptyViewText() {
      return this.isLoadFailed ? this.finalEmptyViewErrorText : this._getI18nText("zp.emptyView.title", this.emptyViewText);
    },
    // 最终的空数据图reload title
    finalEmptyViewReloadText() {
      return this._getI18nText("zp.emptyView.reload", this.emptyViewReloadText);
    },
    // 最终的空数据图加载失败文字
    finalEmptyViewErrorText() {
      return this.customerEmptyViewErrorText || this._getI18nText("zp.emptyView.error", this.emptyViewErrorText);
    },
    // 最终的系统loading title
    finalSystemLoadingText() {
      return this._getI18nText("zp.systemLoading.title", this.systemLoadingText);
    }
  },
  methods: {
    // 获取当前z-paging的语言
    getLanguage() {
      return this.finalLanguage;
    },
    // 获取国际化转换后的文本
    _getI18nText(key, value) {
      const dataType = Object.prototype.toString.call(value);
      if (dataType === "[object Object]") {
        const nextValue = value[this.finalLanguage];
        if (nextValue)
          return nextValue;
      } else if (dataType === "[object String]") {
        return value;
      }
      return t(key);
    },
    // 系统language转i18n local
    _language2Local(language2) {
      const formatedLanguage = language2.toLowerCase().replace(new RegExp("_", ""), "-");
      if (formatedLanguage.indexOf("zh") !== -1) {
        if (formatedLanguage === "zh" || formatedLanguage === "zh-cn" || formatedLanguage.indexOf("zh-hans") !== -1) {
          return "zh-Hans";
        }
        return "zh-Hant";
      }
      if (formatedLanguage.indexOf("en") !== -1)
        return "en";
      return language2;
    }
  }
};
exports.i18nModule = i18nModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/i18n.js.map

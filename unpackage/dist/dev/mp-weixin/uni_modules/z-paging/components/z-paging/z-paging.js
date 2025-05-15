"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingMain = require("./js/z-paging-main.js");
const common_vendor = require("../../../../common/vendor.js");
const block0 = (Component2) => {
  if (!Component2.wxsCallMethods) {
    Component2.wxsCallMethods = [];
  }
  Component2.wxsCallMethods.push("_handleListTouchstart", "_handleRefresherTouchstart", "_handleTouchDirectionChange", "_handleScrollViewBounce", "_handleWxsPullingDown", "_handleRefresherTouchmove", "_handleRefresherTouchend", "_handlePropUpdate", "_handleWxsPullingDownStatusChange");
};
const block1 = {};
if (!Array) {
  const _component_z_paging_refresh = common_vendor.resolveComponent("z-paging-refresh");
  const _component_z_paging_load_more = common_vendor.resolveComponent("z-paging-load-more");
  const _easycom_z_paging_empty_view2 = common_vendor.resolveComponent("z-paging-empty-view");
  (_component_z_paging_refresh + _component_z_paging_load_more + _easycom_z_paging_empty_view2)();
}
const _easycom_z_paging_empty_view = () => "../z-paging-empty-view/z-paging-empty-view.js";
if (!Math) {
  _easycom_z_paging_empty_view();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.cssSafeAreaInsetBottom === -1
  }, _ctx.cssSafeAreaInsetBottom === -1 ? {} : {}, {
    b: !_ctx.usePageScroll && _ctx.zSlots.top
  }, !_ctx.usePageScroll && _ctx.zSlots.top ? {} : _ctx.usePageScroll && _ctx.zSlots.top ? {
    d: common_vendor.o(() => {
    }),
    e: common_vendor.s({
      "top": `${_ctx.windowTop}px`,
      "z-index": _ctx.topZIndex
    })
  } : {}, {
    c: _ctx.usePageScroll && _ctx.zSlots.top,
    f: _ctx.zSlots.left
  }, _ctx.zSlots.left ? {
    g: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    h: _ctx.finalRefresherFixedBacHeight > 0
  }, _ctx.finalRefresherFixedBacHeight > 0 ? {
    i: common_vendor.s({
      "background": _ctx.refresherFixedBackground,
      "height": `${_ctx.finalRefresherFixedBacHeight}px`
    })
  } : {}, {
    j: _ctx.showRefresher
  }, _ctx.showRefresher ? common_vendor.e({
    k: _ctx.useRefresherStatusBarPlaceholder
  }, _ctx.useRefresherStatusBarPlaceholder ? {
    l: common_vendor.s({
      "height": `${_ctx.statusBarHeight}px`
    })
  } : {}, {
    m: !(_ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete)
  }, !(_ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete) ? {
    n: common_vendor.r("refresher", {
      refresherStatus: _ctx.refresherStatus
    })
  } : {}, {
    o: _ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete
  }, _ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete ? {} : !_ctx.showCustomRefresher ? {
    q: common_vendor.sr("refresh", "1aa372d7-0"),
    r: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold - _ctx.finalRefresherThresholdPlaceholder}px`
    }),
    s: common_vendor.p({
      status: _ctx.refresherStatus,
      defaultThemeStyle: _ctx.finalRefresherThemeStyle,
      defaultText: _ctx.finalRefresherDefaultText,
      pullingText: _ctx.finalRefresherPullingText,
      refreshingText: _ctx.finalRefresherRefreshingText,
      completeText: _ctx.finalRefresherCompleteText,
      defaultImg: _ctx.refresherDefaultImg,
      pullingImg: _ctx.refresherPullingImg,
      refreshingImg: _ctx.refresherRefreshingImg,
      completeImg: _ctx.refresherCompleteImg,
      refreshingAnimated: _ctx.refresherRefreshingAnimated,
      showUpdateTime: _ctx.showRefresherUpdateTime,
      updateTimeKey: _ctx.refresherUpdateTimeKey,
      updateTimeTextMap: _ctx.finalRefresherUpdateTimeTextMap,
      imgStyle: _ctx.refresherImgStyle,
      titleStyle: _ctx.refresherTitleStyle,
      updateTimeStyle: _ctx.refresherUpdateTimeStyle,
      unit: _ctx.unit
    })
  } : {}, {
    p: !_ctx.showCustomRefresher,
    t: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold}px`,
      "background": _ctx.refresherBackground
    }),
    v: common_vendor.s({
      "margin-top": `-${_ctx.finalRefresherThreshold + _ctx.refresherThresholdUpdateTag}px`,
      "background": _ctx.refresherBackground,
      "opacity": _ctx.isTouchmoving ? 1 : 0
    })
  }) : {}, {
    w: _ctx.showLoading && _ctx.zSlots.loading && !_ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.zSlots.loading && !_ctx.loadingFullFixed ? {} : {}, {
    x: _ctx.finalUseInnerList
  }, _ctx.finalUseInnerList ? common_vendor.e({
    y: _ctx.finalUseVirtualList
  }, _ctx.finalUseVirtualList ? {
    z: common_vendor.f(_ctx.virtualList, (item, index, i0) => {
      return common_vendor.e(_ctx.useCompatibilityMode ? {} : {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index: _ctx.virtualTopRangeIndex + index
        }, i0)
      }, {
        c: `zp-id-${item[_ctx.virtualCellIndexKey]}`,
        d: item["zp_unique_index"],
        e: common_vendor.o(($event) => _ctx._innerCellClick(item, _ctx.virtualTopRangeIndex + index), item["zp_unique_index"])
      });
    }),
    A: _ctx.useCompatibilityMode,
    B: common_vendor.s(_ctx.innerCellStyle)
  } : {
    C: common_vendor.f(_ctx.realTotalData, (item, index, i0) => {
      return {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index
        }, i0),
        c: index,
        d: common_vendor.o(($event) => _ctx._innerCellClick(item, index), index)
      };
    })
  }, {
    D: common_vendor.s(_ctx.innerListStyle)
  }) : {}, {
    E: _ctx.useChatRecordMode && (_ctx.loadingStatus !== _ctx.M.NoMore || _ctx.zSlots.chatNoMore) && (_ctx.realTotalData.length || _ctx.showChatLoadingWhenReload && _ctx.showLoading) && !_ctx.isFirstPageAndNoMore
  }, _ctx.useChatRecordMode && (_ctx.loadingStatus !== _ctx.M.NoMore || _ctx.zSlots.chatNoMore) && (_ctx.realTotalData.length || _ctx.showChatLoadingWhenReload && _ctx.showLoading) && !_ctx.isFirstPageAndNoMore ? common_vendor.e({
    F: _ctx.loadingStatus === _ctx.M.NoMore && _ctx.zSlots.chatNoMore
  }, _ctx.loadingStatus === _ctx.M.NoMore && _ctx.zSlots.chatNoMore ? {} : common_vendor.e({
    G: _ctx.zSlots.chatLoading
  }, _ctx.zSlots.chatLoading ? {
    H: common_vendor.r("chatLoading", {
      loadingMoreStatus: _ctx.loadingStatus
    })
  } : {
    I: common_vendor.o(($event) => _ctx._onLoadingMore("click")),
    J: common_vendor.p({
      zConfig: _ctx.zLoadMoreConfig
    })
  }), {
    K: common_vendor.s(_ctx.chatRecordRotateStyle)
  }) : {}, {
    L: _ctx.useVirtualList
  }, _ctx.useVirtualList ? {
    M: common_vendor.s({
      height: _ctx.virtualPlaceholderBottomHeight + "px"
    })
  } : {}, {
    N: _ctx.showLoadingMoreDefault
  }, _ctx.showLoadingMoreDefault ? {} : _ctx.showLoadingMoreLoading ? {} : _ctx.showLoadingMoreNoMore ? {} : _ctx.showLoadingMoreFail ? {} : _ctx.showLoadingMoreCustom ? {
    S: common_vendor.o(($event) => _ctx._onLoadingMore("click")),
    T: common_vendor.p({
      zConfig: _ctx.zLoadMoreConfig
    })
  } : {}, {
    O: _ctx.showLoadingMoreLoading,
    P: _ctx.showLoadingMoreNoMore,
    Q: _ctx.showLoadingMoreFail,
    R: _ctx.showLoadingMoreCustom,
    U: _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder && !_ctx.useChatRecordMode
  }, _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder && !_ctx.useChatRecordMode ? {
    V: common_vendor.s({
      height: _ctx.safeAreaBottom + "px"
    })
  } : {}, {
    W: common_vendor.s({
      transform: _ctx.virtualPlaceholderTopHeight > 0 ? `translateY(${_ctx.virtualPlaceholderTopHeight}px)` : "none"
    }),
    X: common_vendor.s(_ctx.finalPagingContentStyle),
    Y: _ctx.showEmpty
  }, _ctx.showEmpty ? common_vendor.e({
    Z: _ctx.zSlots.empty
  }, _ctx.zSlots.empty ? {
    aa: common_vendor.r("empty", {
      isLoadFailed: _ctx.isLoadFailed
    })
  } : {
    ab: common_vendor.o(_ctx._emptyViewReload),
    ac: common_vendor.o(_ctx._emptyViewClick),
    ad: common_vendor.p({
      emptyViewImg: _ctx.finalEmptyViewImg,
      emptyViewText: _ctx.finalEmptyViewText,
      showEmptyViewReload: _ctx.finalShowEmptyViewReload,
      emptyViewReloadText: _ctx.finalEmptyViewReloadText,
      isLoadFailed: _ctx.isLoadFailed,
      emptyViewStyle: _ctx.emptyViewStyle,
      emptyViewTitleStyle: _ctx.emptyViewTitleStyle,
      emptyViewImgStyle: _ctx.emptyViewImgStyle,
      emptyViewReloadStyle: _ctx.emptyViewReloadStyle,
      emptyViewZIndex: _ctx.emptyViewZIndex,
      emptyViewFixed: _ctx.emptyViewFixed,
      unit: _ctx.unit
    })
  }, {
    ae: _ctx.emptyViewCenter ? 1 : "",
    af: common_vendor.s(_ctx.emptyViewSuperStyle),
    ag: common_vendor.s(_ctx.chatRecordRotateStyle)
  }) : {}, {
    ah: common_vendor.s({
      justifyContent: _ctx.useChatRecordMode ? "flex-end" : "flex-start"
    }),
    ai: common_vendor.s(_ctx.scrollViewInStyle),
    aj: common_vendor.s({
      "transform": _ctx.finalRefresherTransform,
      "transition": _ctx.refresherTransition
    }),
    ak: _ctx.wxsPropType,
    al: _ctx.finalRefresherThreshold,
    am: _ctx.isIos,
    an: _ctx.loading || _ctx.isRefresherInComplete,
    ao: _ctx.useChatRecordMode,
    ap: _ctx.refresherEnabled,
    aq: _ctx.useCustomRefresher,
    ar: _ctx.wxsPageScrollTop,
    as: _ctx.wxsScrollTop,
    at: _ctx.refresherMaxAngle,
    av: _ctx.refresherNoTransform,
    aw: _ctx.refresherAngleEnableChangeContinued,
    ax: _ctx.usePageScroll,
    ay: _ctx.watchTouchDirectionChange,
    az: _ctx.isTouchmoving,
    aA: _ctx.finalRefresherOutRate,
    aB: _ctx.finalRefresherPullRate,
    aC: _ctx.hasTouchmove,
    aD: !_ctx.usePageScroll ? 1 : "",
    aE: !_ctx.showScrollbar ? 1 : "",
    aF: common_vendor.s(_ctx.chatRecordRotateStyle),
    aG: _ctx.scrollTop,
    aH: _ctx.scrollX,
    aI: _ctx.scrollable && !_ctx.usePageScroll && _ctx.scrollEnable && (_ctx.refresherCompleteScrollable ? true : _ctx.refresherStatus !== _ctx.R.Complete),
    aJ: _ctx.finalEnableBackToTop,
    aK: _ctx.showScrollbar,
    aL: _ctx.finalScrollWithAnimation,
    aM: _ctx.scrollIntoView,
    aN: _ctx.finalLowerThreshold,
    aO: _ctx.finalRefresherEnabled && !_ctx.useCustomRefresher,
    aP: _ctx.finalRefresherThreshold,
    aQ: _ctx.finalRefresherDefaultStyle,
    aR: _ctx.refresherBackground,
    aS: _ctx.finalRefresherTriggered,
    aT: common_vendor.o((...args) => _ctx._scroll && _ctx._scroll(...args)),
    aU: common_vendor.o((...args) => _ctx._onScrollToLower && _ctx._onScrollToLower(...args)),
    aV: common_vendor.o((...args) => _ctx._onScrollToUpper && _ctx._onScrollToUpper(...args)),
    aW: common_vendor.o((...args) => _ctx._onRestore && _ctx._onRestore(...args)),
    aX: common_vendor.o(($event) => _ctx._onRefresh(true)),
    aY: _ctx.finalIsOldWebView ? 1 : "",
    aZ: common_vendor.s(_ctx.scrollViewContainerStyle),
    ba: _ctx.zSlots.right
  }, _ctx.zSlots.right ? {
    bb: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    bc: !_ctx.usePageScroll ? 1 : "",
    bd: common_vendor.s(_ctx.finalScrollViewStyle),
    be: !_ctx.usePageScroll && _ctx.zSlots.bottom
  }, !_ctx.usePageScroll && _ctx.zSlots.bottom ? {} : _ctx.usePageScroll && _ctx.zSlots.bottom ? {
    bg: common_vendor.o(() => {
    }),
    bh: common_vendor.s({
      "bottom": `${_ctx.windowBottom}px`
    })
  } : {}, {
    bf: _ctx.usePageScroll && _ctx.zSlots.bottom,
    bi: _ctx.useChatRecordMode && _ctx.autoAdjustPositionWhenChat
  }, _ctx.useChatRecordMode && _ctx.autoAdjustPositionWhenChat ? {
    bj: common_vendor.s({
      height: _ctx.chatRecordModeSafeAreaBottom + "px"
    }),
    bk: common_vendor.s({
      height: _ctx.keyboardHeight + "px"
    })
  } : {}, {
    bl: _ctx.bottomBgColor,
    bm: _ctx.showBackToTopClass
  }, _ctx.showBackToTopClass ? common_vendor.e({
    bn: _ctx.zSlots.backToTop
  }, _ctx.zSlots.backToTop ? {} : {
    bo: _ctx.backToTopImg.length ? _ctx.backToTopImg : _ctx.base64BackToTop
  }, {
    bp: common_vendor.n(_ctx.finalBackToTopClass),
    bq: common_vendor.s(_ctx.finalBackToTopStyle),
    br: common_vendor.o((...args) => _ctx._backToTopClick && _ctx._backToTopClick(...args))
  }) : {}, {
    bs: _ctx.showLoading && _ctx.zSlots.loading && _ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.zSlots.loading && _ctx.loadingFullFixed ? {} : {}, {
    bt: !_ctx.usePageScroll && _ctx.fixed ? 1 : "",
    bv: _ctx.usePageScroll ? 1 : "",
    bw: _ctx.renderPropScrollTop < 1 ? 1 : "",
    bx: _ctx.useChatRecordMode ? 1 : "",
    by: common_vendor.s(_ctx.finalPagingStyle)
  });
}
if (typeof block0 === "function")
  block0(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
if (typeof block1 === "function")
  block1(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1aa372d7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/z-paging.js.map

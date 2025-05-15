"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("../z-paging-constant.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../z-paging-enum.js");
const uni_modules_zPaging_components_zPaging_js_zPagingInterceptor = require("../z-paging-interceptor.js");
const dataHandleModule = {
  props: {
    // 自定义初始的pageNo，默认为1
    defaultPageNo: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("defaultPageNo", 1),
      observer: function(newVal) {
        this.pageNo = newVal;
      }
    },
    // 自定义pageSize，默认为10
    defaultPageSize: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("defaultPageSize", 10),
      validator: (value) => {
        if (value <= 0)
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr("default-page-size必须大于0！");
        return value > 0;
      }
    },
    // 为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
    dataKey: {
      type: [Number, String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("dataKey", null)
    },
    // 使用缓存，若开启将自动缓存第一页的数据，默认为否。请注意，因考虑到切换tab时不同tab数据不同的情况，默认仅会缓存组件首次加载时第一次请求到的数据，后续的下拉刷新操作不会更新缓存。
    useCache: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useCache", false)
    },
    // 使用缓存时缓存的key，用于区分不同列表的缓存数据，useCache为true时必须设置，否则缓存无效
    cacheKey: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("cacheKey", null)
    },
    // 缓存模式，默认仅会缓存组件首次加载时第一次请求到的数据，可设置为always，即代表总是缓存，每次列表刷新(下拉刷新、调用reload等)都会更新缓存
    cacheMode: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("cacheMode", uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CacheMode.Default)
    },
    // 自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
    autowireListName: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autowireListName", "")
    },
    // 自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
    autowireQueryName: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autowireQueryName", "")
    },
    // z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
    auto: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("auto", true)
    },
    // 用户下拉刷新时是否触发reload方法，默认为是
    reloadWhenRefresh: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("reloadWhenRefresh", true)
    },
    // reload时自动滚动到顶部，默认为是
    autoScrollToTopWhenReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoScrollToTopWhenReload", true)
    },
    // reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
    autoCleanListWhenReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoCleanListWhenReload", true)
    },
    // 列表刷新时自动显示下拉刷新view，默认为否
    showRefresherWhenReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showRefresherWhenReload", false)
    },
    // 列表刷新时自动显示加载更多view，且为加载中状态，默认为否
    showLoadingMoreWhenReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showLoadingMoreWhenReload", false)
    },
    // 组件created时立即触发reload(可解决一些情况下先看到页面再看到loading的问题)，auto为true时有效。为否时将在mounted+nextTick后触发reload，默认为否
    createdReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("createdReload", false)
    },
    // 本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
    localPagingLoadingTime: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("localPagingLoadingTime", 200)
    },
    // 自动拼接complete中传过来的数组(使用聊天记录模式时无效)
    concat: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("concat", true)
    },
    // 请求失败是否触发reject，默认为是
    callNetworkReject: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("callNetworkReject", true)
    },
    // 父组件v-model所绑定的list的值
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    modelValue: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      currentData: [],
      totalData: [],
      realTotalData: [],
      totalLocalPagingList: [],
      dataPromiseResultMap: {
        reload: null,
        complete: null,
        localPaging: null
      },
      isSettingCacheList: false,
      pageNo: 1,
      currentRefreshPageSize: 0,
      isLocalPaging: false,
      isAddedData: false,
      isTotalChangeFromAddData: false,
      privateConcat: true,
      myParentQuery: -1,
      firstPageLoaded: false,
      pagingLoaded: false,
      loaded: false,
      isUserReload: true,
      fromEmptyViewReload: false,
      queryFrom: "",
      listRendering: false,
      isHandlingRefreshToPage: false,
      isFirstPageAndNoMore: false,
      totalDataChangeThrow: true
    };
  },
  computed: {
    pageSize() {
      return this.defaultPageSize;
    },
    finalConcat() {
      return this.concat && this.privateConcat;
    },
    finalUseCache() {
      if (this.useCache && !this.cacheKey) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr("use-cache为true时，必须设置cache-key，否则缓存无效！");
      }
      return this.useCache && !!this.cacheKey;
    },
    finalCacheKey() {
      return this.cacheKey ? `${uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.cachePrefixKey}-${this.cacheKey}` : null;
    },
    isFirstPage() {
      return this.pageNo === this.defaultPageNo;
    }
  },
  watch: {
    totalData(newVal, oldVal) {
      this._totalDataChange(newVal, oldVal, this.totalDataChangeThrow);
      this.totalDataChangeThrow = true;
    },
    currentData(newVal, oldVal) {
      this._currentDataChange(newVal, oldVal);
    },
    useChatRecordMode(newVal, oldVal) {
      if (newVal) {
        this.nLoadingMoreFixedHeight = false;
      }
    },
    value: {
      handler(newVal) {
        if (newVal !== this.totalData) {
          this.totalDataChangeThrow = false;
          this.totalData = newVal;
        }
      },
      immediate: true
    },
    modelValue: {
      handler(newVal) {
        if (newVal !== this.totalData) {
          this.totalDataChangeThrow = false;
          this.totalData = newVal;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是）
    complete(data, success = true) {
      this.customNoMore = -1;
      return this.addData(data, success);
    },
    //【保证数据一致】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为dataKey，需与:data-key绑定的一致，第三个参数为是否成功(默认为是）
    completeByKey(data, dataKey = null, success = true) {
      if (dataKey !== null && this.dataKey !== null && dataKey !== this.dataKey) {
        this.isFirstPage && this.endRefresh();
        return new Promise((resolve) => resolve());
      }
      this.customNoMore = -1;
      return this.addData(data, success);
    },
    //【通过total判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为total(列表总数)，第三个参数为是否成功(默认为是）
    completeByTotal(data, total, success = true) {
      if (total == "undefined") {
        this.customNoMore = -1;
      } else {
        const dataTypeRes = this._checkDataType(data, success, false);
        data = dataTypeRes.data;
        success = dataTypeRes.success;
        if (total >= 0 && success) {
          return new Promise((resolve, reject) => {
            this.$nextTick(() => {
              let nomore = false;
              const realTotalDataCount = this.pageNo == this.defaultPageNo ? 0 : this.realTotalData.length;
              const dataLength = this.privateConcat ? data.length : 0;
              let exceedCount = realTotalDataCount + dataLength - total;
              if (exceedCount >= 0) {
                nomore = true;
                exceedCount = this.defaultPageSize - exceedCount;
                if (this.privateConcat && exceedCount > 0 && exceedCount < data.length) {
                  data = data.splice(0, exceedCount);
                }
              }
              this.completeByNoMore(data, nomore, success).then((res) => resolve(res)).catch(() => reject());
            });
          });
        }
      }
      return this.addData(data, success);
    },
    //【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否没有更多数据，第三个参数为是否成功(默认是是）
    completeByNoMore(data, nomore, success = true) {
      if (nomore != "undefined") {
        this.customNoMore = nomore == true ? 1 : 0;
      }
      return this.addData(data, success);
    },
    // 请求结束且请求失败时调用，支持传入请求失败原因
    completeByError(errorMsg) {
      this.customerEmptyViewErrorText = errorMsg;
      return this.complete(false);
    },
    // 与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
    addData(data, success = true) {
      if (!this.fromCompleteEmit) {
        this.disabledCompleteEmit = true;
        this.fromCompleteEmit = false;
      }
      const currentTimeStamp = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
      const disTime = currentTimeStamp - this.requestTimeStamp;
      let minDelay = this.minDelay;
      if (this.isFirstPage && this.finalShowRefresherWhenReload) {
        minDelay = Math.max(400, minDelay);
      }
      const addDataDalay = this.requestTimeStamp > 0 && disTime < minDelay ? minDelay - disTime : 0;
      this.$nextTick(() => {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
          this._addData(data, success, false);
        }, this.delay > 0 ? this.delay : addDataDalay);
      });
      return new Promise((resolve, reject) => {
        this.dataPromiseResultMap.complete = { resolve, reject };
      });
    },
    // 从顶部添加数据，不会影响分页的pageNo和pageSize
    addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
      let addFromTop = !this.isChatRecordModeAndNotInversion;
      data = Object.prototype.toString.call(data) !== "[object Array]" ? [data] : addFromTop ? data.reverse() : data;
      this.finalUseVirtualList && this._setCellIndex(data, "top");
      this.totalData = addFromTop ? [...data, ...this.totalData] : [...this.totalData, ...data];
      if (toTop) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => this.useChatRecordMode ? this.scrollToBottom(toTopWithAnimate) : this.scrollToTop(toTopWithAnimate));
      }
    },
    // 重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
    resetTotalData(data) {
      this.isTotalChangeFromAddData = true;
      data = Object.prototype.toString.call(data) !== "[object Array]" ? [data] : data;
      this.totalData = data;
    },
    // 设置本地分页数据，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
    setLocalPaging(data, success = true) {
      this.isLocalPaging = true;
      this.$nextTick(() => {
        this._addData(data, success, true);
      });
      return new Promise((resolve, reject) => {
        this.dataPromiseResultMap.localPaging = { resolve, reject };
      });
    },
    // 重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
    reload(animate = this.showRefresherWhenReload) {
      if (animate) {
        this.privateShowRefresherWhenReload = animate;
        this.isUserPullDown = true;
      }
      if (!this.showLoadingMoreWhenReload) {
        this.listRendering = true;
      }
      this.$nextTick(() => {
        this._preReload(animate, false);
      });
      return new Promise((resolve, reject) => {
        this.dataPromiseResultMap.reload = { resolve, reject };
      });
    },
    // 刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
    refresh() {
      return this._handleRefreshWithDisPageNo(this.pageNo - this.defaultPageNo + 1);
    },
    // 刷新列表数据至指定页，例如pageNo=5时则代表刷新列表至第5页，此时pageNo会变为5，列表会展示前5页的数据。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
    refreshToPage(pageNo) {
      this.isHandlingRefreshToPage = true;
      return this._handleRefreshWithDisPageNo(pageNo + this.defaultPageNo - 1);
    },
    // 手动更新列表缓存数据，将自动截取v-model绑定的list中的前pageSize条覆盖缓存，请确保在list数据更新到预期结果后再调用此方法
    updateCache() {
      if (this.finalUseCache && this.totalData.length) {
        this._saveLocalCache(this.totalData.slice(0, Math.min(this.totalData.length, this.pageSize)));
      }
    },
    // 清空分页数据
    clean() {
      this._reload(true);
      this._addData([], true, false);
    },
    // 清空分页数据
    clear() {
      this.clean();
    },
    // reload之前的一些处理
    _preReload(animate = this.showRefresherWhenReload, isFromMounted = true, retryCount = 0) {
      const showRefresher = this.finalRefresherEnabled && this.useCustomRefresher;
      if (this.customRefresherHeight === -1 && showRefresher) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
          retryCount++;
          if (retryCount % 10 === 0) {
            this._updateCustomRefresherHeight();
          }
          this._preReload(animate, isFromMounted, retryCount);
        }, uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime / 2);
        return;
      }
      this.isUserReload = true;
      this.loadingType = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
      if (animate) {
        this.privateShowRefresherWhenReload = animate;
        if (this.useCustomRefresher) {
          this._doRefresherRefreshAnimate();
        } else {
          this.refresherTriggered = true;
        }
      } else {
        this._refresherEnd(false, false, false, false);
      }
      this._reload(false, isFromMounted);
    },
    // 重新加载分页数据
    _reload(isClean = false, isFromMounted = false, isUserPullDown = false) {
      this.isAddedData = false;
      this.insideOfPaging = -1;
      this.cacheScrollNodeHeight = -1;
      this.pageNo = this.defaultPageNo;
      this._cleanRefresherEndTimeout();
      !this.privateShowRefresherWhenReload && !isClean && this._startLoading(true);
      this.firstPageLoaded = true;
      this.isTotalChangeFromAddData = false;
      if (!this.isSettingCacheList) {
        this.totalData = [];
      }
      if (!isClean) {
        this._emitQuery(this.pageNo, this.defaultPageSize, isUserPullDown ? uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.QueryFrom.UserPullDown : uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.QueryFrom.Reload);
        let delay = 0;
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(this._callMyParentQuery, delay);
        if (!isFromMounted && this.autoScrollToTopWhenReload) {
          this._scrollToTop(false);
        }
      }
    },
    // 处理服务端返回的数组
    _addData(data, success, isLocal) {
      this.isAddedData = true;
      this.fromEmptyViewReload = false;
      this.isTotalChangeFromAddData = true;
      this.refresherTriggered = false;
      this._endSystemLoadingAndRefresh();
      const tempIsUserPullDown = this.isUserPullDown;
      if (this.showRefresherUpdateTime && this.isFirstPage) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.setRefesrherTime(uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime(), this.refresherUpdateTimeKey);
        this.$refs.refresh && this.$refs.refresh.updateTime();
      }
      if (!isLocal && tempIsUserPullDown && this.isFirstPage) {
        this.isUserPullDown = false;
      }
      if (!this.isFirstPage) {
        this.listRendering = true;
        this.$nextTick(() => {
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => this.listRendering = false);
        });
      } else {
        this.listRendering = false;
      }
      let dataTypeRes = this._checkDataType(data, success, isLocal);
      data = dataTypeRes.data;
      success = dataTypeRes.success;
      let delayTime = uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime;
      if (this.useChatRecordMode)
        delayTime = 0;
      this.loadingForNow = false;
      uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
        this.pagingLoaded = true;
        this.$nextTick(() => {
          !isLocal && this._refresherEnd(delayTime > 0, true, tempIsUserPullDown);
        });
      });
      if (this.isFirstPage) {
        this.isLoadFailed = !success;
        this.$emit("isLoadFailedChange", this.isLoadFailed);
        if (this.finalUseCache && success && (this.cacheMode === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CacheMode.Always ? true : this.isSettingCacheList)) {
          this._saveLocalCache(data);
        }
      }
      this.isSettingCacheList = false;
      if (success) {
        if (!(this.privateConcat === false && !this.isHandlingRefreshToPage && this.loadingStatus === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.NoMore)) {
          this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.Default;
        }
        if (isLocal) {
          this.totalLocalPagingList = data;
          const localPageNo = this.defaultPageNo;
          const localPageSize = this.queryFrom !== uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.QueryFrom.Refresh ? this.defaultPageSize : this.currentRefreshPageSize;
          this._localPagingQueryList(localPageNo, localPageSize, 0, (res) => {
            this.completeByTotal(res, this.totalLocalPagingList.length);
          });
        } else {
          let dataChangeDelayTime = 0;
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
            this._currentDataChange(data, this.currentData);
            this._callDataPromise(true, this.totalData);
          }, dataChangeDelayTime);
        }
        if (this.isHandlingRefreshToPage) {
          this.isHandlingRefreshToPage = false;
          this.pageNo = this.defaultPageNo + Math.ceil(data.length / this.pageSize) - 1;
          if (data.length % this.pageSize !== 0) {
            this.customNoMore = 1;
          }
        }
      } else {
        this._currentDataChange(data, this.currentData);
        this._callDataPromise(false);
        this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.Fail;
        this.isHandlingRefreshToPage = false;
        if (this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.LoadingMore) {
          this.pageNo--;
        }
      }
    },
    // 所有数据改变时调用
    _totalDataChange(newVal, oldVal, eventThrow = true) {
      if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length && oldVal.length) {
        return;
      }
      this._doCheckScrollViewShouldFullHeight(newVal);
      if (!this.realTotalData.length && !newVal.length) {
        eventThrow = false;
      }
      this.realTotalData = newVal;
      if (eventThrow) {
        this.$emit("input", newVal);
        this.$emit("update:modelValue", newVal);
        this.$emit("update:list", newVal);
        this.$emit("listChange", newVal);
        this._callMyParentList(newVal);
      }
      this.firstPageLoaded = false;
      this.isTotalChangeFromAddData = false;
      this.$nextTick(() => {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
          this._getNodeClientRect(".zp-paging-container-content").then((res) => {
            res && this.$emit("contentHeightChanged", res[0].height);
          });
        }, uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime * (this.isIos ? 1 : 3));
      });
    },
    // 当前数据改变时调用
    _currentDataChange(newVal, oldVal) {
      newVal = [...newVal];
      this.finalUseVirtualList && this._setCellIndex(newVal, "bottom");
      if (this.isFirstPage && this.finalConcat) {
        this.totalData = [];
      }
      if (this.customNoMore !== -1) {
        if (this.customNoMore === 1 || this.customNoMore !== 0 && !newVal.length) {
          this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.NoMore;
        }
      } else {
        if (!newVal.length || newVal.length && newVal.length < this.defaultPageSize) {
          this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.NoMore;
        }
      }
      if (!this.totalData.length) {
        this.totalData = newVal;
      } else {
        if (this.finalConcat) {
          const currentScrollTop = this.oldScrollTop;
          this.totalData = [...this.totalData, ...newVal];
          if (!this.isIos && !this.refresherOnly && !this.usePageScroll && newVal.length) {
            this.loadingMoreTimeStamp = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
            this.$nextTick(() => {
              this.scrollToY(currentScrollTop);
            });
          }
        } else {
          this.totalData = newVal;
        }
      }
      this.privateConcat = true;
    },
    // 根据pageNo处理refresh操作
    _handleRefreshWithDisPageNo(pageNo) {
      if (!this.isHandlingRefreshToPage && !this.realTotalData.length)
        return this.reload();
      if (pageNo >= 1) {
        this.loading = true;
        this.privateConcat = false;
        const totalPageSize = pageNo * this.pageSize;
        this.currentRefreshPageSize = totalPageSize;
        if (this.isLocalPaging && this.isHandlingRefreshToPage) {
          this._localPagingQueryList(this.defaultPageNo, totalPageSize, 0, (res) => {
            this.complete(res);
          });
        } else {
          this._emitQuery(this.defaultPageNo, totalPageSize, uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.QueryFrom.Refresh);
          this._callMyParentQuery(this.defaultPageNo, totalPageSize);
        }
      }
      return new Promise((resolve, reject) => {
        this.dataPromiseResultMap.reload = { resolve, reject };
      });
    },
    // 本地分页请求
    _localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
      pageNo = Math.max(1, pageNo);
      pageSize = Math.max(1, pageSize);
      const totalPagingList = [...this.totalLocalPagingList];
      const pageNoIndex = (pageNo - 1) * pageSize;
      const finalPageNoIndex = Math.min(totalPagingList.length, pageNoIndex + pageSize);
      const resultPagingList = totalPagingList.splice(pageNoIndex, finalPageNoIndex - pageNoIndex);
      uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => callback(resultPagingList), localPagingLoadingTime);
    },
    // 存储列表缓存数据
    _saveLocalCache(data) {
      common_vendor.index.setStorageSync(this.finalCacheKey, data);
    },
    // 通过缓存数据填充列表数据
    _setListByLocalCache() {
      this.totalData = common_vendor.index.getStorageSync(this.finalCacheKey) || [];
      this.isSettingCacheList = true;
    },
    // 修改父view的list
    _callMyParentList(newVal) {
      if (this.autowireListName.length) {
        const myParent = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getParent(this.$parent);
        if (myParent && myParent[this.autowireListName]) {
          myParent[this.autowireListName] = newVal;
        }
      }
    },
    // 调用父view的query
    _callMyParentQuery(customPageNo = 0, customPageSize = 0) {
      if (this.autowireQueryName) {
        if (this.myParentQuery === -1) {
          const myParent = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getParent(this.$parent);
          if (myParent && myParent[this.autowireQueryName]) {
            this.myParentQuery = myParent[this.autowireQueryName];
          }
        }
        if (this.myParentQuery !== -1) {
          customPageSize > 0 ? this.myParentQuery(customPageNo, customPageSize) : this.myParentQuery(this.pageNo, this.defaultPageSize);
        }
      }
    },
    // emit query事件
    _emitQuery(pageNo, pageSize, from) {
      this.queryFrom = from;
      this.requestTimeStamp = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
      const [lastItem] = this.realTotalData.slice(-1);
      this.$emit("query", ...uni_modules_zPaging_components_zPaging_js_zPagingInterceptor.interceptor._handleQuery(pageNo, pageSize, from, lastItem || null));
    },
    // 触发数据改变promise
    _callDataPromise(success, totalList) {
      for (const key in this.dataPromiseResultMap) {
        const obj = this.dataPromiseResultMap[key];
        if (!obj)
          continue;
        success ? obj.resolve({ totalList, noMore: this.loadingStatus === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.NoMore }) : this.callNetworkReject && obj.reject(`z-paging-${key}-error`);
      }
    },
    // 检查complete data的类型
    _checkDataType(data, success, isLocal) {
      const dataType = Object.prototype.toString.call(data);
      if (dataType === "[object Boolean]") {
        success = data;
        data = [];
      } else if (dataType !== "[object Array]") {
        data = [];
        if (dataType !== "[object Undefined]" && dataType !== "[object Null]") {
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr(`${isLocal ? "setLocalPaging" : "complete"}参数类型不正确，第一个参数类型必须为Array!`);
        }
      }
      return { data, success };
    }
  }
};
exports.dataHandleModule = dataHandleModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/data-handle.js.map

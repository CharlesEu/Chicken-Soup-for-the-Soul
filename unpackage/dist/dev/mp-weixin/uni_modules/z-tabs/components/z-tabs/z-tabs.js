"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_zTabs_components_zTabs_config_index = require("./config/index.js");
function _gc(key, defaultValue) {
  let config = null;
  if (uni_modules_zTabs_components_zTabs_config_index.zTabsConfig && Object.keys(uni_modules_zTabs_components_zTabs_config_index.zTabsConfig).length) {
    config = uni_modules_zTabs_components_zTabs_config_index.zTabsConfig;
  } else {
    return defaultValue;
  }
  const value = config[_toKebab(key)];
  return value === void 0 ? defaultValue : value;
}
function _toKebab(value) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}
const _sfc_main = {
  name: "z-tabs",
  data() {
    return {
      currentIndex: 0,
      currentSwiperIndex: 0,
      bottomDotX: -1,
      bottomDotXForIndex: 0,
      showBottomDot: false,
      shouldSetDx: true,
      barCalcedWidth: 0,
      pxBarWidth: 0,
      scrollLeft: 0,
      tabsSuperWidth: common_vendor.index.upx2px(750),
      tabsWidth: common_vendor.index.upx2px(750),
      tabsHeight: common_vendor.index.upx2px(80),
      tabsLeft: 0,
      tabsContainerWidth: 0,
      itemNodeInfos: [],
      isFirstLoaded: false,
      currentScrollLeft: 0,
      changeTriggerFailed: false,
      currentChanged: false
    };
  },
  props: {
    //数据源数组，支持形如['tab1','tab2']的格式或[{name:'tab1',value:1}]的格式
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //当前选中的index
    current: {
      type: [Number, String],
      default: _gc("current", 0)
    },
    //list数组长度超过scrollCount时滚动显示(不自动铺满全屏)
    scrollCount: {
      type: [Number, String],
      default: _gc("scrollCount", 5)
    },
    //z-tabs样式
    tabsStyle: {
      type: Object,
      default: function() {
        return _gc("tabsStyle", {});
      }
    },
    //自定义每个tab的宽度，默认为0，即代表根据内容自动撑开，单位rpx，支持传100、"100px"或"100rpx"
    tabWidth: {
      type: [Number, String],
      default: _gc("tabWidth", 0)
    },
    //滑块宽度，单位rpx，支持传100、"100px"或"100rpx"
    barWidth: {
      type: [Number, String],
      default: _gc("barWidth", 45)
    },
    //滑块高度，单位rpx，支持传100、"100px"或"100rpx"
    barHeight: {
      type: [Number, String],
      default: _gc("barHeight", 8)
    },
    //滑块样式，其中的width和height将被barWidth和barHeight覆盖
    barStyle: {
      type: Object,
      default: function() {
        return _gc("barStyle", {});
      }
    },
    //tabs与底部的间距，单位rpx，支持传100、"100px"或"100rpx"
    bottomSpace: {
      type: [Number, String],
      default: _gc("bottomSpace", 8)
    },
    //切换tab时滑块动画模式，与swiper联动时有效，点击切换tab时无效，必须调用setDx。默认为line，即切换tab时滑块宽度保持不变，线性运动。可选值为worm，即为类似毛毛虫蠕动效果
    barAnimateMode: {
      type: String,
      default: _gc("barAnimateMode", "line")
    },
    //list中item的name(标题)的key
    nameKey: {
      type: String,
      default: _gc("nameKey", "name")
    },
    //list中item的value的key
    valueKey: {
      type: String,
      default: _gc("valueKey", "value")
    },
    //激活状态tab的颜色
    activeColor: {
      type: String,
      default: _gc("activeColor", "#007AFF")
    },
    //未激活状态tab的颜色
    inactiveColor: {
      type: String,
      default: _gc("inactiveColor", "#666666")
    },
    //禁用状态tab的颜色
    disabledColor: {
      type: String,
      default: _gc("disabledColor", "#bbbbbb")
    },
    //激活状态tab的样式
    activeStyle: {
      type: Object,
      default: function() {
        return _gc("activeStyle", {});
      }
    },
    //未激活状态tab的样式
    inactiveStyle: {
      type: Object,
      default: function() {
        return _gc("inactiveStyle", {});
      }
    },
    //禁用状态tab的样式
    disabledStyle: {
      type: Object,
      default: function() {
        return _gc("disabledStyle", {});
      }
    },
    //z-tabs背景色
    bgColor: {
      type: String,
      default: _gc("bgColor", "white")
    },
    //徽标数最大数字限制，超过这个数字将变成badgeMaxCount+
    badgeMaxCount: {
      type: [Number, String],
      default: _gc("badgeMaxCount", 99)
    },
    //徽标样式，例如可自定义背景色，字体等等
    badgeStyle: {
      type: Object,
      default: function() {
        return _gc("badgeStyle", {});
      }
    },
    //初始化时是否自动触发change事件
    initTriggerChange: {
      type: Boolean,
      default: _gc("initTriggerChange", false)
    }
  },
  mounted() {
    this.updateSubviewLayout();
  },
  watch: {
    current: {
      handler(newVal) {
        this.currentChanged && this._lockDx();
        this.currentIndex = newVal;
        this._preUpdateDotPosition(this.currentIndex);
        if (this.initTriggerChange) {
          if (newVal < this.list.length) {
            this.$emit("change", newVal, this.list[newVal][this.valueKey]);
          } else {
            this.changeTriggerFailed = true;
          }
        }
        this.currentChanged = true;
      },
      immediate: true
    },
    list: {
      handler(newVal) {
        this._handleListChange(newVal);
      },
      immediate: false
    },
    bottomDotX(newVal) {
      if (newVal >= 0) {
        this.showBottomDot = true;
        this.$nextTick(() => {
        });
      }
    },
    finalBarWidth: {
      handler(newVal) {
        this.barCalcedWidth = newVal;
        this.pxBarWidth = this.barCalcedWidth;
      },
      immediate: true
    },
    currentIndex: {
      handler(newVal) {
        this.currentSwiperIndex = newVal;
      },
      immediate: true
    }
  },
  computed: {
    shouldScroll() {
      return this.list.length > this.scrollCount;
    },
    finalTabsHeight() {
      return this.tabsHeight;
    },
    tabStyle() {
      const stl = this.shouldScroll ? { "flex-shrink": 0 } : { "flex": 1 };
      if (this.finalTabWidth > 0) {
        stl["width"] = this.finalTabWidth + "px";
      } else {
        delete stl.width;
      }
      return stl;
    },
    tabsListStyle() {
      return this.shouldScroll ? {} : { "flex": 1 };
    },
    showAnimate() {
      return this.isFirstLoaded && !this.shouldSetDx;
    },
    dotTransition() {
      return this.showAnimate ? "transform .2s linear" : "none";
    },
    finalDotStyle() {
      return { ...this.barStyle, width: this.barCalcedWidth + "px", height: this.finalBarHeight + "px", opacity: this.showBottomDot ? 1 : 0 };
    },
    finalTabWidth() {
      return this._convertTextToPx(this.tabWidth);
    },
    finalBarWidth() {
      return this._convertTextToPx(this.barWidth);
    },
    finalBarHeight() {
      return this._convertTextToPx(this.barHeight);
    },
    finalBottomSpace() {
      return this._convertTextToPx(this.bottomSpace);
    }
  },
  methods: {
    //根据swiper的@transition实时更新底部dot位置
    setDx(dx) {
      if (!this.shouldSetDx)
        return;
      const isLineMode = this.barAnimateMode === "line";
      const isWormMode = this.barAnimateMode === "worm";
      let dxRate = dx / this.tabsSuperWidth;
      this.currentSwiperIndex = this.currentIndex + parseInt(dxRate);
      const isRight = dxRate > 0;
      const barWidth = this.pxBarWidth;
      if (this.currentSwiperIndex !== this.currentIndex) {
        dxRate = dxRate - (this.currentSwiperIndex - this.currentIndex);
        const currentNode = this.itemNodeInfos[this.currentSwiperIndex];
        if (!!currentNode) {
          this.bottomDotXForIndex = this._getBottomDotX(currentNode, barWidth);
        }
      }
      const currentIndex = this.currentSwiperIndex;
      let nextIndex = currentIndex + (isRight ? 1 : -1);
      nextIndex = Math.max(0, nextIndex);
      nextIndex = Math.min(nextIndex, this.itemNodeInfos.length - 1);
      const currentNodeInfo = this.itemNodeInfos[currentIndex];
      const nextNodeInfo = this.itemNodeInfos[nextIndex];
      const nextBottomX = this._getBottomDotX(nextNodeInfo, barWidth);
      if (isLineMode) {
        this.bottomDotX = this.bottomDotXForIndex + (nextBottomX - this.bottomDotXForIndex) * Math.abs(dxRate);
      } else if (isWormMode) {
        if (isRight && currentIndex >= this.itemNodeInfos.length - 1 || !isRight && currentIndex <= 0)
          return;
        const spaceOffset = isRight ? nextNodeInfo.right - currentNodeInfo.left : currentNodeInfo.right - nextNodeInfo.left;
        let barCalcedWidth = barWidth + spaceOffset * Math.abs(dxRate);
        if (isRight) {
          if (barCalcedWidth > nextBottomX - this.bottomDotX + barWidth) {
            const barMinusWidth = barWidth + spaceOffset * (1 - dxRate);
            this.bottomDotX = this.bottomDotXForIndex + (barCalcedWidth - barMinusWidth) / 2;
            barCalcedWidth = barMinusWidth;
          }
        } else if (!isRight) {
          if (barCalcedWidth > this.bottomDotXForIndex + barWidth - nextBottomX) {
            const barMinusWidth = barWidth + spaceOffset * (1 + dxRate);
            barCalcedWidth = barMinusWidth;
            this.bottomDotX = nextBottomX;
          } else {
            this.bottomDotX = this.bottomDotXForIndex - (barCalcedWidth - barWidth);
          }
        }
        barCalcedWidth = Math.max(barCalcedWidth, barWidth);
        this.barCalcedWidth = barCalcedWidth;
      }
    },
    //在swiper的@animationfinish中通知z-tabs结束多setDx的锁定，若在父组件中调用了setDx，则必须调用unlockDx
    unlockDx() {
      this.$nextTick(() => {
        this.shouldSetDx = true;
      });
    },
    //更新z-tabs内部布局
    updateSubviewLayout(tryCount = 0) {
      this.$nextTick(() => {
        let delayTime = 10;
        setTimeout(() => {
          this._getNodeClientRect(".z-tabs-scroll-view-conatiner").then((res) => {
            if (res) {
              if (!res[0].width && tryCount < 10) {
                setTimeout(() => {
                  tryCount++;
                  this.updateSubviewLayout(tryCount);
                }, 50);
                return;
              }
              this.tabsWidth = res[0].width;
              this.tabsHeight = res[0].height;
              this.tabsLeft = res[0].left;
              this._handleListChange(this.list);
            }
          });
          this._getNodeClientRect(".z-tabs-conatiner").then((res) => {
            if (res && res[0].width) {
              this.tabsSuperWidth = res[0].width;
            }
          });
        }, delayTime);
      });
    },
    //点击了tabs
    tabsClick(index, item) {
      if (item.disabled)
        return;
      if (this.currentIndex != index) {
        this.shouldSetDx = false;
        this.$emit("change", index, item[this.valueKey]);
        this.currentIndex = index;
        this._preUpdateDotPosition(index);
      } else {
        this.$emit("secondClick", index, item[this.valueKey]);
      }
    },
    //scroll-view滚动
    scroll(e) {
      this.currentScrollLeft = e.detail.scrollLeft;
    },
    //锁定dx，用于避免在swiper被动触发滚动时候执行setDx中的代码
    _lockDx() {
      this.shouldSetDx = false;
    },
    //更新底部dot位置之前的预处理
    _preUpdateDotPosition(index) {
      this.$nextTick(() => {
        common_vendor.index.createSelectorQuery().in(this).select(".z-tabs-scroll-view").fields({
          scrollOffset: true
        }, (data) => {
          if (data) {
            this.currentScrollLeft = data.scrollLeft;
            this._updateDotPosition(index);
          } else {
            this._updateDotPosition(index);
          }
        }).exec();
      });
    },
    //更新底部dot位置
    _updateDotPosition(index) {
      if (index >= this.itemNodeInfos.length)
        return;
      this.$nextTick(async () => {
        let node = this.itemNodeInfos[index];
        let offset = 0;
        let tabsContainerWidth = this.tabsContainerWidth;
        if (JSON.stringify(this.activeStyle) !== "{}") {
          const nodeRes = await this._getNodeClientRect(`#z-tabs-item-${index}`, true);
          if (nodeRes) {
            node = nodeRes[0];
            offset = this.currentScrollLeft;
            this.tabsHeight = Math.max(node.height + common_vendor.index.upx2px(28), this.tabsHeight);
            tabsContainerWidth = 0;
            for (let i = 0; i < this.itemNodeInfos.length; i++) {
              let oldNode = this.itemNodeInfos[i];
              tabsContainerWidth += i === index ? node.width : oldNode.width;
            }
          }
        }
        this.bottomDotX = this._getBottomDotX(node, this.finalBarWidth, offset);
        this.bottomDotXForIndex = this.bottomDotX;
        if (this.tabsWidth) {
          setTimeout(() => {
            let scrollLeft = this.bottomDotX - this.tabsWidth / 2 + this.finalBarWidth / 2;
            scrollLeft = Math.max(0, scrollLeft);
            if (tabsContainerWidth) {
              scrollLeft = Math.min(scrollLeft, tabsContainerWidth - this.tabsWidth + 10);
            }
            if (this.shouldScroll && tabsContainerWidth > this.tabsWidth) {
              this.scrollLeft = scrollLeft;
            }
            this.$nextTick(() => {
              this.isFirstLoaded = true;
            });
          }, 200);
        }
      });
    },
    // 处理list改变
    _handleListChange(newVal) {
      this.$nextTick(async () => {
        if (newVal.length) {
          let itemNodeInfos = [];
          let tabsContainerWidth = 0;
          let delayTime = 0;
          setTimeout(async () => {
            for (let i = 0; i < newVal.length; i++) {
              const nodeRes = await this._getNodeClientRect(`#z-tabs-item-${i}`, true);
              if (nodeRes) {
                const node = nodeRes[0];
                node.left += this.currentScrollLeft;
                itemNodeInfos.push(node);
                tabsContainerWidth += node.width;
              }
              if (i === this.currentIndex) {
                this.itemNodeInfos = itemNodeInfos;
                this.tabsContainerWidth = tabsContainerWidth;
                this._updateDotPosition(this.currentIndex);
              }
            }
            this.itemNodeInfos = itemNodeInfos;
            this.tabsContainerWidth = tabsContainerWidth;
            this._updateDotPosition(this.currentIndex);
          }, delayTime);
        }
      });
      if (this.initTriggerChange && this.changeTriggerFailed && newVal.length) {
        if (this.current < newVal.length) {
          this.$emit("change", this.current, newVal[this.current][this.valueKey]);
        }
      }
    },
    //根据node获取bottomX
    _getBottomDotX(node, barWidth = this.finalBarWidth, offset = 0) {
      return node.left + node.width / 2 - barWidth / 2 + offset - this.tabsLeft;
    },
    //获取节点信息
    _getNodeClientRect(select, withRefArr = false) {
      const res = common_vendor.index.createSelectorQuery().in(this);
      res.select(select).boundingClientRect();
      return new Promise((resolve, reject) => {
        res.exec((data) => {
          resolve(data && data != "" && data != void 0 && data.length ? data : false);
        });
      });
    },
    //格式化badge中的count
    _formatCount(count) {
      if (!count)
        return "";
      if (count > this.badgeMaxCount) {
        return this.badgeMaxCount + "+";
      }
      return count.toString();
    },
    //将文本的px或者rpx转为px的值
    _convertTextToPx(text) {
      const dataType = Object.prototype.toString.call(text);
      if (dataType === "[object Number]") {
        return common_vendor.index.upx2px(text);
      }
      let isRpx = false;
      if (text.indexOf("rpx") !== -1 || text.indexOf("upx") !== -1) {
        text = text.replace("rpx", "").replace("upx", "");
        isRpx = true;
      } else if (text.indexOf("px") !== -1) {
        text = text.replace("px", "");
      } else {
        text = common_vendor.index.upx2px(text);
      }
      if (!isNaN(text)) {
        if (isRpx)
          return Number(common_vendor.index.upx2px(text));
        return Number(text);
      }
      return 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item[$props.nameKey] || item),
        b: item.disabled ? 1 : "",
        c: common_vendor.s({
          color: item.disabled ? $props.disabledColor : $data.currentIndex === index ? $props.activeColor : $props.inactiveColor
        }),
        d: common_vendor.s(item.disabled ? $props.disabledStyle : $data.currentIndex === index ? $props.activeStyle : $props.inactiveStyle),
        e: item.badge && $options._formatCount(item.badge.count).length
      }, item.badge && $options._formatCount(item.badge.count).length ? {
        f: common_vendor.t($options._formatCount(item.badge.count)),
        g: common_vendor.s($props.badgeStyle)
      } : {}, {
        h: `z-tabs-item-${index}`,
        i: `z-tabs-item-${index}`,
        j: index,
        k: common_vendor.o(($event) => $options.tabsClick(index, item), index)
      });
    }),
    b: common_vendor.s($options.tabStyle),
    c: common_vendor.s($options.tabsListStyle),
    d: common_vendor.s({
      marginTop: -$options.finalBottomSpace + "px"
    }),
    e: common_vendor.s({
      transform: `translateX(${$data.bottomDotX}px)`,
      transition: $options.dotTransition,
      background: $props.activeColor
    }),
    f: common_vendor.s($options.finalDotStyle),
    g: common_vendor.s({
      width: $data.tabsContainerWidth + "px",
      bottom: $options.finalBottomSpace + "px"
    }),
    h: common_vendor.s($options.tabsListStyle),
    i: $data.scrollLeft,
    j: $data.isFirstLoaded,
    k: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    l: common_vendor.s({
      background: $props.bgColor
    }),
    m: common_vendor.s($props.tabsStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0ac4bf81"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/z-tabs/components/z-tabs/z-tabs.js.map

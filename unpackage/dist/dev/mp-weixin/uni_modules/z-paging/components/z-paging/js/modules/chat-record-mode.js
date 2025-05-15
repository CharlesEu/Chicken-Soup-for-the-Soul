"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const chatRecordModerModule = {
  props: {
    // 使用聊天记录模式，默认为否
    useChatRecordMode: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useChatRecordMode", false)
    },
    // 使用聊天记录模式时滚动到顶部后，列表垂直移动偏移距离。默认0rpx。单位px（暂时无效）
    chatRecordMoreOffset: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("chatRecordMoreOffset", "0rpx")
    },
    // 使用聊天记录模式时是否自动隐藏键盘：在用户触摸列表时候自动隐藏键盘，默认为是
    autoHideKeyboardWhenChat: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideKeyboardWhenChat", true)
    },
    // 使用聊天记录模式中键盘弹出时是否自动调整slot="bottom"高度，默认为是
    autoAdjustPositionWhenChat: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoAdjustPositionWhenChat", true)
    },
    // 使用聊天记录模式中键盘弹出时占位高度偏移距离。默认0rpx。单位px
    chatAdjustPositionOffset: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("chatAdjustPositionOffset", "0rpx")
    },
    // 使用聊天记录模式中键盘弹出时是否自动滚动到底部，默认为否
    autoToBottomWhenChat: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoToBottomWhenChat", false)
    },
    // 使用聊天记录模式中reload时是否显示chatLoading，默认为否
    showChatLoadingWhenReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showChatLoadingWhenReload", false)
    },
    // 在聊天记录模式中滑动到顶部状态为默认状态时，以加载中的状态展示，默认为是。若设置为否，则默认会显示【点击加载更多】，然后才会显示loading
    chatLoadingMoreDefaultAsLoading: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("chatLoadingMoreDefaultAsLoading", true)
    }
  },
  data() {
    return {
      // 键盘高度
      keyboardHeight: 0,
      // 键盘高度是否未改变，此时占位高度变化不需要动画效果
      isKeyboardHeightChanged: false
    };
  },
  computed: {
    finalChatRecordMoreOffset() {
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertToPx(this.chatRecordMoreOffset);
    },
    finalChatAdjustPositionOffset() {
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertToPx(this.chatAdjustPositionOffset);
    },
    // 聊天记录模式旋转180度style
    chatRecordRotateStyle() {
      let cellStyle;
      cellStyle = this.useChatRecordMode ? { transform: "scaleY(-1)" } : {};
      this.$emit("update:cellStyle", cellStyle);
      this.$emit("cellStyleChange", cellStyle);
      this.$nextTick(() => {
        if (this.isFirstPage && this.isChatRecordModeAndNotInversion) {
          this.$nextTick(() => {
            this._scrollToBottom(false);
            uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
              this._scrollToBottom(false);
              uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
                this._scrollToBottom(false);
              }, 50);
            }, 50);
          });
        }
      });
      return cellStyle;
    },
    // 是否是聊天记录列表并且有配置transform
    isChatRecordModeHasTransform() {
      return this.useChatRecordMode && this.chatRecordRotateStyle && this.chatRecordRotateStyle.transform;
    },
    // 是否是聊天记录列表并且列表未倒置
    isChatRecordModeAndNotInversion() {
      return this.isChatRecordModeHasTransform && this.chatRecordRotateStyle.transform === "scaleY(1)";
    },
    // 是否是聊天记录列表并且列表倒置
    isChatRecordModeAndInversion() {
      return this.isChatRecordModeHasTransform && this.chatRecordRotateStyle.transform === "scaleY(-1)";
    },
    // 最终的聊天记录模式中底部安全区域的高度，如果开启了底部安全区域并且键盘未弹出，则添加底部区域高度
    chatRecordModeSafeAreaBottom() {
      return this.safeAreaInsetBottom && !this.keyboardHeight ? this.safeAreaBottom : 0;
    }
  },
  mounted() {
    if (this.useChatRecordMode) {
      common_vendor.index.onKeyboardHeightChange(this._handleKeyboardHeightChange);
    }
  },
  methods: {
    // 添加聊天记录
    addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
      if (!this.useChatRecordMode)
        return;
      this.isTotalChangeFromAddData = true;
      this.addDataFromTop(data, toBottom, toBottomWithAnimate);
    },
    // 手动触发滚动到顶部加载更多，聊天记录模式时有效
    doChatRecordLoadMore() {
      this.useChatRecordMode && this._onLoadingMore("click");
    },
    // 处理键盘高度变化
    _handleKeyboardHeightChange(res) {
      this.$emit("keyboardHeightChange", res);
      if (this.autoAdjustPositionWhenChat) {
        this.isKeyboardHeightChanged = true;
        this.keyboardHeight = res.height > 0 ? res.height + this.finalChatAdjustPositionOffset : res.height;
      }
      if (this.autoToBottomWhenChat && this.keyboardHeight > 0) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
          this.scrollToBottom(false);
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.delay(() => {
            this.scrollToBottom(false);
          });
        });
      }
    }
  }
};
exports.chatRecordModerModule = chatRecordModerModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/chat-record-mode.js.map

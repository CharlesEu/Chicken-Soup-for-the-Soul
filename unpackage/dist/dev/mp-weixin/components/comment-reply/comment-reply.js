"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "comment-reply",
  props: {
    source: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  emits: ["success"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const userStore = stores_user.useUserStore();
    const secCheckObj = common_vendor.nr.importObject("secCheckContent", { customUI: true });
    const db = common_vendor.nr.database();
    const commentData = common_vendor.ref({
      comment_content: ""
    });
    const commentFocus = common_vendor.ref(false);
    const props = __props;
    const emits = __emit;
    const focusFn = () => {
      commentFocus.value = false;
      common_vendor.nextTick$1(() => {
        commentFocus.value = true;
        commentData.value = {
          ...commentData.value,
          ...props.source
        };
      });
    };
    const onSubmit = async () => {
      common_vendor.index.showLoading();
      let { reply_user_name, ..._commentData } = commentData.value;
      let secRes = await secCheckObj.textSecCheck(commentData.value.comment_content, userStore.userInfo.openid);
      if (secRes.code) {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: secRes.errMsg,
          content: `发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`,
          showCancel: false
        });
        return;
      }
      let res = await db.collection("soup-comments").add(_commentData);
      commentData.value.comment_content = "";
      common_vendor.index.hideLoading();
      emits("success");
      common_vendor.index.__f__("log", "at components/comment-reply/comment-reply.vue:65", res);
    };
    __expose({
      focusFn
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onSubmit),
        b: commentFocus.value,
        c: commentData.value.reply_user_name ? "回复：" + commentData.value.reply_user_name : "请输入评论内容",
        d: commentData.value.comment_content,
        e: common_vendor.o(($event) => commentData.value.comment_content = $event.detail.value),
        f: common_vendor.p({
          type: "paperplane",
          size: "26",
          color: "#333"
        }),
        g: common_vendor.o(onSubmit)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1a83b5c4"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/comment-reply/comment-reply.js.map

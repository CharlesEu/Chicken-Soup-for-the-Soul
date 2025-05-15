"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_dateformat2 + _easycom_uni_icons2)();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_dateformat + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "comment-item",
  props: {
    subReply: {
      type: Boolean,
      default: false
    },
    item: Object,
    reply: {
      type: Boolean,
      default: false
    },
    toplevel: {
      type: Boolean,
      default: false
    }
  },
  emits: ["reply"],
  setup(__props, { emit: __emit }) {
    const db = common_vendor.nr.database();
    const current_id = common_vendor.ref(common_vendor.nr.getCurrentUserInfo().uid);
    const emits = __emit;
    const props = __props;
    const commentItem = common_vendor.ref(props.item);
    common_vendor.watch(() => props.item, (nv) => {
      commentItem.value = nv;
    });
    const commentRemove = async () => {
      let result = await common_vendor.index.showModal({
        title: "是否删除"
      });
      if (!result.confirm)
        return;
      let { result: { errCode } } = await db.collection("soup-comments").doc(commentItem.value._id).update({
        is_delete: true
      });
      if (errCode == 0)
        common_vendor.index.$emit("commentRemove");
    };
    const clickLike = common_vendor.debounce(handleLike, 1e3, { "leading": true, "trailing": false });
    async function handleLike() {
      if (commentItem.value.isLike) {
        commentItem.value.like_count--;
        db.collection("soup-like").where({
          soup_id: commentItem.value.soup_id,
          comment_id: commentItem.value._id,
          user_id: current_id.value,
          like_type: 1
        }).remove();
      } else {
        commentItem.value.like_count++;
        db.collection("soup-like").add({
          soup_id: commentItem.value.soup_id,
          comment_id: commentItem.value._id,
          like_type: 1
        });
      }
      commentItem.value.isLike = !commentItem.value.isLike;
      common_vendor.index.$emit("commentLike", { _id: commentItem.value._id, isLike: commentItem.value.isLike, like_count: commentItem.value.like_count });
    }
    const goReply = () => {
      if (props.subReply) {
        common_vendor.index.navigateTo({
          url: "/pages/detail/reply"
        });
        common_vendor.index.setStorageSync("currentReply", props.item);
      }
      if (props.reply) {
        emits("reply", props.item);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: commentItem.value.userInfo.avatar || "../../static/images/defAvatar.png",
        b: common_vendor.t(commentItem.value.userInfo.username),
        c: common_vendor.p({
          date: commentItem.value.comment_date,
          threshold: [6e4, 36e5],
          format: "yyyy/MM/dd hh:mm"
        }),
        d: commentItem.value.like_count > 0
      }, commentItem.value.like_count > 0 ? {
        e: common_vendor.t(commentItem.value.like_count),
        f: commentItem.value.isLike ? "#dd524d" : "#a7a7a7"
      } : {}, {
        g: !commentItem.value.isLike
      }, !commentItem.value.isLike ? {
        h: common_vendor.p({
          type: "hand-up",
          size: "20",
          color: "#a7a7a7"
        })
      } : {
        i: common_vendor.p({
          type: "hand-up-filled",
          size: "20",
          color: "#dd524d"
        })
      }, {
        j: common_vendor.o((...args) => common_vendor.unref(clickLike) && common_vendor.unref(clickLike)(...args)),
        k: !__props.toplevel && !commentItem.value.is_delete && (commentItem.value.userInfo._id == current_id.value || common_vendor.unref(utils_common.isAdminRole)())
      }, !__props.toplevel && !commentItem.value.is_delete && (commentItem.value.userInfo._id == current_id.value || common_vendor.unref(utils_common.isAdminRole)()) ? {
        l: common_vendor.p({
          type: "trash",
          size: "20",
          color: "#a7a7a7"
        }),
        m: common_vendor.o(commentRemove)
      } : {}, {
        n: common_vendor.t(commentItem.value.comment_content),
        o: common_vendor.n(commentItem.value.is_delete ? "isDelete" : ""),
        p: commentItem.value.replyInfo
      }, commentItem.value.replyInfo ? {
        q: common_vendor.t(commentItem.value.replyInfo.userInfo.username),
        r: common_vendor.t(commentItem.value.replyInfo.comment_content)
      } : {}, {
        s: common_vendor.o(goReply),
        t: __props.subReply && commentItem.value.childCount
      }, __props.subReply && commentItem.value.childCount ? {
        v: common_vendor.f(commentItem.value.child, (row, k0, i0) => {
          return {
            a: common_vendor.t(row.userInfo.username),
            b: common_vendor.t(row.comment_content),
            c: row._id
          };
        }),
        w: common_vendor.t(commentItem.value.childCount),
        x: common_vendor.p({
          type: "right",
          color: "#a7a7a7",
          size: "16"
        }),
        y: common_vendor.o(goReply)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c7df51b2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/comment-item/comment-item.js.map

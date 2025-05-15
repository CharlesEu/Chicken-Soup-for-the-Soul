"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_soup_tab_group2 = common_vendor.resolveComponent("soup-tab-group");
  const _easycom_soup_text_content2 = common_vendor.resolveComponent("soup-text-content");
  const _easycom_comment_item2 = common_vendor.resolveComponent("comment-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_interactive_bar2 = common_vendor.resolveComponent("interactive-bar");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_comment_reply2 = common_vendor.resolveComponent("comment-reply");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_share_posters2 = common_vendor.resolveComponent("share-posters");
  (_easycom_soup_tab_group2 + _easycom_soup_text_content2 + _easycom_comment_item2 + _easycom_uni_load_more2 + _easycom_interactive_bar2 + _easycom_z_paging2 + _easycom_comment_reply2 + _easycom_uni_popup2 + _easycom_share_posters2)();
}
const _easycom_soup_tab_group = () => "../../components/soup-tab-group/soup-tab-group.js";
const _easycom_soup_text_content = () => "../../components/soup-text-content/soup-text-content.js";
const _easycom_comment_item = () => "../../components/comment-item/comment-item.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_interactive_bar = () => "../../components/interactive-bar/interactive-bar.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_comment_reply = () => "../../components/comment-reply/comment-reply.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_share_posters = () => "../../components/share-posters/share-posters.js";
if (!Math) {
  (_easycom_soup_tab_group + _easycom_soup_text_content + _easycom_comment_item + _easycom_uni_load_more + _easycom_interactive_bar + _easycom_z_paging + _easycom_comment_reply + _easycom_uni_popup + _easycom_share_posters)();
}
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const commentRef = common_vendor.ref(null);
    const commentPopup = common_vendor.ref(null);
    const source = common_vendor.ref({});
    const db = common_vendor.nr.database();
    const dbCmd = db.command;
    const $ = dbCmd.aggregate;
    const item = common_vendor.ref();
    const current_id = common_vendor.nr.getCurrentUserInfo().uid;
    const shareRef = common_vendor.ref(null);
    const shareInfo = common_vendor.ref(null);
    const commentList = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    const noData = common_vendor.ref(false);
    let id;
    common_vendor.onLoad((e) => {
      e.scene ? id = e.scene : id = e.id;
      getDetail();
    });
    common_vendor.index.$on("commentLike", (e) => {
      let index = commentList.value.findIndex((item2) => item2._id == e._id);
      commentList.value[index] = {
        ...commentList.value[index],
        ...e
      };
    });
    common_vendor.index.$on("commentRemove", () => {
      common_vendor.nextTick$1(() => {
        paging.value.refresh();
      });
    });
    const clickShare = (index) => {
      shareInfo.value = item.value;
      shareRef.value.handleShow();
    };
    const queryList = (pageNo, pageSize) => {
      getComment(pageNo, pageSize);
    };
    const getComment = async (pageNo, pageSize) => {
      let skip = (pageNo - 1) * pageSize;
      let { result: { errCode, data } } = await db.collection("soup-comments").aggregate().match({
        soup_id: id,
        comment_type: 0
      }).lookup({
        from: "uni-id-users",
        let: {
          uid: "$user_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(["$_id", "$$uid"]))).project({
          username: 1,
          avatar: 1
        }).done(),
        as: "userInfo"
      }).lookup({
        from: "soup-comments",
        let: {
          id: "$_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(["$reply_parent_id", "$$id"]))).count("length").done(),
        as: "childCount"
      }).lookup({
        from: "soup-comments",
        let: {
          id: "$_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(["$reply_parent_id", "$$id"]))).lookup({
          from: "uni-id-users",
          let: {
            uid: "$user_id"
          },
          pipeline: $.pipeline().match(dbCmd.expr($.eq([
            "$_id",
            "$$uid"
          ]))).project({
            username: 1
          }).done(),
          as: "userInfo"
        }).project({
          comment_content: $.cond({
            if: $.eq(["$is_delete", true]),
            then: "已被删除",
            else: "$comment_content"
          }),
          userInfo: $.arrayElemAt(["$userInfo", 0])
        }).sort({
          like_count: -1
        }).limit(2).done(),
        as: "child"
      }).lookup({
        from: "soup-like",
        let: {
          commentID: "$_id"
        },
        pipeline: $.pipeline().match(
          dbCmd.expr(
            $.and([
              $.eq([id, "$soup_id"]),
              $.eq(["$$commentID", "$comment_id"]),
              $.eq(["$user_id", current_id])
            ])
          )
        ).count("length").done(),
        as: "likeState"
      }).sort({ comment_date: -1 }).skip(skip).limit(pageSize).project({
        is_delete: 1,
        isLike: $.cond({
          if: $.gt([$.arrayElemAt(["$likeState.length", 0]), 0]),
          then: true,
          else: false
        }),
        child: 1,
        childCount: $.arrayElemAt(["$childCount.length", 0]),
        like_count: 1,
        comment_count: 1,
        comment_type: 1,
        comment_content: $.cond({
          if: $.eq(["$is_delete", true]),
          then: "已被删除",
          else: "$comment_content"
        }),
        soup_id: 1,
        comment_date: 1,
        userInfo: $.arrayElemAt(["$userInfo", 0])
      }).end();
      paging.value.complete(data);
      if (data.length == 0)
        noData.value = true;
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:202", data);
    };
    const replySuccess = () => {
      utils_common.showToast("发布成功");
      commentPopup.value.close();
      paging.value.refresh();
    };
    const getDetail = async () => {
      let {
        result: {
          errCode,
          data
        }
      } = await db.collection("soup-chicken").aggregate().match({
        status: 1,
        is_delete: dbCmd.neq(true),
        _id: id
      }).lookup({
        from: "uni-id-users",
        let: {
          uid: "$user_id"
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(["$_id", "$$uid"]))).project({
          username: 1,
          avatar: 1
        }).done(),
        as: "userInfo"
      }).lookup({
        from: "soup-like",
        let: {
          soupID: "$_id"
        },
        pipeline: $.pipeline().match(
          dbCmd.expr(
            $.and([
              $.eq(["$like_type", 0]),
              $.eq(["$$soupID", "$soup_id"]),
              $.eq(["$user_id", current_id])
            ])
          )
        ).count("length").done(),
        as: "likeState"
      }).project({
        isLike: $.cond({
          if: $.gt([$.arrayElemAt(["$likeState.length", 0]), 0]),
          then: true,
          else: false
        }),
        collect_count: 1,
        comment_count: 1,
        content: 1,
        from: 1,
        like_count: 1,
        soup_type: 1,
        view_count: 1,
        userInfo: $.arrayElemAt(["$userInfo", 0])
      }).end();
      if (errCode != 0)
        return utils_common.showToast("信息有误，请重新刷新", "none");
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:269", data);
      item.value = data[0];
      source.value = {
        soup_id: item.value._id,
        comment_type: 0
      };
    };
    const handelComment = () => {
      commentPopup.value.open();
      commentRef.value.focusFn();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: item.value
      }, item.value ? common_vendor.e({
        b: common_vendor.p({
          type: item.value.soup_type
        }),
        c: common_vendor.p({
          lookState: true,
          item: item.value
        }),
        d: commentList.value.length
      }, commentList.value.length ? {
        e: common_vendor.f(commentList.value, (item2, k0, i0) => {
          return {
            a: "eca06f3c-3-" + i0 + ",eca06f3c-0",
            b: common_vendor.p({
              item: item2,
              subReply: true
            }),
            c: item2._id
          };
        })
      } : {}, {
        f: !commentList.value.length && !noData.value
      }, !commentList.value.length && !noData.value ? {
        g: common_vendor.p({
          status: "loading",
          showText: false
        })
      } : {}, {
        h: common_vendor.o(handelComment),
        i: common_vendor.o(clickShare),
        j: common_vendor.p({
          item: item.value,
          type: 1
        }),
        k: common_vendor.sr(paging, "eca06f3c-0", {
          "k": "paging"
        }),
        l: common_vendor.o(queryList),
        m: common_vendor.o(($event) => commentList.value = $event),
        n: common_vendor.p({
          ["empty-view-text"]: "抢先回复",
          ["empty-view-img"]: "http://cdn.uviewui.com/uview/empty/comment.png",
          modelValue: commentList.value
        })
      }) : {}, {
        o: common_vendor.sr(commentRef, "eca06f3c-7,eca06f3c-6", {
          "k": "commentRef"
        }),
        p: common_vendor.o(replySuccess),
        q: common_vendor.p({
          source: source.value
        }),
        r: common_vendor.sr(commentPopup, "eca06f3c-6", {
          "k": "commentPopup"
        }),
        s: common_vendor.p({
          type: "bottom"
        }),
        t: common_vendor.sr(shareRef, "eca06f3c-8", {
          "k": "shareRef"
        }),
        v: common_vendor.p({
          info: shareInfo.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map

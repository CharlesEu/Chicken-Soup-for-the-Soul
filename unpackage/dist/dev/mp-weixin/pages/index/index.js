"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_counter = require("../../stores/counter.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_home_head2 = common_vendor.resolveComponent("home-head");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_soup_tab_group2 = common_vendor.resolveComponent("soup-tab-group");
  const _easycom_soup_text_content2 = common_vendor.resolveComponent("soup-text-content");
  const _easycom_interactive_bar2 = common_vendor.resolveComponent("interactive-bar");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_share_posters2 = common_vendor.resolveComponent("share-posters");
  (_easycom_home_head2 + _easycom_uni_load_more2 + _easycom_soup_tab_group2 + _easycom_soup_text_content2 + _easycom_interactive_bar2 + _easycom_uni_popup2 + _easycom_share_posters2)();
}
const _easycom_home_head = () => "../../components/home-head/home-head.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_soup_tab_group = () => "../../components/soup-tab-group/soup-tab-group.js";
const _easycom_soup_text_content = () => "../../components/soup-text-content/soup-text-content.js";
const _easycom_interactive_bar = () => "../../components/interactive-bar/interactive-bar.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_share_posters = () => "../../components/share-posters/share-posters.js";
if (!Math) {
  (_easycom_home_head + _easycom_uni_load_more + _easycom_soup_tab_group + _easycom_soup_text_content + _easycom_interactive_bar + _easycom_uni_popup + _easycom_share_posters)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    stores_counter.useCounterStore();
    const listData = common_vendor.ref([]);
    const currentIndex = common_vendor.ref(0);
    const usePopup = common_vendor.ref(null);
    const db = common_vendor.nr.database();
    const dbCmd = db.command;
    dbCmd.aggregate;
    const currentUser = common_vendor.nr.getCurrentUserInfo().uid;
    const readNumber = common_vendor.ref(5);
    const shareRef = common_vendor.ref(null);
    const shareInfo = common_vendor.ref(null);
    common_vendor.onReady(() => {
      let useState = common_vendor.index.getStorageSync("useState") || false;
      if (!useState)
        usePopup.value.open();
    });
    const clickShare = (index) => {
      shareInfo.value = listData.value[index];
      shareRef.value.handleShow();
    };
    common_vendor.index.$on("like", (e) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:89", e);
      let index = listData.value.findIndex((item) => item._id == e._id);
      listData.value[index] = {
        ...listData.value[index],
        ...e
      };
      db.collection("soup-today").where(`user_id == $cloudEnv_uid`).update({
        soup_list: listData.value
      });
    });
    const clickAdSoup = async () => {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      if (videoAd) {
        videoAd.show().catch(() => {
          common_vendor.index.hideLoading();
          videoAd.load().then(() => videoAd.show()).catch((err) => {
            common_vendor.index.__f__("error", "at pages/index/index.vue:115", "激励视频 广告显示失败", err);
          });
        });
      }
    };
    const getSoup = async (type = "get") => {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        let { result: { data: todayData = [], errCode = -1 } = {} } = await db.collection("soup-today").where(`user_id == $cloudEnv_uid`).get();
        if (todayData.length && type == "get") {
          if (errCode != 0) {
            common_vendor.index.hideLoading();
            return utils_common.showToast("信息有误，请重新刷新", "none");
          }
          listData.value = todayData[0].soup_list;
          readNumber.value = todayData[0].number;
        } else {
          let { result: { errCode: errCode2, data } } = await db.collection("soup-chicken").aggregate();
          if (errCode2 != 0) {
            common_vendor.index.hideLoading();
            return utils_common.showToast("信息有误，请重新刷新", "none");
          }
          if (data.length == 0) {
            common_vendor.index.hideLoading();
            return getSoup("random");
          }
          data[0].is_read = true;
          if (type == "ad") {
            listData.value = [...listData.value, ...data];
            db.collection("soup-today").where(`user_id == "${currentUser}"`).update({
              soup_list: listData.value
            });
          } else {
            listData.value = data;
            db.collection("soup-today").add({
              user_id: currentUser,
              soup_list: data
            });
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:177", "获取鸡汤数据失败:", error);
        utils_common.showToast("获取数据失败，请重试", "none");
      } finally {
        common_vendor.index.hideLoading();
      }
      common_vendor.index.__f__("log", "at pages/index/index.vue:184", "获取到的鸡汤数据:", listData.value);
    };
    getSoup();
    const swiperChange = (e) => {
      currentIndex.value = e.detail.current;
      if (listData.value[currentIndex.value] && !listData.value[currentIndex.value].is_read) {
        listData.value[currentIndex.value].is_read = true;
        db.collection("soup-today").where(`user_id == $cloudEnv_uid`).update({
          soup_list: listData.value
        }).then((res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:199", res);
        });
      } else {
        common_vendor.index.__f__("log", "at pages/index/index.vue:202", "重复操作");
      }
    };
    const lineWidth = common_vendor.computed(() => currentIndex.value / listData.value.length * 100);
    const closeUsePopup = () => {
      usePopup.value.close();
      common_vendor.index.setStorageSync("useState", true);
    };
    let videoAd = null;
    if (common_vendor.wx$1.createRewardedVideoAd) {
      common_vendor.index.hideLoading();
      videoAd = common_vendor.wx$1.createRewardedVideoAd({
        adUnitId: "adunit-c2d6709878b96f75"
      });
      videoAd.onLoad(() => {
      });
      videoAd.onError((err) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:229", "激励视频光告加载失败", err);
      });
      videoAd.onClose((res) => {
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        if (res.isEnded) {
          adClose();
        } else {
          utils_common.showToast("广告没有播放完毕");
        }
      });
    }
    const adClose = async () => {
      if (readNumber.value <= 0)
        return utils_common.showToast("今日份鸡汤已全部喝光~");
      readNumber.value--;
      await db.collection("soup-today").where(`user_id == "${currentUser}"`).update({
        number: readNumber.value
      });
      getSoup("ad");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !listData.value.length
      }, !listData.value.length ? {
        b: common_vendor.p({
          status: "loading",
          showText: false
        })
      } : {
        c: common_vendor.f(listData.value, (item, index, i0) => {
          return {
            a: "1cf27b2a-2-" + i0,
            b: common_vendor.p({
              type: item.soup_type
            }),
            c: "1cf27b2a-3-" + i0,
            d: common_vendor.p({
              maxline: "5",
              item
            }),
            e: `/pages/detail/detail?id=${item._id}`,
            f: common_vendor.o(($event) => clickShare(index), index),
            g: "1cf27b2a-4-" + i0,
            h: common_vendor.p({
              item
            }),
            i: index
          };
        }),
        d: common_vendor.o(clickAdSoup),
        e: common_vendor.t(readNumber.value),
        f: common_vendor.o(swiperChange)
      }, {
        g: lineWidth.value + "%",
        h: common_assets._imports_0,
        i: common_vendor.o(closeUsePopup),
        j: common_vendor.sr(usePopup, "1cf27b2a-5", {
          "k": "usePopup"
        }),
        k: common_vendor.o(closeUsePopup),
        l: common_vendor.o(closeUsePopup),
        m: common_vendor.p({
          type: "center"
        }),
        n: common_vendor.sr(shareRef, "1cf27b2a-6", {
          "k": "shareRef"
        }),
        o: common_vendor.p({
          info: shareInfo.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map

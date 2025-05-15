"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const utils_tools = require("../../utils/tools.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const usernamePopup = common_vendor.ref(null);
    const genderPopup = common_vendor.ref(null);
    const genderValue = common_vendor.ref(userStore.userInfo.gender || 0);
    const avatarUrl = common_vendor.ref(userStore.userInfo.avatar);
    const uploadState = common_vendor.ref(false);
    const percentCompleted = common_vendor.ref(0);
    const genderGroup = common_vendor.ref([
      {
        value: 0,
        text: "保密"
      },
      {
        value: 1,
        text: "男"
      },
      {
        value: 2,
        text: "女"
      }
    ]);
    function clickID(value) {
      common_vendor.index.__f__("log", "at pages_self/user/edit.vue:84", value);
      common_vendor.index.setClipboardData({
        data: value,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages_self/user/edit.vue:88", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages_self/user/edit.vue:91", err);
        }
      });
    }
    function onChooseAvatar(e) {
      uploadState.value = true;
      avatarUrl.value = e.detail.avatarUrl;
      common_vendor.nr.uploadFile({
        filePath: avatarUrl.value,
        cloudPath: `userAvatar/${utils_tools.formatDate(Date.now(), "yyyyMMdd")}/${Date.now()}.jpg`,
        cloudPathAsRealPath: true,
        onUploadProgress: function(progressEvent) {
          common_vendor.index.__f__("log", "at pages_self/user/edit.vue:106", progressEvent);
          percentCompleted.value = Math.round(
            progressEvent.loaded * 100 / progressEvent.total
          );
        }
      }).then((res) => {
        avatarUrl.value = res.fileID;
        common_vendor.index.__f__("log", "at pages_self/user/edit.vue:113", res.fileID);
        userStore.updateUserInfo({ avatar: avatarUrl.value });
        uploadState.value = false;
      });
    }
    function clickUsername() {
      usernamePopup.value.open();
    }
    function clickGender() {
      genderPopup.value.open();
    }
    function clickTime() {
    }
    function genderChange(e) {
      common_vendor.index.__f__("log", "at pages_self/user/edit.vue:137", e);
      genderValue.value = Number(e.detail.value);
    }
    function genderConfirm() {
      common_vendor.index.showLoading();
      userStore.updateUserInfo({ gender: genderValue.value });
    }
    function usernameConfirm(e) {
      common_vendor.index.showLoading();
      userStore.updateUserInfo({ username: e });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: avatarUrl.value
      }, avatarUrl.value ? {
        b: avatarUrl.value
      } : {
        c: common_assets._imports_0$1
      }, {
        d: common_vendor.o(onChooseAvatar),
        e: uploadState.value
      }, uploadState.value ? {
        f: common_vendor.t(percentCompleted.value)
      } : {}, {
        g: common_vendor.p({
          type: "camera",
          color: "#fff",
          size: "16"
        }),
        h: common_vendor.o(($event) => clickID(userInfo.value._id)),
        i: common_vendor.p({
          showArrow: true,
          title: "用户ID",
          clickable: true,
          rightText: userInfo.value._id
        }),
        j: common_vendor.o(clickUsername),
        k: common_vendor.p({
          showArrow: true,
          title: "昵称",
          clickable: true,
          rightText: userInfo.value.username
        }),
        l: common_vendor.o(clickGender),
        m: common_vendor.p({
          showArrow: true,
          title: "性别",
          clickable: true,
          rightText: common_vendor.unref(utils_tools.formatGender)(userInfo.value.gender)
        }),
        n: common_vendor.o(clickTime),
        o: common_vendor.p({
          showArrow: true,
          title: "注册时间",
          rightText: common_vendor.unref(utils_tools.formatDate)(userInfo.value.register_date)
        }),
        p: common_vendor.o(usernameConfirm),
        q: common_vendor.o(($event) => userInfo.value.username = $event),
        r: common_vendor.p({
          mode: "input",
          title: "修改昵称",
          maxlength: "15",
          placeholder: "请输入昵称",
          modelValue: userInfo.value.username
        }),
        s: common_vendor.sr(usernamePopup, "bcc1b054-6", {
          "k": "usernamePopup"
        }),
        t: common_vendor.p({
          type: "dialog"
        }),
        v: common_vendor.f(genderGroup.value, (item, k0, i0) => {
          return {
            a: item.value,
            b: genderValue.value == item.value,
            c: common_vendor.t(item.text),
            d: item.value
          };
        }),
        w: common_vendor.o(genderChange),
        x: common_vendor.o(genderConfirm),
        y: common_vendor.p({
          title: "修改性别",
          mode: "input"
        }),
        z: common_vendor.sr(genderPopup, "bcc1b054-8", {
          "k": "genderPopup"
        }),
        A: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bcc1b054"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_self/user/edit.js.map

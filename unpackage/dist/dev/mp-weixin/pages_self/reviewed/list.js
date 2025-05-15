"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_z_tabs2 = common_vendor.resolveComponent("z-tabs");
  const _easycom_soup_list2 = common_vendor.resolveComponent("soup-list");
  const _easycom_z_paging_swiper2 = common_vendor.resolveComponent("z-paging-swiper");
  (_easycom_z_tabs2 + _easycom_soup_list2 + _easycom_z_paging_swiper2)();
}
const _easycom_z_tabs = () => "../../uni_modules/z-tabs/components/z-tabs/z-tabs.js";
const _easycom_soup_list = () => "../../components/soup-list/soup-list.js";
const _easycom_z_paging_swiper = () => "../../uni_modules/z-paging/components/z-paging-swiper/z-paging-swiper.js";
if (!Math) {
  (_easycom_z_tabs + _easycom_soup_list + _easycom_z_paging_swiper)();
}
const _sfc_main = {
  __name: "list",
  setup(__props) {
    if (!utils_common.isAdminRole()) {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
      throw new Error("error");
    }
    const tabs = common_vendor.ref(null);
    const tabList = common_vendor.computed(() => utils_common.stateLists.map((item) => ({ ...item, name: item.text })));
    const current = common_vendor.ref(0);
    const swiperTransition = (e) => {
      tabs.value.setDx(e.detail.dx);
    };
    const swiperAnimationfinish = (e) => {
      current.value = e.detail.current;
      tabs.value.unlockDx();
    };
    const tabsChange = (e) => {
      current.value = e;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(tabs, "3eb3d27f-1,3eb3d27f-0", {
          "k": "tabs"
        }),
        b: common_vendor.o(tabsChange),
        c: common_vendor.p({
          current: current.value,
          list: tabList.value
        }),
        d: common_vendor.f(common_vendor.unref(utils_common.stateLists), (item, index, i0) => {
          return {
            a: "3eb3d27f-2-" + i0 + ",3eb3d27f-0",
            b: common_vendor.p({
              tabIndex: index,
              currentIndex: current.value
            }),
            c: index
          };
        }),
        e: current.value,
        f: common_vendor.o(swiperTransition),
        g: common_vendor.o(swiperAnimationfinish)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3eb3d27f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_self/reviewed/list.js.map

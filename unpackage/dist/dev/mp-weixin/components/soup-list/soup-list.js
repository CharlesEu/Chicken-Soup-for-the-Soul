"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_common = require("../../utils/common.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_soup_item2 = common_vendor.resolveComponent("soup-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_uni_load_more2 + _easycom_soup_item2 + _easycom_z_paging2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_soup_item = () => "../soup-item/soup-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_soup_item + _easycom_z_paging)();
}
const _sfc_main = {
  __name: "soup-list",
  props: {
    //每一个索引
    tabIndex: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    //当前swiper切换到第几个index
    currentIndex: {
      type: Number,
      default: function() {
        return 0;
      }
    }
  },
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const paging = common_vendor.ref(null);
    const db = common_vendor.nr.database();
    const firstLoaded = common_vendor.ref(false);
    const props = __props;
    common_vendor.watch(() => props.currentIndex, (nv, ov) => {
      if (nv == props.tabIndex) {
        if (!firstLoaded.value) {
          common_vendor.nextTick$1(() => {
            setTimeout(() => {
              paging.value.reload();
            }, 100);
          });
        }
      }
    }, {
      immediate: true
    });
    function queryList(pageNo, pageSize) {
      getSoupList(pageNo, pageSize);
    }
    async function getSoupList(pageNo, pageSize) {
      let skip = (pageNo - 1) * pageSize;
      let { result: { data, errCode } } = await db.collection("soup-chicken").where(`status == ${utils_common.stateLists[props.tabIndex].value} && is_delete != true`).field("publish_date,last_modify_date,content,soup_type,like_count,collect_count,comment_count,status").orderBy("last_modify_date", "desc").skip(skip).limit(pageSize).get();
      if (errCode != 0)
        return;
      paging.value.complete(data);
      firstLoaded.value = true;
      common_vendor.index.__f__("log", "at components/soup-list/soup-list.vue:75", data);
    }
    function onRemove() {
      paging.value.refresh();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          status: "loading"
        }),
        b: common_vendor.f(dataList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(onRemove, item._id),
            b: "498e750f-2-" + i0 + ",498e750f-0",
            c: common_vendor.p({
              item
            }),
            d: item._id
          };
        }),
        c: common_vendor.sr(paging, "498e750f-0", {
          "k": "paging"
        }),
        d: common_vendor.o(queryList),
        e: common_vendor.o(($event) => dataList.value = $event),
        f: common_vendor.p({
          auto: false,
          fixed: false,
          modelValue: dataList.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-498e750f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/soup-list/soup-list.js.map

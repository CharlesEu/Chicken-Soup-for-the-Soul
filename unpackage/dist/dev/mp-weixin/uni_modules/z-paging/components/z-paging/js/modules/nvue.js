"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const nvueModule = {
  props: {},
  data() {
    return {
      nRefresherLoading: false,
      nListIsDragging: false,
      nShowBottom: true,
      nFixFreezing: false,
      nShowRefresherReveal: false,
      nLoadingMoreFixedHeight: false,
      nShowRefresherRevealHeight: 0,
      nOldShowRefresherRevealHeight: -1,
      nRefresherWidth: common_vendor.index.upx2px(750)
    };
  },
  computed: {},
  mounted() {
  },
  methods: {}
};
exports.nvueModule = nvueModule;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/z-paging/components/z-paging/js/modules/nvue.js.map

"use strict";
const common_vendor = require("../common/vendor.js");
const useCounterStore = common_vendor.defineStore("counter", () => {
  const count = common_vendor.ref(0);
  const username = common_vendor.ref("咸虾米");
  function increment() {
    count.value++;
  }
  return { count, increment, username };
});
exports.useCounterStore = useCounterStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/counter.js.map

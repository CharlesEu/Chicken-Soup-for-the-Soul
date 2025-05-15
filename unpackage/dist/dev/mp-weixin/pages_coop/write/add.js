"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "add",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const formData = common_vendor.ref({
      content: "",
      imageList: [],
      status: 0
    });
    const maxNumber = common_vendor.ref(9);
    const uniCloudStorageExtCo = common_vendor.nr.importObject("ext-storage-co", {
      customUI: true
    });
    const db = common_vendor.nr.database();
    const secCheckObj = common_vendor.nr.importObject("secCheckContent", { customUI: true });
    const submitState = common_vendor.computed(() => {
      return formData.value.content.length > 0 || formData.value.imageList.length > 0 && formData.value.imageList.every((item) => item.progress === 100);
    });
    const addImages = () => {
      let checkNumber = maxNumber.value - formData.value.imageList.length;
      common_vendor.index.chooseImage({
        count: checkNumber,
        sizeType: ["original", "compressed "],
        sourceType: ["album", "camera"],
        success: (res) => {
          let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length;
          for (let i = 0; i < count; i++) {
            formData.value.imageList.push({
              src: res.tempFilePaths[i],
              url: "",
              progress: 0,
              status: 0,
              id: Date.now() + "_" + i
            });
          }
          upload();
        }
      });
    };
    const upload = async () => {
      let promises = [];
      let readyFileCount;
      formData.value.imageList.filter((e) => e.status === 0 && (readyFileCount = formData.value.imageList.length)).forEach((item) => {
        readyFileCount -= 1;
        item.status = 1;
        let promise = uniCloudStorageExtCo.getUploadFileOptions({
          cloudPath: `chickenSoup/${common_vendor.dayjs().format("YYYYMMDD")}/${item.id}.jpg`
          // 支持自定义目录
        });
        promises.push(promise);
      });
      let result = await Promise.all(promises);
      result.forEach((item, index) => {
        let currentImg = formData.value.imageList[index + readyFileCount];
        const uploadTask = common_vendor.index.uploadFile({
          ...item.uploadFileOptions,
          // 上传文件所需参数
          filePath: currentImg.src,
          // 本地文件路径
          success: () => {
            const res = {
              cloudPath: item.cloudPath,
              // 文件云端路径
              fileID: item.fileID,
              // 文件ID
              fileURL: item.fileURL
              // 文件URL（如果是私有权限，则此URL是无法直接访问的）
            };
            common_vendor.index.__f__("log", "at pages_coop/write/add.vue:111", "上传成功", res);
            currentImg.progress = 100;
            currentImg.status = 2;
            currentImg.url = res.fileURL;
          },
          fail: (err) => {
            currentImg.status = -1;
            currentImg.progress = 99;
          }
        });
        uploadTask.onProgressUpdate((res) => {
          currentImg.progress = res.progress;
        });
      });
    };
    const delImage = (item, index) => {
      uniCloudStorageExtCo.deleteFile([formData.value.imageList[index].url]);
      formData.value.imageList.splice(index, 1);
    };
    const previewImage = (item, index) => {
      let previews = formData.value.imageList.map((item2) => item2.src);
      common_vendor.index.previewImage({
        urls: previews,
        current: index
      });
    };
    const onSubmit = async () => {
      common_vendor.index.showLoading({
        title: "提交中",
        mask: true
      });
      if (!submitState.value)
        return;
      if (formData.value.content) {
        let secRes = await secCheckObj.textSecCheck(formData.value.content, userStore.userInfo.openid);
        if (secRes.code) {
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: secRes.errMsg,
            content: `发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`,
            showCancel: false
          });
          return;
        }
      }
      if (!formData.value.imageList.length)
        formData.value.status = 1;
      let res = await db.collection("chicken-coop").add({
        content: formData.value.content,
        picurls: formData.value.imageList.map((item) => item.url),
        status: formData.value.status
      });
      if (res.result.errCode == 0) {
        let coop_id = res.result.id;
        let picurls = formData.value.imageList.map((item) => item.url);
        if (picurls.length) {
          await secCheckObj.imgSecCheck({ picurls, openid: userStore.userInfo.openid, coop_id });
        }
        common_vendor.index.showToast({
          title: "发布成功，等待审核",
          icon: "none",
          mask: true
        });
        setTimeout(() => {
          goback();
        }, 1e3);
      }
    };
    const goback = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goback),
        b: common_vendor.n(submitState.value ? "active" : ""),
        c: common_vendor.o(onSubmit),
        d: formData.value.content,
        e: common_vendor.o(($event) => formData.value.content = $event.detail.value),
        f: common_vendor.f(formData.value.imageList, (item, index, i0) => {
          return common_vendor.e({
            a: item.src,
            b: common_vendor.o(($event) => previewImage(item, index), item.id),
            c: item.status != 0
          }, item.status != 0 ? {
            d: common_vendor.o(($event) => delImage(item, index), item.id)
          } : {}, {
            e: item.status === 1
          }, item.status === 1 ? {
            f: common_vendor.t(item.progress)
          } : {}, {
            g: item.id
          });
        }),
        g: common_vendor.o(addImages)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c26bdf21"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_coop/write/add.js.map

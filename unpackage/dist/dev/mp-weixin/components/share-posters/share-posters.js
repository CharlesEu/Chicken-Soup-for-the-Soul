"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_l_painter_text2 = common_vendor.resolveComponent("l-painter-text");
  const _easycom_l_painter_image2 = common_vendor.resolveComponent("l-painter-image");
  const _easycom_l_painter_view2 = common_vendor.resolveComponent("l-painter-view");
  const _easycom_l_painter2 = common_vendor.resolveComponent("l-painter");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_l_painter_text2 + _easycom_l_painter_image2 + _easycom_l_painter_view2 + _easycom_l_painter2 + _easycom_uni_popup2)();
}
const _easycom_l_painter_text = () => "../../uni_modules/lime-painter/components/l-painter-text/l-painter-text.js";
const _easycom_l_painter_image = () => "../../uni_modules/lime-painter/components/l-painter-image/l-painter-image.js";
const _easycom_l_painter_view = () => "../../uni_modules/lime-painter/components/l-painter-view/l-painter-view.js";
const _easycom_l_painter = () => "../../uni_modules/lime-painter/components/l-painter/l-painter.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_l_painter_text + _easycom_l_painter_image + _easycom_l_painter_view + _easycom_l_painter + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "share-posters",
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(__props, { expose: __expose }) {
    const QRCode = common_vendor.nr.importObject("QRCode");
    const userStore = stores_user.useUserStore();
    const popup = common_vendor.ref(null);
    const poster = common_vendor.ref(null);
    const sharePathUrl = common_vendor.ref();
    const isShow = common_vendor.ref(false);
    const QRPicPath = common_vendor.ref();
    const props = __props;
    const handleShow = () => {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      isShow.value = true;
      common_vendor.nextTick$1(() => {
        showPopup();
      });
    };
    const showPopup = async () => {
      let code = await QRCode.getUnlimited({ page: "pages/detail/detail", scene: props.info._id });
      QRPicPath.value = code;
      common_vendor.nextTick$1(() => {
        poster.value.canvasToTempFilePathSync({
          fileType: "jpg",
          pathType: "url",
          quality: 0.6,
          success: (res) => {
            common_vendor.index.__f__("log", "at components/share-posters/share-posters.vue:72", res);
            sharePathUrl.value = res.tempFilePath;
            popup.value.open();
            common_vendor.index.hideLoading();
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            showToast(err);
          }
        });
      });
    };
    const onSaveAlbum = () => {
      try {
        common_vendor.index.showLoading({
          title: "下载中...",
          mask: true
        });
        common_vendor.index.getImageInfo({
          src: sharePathUrl.value,
          success: (res) => {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: res.path,
              success: (res2) => {
                popup.value.close();
                setTimeout(() => {
                  common_vendor.index.showToast({
                    title: "保存成功，请到相册查看",
                    icon: "none"
                  });
                }, 500);
              },
              fail: (err) => {
                if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                  common_vendor.index.showToast({
                    title: "保存失败，请重新点击下载",
                    icon: "none"
                  });
                  return;
                }
                common_vendor.index.showModal({
                  title: "授权提示",
                  content: "需要授权保存相册",
                  success: (res2) => {
                    if (res2.confirm) {
                      common_vendor.index.openSetting({
                        success: (setting) => {
                          common_vendor.index.__f__(
                            "log",
                            "at components/share-posters/share-posters.vue:123",
                            setting
                          );
                          if (setting.authSetting["scope.writePhotosAlbum"]) {
                            common_vendor.index.showToast({
                              title: "获取授权成功",
                              icon: "none"
                            });
                          } else {
                            common_vendor.index.showToast({
                              title: "获取权限失败",
                              icon: "none"
                            });
                          }
                        }
                      });
                    }
                  }
                });
              },
              complete: () => {
                common_vendor.index.hideLoading();
              }
            });
          }
        });
      } catch (err) {
        common_vendor.index.__f__("log", "at components/share-posters/share-posters.vue:154", err);
        common_vendor.index.hideLoading();
      }
    };
    __expose({
      showPopup,
      handleShow
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isShow.value
      }, isShow.value ? {
        b: common_vendor.p({
          css: "font-size: 46rpx; line-height: 1.7em;line-clamp:6",
          text: __props.info.content
        }),
        c: common_vendor.p({
          src: __props.info.userInfo.avatar || "../../static/images/defAvatar.png",
          css: "width: 50rpx; height: 50rpx; border-radius: 50%; object-fit: cover; object-position: 50% 50%;"
        }),
        d: common_vendor.p({
          text: __props.info.userInfo.username,
          css: "font-size: 30rpx;margin-left: 10rpx;line-height:50rpx;color:#555"
        }),
        e: common_vendor.p({
          css: "margin-top:40rpx"
        }),
        f: common_vendor.p({
          css: "width: 600rpx;position: absolute; top:300rpx;left:82rpx"
        }),
        g: common_vendor.p({
          text: `—— 来自：${common_vendor.unref(userStore).userInfo.username}的分享 ——`,
          css: "position: absolute; top:850rpx; left: 0; width:100%; text-align: center; font-size: 26rpx; color:#bbb"
        }),
        h: common_vendor.p({
          src: QRPicPath.value,
          css: "position: absolute; width: 145rpx; height: 145rpx; left: 82rpx; top:955rpx;object-fit: cover;"
        }),
        i: common_vendor.sr(poster, "e420b032-0", {
          "k": "poster"
        }),
        j: common_vendor.p({
          hidden: true,
          ["after-delay"]: 200,
          css: "width:750rpx; height: 1163rpx; background-image: url(https://mp-293d9e23-9bcc-4a7d-86ad-51eac2183ed9.cdn.bspapp.com/cloudstorage/shareBg.jpg);",
          ["custom-style"]: "position: fixed; top:0;left:0%;"
        })
      } : {}, {
        k: sharePathUrl.value,
        l: common_vendor.o(onSaveAlbum),
        m: common_vendor.sr(popup, "e420b032-8", {
          "k": "popup"
        }),
        n: common_vendor.p({
          ["mask-background-color"]: "rgba(0,0,0,0.7)"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e420b032"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/share-posters/share-posters.js.map

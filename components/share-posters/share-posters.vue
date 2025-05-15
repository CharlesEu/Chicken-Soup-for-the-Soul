<template>
	<!-- 分享海报主布局，仅在 isShow 为 true 时显示 -->
	<view class="layout" v-if="isShow">
		<!-- l-painter 组件用于绘制分享海报 -->
		<l-painter hidden ref="poster" :after-delay="200" css="width:750rpx; height: 1163rpx; background-image: url(https://mp-293d9e23-9bcc-4a7d-86ad-51eac2183ed9.cdn.bspapp.com/cloudstorage/shareBg.jpg);" 
		custom-style="position: fixed; top:0;left:0%;">
			<!-- 海报内容区域 -->
			<l-painter-view css="width: 600rpx;position: absolute; top:300rpx;left:82rpx">
				<!-- 鸡汤文本内容，最多显示6行 -->
				<l-painter-text css="font-size: 46rpx; line-height: 1.7em;line-clamp:6" 
				:text="info.content"></l-painter-text>
				
				<!-- 用户头像和昵称 -->
				<l-painter-view css="margin-top:40rpx">
					<l-painter-image :src="info.userInfo.avatar || '../../static/images/defAvatar.png'" css="width: 50rpx; height: 50rpx; border-radius: 50%; object-fit: cover; object-position: 50% 50%;"></l-painter-image>
					<l-painter-text :text="info.userInfo.username" css="font-size: 30rpx;margin-left: 10rpx;line-height:50rpx;color:#555"></l-painter-text>
				</l-painter-view>
				
			</l-painter-view>	
					
			<!-- 分享者信息 -->
			<l-painter-text :text="`—— 来自：${userStore.userInfo.username}的分享 ——`" css="position: absolute; top:850rpx; left: 0; width:100%; text-align: center; font-size: 26rpx; color:#bbb"></l-painter-text>
			
			<!-- 小程序二维码 -->
			<l-painter-image :src="QRPicPath" css="position: absolute; width: 145rpx; height: 145rpx; left: 82rpx; top:955rpx;object-fit: cover;"></l-painter-image>
		</l-painter>
	</view>
	<!-- 占位空视图 -->
	<view style=" "></view>
	<!-- 分享图片弹窗，展示生成的海报并可保存到相册 -->
	<uni-popup ref="popup" mask-background-color="rgba(0,0,0,0.7)">		
		<view class="shareLayout">
			<!-- 生成的分享图片 -->
			<image class="pic" :src="sharePathUrl" mode="widthFix"></image>
			<!-- 保存到相册按钮 -->
			<view class="saveAlbum" @click="onSaveAlbum">点击保存至相册</view>
		</view>	
	</uni-popup>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import {useUserStore} from "@/stores/user.js"
const QRCode = uniCloud.importObject("QRCode");
const userStore = useUserStore()
const popup = ref(null);
const poster = ref(null);
const sharePathUrl =ref();
const isShow = ref(false);
const QRPicPath = ref()

const props = defineProps({
	info:{
		type:Object,
		default(){
			return {}
		}
	}
})

const handleShow = ()=>{
	uni.showLoading({
		title:"加载中..."
	})
	isShow.value = true;
	nextTick(()=>{
		showPopup();
	})	
}


const showPopup =async ()=>{
	let code =await QRCode.getUnlimited({page:'pages/detail/detail',scene:props.info._id})
	QRPicPath.value =code	
	
	nextTick(()=>{			
		poster.value.canvasToTempFilePathSync({
			fileType:"jpg",
			pathType:'url',
			quality: 0.6,
			success:res=>{
				console.log(res)
				sharePathUrl.value = res.tempFilePath
				popup.value.open();
				uni.hideLoading();
			},
			fail:err=>{
				uni.hideLoading();
				showToast(err)
			}
		})
	})
}



//点击保存到相册
const onSaveAlbum = ()=>{		
	try {	
		uni.showLoading({
			title: "下载中...",
			mask: true
		})				
		uni.getImageInfo({
			src: sharePathUrl.value,
			success: (res) => {
				uni.saveImageToPhotosAlbum({
					filePath: res.path,
					success: (res) => {
						popup.value.close();
						setTimeout(()=>{
							uni.showToast({
								title: "保存成功，请到相册查看",
								icon: "none"
							})
						},500)												
					},
					fail: err => {
						if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
							uni.showToast({
								title: '保存失败，请重新点击下载',
								icon: "none"
							})
							return;
						}
						uni.showModal({
							title: "授权提示",
							content: "需要授权保存相册",
							success: res => {
								if (res.confirm) {
									uni.openSetting({
										success: (setting) => {
											console.log(
												setting);
											if (setting
												.authSetting[
													'scope.writePhotosAlbum'
													]) {
												uni.showToast({
													title: "获取授权成功",
													icon: "none"
												})
											} else {
												uni.showToast({
													title: "获取权限失败",
													icon: "none"
												})
											}
										}
									})
								}
							}
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				})
	
			}
		})
	
	} catch (err) {
		console.log(err);
		uni.hideLoading();
	}	
}




defineExpose({
	showPopup,
	handleShow
})

</script>

<style lang="scss" scoped>
.shareLayout{
	width: 600rpx;
	.pic{
		width: 100%;
		display: block;
		border-radius: 30rpx;
	}
	.saveAlbum{
		width: 100%;
		height: 80rpx;
		background: #2A9D8E;
		color:#fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		margin:0 auto;
		margin-top:30rpx;
		border-radius: 80rpx;
	}
}
</style>
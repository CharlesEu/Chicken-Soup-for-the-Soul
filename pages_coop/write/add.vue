<template>
	<!-- ‘鸡圈内容发布’页面整体容器 -->
	<view class="writePage">

		<!-- 顶部菜单栏，包含取消和发布按钮 -->
		<view class="topMenu">
			<!-- 左侧取消按钮，点击返回上一页 -->
			<view class="left text" @click="goback">
				取消
			</view>
			<!-- 右侧操作区域 -->
			<view class="right">
				<!-- 预览按钮 注释了已经-->
				<!-- <view class="preview text">预览</view> -->
				<!-- 发布按钮，根据submitState状态变化样式，点击触发提交 -->
				<view class="submit text" :class="submitState?'active':''" @click="onSubmit">发布</view>
			</view>
		</view>

		<!-- 内容输入区域 -->
		<view class="content">
			<!-- 文本输入框，自动高度调整，最多600字 -->
			<textarea class="textarea" placeholder="说点什么吧..." auto-height :maxlength="600" v-model="formData.content"></textarea>
		</view>

		<!-- 图片上传区域 -->
		<view class="pics">
			<!-- 已上传图片列表，循环渲染每张图片 -->
			<view class="item" v-for="(item,index) in formData.imageList" :key="item.id">
				<!-- 图片预览，点击可查看大图 -->
				<image :src="item.src" mode="aspectFill" class="pic" @click="previewImage(item,index)"></image>				
				<!-- 删除按钮，非上传中状态显示 -->
				<view class="close" v-if="item.status !=0" @click="delImage(item, index)">×</view>
				<!-- 上传进度显示，仅上传中状态显示 -->
				<view class="progress" v-if="item.status === 1">{{item.progress}}%</view>
			</view>

			<!-- 添加图片按钮 -->
			<view class="item add" @click="addImages">+</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue';
	import dayjs from "dayjs";	
	import {useUserStore} from "@/stores/user.js"
	const userStore = useUserStore();
	const formData = ref({
		content:"",
		imageList:[],
		status:0
	})
	const maxNumber = ref(9);
	const uniCloudStorageExtCo = uniCloud.importObject("ext-storage-co", {
		customUI: true
	});
	
	const db = uniCloud.database();
	const secCheckObj = uniCloud.importObject("secCheckContent",{customUI:true});
	
	
	//判断发布状态
	const submitState = computed(()=>{
		return formData.value.content.length>0 ||(formData.value.imageList.length>0 && formData.value.imageList.every(item => item.progress === 100));
	})
	

	//点击添加图片
	const addImages = () => {
		let checkNumber = maxNumber.value - formData.value.imageList.length;
		uni.chooseImage({
			count: checkNumber,
			sizeType: ['original', 'compressed '],
			sourceType: ['album', 'camera'],
			success: res => {
				let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths
					.length				
				for (let i = 0; i < count; i++) {
					formData.value.imageList.push({
						src: res.tempFilePaths[i],
						url: '',
						progress: 0,
						status: 0,
						id: Date.now() + "_" + i
					})
				}
				upload()
			}
		})
	}


	//上传图片
	const upload = async () => {		
		let promises = [];
		let readyFileCount;
		formData.value.imageList
		.filter((e) => e.status === 0 && (readyFileCount=formData.value.imageList.length))
		.forEach(item=>{
			readyFileCount -=1;
			item.status = 1;
			let promise = uniCloudStorageExtCo.getUploadFileOptions({
				cloudPath: `chickenSoup/${dayjs().format("YYYYMMDD")}/${item.id}.jpg`, // 支持自定义目录
			})
			promises.push(promise);
		})
		
		let result = await Promise.all(promises);
		result.forEach((item,index)=>{
			let currentImg = formData.value.imageList[index+readyFileCount];
			const uploadTask = uni.uploadFile({
			  ...item.uploadFileOptions, // 上传文件所需参数
			  filePath:currentImg.src, // 本地文件路径
			  success: () => {
			    const res = {
			      cloudPath: item.cloudPath, // 文件云端路径
			      fileID: item.fileID, // 文件ID
			      fileURL: item.fileURL, // 文件URL（如果是私有权限，则此URL是无法直接访问的）
			    };
			    // 数据库里可直接保存 fileURL 或 fileID
			    console.log("上传成功", res);
			    currentImg.progress = 100;
			    currentImg.status = 2;
			    currentImg.url = res.fileURL;
			  },
			  fail: (err) => {
			    currentImg.status = -1;
				currentImg.progress = 99;
			  },
			});				
			// 监听上传进度
			uploadTask.onProgressUpdate((res) => {
			  currentImg.progress = res.progress;
			});				
		})
	};


	//删除图片
	const delImage = (item, index)=>{
		uniCloudStorageExtCo.deleteFile([formData.value.imageList[index].url]);
		formData.value.imageList.splice(index, 1);		
	}


	//预览图片
	const previewImage = (item,index)=>{
		let previews = formData.value.imageList.map(item=>item.src);
		uni.previewImage({
		  urls: previews,
		  current: index
		})
	}
	
	//提交圈子
	const onSubmit = async ()=>{
						
		uni.showLoading({
			title:"提交中",
			mask:true
		})
		if(!submitState.value) return;
		if(formData.value.content){
			let secRes = await secCheckObj.textSecCheck(formData.value.content,userStore.userInfo.openid);	
			if(secRes.code){
				uni.hideLoading()
				uni.showModal({
					title:secRes.errMsg,
					content:`发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`,
					showCancel:false
				})
				return;
			}
		}
		
		if(!formData.value.imageList.length) formData.value.status=1;
				
		
		let res = await db.collection("chicken-coop").add({
			content:formData.value.content,
			picurls:formData.value.imageList.map(item=>item.url),
			status:formData.value.status
		})
		
		if(res.result.errCode==0){
			let coop_id = res.result.id;
			let picurls = formData.value.imageList.map(item=>item.url);		
			if(picurls.length){
				let row = await secCheckObj.imgSecCheck({picurls,openid:userStore.userInfo.openid,coop_id});				
				
			}
			uni.showToast({
				title:"发布成功，等待审核",
				icon:"none",
				mask:true
			})
			setTimeout(()=>{
				goback();
			},1000)
			
		}		
		
		
	}



	//返回上个页面
	const goback = ()=>{
		uni.navigateBack()
	}

</script>

<style lang="scss" scoped>
	.writePage {
		.topMenu {
			border-bottom: 1rpx solid #F8F8F8;
			height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				font-size: 32rpx;
				padding: 10rpx 30rpx;
			}

			.left {}

			.right {
				display: flex;
				color: #a0a0a0;

				.submit {
					font-weight: 600;

					&.active {
						color: #3B3B98;
					}
				}
			}
		}

		.content {
			padding: 30rpx;

			.textarea {
				font-size: 38rpx;
				width: 100%;
				line-height: 1.7em;
				max-height: 600rpx;
			}
		}

		.pics {
			display: grid;
			padding: 30rpx;
			grid-template-columns: repeat(3, 1fr);
			gap: 10rpx;

			.item {
				aspect-ratio: 1 / 1;
				background: #F4F5F7;
				position: relative;

				.pic {
					width: 100%;
					height: 100%;
					display: block;
				}

				.close {
					line-height: 50rpx;
					background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					text-align: right;
					color: #fff;
					font-size: 40rpx;
					padding-right: 10rpx;
				}

				.progress {
					position: absolute;
					top: 0;
					left: 0;
					background: rgba(0, 0, 0, 0.6);
					width: 100%;
					height: 100%;
					color: #fff;
					font-size: 26rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				&.add {
					background: #F4F5F7;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 100rpx;
					font-weight: 100;
					color: #a5a6a8;
				}
			}

		}

	}
</style>
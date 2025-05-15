<template>
	<!-- 用户资料编辑页面整体容器 -->
	<view class="userLayout">
		<!-- 头像编辑区域 -->
		<view class="avatar">
			<view class="box">
				<!-- 头像显示和上传区域 -->
				<view class="inner">	
					<!-- 显示用户头像，如果有则显示用户头像，否则显示默认头像 -->			
					<image v-if="avatarUrl" :src="avatarUrl" mode="aspectFill"></image>
					<image v-else src="../../static/images/defAvatar.png" mode="aspectFill"></image>
										
					<!-- 微信小程序原生头像选择按钮，透明覆盖在头像上 -->
					<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="btn">按钮</button>
					<!-- 上传进度遮罩层，仅在上传过程中显示 -->
					<view class="mask" v-if="uploadState">
						上传{{percentCompleted}}%
					</view>
				</view>
				
				<!-- 相机图标，表示可以更换头像 -->
				<view class="icon">
					<uni-icons type="camera" color="#fff" size="16"></uni-icons>
				</view>
				<!-- 提示文字 -->
				<view class="text">点击更换头像</view>
			</view>
		</view>	
		
		<!-- 用户信息列表区域 -->
		<view class="list">			
			<uni-list>
				<!-- 用户ID项，点击可复制ID -->
				<uni-list-item showArrow title="用户ID" clickable 
				:rightText="userInfo._id" @click="clickID(userInfo._id)"/>
				<!-- 昵称项，点击弹出修改昵称弹窗 -->
				<uni-list-item showArrow title="昵称" clickable
				:rightText="userInfo.username" @click="clickUsername"/>				
				<!-- 性别项，点击弹出修改性别弹窗 -->
				<uni-list-item showArrow title="性别" clickable 
				:rightText="formatGender(userInfo.gender)"  @click="clickGender"/>
				<!-- 注册时间项，只读不可修改 -->
				<uni-list-item showArrow title="注册时间"  
				:rightText="formatDate(userInfo.register_date)"  @click="clickTime"/>
			</uni-list>			 
		</view>
	</view>
	
	<!-- 修改昵称弹窗 -->
	<uni-popup ref="usernamePopup" type="dialog">
		<uni-popup-dialog mode="input" title="修改昵称" maxlength="15" v-model="userInfo.username" placeholder="请输入昵称" @confirm="usernameConfirm">			
		</uni-popup-dialog>
	</uni-popup>
	
	
	<!-- 修改性别弹窗 -->
	<uni-popup ref="genderPopup" type="dialog">
		<uni-popup-dialog  @confirm="genderConfirm" title="修改性别" mode="input">		
			<view class="genderForm">				
				<!-- 性别选择单选按钮组 -->
				<radio-group @change="genderChange">
					<label class="radio" v-for="item in genderGroup" :key="item.value">
						<radio :value="item.value" :checked="genderValue == item.value" style="transform:scale(0.7)"/>
						{{item.text}}
					</label>					
				</radio-group>				
			</view>
		</uni-popup-dialog>
	</uni-popup>
	
</template>

<script setup>
import {ref,computed} from "vue";
import {useUserStore} from "@/stores/user.js"
import {formatDate,formatGender} from "@/utils/tools.js"
const userStore = useUserStore();
const userInfo = computed(()=>userStore.userInfo);
const usernamePopup = ref(null);
const genderPopup = ref(null);
const genderValue = ref(userStore.userInfo.gender || 0);
const avatarUrl = ref(userStore.userInfo.avatar);
const uploadState = ref(false);
const percentCompleted = ref(0)
const genderGroup = ref([
	{
		value:0,
		text:"保密"
	},{
		value:1,
		text:"男"
	},{
		value:2,
		text:"女"
	}
])
//点击id模块复制内容
function clickID(value){	
	console.log(value);
	uni.setClipboardData({
		data:value,
		success:res=>{
			console.log(res);
		},
		fail:err=>{
			console.log(err);
		}
	})
}

//点击获取头像
function onChooseAvatar(e){
	uploadState.value = true;
	avatarUrl.value = e.detail.avatarUrl;
	// 云存储API
	uniCloud.uploadFile({
		filePath:avatarUrl.value,
		cloudPath:`userAvatar/${formatDate(Date.now(),"yyyyMMdd")}/${Date.now()}.jpg`,
		cloudPathAsRealPath:true,
		onUploadProgress: function(progressEvent) {
		  console.log(progressEvent);
		  percentCompleted.value = Math.round(
			(progressEvent.loaded * 100) / progressEvent.total
		  );
		}
	}).then(res=>{
		avatarUrl.value = res.fileID
		console.log(res.fileID);
		userStore.updateUserInfo({avatar:avatarUrl.value})
		uploadState.value = false;
	})
}

//点击修改昵称
function clickUsername(){
	usernamePopup.value.open();
}

//点击修改性别
function clickGender(){
	genderPopup.value.open();
}

//点击注册时间
function clickTime(){
	
}


//修改性别
function genderChange(e){
	console.log(e);	
	genderValue.value = Number(e.detail.value)
}

//确认修改性别
function genderConfirm(){	
	uni.showLoading();
	userStore.updateUserInfo({gender:genderValue.value})	
}


//确认修改昵称
function usernameConfirm(e){	
	uni.showLoading();
	userStore.updateUserInfo({username:e})	
}


</script>

<style lang="scss" scoped>
.userLayout{
	.avatar{
		padding:100rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.box{
			height: 150rpx;
			width: 150rpx;
			position: relative;
			.inner{
				width: 100%;
				height: 100%;				
				image{
					width: 100%;
					height: 100%;				
					border-radius: 50%;
					border:1px solid #eee;
				}
				.btn{
					position: absolute;
					top:0;
					left:0;
					width: 100%;
					height: 100%;	
					border-radius: 50%;
					opacity: 0;
				}
				.mask{
					position: absolute;
					background: rgba(0,0,0,0.6);
					color:#fff;
					top:0;
					left:0;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 22rpx;					
				}
			}
			
			.icon{
				width: 50rpx;
				height: 50rpx;
				background: #FE9468;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				border:2px solid #fff;
				position: absolute;
				right:0;
				bottom:0;
				pointer-events: none;
			}
			.text{
				font-size: 25rpx;
				color:#999;
				white-space: nowrap;
				padding:20rpx 0;
				text-align: center;
			}
		}
	}
	.list{
		padding:50rpx 0rpx;		
	}
}

.genderForm{
	.radio{
		padding:0 10rpx;		
	}
}

</style>

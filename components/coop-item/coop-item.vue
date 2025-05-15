<template>
	<!-- 圈子（鸡汤圈）单条内容项 -->
	<view class="qzItem">
		<!-- 用户信息区域 -->
		<view class="userinfo">
			<!-- 用户头像 -->
			<view class="avatar">
				<image class="pic" :src="item.userInfo.avatar || '../../static/images/defAvatar.png'" mode="aspectFill"></image>
			</view>
			<!-- 用户名 -->
			<view class="username">{{item.userInfo.username}}</view>
		</view>
		<!-- 内容主体区域 -->
		<view class="body">
			<!-- 文本内容（如果有） -->
			<view class="text" v-if="item.content">
				<view class="font">{{item.content}}</view>
			</view>
			<!-- 图片列表（如果有图片） -->
			<view class="piclist" v-if="item.picurls&&item.picurls.length">
				<!-- 循环渲染每一张图片 -->
				<view class="pic" v-for="(pic,index) in item.picurls" 
				:key="pic">
					<!-- 点击图片可放大预览 -->
					<image @click="clickPic(index)" :src="pic" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 底部信息栏 -->
		<view class="info">
			<view class="left">
				<!-- 发布时间（格式化） -->
				<uni-dateformat :date="item.publish_date" format="MM月dd hh:mm" :threshold="[60000,3600000*24*30]"></uni-dateformat>
				<!-- 发布地址或IP -->
				<text style="padding-left: 20rpx;">{{item.publish_address || item.publish_ip}}</text>
			</view>
			<view class="right">
				<!-- 删除按钮，仅管理员或本人可见 -->
				<view class="remove" @click="handleRemove" v-if="isAdminRole() || item.userInfo._id == current_id">
					<uni-icons type="trash-filled" size="16" color="#999"></uni-icons>删除	
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref,nextTick, onMounted,defineExpose,computed, defineEmits} from "vue";
import { isAdminRole } from "../../utils/common";


const current_id = ref(uniCloud.getCurrentUserInfo().uid);
const emit = defineEmits(["delRowEnv"])
const props = defineProps({item:Object});
const db = uniCloud.database();



//点击放大图片
function clickPic(index){	
	let picurls = props.item.picurls.map(item=>item.replace('?imageMogr2/thumbnail/200x',''));
	uni.previewImage({
		urls:picurls,
		current:index
	})
}


//删除圈子记录
async function handleRemove(){
	let result = await uni.showModal({
		title:"是否删除"
	})
	if(!result.confirm) return;	
	let {result:{errCode}} = await db.collection("chicken-coop").doc(props.item._id).update({
		is_delete:true
	})
	emit("delRowEnv",{msg:"删除成功"})
}


</script>

<style lang="scss" scoped>
.qzItem{
	padding:40rpx 30rpx;	
	.userinfo{
		display: flex;
		align-items: center;
		border-bottom:1px solid #f4f4f4;
		padding-bottom:30rpx;
		.avatar{
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 10rpx;
			.pic{
				width: 100%;
				height: 100%;
			}
		}
		.username{
			font-size: 28rpx;
			color:#333;
		}
	}
	.body{
		padding:15rpx 0 30rpx;		
		.text{			
			padding-bottom:10rpx;
			font-size: 40rpx;
			text-align: justify;
			color:#111;
			line-height: 1.7em;
			.font{
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;				
				text-overflow: ellipsis;		
				display: -webkit-box;			
				-webkit-line-clamp: 2;			
				line-clamp: 2;					
				-webkit-box-orient: vertical;
				width: 100%;				
				word-break:break-all; 
			}
		}
		.piclist{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap: 15rpx;
			padding-top:20rpx;
			.pic{				
				overflow: hidden;
				border-radius: 10rpx;
				aspect-ratio: 1 / 1;
				image{
					width: 100%;
					height: 100%;
				}
			}
			
		}
	}
	
	
	.info{
		display: flex;
		align-items: center;
		justify-content:space-between;
		font-size: 28rpx;	
		color:#999;		
		.right{
			display: flex;
			align-items: center;
			.ipname{
				margin-right: 20rpx;
			}
		}
	}	
	
}

</style>
<!-- 审核鸡汤页面 子组件 -->
<template>
	<!-- 鸡汤项主容器，点击可进入编辑 -->
	<view class="soupItem" @click="goEdit">
		<!-- 头部区域：左侧为类型标签，右侧为详情按钮 -->
		<view class="head">
			<view class="left">
				<!-- 鸡汤类型标签子组件 -->
				<soup-tab-group :type="item.soup_type"></soup-tab-group>
			</view>
			<!-- 详情按钮，点击跳转详情页，阻止冒泡 -->
			<view class="right" @click.stop="goDetail">
				<uni-icons type="eye" size="18" color="#999"></uni-icons>
				<text>详情</text>
			</view>
		</view>
		
		<!-- 鸡汤内容主体 -->
		<view class="content">
			{{item.content}}
		</view>
		
		<!-- 底部信息栏 -->
		<view class="info">
			<!-- 左侧：发布时间 -->
			<view class="left">
				<view class="time">
					<uni-dateformat :date="item.publish_date" format='yyyy-MM-dd hh:mm'>
					</uni-dateformat>				
				</view>
			</view>
			<!-- 右侧：状态分组或反馈信息 -->
			<view class="right">
				<!-- 状态为1时显示点赞、收藏、评论数 -->
				<view class="group" v-if="stateFormat(item.status).value==1">
					<view class="every">
						<uni-icons type="heart" color="#a7a7a7" size="16"></uni-icons>
						<text class="font" v-if="item.like_count">{{item.like_count}}</text>
					</view>
					<view class="every">
						<uni-icons type="star" color="#a7a7a7" size="16"></uni-icons>
						<text class="font" v-if="item.collect_count">{{item.collect_count}}</text>
					</view>
					<view class="every">
						<uni-icons type="chatbubble" color="#a7a7a7" size="16"></uni-icons>
						<text class="font" v-if="item.comment_count">{{item.comment_count}}</text>
					</view>
				</view>
				
				<!-- 其他状态显示反馈信息及删除按钮 -->
				<view v-else :style="{color:useStateFormat.color}" class="feedback">
					{{useStateFormat.text}}
					<!-- 状态为2时显示删除按钮，阻止冒泡 -->
					<view class="icon" v-if="item.status === 2" 
					@click.stop="clickRemove(item._id)">
						<uni-icons type="trash" size="16"></uni-icons>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script setup>
import {stateFormat} from "@/utils/common.js"
import { computed ,getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance()


const props = defineProps({
	item:{
		type:Object,
		default(){
			return {}
		}
	},
	isEdit:{
		type:Boolean,
		default:true
	}
})
const emits = defineEmits(["remove"])

const useStateFormat =  computed(()=>stateFormat(props.item.status))
const db = uniCloud.database();

const goEdit = ()=>{	
	if(!props.isEdit) return;
	uni.navigateTo({
		url:"/pages_self/soup/edit?id="+props.item._id
	})
}
const goDetail = ()=>{
	console.log("跳转详情");
	uni.navigateTo({
		url:"/pages/detail/detail?id="+props.item._id
	})
}

//删除一条记录
const clickRemove = async (id)=>{
	
	let res = await uni.showModal({
		title:"是否删除此条鸡汤",
		content:"删除之后无法恢复，请谨慎操作"
	})
	if(res.confirm){
		let {result:{errCode}} = await db.collection("soup-chicken").where(`_id == "${id}"`).update({
			is_delete:true
		});
		if(errCode!=0) return proxy.showToast("删除失败，请重新操作")
	    proxy.showToast("删除成功")
		emits("remove")
	}
}
</script>

<style lang="scss" scoped>
.soupItem{
	border:1px solid #e4e4e4;
	border-bottom-width: 3px;
	margin-bottom: 40rpx;
	border-radius: 10rpx;
	
	.head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20rpx;
		.right{
			font-size: 28rpx;
			color:$text-font-color-3;
			display: flex;
			align-items: center;			
			padding:5rpx 10rpx;
			text{
				margin-left:10rpx;
				line-height: 1em;
			}
		}
	}
	.content{
		padding:30rpx 20rpx;
		font-size: 40rpx;
		font-weight: bold;
		line-height: 1.7em;
		text-align: justify;		
	}
	.info{
		background: #f9f9f9;
		padding:20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color:$text-font-color-3;
		.group{
			display: flex;
			align-items: center;
			.every{
				margin-left:20rpx;
				.font{					
					font-size: 26rpx;
				}
			}
		}
		.feedback{			
			display: flex;
			align-items: center;
			.icon{				
				padding:5rpx 10rpx;
			}
		}
	}
}
</style>
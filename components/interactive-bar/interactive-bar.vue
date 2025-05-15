<template>
	<!-- 互动栏主容器 -->
	<view class="interactiveBar">
		<!-- 信息区域，包含左右两部分 -->
		<view class="info">
			<!-- 左侧区域：分享或评论入口 -->
			<view class="left">
				<!-- 分享按钮，仅type为0时显示 -->
				<view class="item" v-if="type==0" @click="clickShare">
					<uni-icons type="redo" size="28" color="#999"></uni-icons>
					<text></text>
				</view>
				<!-- 评论输入按钮，仅type为1时显示 -->
				<view class="item" v-if="type==1" @click="clickCommentBtn">
					<view class="input">评价一下...</view>
				</view>
			</view>
			<!-- 右侧区域：点赞、收藏、评论数、分享等 -->
			<view class="right">
				<!-- 点赞按钮及数量 -->
				<view class="item" @click="clickLike">
					<!-- 未点赞时的心形图标 -->
					<uni-icons v-if="!newItem.isLike" type="heart" size="28" color="#999"></uni-icons>
					<!-- 已点赞时的实心心形图标 -->
					<uni-icons v-else type="heart-filled" size="28" color="#dd524d"></uni-icons>
					<!-- 点赞数量，数量大于0时显示，颜色随点赞状态变化 -->
					<text v-if="newItem.like_count>0" :style="{color:newItem.isLike?'#dd524d':'#999'}">{{newItem.like_count}}</text>
				</view>

				<!-- 收藏按钮（当前被隐藏，v-if为false） -->
				<view class="item" @click="clickCollect" v-if="false">
					<uni-icons v-if="true" type="star" size="28" color="#999"></uni-icons>
					<uni-icons v-else type="star-filled" size="28" color="#f0ad4e"></uni-icons>
					<text v-if="newItem.collect_count">{{newItem.collect_count}}</text>
				</view>

				<!-- 评论数显示（当前被隐藏，v-if为false） -->
				<view class="item" v-if="false">
					<uni-icons type="chatbubble" size="28" color="#999"></uni-icons>
					<text v-if="newItem.comment_count">{{newItem.comment_count}}</text>
				</view>
				
				<!-- 分享按钮，仅type为1时显示 -->
				<view class="item" v-if="type==1"  @click="clickShare">
					<uni-icons type="redo" size="28" color="#999"></uni-icons>
					<text></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import debounce from "lodash.debounce"
const db = uniCloud.database();
const props = defineProps({
	type:{
		type:Number,
		default:0
	},
	item:{
		type:Object,
		default(){
			return {}
		}
	}
})

const newItem = ref(props.item);

watch(()=>props.item,(nv)=>{
	newItem.value = nv;
})


const current_id = uniCloud.getCurrentUserInfo().uid;


const emit = defineEmits(['comment','share']) 



//触发点击分享
const clickShare = ()=>{
	emit('share')
}


//点赞
const clickLike = debounce(handleLike,1000,{'leading': true,'trailing': false})

async function handleLike(){
	if(newItem.value.isLike){
		newItem.value.like_count--
		db.collection("soup-like").where({
			soup_id:newItem.value._id,
			user_id:current_id,
			like_type:0
		}).remove();
	}else{
		newItem.value.like_count++
		db.collection("soup-like").add({
			soup_id:newItem.value._id,
			like_type:0
		})
	}
	newItem.value.isLike = !newItem.value.isLike
	uni.$emit('like',{_id:newItem.value._id,isLike:newItem.value.isLike,like_count:newItem.value.like_count})
}




//收藏
const clickCollect = ()=>{
	console.log("收藏");
}

//点击评论框按钮
const clickCommentBtn = ()=>{
	console.log("交互子组件");
	emit("comment")
}
</script>

<style lang="scss" scoped>
	.interactiveBar {		
		.info {
			height: 130rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;

			.item {
				display: flex;
				align-items: center;
				padding: 10rpx 15rpx;
				color: #999;
			}

			.left {				
				flex:1;
				margin-right: 15rpx;
				.item {
					padding-left: 0;
				}
				.input{
					width: 100%;
					height: 70rpx;
					background: #f7f7f7;
					border-radius: 70rpx;
					display: flex;
					align-items: center;
					padding:0 30rpx;
				}
			}

			.right {
				display: flex;

				.item:last-child {
					padding-right: 0;
				}
			}
		}

	}
</style>
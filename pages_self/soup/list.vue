<template>
	<!-- 我的鸡汤列表页面整体容器 -->
	<view class="soupLayout">
		<!-- z-paging组件：用于分页加载鸡汤列表，支持下拉刷新和上拉加载更多 -->
		<z-paging ref="paging" safe-area-inset-bottom v-model="soupData" @query="queryList">
			<!-- 自定义加载中状态插槽 -->
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			
			<!-- 顶部插槽：放置标题和添加按钮 -->
			<template #top>
				<view class="headTop">
					<!-- 页面标题 -->
					<view class="title">我的鸡汤</view>
					<!-- 添加新鸡汤的导航按钮 -->
					<navigator  url="/pages_self/soup/edit" class="btn">+ 熬制鸡汤</navigator>
				</view>
			</template>
			
			<!-- 鸡汤列表区域 -->
			<view class="list">
				<!-- 循环渲染每条鸡汤项 -->
				<view class="item" v-for="item in soupData" :key="item._id">
					<!-- 鸡汤项组件：显示单条鸡汤内容及状态 -->
					<soup-item :item="item"></soup-item>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import {useUserStore} from "@/stores/user.js"
const userStore = useUserStore();
const soupData = ref([]);
const paging = ref(null);
const db = uniCloud.database();

const queryList = (pageNo, pageSize)=>{	
	getSoupList(pageNo, pageSize);
}


const getSoupList = async (pageNo, pageSize)=>{
	let skip = (pageNo - 1) * pageSize;
	try{
		let {result:{errCode,data}} = await db.collection("soup-chicken")				
		.where(`user_id == $cloudEnv_uid`)
		.field("publish_date,last_modify_date,content,soup_type,like_count,collect_count,comment_count,status")
		.orderBy("last_modify_date","desc")
		.skip(skip)
		.limit(pageSize)
		.get();
		if(errCode != 0) return;	
		paging.value.complete(data);
	}catch(e){
		paging.value.complete(false);
	}
}


uni.$on("soupUpdate",(e)=>{
	nextTick(()=>{
		paging.value.reload();
	})	
});



</script>

<style lang="scss" scoped>
.soupLayout{	
	.headTop{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
		padding:30rpx 30rpx 10rpx;
		color:#000;
		.title{
			font-size: 40rpx
		}
		.btn{
			border:1px solid #000;
			padding:8rpx 15rpx;
			border-radius: 100rpx;
		}
	}
	.list{
		padding:30rpx 30rpx 0;
	}
}
</style>

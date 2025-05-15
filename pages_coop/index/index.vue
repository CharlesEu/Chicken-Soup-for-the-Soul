<template>	
	<!-- 鸡圈页面整体布局容器 - 社区交流功能 -->
	<view class="layout">
		<!-- z-paging组件：用于分页加载社区内容，支持下拉刷新和上拉加载更多 -->
		<z-paging ref="paging" v-model="coopData" @query="queryList" :default-page-size="10" empty-view-text="暂无数据">
			 <!-- 自定义加载中状态插槽 -->
			 <template #loading>
			 	<uni-load-more status="loading"></uni-load-more>
			 </template>
			 
			 <!-- 社区内容列表区域 -->
			 <view class="list" v-if="coopData.length">
				<!-- 循环渲染每条社区内容 -->
				<view class="item" v-for="item in coopData" :key="item._id">
					<!-- 非广告内容使用coop-item组件渲染，delRowEnv事件用于删除后刷新列表 -->
					<coop-item :item="item" @delRowEnv="delRowEnv" v-if="!item.ad"></coop-item>		
								 
					<!-- 广告内容区域，仅在微信小程序环境下显示 -->
					<view v-else class="wxAd" style="padding:0 18rpx">
						<!-- #ifdef MP-WEIXIN -->						
						<ad unit-id="adunit-3e2ae9dacbcb600d" ad-type="video" ad-theme="white"></ad>
						<!-- #endif -->					
					</view>
				</view>
			 </view>			 
		</z-paging>
		
		<!-- 悬浮按钮组件，用于发布新内容，位于右下角 -->
		<uni-fab ref="fab" :pattern="{icon:'compose'}" horizontal="right" vertical="bottom" 
		@fabClick="goAdd"/>
	</view>	
</template>

<script setup>
import {ref,nextTick, onMounted,defineExpose,computed} from "vue";
const db = uniCloud.database();
const dbCmd = db.command;
const coopData = ref([]);
const paging = ref(null);

//获取圈子列表
async function queryList(pageNo, pageSize){
	let skip = (pageNo-1)*pageSize;	
	let coopTemp = db.collection("chicken-coop").where({
		is_delete:dbCmd.neq(true),
		status:1
	}).getTemp();
	let userTemp = await db.collection("uni-id-users").field("_id,username,avatar").getTemp();	
	let {result:{errCode,data}} = 
	await db.collection(coopTemp,userTemp).field("arrayElemAt(user_id,0) as userInfo,content,picurls,is_delete,publish_ip,publish_date,status,publish_address").orderBy("publish_date","desc").skip(skip).limit(pageSize).get();	
	data.forEach(item=>{		
		item.picurls = item.picurls.map(pic=>pic+'?imageMogr2/thumbnail/200x')			
	})
	if(data.length>5) data.splice(5,0,{ad:true});
	console.log(data);
	paging.value.complete(data);
}


const goAdd = ()=>{
	uni.navigateTo({
		url:'/pages_coop/write/add'
	})
}

const delRowEnv = ()=>{
	paging.value.refresh();
}



</script>

<style lang="scss" scoped>
.layout{
	.item{
		border-bottom:18rpx solid #f8f8f8;
		&:last-child{
			border:none;
			margin-bottom:60rpx;
		}
	}
}
</style>

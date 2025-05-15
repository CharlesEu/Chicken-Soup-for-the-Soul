<template>
	<!-- 页面主容器 -->
	<view class="pages">
		<!-- 分页组件，自动适配底部安全区，管理数据加载和分页 -->
		<z-paging ref="paging" safe-area-inset-bottom v-model="soupData" @query="queryList">
			<!-- 加载中插槽，显示加载动画 -->
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
						
			<!-- 列表区域 -->
			<view class="list">
				<!-- 循环渲染每一条鸡汤数据 -->
				<view class="item" v-for="item in soupData" :key="item._id">
					<!-- 鸡汤项子组件，非广告项时显示 -->
					<soup-item :item="item" :isEdit="false" v-if="!item.ad"></soup-item>
					<!-- 广告项，微信小程序下显示视频广告 -->
					<view v-else class="wxAd">
						<!-- #ifdef MP-WEIXIN -->						
						<ad unit-id="adunit-3e2ae9dacbcb600d" ad-type="video" ad-theme="white"></ad>
						<!-- #endif -->					
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from '../../utils/common';
const soupData = ref([]);
const paging = ref(null);
const db = uniCloud.database();

const queryList = (pageNo, pageSize)=>{
	getSoupList(pageNo, pageSize);
}

const getSoupList =async (pageNo, pageSize)=>{
	let likeTemp = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).getTemp();
	let soupTemp = db.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp();
	let {result:{errCode,data}}= await db.collection(likeTemp,soupTemp).field(`		
		create_date as publish_date,
		arrayElemAt(soup_id._id, 0) as _id,
		arrayElemAt(soup_id.content, 0) as content,
		arrayElemAt(soup_id.like_count, 0) as like_count,
		arrayElemAt(soup_id.collect_count, 0) as collect_count,
		arrayElemAt(soup_id.comment_count, 0) as comment_count,
		arrayElemAt(soup_id.soup_type, 0) as soup_type,
		arrayElemAt(soup_id.status, 0) as status
	`).orderBy("publish_date","desc").get();
	if(errCode!=0) return showToast("操作有误");
	
	if(data.length>3) data.splice(3,0,{ad:true});
	paging.value.complete(data);
	
}
</script>

<style lang="scss" scoped>
.pages{
	.list{
		padding:30rpx 30rpx 0;
	}
}
</style>
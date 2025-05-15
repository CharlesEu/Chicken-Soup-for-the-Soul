<!-- 审核鸡汤页面  review-list的子组件-->
<template>
	<!-- 主内容容器 -->
	<view class="content">
		<!-- 分页组件，管理数据加载和分页 -->
		<z-paging ref="paging" v-model="dataList" @query="queryList" :auto="false" 
		:fixed="false">
			<!-- 加载中插槽，显示加载动画 -->
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			<!-- 列表区域 -->
			<view class="list">
				<!-- 循环渲染每一条鸡汤数据 -->
				<view class="item" v-for="item in dataList" :key="item._id">
					<!-- 鸡汤项子组件，传递数据和删除事件 -->
					<soup-item :item="item" @remove="onRemove"></soup-item>
				</view>
			 </view>	
		</z-paging>
	</view>
</template>

<script setup>
import {nextTick, ref, watch} from "vue";
import {stateLists} from "@/utils/common.js"

const dataList = ref([]);
const paging =ref(null)
const db = uniCloud.database();
const firstLoaded = ref(false);

const props = defineProps({
	//每一个索引
	tabIndex: {
		type: Number,
		default: function(){
			return 0
		}
	},
	//当前swiper切换到第几个index
	currentIndex: {
		type: Number,
		default: function(){
			return 0
		}
	}
})

watch(()=>props.currentIndex,(nv,ov)=>{
	if(nv == props.tabIndex){
		if(!firstLoaded.value){
			nextTick(()=>{
				setTimeout(()=>{
					paging.value.reload();
				},100)
			})
		}
	}
},{
	immediate: true
})



function queryList(pageNo, pageSize){
	getSoupList(pageNo, pageSize)
}


async function getSoupList(pageNo, pageSize){
	let skip = (pageNo - 1)*pageSize
	let {result:{data,errCode}} = await db.collection("soup-chicken")
	.where(`status == ${stateLists[props.tabIndex].value} && is_delete != true`)
	.field("publish_date,last_modify_date,content,soup_type,like_count,collect_count,comment_count,status")
	.orderBy("last_modify_date","desc").skip(skip).limit(pageSize).get();
	if(errCode!=0) return;
	paging.value.complete(data);
	firstLoaded.value = true;
	console.log(data);	
}


function onRemove(){	
	paging.value.refresh();
}

</script>

<style lang="scss" scoped>
.content {
	height: 100%;
	.list{
		padding:30rpx 30rpx 0;		
	}
}	
</style>
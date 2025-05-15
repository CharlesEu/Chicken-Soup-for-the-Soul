<!-- 我的积分页面 - 显示用户积分余额和积分明细记录 -->
<template>
	<!-- 积分页面整体容器 -->
	<view class="scorePage">
		<!-- z-paging组件：用于分页加载积分记录，支持下拉刷新和上拉加载更多 -->
		<z-paging ref="paging" v-model="scoreData" @query="queryList" :default-page-size="10" empty-view-text="还没有积分">
			
			<!-- 自定义加载中状态插槽 -->
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			
			<!-- 积分余额显示区域 -->
			<template>
				<view class="head">
					<!-- 当前积分数值 -->
					<view class="number">{{balance}}</view>
					<!-- 标题文字 -->
					<view class="text">当前积分</view>
				</view>
			</template>
			
			 <!-- 积分记录列表区域 -->
			 <view class="list">
				<!-- 循环渲染每条积分记录 -->
				<view class="item" v-for="item in scoreData" :key="item._id">				
					<view class="left">
						<!-- 积分类型和说明 -->
						<view class="title">
							<!-- 根据类型显示"获得"或"支出" -->
							<template v-if="item.type==1">
								获得
							</template>
							<template v-if="item.type==2">
								支出
							</template>
							<!-- 积分说明 -->
							({{item.comment}})
							
						</view>
						<!-- 积分记录编号 -->
						<view class="order">编号：{{item._id}}</view>
						<!-- 积分记录时间 -->
						<view class="time">{{formatDate(item.create_date)}}</view>
					</view>
					<!-- 积分数值显示 -->
					<view class="right">
						<!-- 根据类型显示"+"号 -->
						<template v-if="item.type==1">
							+
						</template> 
						<!-- 积分数值 -->
						{{item.score}}
											
					</view>
				</view>
			 </view>			 
		</z-paging>		
	</view>
</template>

<script setup>
import {ref,computed} from "vue";
import {formatDate} from "@/utils/tools.js" //公共库utils
const paging = ref(null);
const scoreData = ref([]);
const db = uniCloud.database();

const balance = computed(()=>scoreData.value.length?scoreData.value[0].balance :0);


//滚动数据处理
const queryList = (pageNo, pageSize) => {	
	getScoreList(pageNo, pageSize);
}

//获取积分列表
async function getScoreList(pageNo, pageSize){
	let skip = (pageNo-1)*pageSize;
	try{
		let {result:{data,errCode}} = await db.collection("soup-scores").where(`user_id == $cloudEnv_uid`).orderBy('create_date',"desc").skip(skip).limit(pageSize).get();
		if(errCode!=0) return;
		console.log(data);
		paging.value.complete(data);
	}catch(e){
		paging.value.complete(false);
	}
	
	
}
</script>

<style lang="scss" scoped>
.scorePage{
	.head{
		background-image: linear-gradient(to right,rgba(75,228,197,1),rgba(75,228,197,0.5));
		width: 690rpx;
		margin:50rpx auto;
		border-radius: 10rpx;
		padding:30rpx;
		color:#fff;
		text-align: center;
		.number{
			font-size: 52rpx;
			font-weight: 600;
		}
		.text{
			font-size: 28rpx;
			opacity: 0.8;
		}
	}
	.list{
		padding:0rpx 30rpx 0;
		.item{
			padding: 40rpx 0;
			border-bottom:1px solid $border-color-light;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				color:$text-font-color-3;
				font-size: 28rpx;		
				.title{
					font-size: 38rpx;
					color:$text-font-color-1;
					padding-bottom:10rpx;
				}
			}
			.right{
				color:$text-font-color-3;
				font-size: 34rpx;
			}
		}
	}	
}
</style>

<template>
	<!-- 首页头部整体容器 -->
	<view class="homeHead">
		<!-- 状态栏占位，动态高度适配不同设备 -->
		<view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
		<!-- 标题栏，显示今日鸡汤送达提示 -->
		<view class="titleBar" :style="{height:getTitleBarHeight()+'px'}">今日份鸡汤送达喽~~</view>
		<!-- 内容区域 -->
		<view class="content">
			<!-- 日期时间区域 -->
			<view class="time">
				<!-- 左侧：显示日期（几号） -->
				<view class="left">
					<uni-dateformat :date="Date.now()" format="dd"></uni-dateformat>
				</view>
				<!-- 右侧：显示年月和星期几 -->
				<view class="right">
					<view class="year">
						<uni-dateformat :date="Date.now()" format="yyyy年MM月"></uni-dateformat>
					</view>
					<view class="week">{{getCurrentDayOfWeek()}}</view>
				</view>
			</view>
			<!-- 头部插图 -->
			<view class="pic">
				<image src="../../static/images/headPic.png" mode="heightFix"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import {getStatusBarHeight,getTitleBarHeight} from "@/utils/system.js"
import {getCurrentDayOfWeek} from "@/utils/tools.js"
</script>

<style lang="scss">
.homeHead{
	background:	
	radial-gradient(50% 200px at left top, #D5F8FC, transparent),
	radial-gradient(50% 200px at right top, #D3CBFC, transparent);
	
	.titleBar{
		display: flex;
		align-items: center;
		padding-left:50rpx;
	}
	.content{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 15vh;
		.time{
			display: flex;
			align-items: center;
			padding-left:50rpx;
			.left{
				font-size: 110rpx;
				font-weight: bolder;
			}
			.right{	
				padding-left:15rpx;
				.year{
					font-size: 30rpx;
				}
				.week{
					font-size: 40rpx;
					font-weight: bolder;
				}
			}
		}
		.pic{
			height: 100%;
			padding-right: 80rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
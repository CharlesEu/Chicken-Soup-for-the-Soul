<template>
	<!-- 鸡汤内容文本，支持多行省略，最大显示行数由 maxline 控制 -->
	<text class="soupContent" :style="{'-webkit-line-clamp':maxline}">
		{{item.content}}
	</text>

	<!-- 作者信息区域 -->
	<view class="author">
		<!-- 分割线 -->
		<view class="line"></view>
		
		<view class="outer">
			<!-- 用户信息（头像、昵称、来源），仅当有 userInfo 时显示 -->
			<view class="userinfo" v-if="item.userInfo">
				<view class="avatar">					
					<image :src="item.userInfo.avatar || '../../static/images/defAvatar.png'" mode="aspectFill"></image>
				</view>
				<view class="name">{{item.userInfo.username}}</view>
				<!-- 鸡汤来源信息（如有） -->
				<view class="from" v-if="item.from">摘自：{{item.from}}</view>
			</view>			
			<!-- 浏览人数，lookState 为 true 时显示 -->
			<view class="number" v-if="lookState">共{{item.view_count}}人看过</view>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		maxline: {
			type: [String, Number],
			default: 'none'
		},
		lookState:{
			type:Boolean,
			default:false
		},
		item:{
			type:Object,
			default(){
				return {}
			}
		}
	})
</script>

<style lang="scss" scoped>
	.soupContent {
		font-size: 50rpx;
		font-weight: lighter;
		width: 100%;
		letter-spacing: 0.05em;
		line-height: 1.8em;
		margin-top: 10rpx;
		margin-bottom: 60rpx;
		@include maxline();
	}

	.author {
		.line {
			width: 70rpx;
			height: 5rpx;
			background: #f0f0f0;
			margin-bottom:30rpx;
		}
		.outer{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.number{
				font-size: 26rpx;
				color:#999;
			}
			.userinfo {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				coor: #888;
				.avatar {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}
			
				.name {
					padding-left: 12rpx;
				}
			
				.from {
					padding-left: 12rpx;
				}
			}
		}

		

	}
</style>
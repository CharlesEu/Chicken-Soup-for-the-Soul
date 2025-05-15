<!-- "我的"页面 - 用户个人中心，显示用户信息和功能入口 -->
<template>
	<view class="self">
		<!-- 顶部状态栏占位，高度的动态计算 -->
		<view :style="{height:getNavBarHeight()+'px'}"></view>
						
		<!-- 用户信息卡片区域 -->
		<view class="userinfo">
			<!-- 左侧用户基本信息 -->
			<view class="left">
				<!-- 用户头像 -->
				<view class="avatar">
					<image :src="userStore.userInfo.avatar || '../../static/images/defAvatar.png'" mode="aspectFill"></image>
					
				</view>
				<!-- 用户名和注册天数 -->
				<view class="info">
					<!-- 用户名，超过8个字符会被截断 -->
					<view class="username">{{truncateString(userStore.userInfo.username,8)}}</view>
					<!-- 显示用户注册天数 -->
					<view class="text">喝汤的第
					{{daysFromTimestamp(userStore.userInfo.register_date)}}
					天</view>
				</view>
			</view>
			<!-- 右侧编辑资料入口 -->
			<navigator url="/pages_self/user/edit" class="right">
				<view class="text">编辑资料</view>
				<view class="icon">
					<uni-icons type="right" size="20" color="#999"></uni-icons>
				</view>
			</navigator>
		</view>
	
		<!-- 功能卡片区域 -->
		<view class="cardLayout">
			<view class="list">
				<!-- 熬制鸡汤入口 - 用户创建的鸡汤内容 -->
				<navigator url="/pages_self/soup/list" class="item">
					<view class="left">
						<!-- 图标区域，使用渐变背景 -->
						<view class="icon" 
						style="background-image: linear-gradient(to right,rgba(111,207,151,1),rgba(111,207,151,0.5))">
							<uni-icons 
							custom-prefix="iconfont" 
							type="xxm-highlight-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">熬制鸡汤</view>
					</view>
					<view class="right">
						<!-- 显示用户创建的鸡汤数量 -->
						<view class="text">{{dataset.soup}}</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				<!-- 审核鸡汤入口 - 仅管理员可见 -->
				<navigator url="/pages_self/reviewed/list" class="item" v-if="isAdminRole()">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(156,77,204,1),rgba(156,77,204,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-edit-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">审核鸡汤</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				
				
				<!-- 我的喜欢入口 - 用户点赞的内容 -->
				<navigator url="/pages_self/like/list" class="item">
					<view class="left">
						<view class="icon"
						style="background-image: linear-gradient(to right,rgba(242,148,146,1),rgba(242,148,146,0.5));"
						><uni-icons custom-prefix="iconfont" type="xxm-heart-fill" color="#fff" size="18"></uni-icons></view>
						<view class="name">我的喜欢</view>
					</view>
					<view class="right">
						<!-- 显示用户点赞的内容数量 -->
						<view class="text">{{dataset.like}}</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				
				<!-- 我的积分入口 - 显示用户积分 -->
				<navigator url="/pages_self/score/list" class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(75,228,197,1),rgba(75,228,197,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-hourglass-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">我的积分</view>
					</view>
					<view class="right">
						<!-- 显示用户当前积分 -->
						<view class="text">{{dataset.scores}}分</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				
				<!-- 鸡圈入口 - 社区交流功能 -->
				<navigator url="/pages_coop/index/index" class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(59,59,152,1),rgba(59,59,152,0.5))">
							<uni-icons type="pyq" color="#fff" size="18"></uni-icons>
						</view>
						<view class="name">鸡圈</view>
					</view>
					<view class="right">
						<view class="text">社区交流</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				<!-- 联系我们入口 - 在线客服功能 -->
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(255,112,52,1),rgba(255,112,52,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-message-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">联系我们</view>
					</view>
					<view class="right">
						<view class="text">在线客服</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
					<!-- 微信小程序客服按钮，透明覆盖在整个item上 -->
					<button open-type="contact" class="contactBtn" style="width: 100%;">联系</button>
				</view>
				
				
				
			</view>
		</view>
		
		<!-- 广告区域 - 视频广告 -->
		<view class="cardLayout">
			<ad unit-id="adunit-3e2ae9dacbcb600d" ad-type="video" ad-theme="white"></ad> 
		</view>
		
		
		
		<!--  
		注释掉的功能区域 - 偏好设置和退出登录
		<view class="cardLayout">
			<view class="list">
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-pushpin-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">偏好设置</view>
					</view>
					<view class="right">
						<view class="text">默认</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
				
				
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-api-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">退出登录</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
				
			</view>
		</view>
		-->
		
		
	</view>
</template>

<script setup>
import {ref} from "vue";
import {getNavBarHeight} from "@/utils/system.js"
import {useCounterStore} from "@/stores/counter.js"
import {useUserStore} from "@/stores/user.js"
import {isAdminRole} from "@/utils/common.js"
import {daysFromTimestamp,truncateString} from "@/utils/tools.js"
const counterStore = useCounterStore();
const userStore = useUserStore();
const db = uniCloud.database();
const dataset = ref({
	soup:0,
	like:0,
	scores:0
})

const getUserDataset = async()=>{
	let soup = db.collection("soup-chicken").where(`user_id == $cloudEnv_uid && status==1`).count();
	let like = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).count();
	let scores = db.collection("soup-scores").where(`user_id ==  $cloudEnv_uid`).orderBy("create_date","desc").limit(1).get({getOne:true});

	Promise.all([soup,like,scores]).then(res=>{
		console.log(res);
		dataset.value.soup = res[0].result.total;
		dataset.value.like = res[1].result.total;
		dataset.value.scores = res[2].result?.data?.balance ?? 0;
	})
	  
}


getUserDataset();

</script>

<style lang="scss" scoped>
.self{
	background: $page-bg-color;
	min-height: 100vh;
	padding-bottom:30rpx;
	.userinfo{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:50rpx;
		.left{
			display: flex;
			align-items: center;
			.avatar{
				width: 120rpx;
				height: 120rpx;
				border:3px solid #fff;
				border-radius: 50%;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				padding-left:20rpx;
				.username{
					font-size: 38rpx;
					font-weight: 600;
					color:#111;
				}
				.text{
					font-size: 26rpx;
					font-weight: 100;
					color:$text-font-color-3;
					padding-top:10rpx;
				}
				
				
			}
		}
		
		.right{
			display: flex;
			align-items: center;
			.text{
				font-size: 28rpx;
				color:#999;
			}
		}
	}

	.cardLayout{
		width: 690rpx;
		background: #fff;
		margin:30rpx auto;
		border-radius: 20rpx;
		.list{
			padding:30rpx;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:34rpx 0;
				border-bottom: 1px solid $border-color-light;
				position: relative;
				&:last-child{
					border:none;
				}
				.left{
					display: flex;
					.icon{
						width: 50rpx;
						height: 50rpx;
						background: #fff;
						border-radius: 50%;
						overflow: hidden;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.name{
						font-size: 38rpx;
						padding-left:20rpx;
					}
				}
				.right{
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color:#999;
				}
				.contactBtn{
					position: absolute;
					top:0;
					left:0;
					opacity:0;
				}
			}
		}
	}
}
</style>

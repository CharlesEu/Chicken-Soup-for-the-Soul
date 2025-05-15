<!-- 入口组件  首页页面-->
<template>
	<view class="homeLayout">
		<!-- 顶部导航栏区域 -->
		<view class="head">
			<home-head></home-head>
		</view>
		
		<view class="body">
			<view class="swiperOut">
				<!-- 如果没有数据，显示加载中状态 -->
				<view class="noData" v-if="!listData.length"> 
					<uni-load-more status="loading" :showText="false"></uni-load-more>
				</view>
				<!-- 有数据时显示垂直滑动的轮播组件 -->
				<swiper vertical @change="swiperChange" :duration="260" v-else>
					<!-- 循环渲染每条鸡汤内容 -->
					<swiper-item v-for="(item,index) in listData" :key="index">
						<!-- 点击跳转到详情页的导航组件 -->
						<navigator :url="`/pages/detail/detail?id=${item._id}`" class="content">
							<!-- 鸡汤类型标签组件 -->
							<soup-tab-group :type="item.soup_type"></soup-tab-group>
							
							<!-- 鸡汤文本内容组件，最多显示5行 -->
							<soup-text-content maxline="5" :item="item"></soup-text-content>
							
							
						</navigator>
						
						
						
						<!-- 互动栏组件，包含点赞、分享等功能 -->
						<interactive-bar :item="item" @share="clickShare(index)"></interactive-bar>
					</swiper-item>
					
					
					<!-- 当日鸡汤用完后显示的广告轮播项 -->
					<swiper-item class="ad">
						<view class="message">
							<view class="title">小主，今日鸡汤已干完！</view>
							<text class="des">每日5碗鸡汤，如果想要加餐，\n点击下方看广告按钮，可继续推送5碗，\n每日最多加餐5次。</text>
						</view>
						<view class="btnGroup">
							<!-- 观看广告获取更多鸡汤的按钮 -->
							<view class="btn" @click="clickAdSoup">看广告刷新</view>
							<view class="text">今日还有{{readNumber}}次机会</view>
						</view>
					</swiper-item>
					
				</swiper>
			</view>
			<!-- 底部进度条，显示当前浏览进度 -->
			<view class="progress">
				<view class="line" :style="{width:lineWidth+'%'}"></view>
			</view>
		</view>
		
		<!-- 首次使用时的引导弹窗 -->
		<uni-popup ref="usePopup" type="center" @maskClick="closeUsePopup" 
		@touchmove="closeUsePopup">
			<view class="usePopup">
				<image src="../../static/images/upward.png" mode="heightFix" @click="closeUsePopup"></image>
			</view>
		</uni-popup>
		
		<!-- 分享海报组件 -->
		<share-posters ref="shareRef" :info="shareInfo"></share-posters>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';
import {onReady} from "@dcloudio/uni-app"
import {useCounterStore} from "@/stores/counter.js";
import { showToast } from '../../utils/common';
const counterStore = useCounterStore()
const listData = ref([]);
const currentIndex = ref(0);
const usePopup =ref(null);
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const currentUser = uniCloud.getCurrentUserInfo().uid
const readNumber = ref(5);
const shareRef = ref(null)
const shareInfo = ref(null);
onReady(()=>{
	let useState = uni.getStorageSync("useState") || false;
	if(!useState) usePopup.value.open();
	
})


const clickShare =(index)=>{
	shareInfo.value = listData.value[index]
	shareRef.value.handleShow();
}


uni.$on('like',(e)=>{
	console.log(e);
	let index = listData.value.findIndex(item=>item._id == e._id);
	listData.value[index] = {
		...listData.value[index],
		...e
	}	
	db.collection("soup-today").where(`user_id == $cloudEnv_uid`).update({
		soup_list:listData.value
	})
})



//点击广告获取新鸡汤
const clickAdSoup = async ()=>{
	uni.showLoading({
		title:"加载中..."
	})
	// 用户触发广告后，显示激励视频广告
	if (videoAd) {
	  videoAd.show().catch(() => {
		uni.hideLoading();
	    // 失败重试
	    videoAd.load()
	      .then(() => videoAd.show())
	      .catch(err => {
	        console.error('激励视频 广告显示失败', err)
	      })
	  })
	}	
}




//获取鸡汤
const getSoup =async (type='get')=>{
   // 添加加载状态
   uni.showLoading({
       title:"加载中..."
   });
   
   try {
       //查询soup-today表，有无当前用户进入的记录
       let {result:{data:todayData=[],errCode=-1}={}} =await db.collection("soup-today").where(`user_id == $cloudEnv_uid`).get();
       
       //存在today记录，就获取today的鸡汤
       if(todayData.length && type=='get'){
           if(errCode!=0) {
               uni.hideLoading();
               return showToast("信息有误，请重新刷新","none");
           }
           // 直接赋值，避免重复添加
           listData.value = todayData[0].soup_list;
           readNumber.value = todayData[0].number;
       } else {
           //不存在则执行查询soup-chicken中满足要求的鸡汤
           let {result:{errCode,data}}= await db.collection("soup-chicken").aggregate()  
           // ... 现有代码 ...
           
           if(errCode!=0) {
               uni.hideLoading();
               return showToast("信息有误，请重新刷新","none");
           }
           
           if(data.length==0) {
               uni.hideLoading();
               return getSoup("random");
           }
           
           data[0].is_read = true;
           // 对于新数据，直接赋值而不是追加
           if(type=='ad') {
               // 广告刷新时，追加新数据
               listData.value = [...listData.value, ...data];
               db.collection("soup-today").where(`user_id == "${currentUser}"`).update({
                   soup_list:listData.value
               });
           } else {
               // 首次加载时，直接赋值
               listData.value = data;
               db.collection("soup-today").add({
                   user_id:currentUser,
                   soup_list:data
               });
           }
       }
   } catch (error) {
       console.error("获取鸡汤数据失败:", error);
       showToast("获取数据失败，请重试","none");
   } finally {
       uni.hideLoading();
   }
   
   // 打印检查获取到的数据
   console.log("获取到的鸡汤数据:", listData.value);
}



getSoup()

//轮播切换事件
const swiperChange = (e)=>{	
	currentIndex.value = e.detail.current
	if(listData.value[currentIndex.value] && !listData.value[currentIndex.value].is_read){
		listData.value[currentIndex.value].is_read = true;	
		db.collection("soup-today").where(`user_id == $cloudEnv_uid`).update({
			soup_list:listData.value
		}).then(res=>{
			console.log(res);
		})
	}else{
		console.log("重复操作");
	}
}

//进度条的宽度
const lineWidth = computed(()=>currentIndex.value/listData.value.length*100)


//点击操作的遮罩层
const closeUsePopup = ()=>{
	usePopup.value.close();
	uni.setStorageSync("useState",true);
}


// 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
// 在页面中定义激励视频广告
let videoAd = null

// 在页面onLoad回调事件中创建激励视频广告实例
if (wx.createRewardedVideoAd) {
  uni.hideLoading();
  videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-c2d6709878b96f75'
  })
  videoAd.onLoad(() => {})
  videoAd.onError((err) => {
    console.error('激励视频光告加载失败', err)
  })
  videoAd.onClose((res) => {
	  uni.showLoading({
	  	title:"加载中..."
	  })
	  if(res.isEnded){
		  adClose();
	  }else{
		  showToast("广告没有播放完毕");
	  }
  })
}


const  adClose =async ()=>{	
	if(readNumber.value<=0) return showToast('今日份鸡汤已全部喝光~')
	readNumber.value--
	let res = await db.collection("soup-today").where(`user_id == "${currentUser}"`).update({
		number:readNumber.value
	})
	getSoup('ad')
}




</script>

<style lang="scss" scoped>
.homeLayout{
	height: 100vh;
	background: #BDE1FB;
	display: flex;
	flex-direction: column;
	.head{
		height: 200rpx;
	}
	.body{
		flex:1;
		background: #fff;
		border-radius: 50rpx 50rpx 0 0;
		overflow: hidden;
		.swiperOut{
			height: calc(100% - 8rpx);
			.noData{				
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			swiper{
				height: 100%;
				&-item{
					.content{
						height: calc(100% - 130rpx);						
						display: flex;
						justify-content: center;
						flex-direction: column;
						padding:0 30rpx;
						
						
						
						
						
					}
					
				}
				
				.ad{
					background: #F8F8F8;	
					padding:100rpx 30rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					text-align: center;
					.message{
						background: #fff;
						border-radius: 30rpx;
						padding:40rpx;
						
						.title{
							font-size: 46rpx;
							padding-bottom:20rpx;
							border-bottom:1px solid #eee;
							margin-bottom: 20rpx;
						}
						.des{
							font-size: 32rpx;
							color:#555;
							line-height: 1.8em;
						}
					}
					
					.btnGroup{
						font-size: 30rpx;
						.btn{
							width: 400rpx;
							height: 100rpx;
							border-radius: 100rpx;
							background: linear-gradient(to top,#93c4ff,#b1e1ff);
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 38rpx;
							color:#203e5f;
							margin-bottom: 10rpx;
						}
						.text{
							padding:20rpx 0;
						}
					}
				}
				
			}
		}
		.progress{
			height: 8rpx;
			width: 100%;
			background: #eee;
			.line{
				height: 100%;
				width: 0%;
				background: linear-gradient(to right,#BCE0FD,#74dbef);
			}
		}
	}
}


.usePopup{	
	padding-top:15vh;
	image{
		height: 150rpx;
		transform: translateY(100rpx);
		opacity: 0;
		animation: useanimate 1.5s infinite;
	}
}

@keyframes useanimate{
	0%{
		transform: translateY(100rpx);
		opacity: 0;
	}
	100%{
		transform: translateY(-100rpx);
		opacity: 1;
	}
}
</style>

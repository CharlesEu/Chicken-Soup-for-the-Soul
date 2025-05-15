<template>
	<!-- 单个评论项组件 -->
	<view class="commentItem">
		<!-- 评论外部容器 -->
		<view class="outer">
			<!-- 用户头像区域 -->
			<view class="avatar">
				<!-- 用户头像图片，如果用户没有头像则显示默认头像 -->
				<image class="pic" :src="commentItem.userInfo.avatar || '../../static/images/defAvatar.png'" mode=""></image>
			</view>
			<!-- 评论内容区域 -->
			<view class="content">
				<!-- 用户信息行 -->
				<view class="userinfo">
					<!-- 左侧：用户名和评论时间 -->
					<view class="left">
						<!-- 用户名 -->
						<view class="name">{{commentItem.userInfo.username}}</view>
						<!-- 评论时间，使用 uni-dateformat 进行格式化 -->
						<view class="time">
							<uni-dateformat :date="commentItem.comment_date" :threshold="[60000, 3600000]" format="yyyy/MM/dd hh:mm"></uni-dateformat>
						</view>
					</view>
					<!-- 右侧：点赞和删除操作 -->
					<view class="right">
						<!-- 点赞按钮和数量 -->
						<view class="like" @click="clickLike">
							<!-- 点赞数量，仅当数量大于0时显示 -->
							<view class="num" v-if="commentItem.like_count>0"
							:style="{color:commentItem.isLike?'#dd524d':'#a7a7a7'}"
							>{{commentItem.like_count}}</view>
							<!-- 未点赞状态图标 -->
							<uni-icons v-if="!commentItem.isLike" type="hand-up" size="20" color="#a7a7a7"></uni-icons>
							<!-- 已点赞状态图标 -->
							<uni-icons v-else type="hand-up-filled" size="20" color="#dd524d"></uni-icons>
						</view>
						<!-- 删除按钮，条件：非顶级评论、评论未被标记为删除、当前用户是评论发布者或管理员 -->
						<view class="remove" 
	v-if="!toplevel && !commentItem.is_delete && (commentItem.userInfo._id == current_id || isAdminRole())"
						@click="commentRemove"
						>
							<!-- 删除图标 -->
							<uni-icons type="trash" size="20" color="#a7a7a7"></uni-icons>
							<!-- 删除文字 -->
							<text>删除</text>
						</view>
					</view>
				</view>
				<!-- 评论内容或回复内容区域，点击可进行回复 -->
				<view class="reply" @click="goReply">
					<!-- 评论主要内容，如果评论被删除则添加删除线样式 -->
					<text :class="commentItem.is_delete?'isDelete':''">{{commentItem.comment_content}}</text> 
					<!-- 如果是回复类型的评论，显示被回复的内容摘要 -->
					<text class="text" v-if="commentItem.replyInfo">
						// 回复 <text class="nickname">@{{commentItem.replyInfo.userInfo.username}}</text>：{{commentItem.replyInfo.comment_content}}
					</text>
					
				</view>
			</view>
		</view>
	
		<!-- 子回复区域，条件：允许显示子回复 (subReply) 且该评论有子评论 (commentItem.childCount) -->
		<view class="subReply" v-if="subReply && commentItem.childCount" @click="goReply">
			<!-- 子回复列表 -->
			<view class="list">
				<!-- 循环渲染子回复项 -->
				<view class="row" v-for="row in commentItem.child" :key="row._id">
					{{row.userInfo.username}}：{{row.comment_content}}</view>				
				<!-- 显示更多回复的提示 -->
				<view class="row more">共{{commentItem.childCount}}条回复 
					<!-- 右箭头图标 -->
					<uni-icons type="right" color="#a7a7a7" size="16"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {ref,watch} from "vue";
import debounce from "lodash.debounce"
import { isAdminRole } from "../../utils/common";
const db = uniCloud.database();
const current_id = ref(uniCloud.getCurrentUserInfo().uid);

const emits = defineEmits(['reply']);
const props = defineProps({
	subReply:{
		type:Boolean,
		default:false
	},
	item:Object,
	reply:{
		type:Boolean,
		default:false
	},
	toplevel:{
		type:Boolean,
		default:false
	}
})

const commentItem = ref(props.item);

watch(()=>props.item,(nv)=>{
	commentItem.value = nv;
})

//删除评论
const commentRemove = async()=>{
	let result = await uni.showModal({
		title:"是否删除"
	})
	if(!result.confirm) return;	
	let {result:{errCode}} = await db.collection("soup-comments").doc(commentItem.value._id).update({
		is_delete:true
	})
	if(errCode == 0) uni.$emit("commentRemove");
	
}



//点赞
const clickLike = debounce(handleLike,1000,{'leading': true,'trailing': false})


async function handleLike(){
	if(commentItem.value.isLike){
		commentItem.value.like_count--
		db.collection("soup-like").where({
			soup_id:commentItem.value.soup_id,
			comment_id:commentItem.value._id,
			user_id:current_id.value,
			like_type:1
		}).remove();
	}else{
		commentItem.value.like_count++
		db.collection("soup-like").add({
			soup_id:commentItem.value.soup_id,
			comment_id:commentItem.value._id,
			like_type:1
		})
	}
	commentItem.value.isLike = !commentItem.value.isLike
	uni.$emit('commentLike',{_id:commentItem.value._id,isLike:commentItem.value.isLike,like_count:commentItem.value.like_count})
}



//点击回复
const goReply = ()=>{
	if(props.subReply){
		uni.navigateTo({
			url:"/pages/detail/reply"
		})
		uni.setStorageSync("currentReply",props.item);
	}	
	if(props.reply){		
		emits("reply",props.item)
	}
}
</script>

<style lang="scss" scoped>
.isDelete{
	text-decoration: line-through;
	color:$text-font-color-3;
}
.commentItem{
	padding:30rpx;
	.outer{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		.avatar{
			width: 60rpx;
			height:60rpx;
			margin-right: 20rpx;
			border-radius: 50%;
			overflow: hidden;
			.pic{
				width: 100%;
				height: 100%;
			}
		}
		.content{
			flex:1;
			.userinfo{
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					.name{
						font-size: 26rpx;
						color:$text-font-color-2;
					}
					.time{
						font-size: 22rpx;
						color:$text-font-color-3;
					}
				}
				.right{
					color:$text-font-color-3;
					font-size: 22rpx;
					display: flex;
					align-items: center;
					.like{
						display: flex;
						align-items: center;
						.num{
							margin-right: 5rpx;
						}
					}
					.remove{
						margin-left:20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
			.reply{
				padding:20rpx 0;
				font-size: 30rpx;
				color:$text-font-color-1;
				line-height: 1.7em;
				.text{
					color:$text-font-color-3;
					.nickname{
						color:$brand-theme-color;
					}
				}
			}
		
		}
	}
	.subReply{
		padding-left:80rpx;
		.list{
			background: #f4f4f4;
			padding:20rpx;
			border-radius: 10rpx;
			.row{
				line-height: 1.8em;
				font-size: 28rpx;
				color:$text-font-color-2;
			}
			.more{
				color:$text-font-color-3;
			}
		}
	}
}
</style>
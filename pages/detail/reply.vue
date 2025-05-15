<!-- '评论'页面 - 用于显示某条评论的所有回复内容 -->
<template>
	<!-- 回复页面整体布局容器 -->
	<view class="replyLayout">
		<!-- z-paging组件：用于分页加载回复列表，支持下拉刷新和上拉加载更多 -->
		<z-paging ref="paging" v-model="replyList" @query="queryList" empty-view-text="抢先回复" empty-view-img="http://cdn.uviewui.com/uview/empty/comment.png">
			<view class="outer">
				<!-- 顶部显示当前被回复的评论内容 -->
				<view class="body">
					<!-- 使用comment-item组件显示原评论，toplevel=true表示这是顶层评论 -->
					<comment-item :item="currentReply" :toplevel="true"></comment-item>
				</view>
				<!-- 回复列表区域 -->
				<view class="list">
					<!-- 循环渲染每条回复 -->
					<view class="row" v-for="item in replyList" :key="item._id">
						<!-- 回复项组件，reply=true表示这是回复模式，点击触发clickComment事件 -->
						<comment-item :item="item" :reply="true" @reply="clickComment"></comment-item>
					</view>
				</view>
				<!-- 回复加载中状态显示 -->
				<view v-if="!replyList.length && !noData" style="padding:60rpx">
					<uni-load-more status="loading" :showText="false"></uni-load-more>
				</view>
				
			</view>	
			
			<!-- z-paging的底部插槽，用于固定在页面底部的回复输入栏 -->
			<template #bottom>
				<!-- 底部回复输入栏，点击后弹出评论输入框 -->
				<view class="replyBar" @click="clickReply">
					<view class="out">
						<!-- 左侧提示文字 -->
						<view class="left">发一条友好的评论吧</view>
						<!-- 右侧发送图标 -->
						<view class="right">
							<uni-icons type="paperplane" size="26" color="#333"></uni-icons>
						</view>
					</view>
					<!-- 底部安全区域，适配全面屏手机 -->
					<view class="safe-area-bottom" :style="{background:'#fff'}"></view>
				</view>
			</template>			
		</z-paging>
	</view>
	
	<!-- 评论回复弹出层 -->
	<uni-popup type="bottom" ref="commentPopup">
		<!-- 评论回复组件，用于用户输入回复内容 -->
		<comment-reply ref="commentRef" :source="source" @success="replySuccess"></comment-reply>
	</uni-popup>
</template>

<script setup>
import { ref ,getCurrentInstance, nextTick} from 'vue';
import {onUnload} from "@dcloudio/uni-app"
import { showToast } from '../../utils/common';
const currentReply = ref(uni.getStorageSync("currentReply") || {});
const current_id = uniCloud.getCurrentUserInfo().uid;
const commentPopup = ref(null);
const paging = ref(null);
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const replyList = ref([]);
const noData = ref(false);
const source =ref({
	soup_id:currentReply.value.soup_id,
	comment_type:1,
	reply_parent_id:currentReply.value._id,
	reply_user_id:currentReply.value.userInfo._id,
	reply_comment_id:currentReply.value._id,
	reply_user_name:currentReply.value.userInfo.username
});
const commentRef = ref(null);
const queryList =(pageNo, pageSize)=>{
	getReply(pageNo, pageSize)
}

uni.$on("commentRemove",()=>{
	nextTick(()=>{
		paging.value.refresh();
	})	
})

const getReply =async (pageNo, pageSize)=>{
	let skip = (pageNo - 1) * pageSize;
	let {result:{errCode,data}} = await db.collection("soup-comments").aggregate()
	.match({
		soup_id:currentReply.value.soup_id,		
		comment_type:1,
		reply_parent_id:currentReply.value._id
	})
	.lookup({
		from: "uni-id-users",
		let: {
			uid: '$user_id'
		},
		pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
			username: 1,
			avatar: 1
		}).done(),
		as: "userInfo"
	})
	.lookup({
		from: "soup-comments",
		let: {
			reply_comment_id: '$reply_comment_id',
			reply_parent_id:'$reply_parent_id'
		},
		pipeline: $.pipeline()
		.match(dbCmd.expr(
			$.and([
				$.neq(["$$reply_comment_id","$$reply_parent_id"]),
				$.eq(['$_id', '$$reply_comment_id'])
			])		
		))
		.lookup({
			from: "uni-id-users",
			let: {
				uid: '$user_id'
			},
			pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
				username: 1
			}).done(),
			as: "userInfo"
		})
		.project({
			comment_content: $.cond({
				if:$.eq(['$is_delete',true]),
				then:"已被删除",
				else:'$comment_content'
			}),
			userInfo:$.arrayElemAt(['$userInfo', 0])
		}).done(),
		as: "replyInfo"
	})
	.lookup({
		from: "soup-like",
		let: {
			commentID: '$_id'
		},
		pipeline: $.pipeline().match(				
		dbCmd.expr(
			$.and([					
				$.eq([currentReply.value.soup_id,'$soup_id']),
				$.eq(['$$commentID','$comment_id']),
				$.eq(['$user_id',current_id])
			])
		)).count('length')
		.done(),
		as: "likeState"
	})
	.sort({comment_date:-1})
	.skip(skip)
	.limit(pageSize)
	.project({	
		is_delete:1,
		isLike:$.cond({
			if:$.gt([$.arrayElemAt(['$likeState.length',0]),0]),
			then:true,
			else:false
		}),
		like_count: 1,
		comment_count: 1,
		comment_type: 1,
		comment_content: $.cond({
			if:$.eq(['$is_delete',true]),
			then:"已被删除",
			else:'$comment_content'
		}),
		soup_id: 1,
		comment_date: 1,
		userInfo: $.arrayElemAt(['$userInfo', 0]),
		replyInfo:$.arrayElemAt(['$replyInfo', 0]),
	})
	.end();
	console.log(data);	
	paging.value.complete(data);
	if(data.length==0) noData.value = true;
}



const clickReply = ()=>{
	commentPopup.value.open();
	commentRef.value.focusFn();
}

const clickComment = (e)=>{
	clickReply();
	source.value = {
		...source.value,
		reply_user_id:e.userInfo._id,
		reply_comment_id:e._id,
		reply_user_name:e.userInfo.username		
	}
}


//发布成功后的回调
const replySuccess = ()=>{	
	showToast("发布成功")
	commentPopup.value.close();
	paging.value.refresh();
	source.value = {
		...source.value,
		reply_user_id:currentReply.value.userInfo._id,
		reply_comment_id:currentReply.value._id,
		reply_user_name:currentReply.value.userInfo.username
	}
}


onUnload(()=>{
	uni.removeStorageSync("currentReply")
})
</script>

<style lang="scss" scoped>
.replyLayout{
	.body{
		padding:30rpx 0;
		border-bottom:12rpx solid #F7F7F7;
	}
	.list{
		.row{
			border-bottom:1px solid #F7F7F7;
		}
	}
	.replyBar{
		padding:30rpx;
		border-top: 2rpx solid #e4e4e4;
		background: #fff;
		.out{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				flex:1;
				height: 70rpx;
				background: #f7f7f7;
				border-radius: 70rpx;
				padding:0 20rpx;
				display: flex;
				align-items: center;
				color:#999;
				margin-right:30rpx;
			}
		}
	}
}
</style>

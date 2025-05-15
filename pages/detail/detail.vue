<template>
	<!-- 详情页整体布局容器，只有当item数据存在时才显示 -->
	<view class="detailLayout" v-if="item">		
	    <!-- z-paging组件：用于分页加载评论列表，支持下拉刷新和上拉加载更多 -->
	    <z-paging ref="paging" v-model="commentList" @query="queryList" empty-view-text="抢先回复" empty-view-img="http://cdn.uviewui.com/uview/empty/comment.png">
						
			<!-- 鸡汤详情内容区域 -->
			<view class="soupDetail">
				<!-- 显示鸡汤类型标签 -->
				<soup-tab-group :type="item.soup_type"></soup-tab-group>
				<!-- 显示鸡汤文本内容，lookState为true表示完整显示 -->
				<soup-text-content :lookState="true" :item="item"></soup-text-content>
			</view>
			
			<!-- 广告横幅区域 -->
			<view class="bannerAd">
				<ad unit-id="adunit-bf05c0a93b3fd0d2"></ad>
			</view>

			<!-- 评论列表区域 -->
			<view class="comment">
				<!-- 当有评论数据时显示评论列表 -->
				<view class="list" v-if="commentList.length">
					<view class="row" v-for="item in commentList" :key="item._id">
						<!-- 评论项组件，subReply为true表示显示子回复 -->
						<comment-item :item="item" :subReply="true"></comment-item>
					</view>
				</view>
				<!-- 评论加载中状态显示 -->
				<view v-if="!commentList.length && !noData" style="padding:60rpx">
					<uni-load-more status="loading" :showText="false"></uni-load-more>
				</view>
			</view>
						
			<!-- z-paging的底部插槽，用于固定在页面底部的交互栏 -->
			<template #bottom>
				<view class="interactive">
					<!-- 互动栏组件，type=1表示详情页样式，包含点赞、评论、分享等功能 -->
					<interactive-bar :item="item" :type="1" @comment="handelComment" 
					@share="clickShare"></interactive-bar>
					<!-- 底部安全区域，适配全面屏手机 -->
					<view class="safe-area-bottom"></view>
				</view>
			</template>
			
		</z-paging>
	</view>

	<!-- 评论回复弹出层 -->
	<uni-popup type="bottom" ref="commentPopup">
		<!-- 评论回复组件，用于用户输入评论内容 -->
		<comment-reply ref="commentRef" :source="source" @success="replySuccess"></comment-reply>
	</uni-popup>
	
	<!-- 分享海报弹出组件 -->
	<share-posters ref="shareRef" :info="shareInfo"></share-posters>

</template>

<script setup>
	import {
		nextTick,
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
import { showToast } from '../../utils/common';
    const commentRef =ref(null);
	const commentPopup = ref(null);
	const source = ref({});
	const db = uniCloud.database();
	const dbCmd = db.command;
	const $ = dbCmd.aggregate;
	const item = ref();
	const current_id = uniCloud.getCurrentUserInfo().uid;
	const shareRef = ref(null)
	const shareInfo = ref(null);
	const commentList = ref([]);
	const paging =ref(null);
	const noData = ref(false);
	let id;
	onLoad((e) => {
		e.scene ? id = e.scene :id = e.id		
		getDetail();
	})


	uni.$on('commentLike',(e)=>{
		let index = commentList.value.findIndex(item=>item._id == e._id);
		commentList.value[index] = {
			...commentList.value[index],
			...e
		}
	})
	
	uni.$on("commentRemove",()=>{
		nextTick(()=>{
			paging.value.refresh();
		})		
	})

	const clickShare =(index)=>{
		shareInfo.value = item.value
		shareRef.value.handleShow();
	}


	const queryList = (pageNo, pageSize)=>{
		getComment(pageNo, pageSize)
	}

	const getComment =async (pageNo, pageSize)=>{
		let skip = (pageNo - 1) * pageSize;
		let {result:{errCode,data}} = await db.collection("soup-comments").aggregate()
		.match({
			soup_id:id,
			comment_type:0
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
				id: '$_id'
			},
			pipeline: $.pipeline().match(dbCmd.expr($.eq(['$reply_parent_id', '$$id'])))
			.count('length')
			.done(),
			as: "childCount"
		})
		.lookup({
			from: "soup-comments",
			let: {
				id: '$_id'
			},
			pipeline: $.pipeline().match(dbCmd.expr($.eq(['$reply_parent_id', '$$id'])))
			.lookup({
				from: "uni-id-users",
				let: {
					uid: '$user_id'
				},
				pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id',
					'$$uid'
				]))).project({
					username: 1
				}).done(),
				as: 'userInfo'
			})			
			.project({
				comment_content: $.cond({
					if:$.eq(['$is_delete',true]),
					then:"已被删除",
					else:'$comment_content'
				}),
				userInfo:$.arrayElemAt(['$userInfo', 0])
			})
			.sort({
				like_count:-1
			})
			.limit(2)
			.done(),
			as: "child"
		})
		.lookup({
			from: "soup-like",
			let: {
				commentID: '$_id'
			},
			pipeline: $.pipeline().match(				
			dbCmd.expr(
				$.and([					
					$.eq([id,'$soup_id']),
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
			child:1,
			childCount:$.arrayElemAt(['$childCount.length', 0]),
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
			userInfo: $.arrayElemAt(['$userInfo', 0])
		})
		.end();
		paging.value.complete(data)
		if(data.length==0) noData.value = true;
		console.log(data);
	}
	
	
	const replySuccess = ()=>{
		showToast("发布成功");
		commentPopup.value.close();
		paging.value.refresh();
	}

	const getDetail = async () => {
		let {
			result: {
				errCode,
				data
			}
		} = await db.collection("soup-chicken").aggregate()
			.match({
				status: 1,
				is_delete: dbCmd.neq(true),
				_id:id
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
				from: "soup-like",
				let: {
					soupID: '$_id'
				},
				pipeline: $.pipeline().match(				
				dbCmd.expr(
					$.and([
						$.eq(['$like_type', 0]),
						$.eq(['$$soupID','$soup_id']),
						$.eq(['$user_id',current_id])
					])
				)).count('length')
				.done(),
				as: "likeState"
			})
			.project({
				isLike:$.cond({
					if:$.gt([$.arrayElemAt(['$likeState.length',0]),0]),
					then:true,
					else:false
				}),
				collect_count: 1,
				comment_count: 1,
				content: 1,
				from: 1,
				like_count: 1,
				soup_type: 1,
				view_count: 1,
				userInfo: $.arrayElemAt(['$userInfo', 0])
			})
			.end()

		if (errCode != 0) return showToast("信息有误，请重新刷新", "none");
		console.log(data);
		item.value = data[0];
		source.value = {
			soup_id:item.value._id,
			comment_type:0
		}
	}



	const handelComment = () => {
		commentPopup.value.open();
		commentRef.value.focusFn();
	}
</script>

<style lang="scss" scoped>
	.soupDetail {
		padding: 50rpx 30rpx;
		border-bottom: 12rpx solid #F7F7F7;
	}
	.bannerAd{
		border-bottom: 12rpx solid #F7F7F7;
	}
	.comment {
		
	}

	.interactive {		
		width: 100%;		
		background: #fff;
		border-top: 1px solid #e4e4e4;
	}
</style>
<template>
	<!-- 评论回复组件的根视图 -->
	<view>
		<!-- 评论输入区域的容器 -->
		<view class="commentPopup">
			<!-- 评论输入框 -->
			<input 
				@confirm="onSubmit" <!-- 用户点击软键盘完成按钮时触发提交 -->
				:focus="commentFocus" <!-- 控制输入框是否自动获取焦点 -->
				v-model="commentData.comment_content" <!-- 双向绑定评论内容 -->
				type="text" <!-- 输入框类型为文本 -->
				class="ipt" <!-- 输入框样式类 -->
				:placeholder="commentData.reply_user_name?'回复：'+commentData.reply_user_name:'请输入评论内容'" <!-- 根据是否有回复对象显示不同的占位文本 -->
				maxlength="50"> <!-- 最大输入长度为50个字符 -->
			<!-- 提交按钮 -->
			<view class="button" @click="onSubmit">
				<!-- 发送图标 -->
				<uni-icons type="paperplane" size="26" color="#333"></uni-icons>
			</view>			
		</view>
		<!-- 底部安全区域，适配iPhone X等机型，防止内容被底部指示条遮挡 -->
		<view class="safe-area-bottom" :style="{background:'#fff'}"></view>
	</view>
</template>

<script setup>
import {nextTick, ref} from "vue";
import {useUserStore} from "@/stores/user.js"
const userStore = useUserStore();
const secCheckObj = uniCloud.importObject("secCheckContent",{customUI:true})
const db = uniCloud.database();
const commentData = ref({
	comment_content:""
})
const commentFocus = ref(false);
const props = defineProps({
	source:{
		type:Object,
		default(){
			return {}
		}
	}
})
const emits = defineEmits(["success"]);

const focusFn = ()=>{
	commentFocus.value = false;
	nextTick(()=>{
		commentFocus.value = true;
		commentData.value = {
			...commentData.value,
			...props.source
		}
	})	
}


const onSubmit = async ()=>{
	uni.showLoading()
	let {reply_user_name,..._commentData} = commentData.value;		
	let secRes = await secCheckObj.textSecCheck(commentData.value.comment_content,userStore.userInfo.openid);
	if(secRes.code){
		uni.hideLoading()
		uni.showModal({
			title:secRes.errMsg,
			content:`发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`,
			showCancel:false
		})
		return;
	}
	
	let res = await db.collection("soup-comments").add(_commentData);
	commentData.value.comment_content = ""
	uni.hideLoading()
	emits("success")
	console.log(res);
}


defineExpose({
	focusFn
})
</script>

<style lang="scss" scoped>

.commentPopup{
	background: #fff;
	padding:30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	.ipt{
		background: #f7f7f7;
		height:70rpx;
		flex:1;
		padding:0 20rpx;
		font-size: 28rpx;
		color:#333;
	}
	.button{
		width: 70rpx;
		height: 70rpx;
		margin-left:10rpx;
		display: flex;
		align-items: center;
		justify-content: center;		
	}
}
</style>
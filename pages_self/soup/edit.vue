<!-- 编辑鸡汤页面 就是点进熬制鸡汤再点任何一个鸡汤就行 -->
<template>
	<!-- 状态通知栏：非管理员用户可见，显示当前鸡汤的审核状态和反馈信息 -->
	<view v-if="formData.status != undefined && !isAdminRole()">
		<uni-notice-bar
		:background-color="useStateFormat.bgColor"
		:color="useStateFormat.color" 
		showIcon 
		:text="`通知：${useStateFormat.text}，${(formData.status == 0 || formData.status == 1)?'不允许再次编辑':formData.feedback+'，修改后可再次提交'}。`"></uni-notice-bar>
	</view>
	
	<view class="editLayout">
		<!-- 发布者信息区域：仅管理员可见，显示鸡汤提交者的信息 -->
		<view class="row" v-if="formData.user_id && isAdminRole()">
			<view class="head">
				<view class="title">发布者</view>				
			</view>
			
			<view class="body">
				<view class="userinfo">
					<image class="pic" :src="formData?.user_id[0]?.avatar || '../../static/images/defAvatar.png'" mode="aspectFill"></image>
					<text class="name">{{formData?.user_id[0]?.username || '匿名'}}</text>
				</view>
			</view>
		</view>
		
		
		
		
		
		<!-- 鸡汤类型选择区域：单选按钮组，选择毒鸡汤或心灵鸡汤 -->
		<view class="row">
			<view class="head">
				<view class="title">鸡汤类型</view>				
			</view>
			<view class="body">
				<radio-group @change="radioChange">
					<label class="radio">
						<radio :disabled="disabled || statusDisabled" :value="0" color="#4F9153" :checked="formData.soup_type==0"></radio>毒鸡汤
					</label>
					<label class="radio">
						<radio :disabled="disabled || statusDisabled" :value="1" color="#f83162" :checked="formData.soup_type==1"></radio>心灵鸡汤
					</label>
				</radio-group>
			</view>
		</view>
		
		<!-- 鸡汤内容输入区域：文本框，用于输入鸡汤内容 -->
		<view class="row">
			<view class="head">
				<view class="title">鸡汤内容</view>
				<text class="subTitle">
					1.一行不超过12个字，最多5行\n
					2.毒鸡汤、心灵鸡汤、有感而发均可\n
					3.提交后管理员审核，有可能会微调
				</text>
			</view>
			<view class="body">
				<textarea :disabled="disabled || statusDisabled" v-model="formData.content" class="soupConent" placeholder="编写你的鸡汤吧~~"></textarea>
			</view>
		</view>
		
		
		<!-- 出处输入区域：用于标注鸡汤内容的来源 -->
		<view class="row">
			<view class="head">
				<view class="title">添加出处</view>
				<text class="subTitle">
					如果是摘抄的，建议添加出处
				</text>
			</view>
			<view class="body">
				<input :disabled="disabled || statusDisabled" v-model="formData.from" class="fromIpt" type="text" placeholder="如:《红楼梦》">
			</view>
		</view>
		
		
		<!-- 审核状态选择区域：仅管理员可见，用于设置鸡汤的审核状态 -->
		<view class="row" v-if="isAdminRole() && formData._id">
			<view class="head">
				<view class="title">鸡汤状态</view>				
			</view>
			<view class="body">
				<radio-group @change="statusChange"> <!-- radio是单选框 -->
					<label class="radio" v-for="item in stateLists" :key="item.value">
						<view><radio :color="item.color" :value="item.value" 
						:checked="item.value == formData.status" />
						<text>{{item.text}}</text></view> 
					</label> 
				</radio-group>
				<!-- 不通过原因输入框：当状态为不通过时显示 -->
				<input v-if="formData.status===2" :disabled="disabled || statusDisabled" v-model="formData.feedback" class="fromIpt" type="text" placeholder="请输入不通过的原因">
			</view>
		</view>
		
		
		<!-- 提交按钮区域：根据用户角色显示不同的按钮文本 -->
		<view class="row btnGroup">			
			<view class="body">
				<button type="primary" v-if="isAdminRole()" @click="onSubmit" :disabled="statusDisabled">发布鸡汤</button> <!-- 根据是否是管理员决定是发布鸡汤还是提交审核 -->
				<button type="primary" v-else @click="onSubmit" :disabled="statusDisabled">提交审核</button>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { ref,computed } from 'vue';
import {showToast,stateFormat,isAdminRole,stateLists} from "@/utils/common.js"
import {removeHtmlTags,formatDate} from "@/utils/tools.js"
import {onLoad} from "@dcloudio/uni-app"
import {useUserStore} from "@/stores/user.js"
const userStore = useUserStore();
const useStateFormat =  computed(()=>stateFormat(formData.value.status));
const soupScore = uniCloud.importObject("soup-score")
const subscribemsg = uniCloud.importObject("subscribemsg")
const db = uniCloud.database();
const formData = ref({
	soup_type:0,
	content:"",
	from:"",
	feedback:''
})
const disabled = ref(false);
const statusDisabled = ref(false);
let id;

onLoad((e)=>{	
	id = e.id
	if(id){
		uni.showLoading({
			title:"加载中...",
			mask:true
		})
		getDetail();
		uni.setNavigationBarTitle({
			title:"编辑鸡汤"
		})
	}
})

//鸡汤类型
const radioChange = (e)=>{	
	formData.value.soup_type = Number(e.detail.value);
}


//审核状态修改
const statusChange = (e)=>{	
	formData.value.status = Number(e.detail.value);
	if(formData.value.status!=2) formData.value.feedback = ''
}


const onSubmit = async ()=>{
	if(!isAdminRole()){
		await uni.requestSubscribeMessage({
			tmplIds: ["B5Y1YX8q2WhPV1qSOD0lOlGenO2J5L79NKPWFUZMO5w"]		
		});
	}	
	
	try{
		disabled.value = true;
		uni.showLoading({
			title:"提交中"
		})
		formData.value.content = removeHtmlTags(formData.value.content);	
		if(formData.value.content==="") return showToast('鸡汤内容不能为空',"none",false);		
		let errCode,res
		let {soup_type,status,content,from,feedback} = formData.value;
		let _formData = {soup_type,status,content,from,feedback};
		if(id){
			if(!isAdminRole()) _formData.status = 0;
			if(isAdminRole()) _formData.review_uid = userStore.userInfo._id;
			res = await db.collection("soup-chicken").doc(id).update(_formData);			
		}else{
			if(isAdminRole()) formData.value.status = 1;
			res = await db.collection("soup-chicken").add(formData.value);
			
		}		
		errCode = res.result.errCode;
					
		if(errCode === 0){
			uni.$emit("soupUpdate",{msg:"更新了"});
			showToast("发表成功","success");			
			setTimeout(()=>uni.navigateBack(),1000)
			updataSuccess(res.result.id)
		}		
	}catch(e){		
		console.log(e);
		showToast(e.errMsg,"error")
	}finally{
		uni.hideLoading();
		disabled.value = false;
	}	
	
}


const  updataSuccess = (soupID)=>{	 
		
	if(id || isAdminRole()){	
		if(formData.value.status===1){
			let {user_id:[{_id:user_id=uniCloud.getCurrentUserInfo().uid}={}]=[],_id:soup_id=soupID} = formData.value || {}
			soupScore.soupAdd({user_id,soup_id})
		}
	}
	if(id && isAdminRole()){
		// 发送消息
		subscribemsg.sendSubscribeMessage({
			user_id:formData.value.user_id[0]._id,
			phrase2:useStateFormat.value.text,
			time3:formatDate(Date.now()),
			thing4:formData.value.feedback?formData.value.feedback:"点击进入小程序查看"
		}).then(res=>{
			console.log(res);
		})
	}	
}


//获取单条数据
const getDetail = async()=>{
	
	let soupTemp = await db.collection("soup-chicken").where({_id:id}).getTemp();
	let userTemp = await db.collection("uni-id-users").field("_id,username,avatar").getTemp();
	
	let {result:{errCode,data}} = await db.collection(soupTemp,userTemp).get();
		
	console.log(data[0]);
	if(errCode === 0){
		formData.value = data[0]
		if(formData.value.status !==2 && !isAdminRole()) statusDisabled.value = true;
	}
	uni.hideLoading()
}
</script>

<style lang="scss" scoped>
.editLayout{
	padding:30rpx;
	.row{
		padding-bottom:30rpx;
		.head{
			padding:20rpx 0;
			.title{
				font-size: 34rpx;
				padding-left:20rpx;
				position: relative;
				padding-bottom:6rpx;
				&::before{
					content: "";
					display: block;
					width: 8rpx;
					height: 30rpx;
					background: $brand-theme-color;
					position: absolute;
					left:0;
					top:calc(50% - 15rpx);
					border-radius: 10rpx;
				}
			}
			.subTitle{
				font-size: 26rpx;
				color:$text-font-color-3;
			}
		}
		.body{
			.userinfo{
				display: flex;
				align-items: center;
				.pic{
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
				.name{
					padding-left:10rpx;
				}
			}
			.radio{
				margin-right:30rpx;
				radio{
					transform: scale(0.9);
				}
			}
			.soupConent{
				border:1px solid $border-color;
				width: 100%;
				height: 400rpx;
				background: #FCFCFC;
				padding:20rpx;
				border-radius: 10rpx;
				font-size: 50rpx;
				line-height: 1.7em;
			}
			.fromIpt{
				border:1px solid $border-color;
				height: 80rpx;
				padding:0 20rpx;
				border-radius: 10rpx;
				background: #FCFCFC;
			}
		}
	}
	
	.btnGroup{
		padding-top:60rpx;
	}
}

[disabled]:not(button){
	color:#bbb;
}
</style>

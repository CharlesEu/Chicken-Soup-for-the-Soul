<!-- 审核鸡汤页面 - 管理员专用页面，用于审核用户提交的鸡汤内容 -->
<template>
	<view class="reviewed">
		<!-- z-paging-swiper组件：结合分页和轮播功能的容器 -->
		<z-paging-swiper>
			<!-- 顶部插槽：放置标签页组件 -->
			<template #top>				
				<!-- 标签页组件：显示不同状态的鸡汤分类（如待审核、已通过、已拒绝等） -->
				<z-tabs :current="current" ref="tabs" :list="tabList" @change="tabsChange"></z-tabs>
			</template>
			<!-- 轮播组件：根据当前选中的标签页显示对应内容 -->
			<swiper :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
				<!-- 循环渲染每个状态对应的轮播项 -->
				<swiper-item v-for="(item,index) in stateLists" :key="index">
					<!-- 鸡汤列表子组件：显示对应状态的鸡汤列表 -->
					<soup-list :tabIndex="index" :currentIndex="current"></soup-list>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script setup>
import {isAdminRole, stateLists} from "@/utils/common.js"
import { computed, ref } from "vue";
if(!isAdminRole()){
	uni.reLaunch({
		url:"/pages/index/index"
	})
	throw new Error('error')
}
const tabs =ref(null);
const tabList = computed(()=>stateLists.map(item=>({...item,name:item.text})))
const current = ref(0);
const swiperTransition = (e)=>{	
	tabs.value.setDx(e.detail.dx)
}
const swiperAnimationfinish = (e)=>{
	current.value = e.detail.current;
	tabs.value.unlockDx();	
}

const tabsChange =(e)=>{
	current.value = e	
}
</script>

<style lang="scss" scoped>
.reviewed{
	swiper{
		height: 100%;
	}
}
</style>

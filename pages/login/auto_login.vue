<template>
	<view class="">
		
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		useUserStore
	} from "@/stores/user.js"
	const userStore = useUserStore();
	const uniIdCo = uniCloud.importObject('uni-id-co')
	

	let uniIdRedirectUrl;
	onLoad(async (e) => {
		
		uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
			
		let login = await uni.login()
		let res = await uniIdCo.loginByWeixin({
			code: login.code
		})
		userStore.loginSuccess({
			...res,
			showToast: false,
			uniIdRedirectUrl
		});	



	})
</script>

<style lang="scss" scoped>

</style>
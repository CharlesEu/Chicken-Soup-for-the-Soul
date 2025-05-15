import {ref} from "vue"
import { defineStore } from 'pinia';
const uniIdCo = uniCloud.importObject("uni-id-co")
const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')

export const useUserStore = defineStore("user",()=>{
	let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo')||{}
	const userInfo = ref(hostUserInfo);
	const hasLogin= ref(Object.keys(hostUserInfo).length != 0);
	
	
	// data不为空，表示传递要更新的值(注意不是覆盖是合并),什么也不传时，直接查库获取更新
	async function updateUserInfo(data = false) {
		if (data) {
			usersTable.where('_id==$env.uid').update(data).then(e => {
				// console.log(e);
				if (e.result.updated) {
					uni.showToast({
						title: "更新成功",
						icon: 'none',
						duration: 3000
					});
					setUserInfo(data)
				} else {
					uni.showToast({
						title: "没有改变",
						icon: 'none',
						duration: 3000
					});
				}
			})
	
		} else {
			const uniIdCo = uniCloud.importObject("uni-id-co", {
				customUI: true
			})
			try {
				let res = await usersTable.where("'_id' == $cloudEnv_uid")
				.field('mobile,username,email,avatar,wx_openid.mp as openid,register_date')
				.get()
	
				const realNameRes = await uniIdCo.getRealNameInfo()
	
				// console.log('fromDbData',res.result.data);
				setUserInfo({
					...res.result.data[0],
					realNameAuth: realNameRes
				})
			} catch (e) {
				setUserInfo({},{cover:true})
				console.error(e.message, e.errCode);
			}
		}
	}
	
	
	async function setUserInfo(data, {cover}={cover:false}) {
		// console.log('set-userInfo', data);
		let _userInfo = cover?data:Object.assign(userInfo.value,data)
		userInfo.value = Object.assign({},_userInfo)
		hasLogin.value = Object.keys(userInfo.value).length != 0
		// console.log('store.userInfo', store.userInfo);
		uni.setStorageSync('uni-id-pages-userInfo', userInfo.value)
		return data
	}
	
	
	async function logout() {
		// 1. 已经过期就不需要调用服务端的注销接口	2.即使调用注销接口失败，不能阻塞客户端
		if(uniCloud.getCurrentUserInfo().tokenExpired > Date.now()){
			try{
				await uniIdCo.logout()
			}catch(e){
				console.error(e);
			}
		}
		uni.removeStorageSync('uni_id_token');
		uni.setStorageSync('uni_id_token_expired', 0)		
		uni.$emit('uni-id-pages-logout')
		setUserInfo({},{cover:true})
	}
	
	//登录后的操作
	function loginSuccess(e = {}){
		const {
			showToast = true, toastText = '登录成功', autoBack = true, uniIdRedirectUrl = '', passwordConfirmed
		} = e
		// console.log({toastText,autoBack});
		if (showToast) {
			uni.showToast({
				title: toastText,
				icon: 'none',
				duration: 3000
			});
		}
		updateUserInfo()	
		uni.$emit('uni-id-pages-login-success')	
		
		if (autoBack) {
			loginBack({uniIdRedirectUrl})
		}
	}
	
	
	
	
	function loginBack (e = {}) {
		const {uniIdRedirectUrl = ''} = e
		let delta = 0; //判断需要返回几层
		let pages = getCurrentPages();
		// console.log(pages);
		pages.forEach((page, index) => {
			if (pages[pages.length - index - 1].route.split('/')[3] == 'login') {
				delta++
			}
		})
		// console.log('判断需要返回几层:', delta);
		if (uniIdRedirectUrl) {
			return uni.redirectTo({
				url: uniIdRedirectUrl,
				fail: (err1) => {
					uni.switchTab({
						url:uniIdRedirectUrl,
						fail: (err2) => {
							console.log(err1,err2)
						}
					})
				}
			})
		}
		// #ifdef H5
		if (e.loginType == 'weixin') {
			// console.log('window.history', window.history);
			return window.history.go(-3)
		}
		// #endif
	
		if (delta) {
			const page = pagesJson.pages[0]
			return uni.reLaunch({
				url: `/${page.path}`
			})
		}
	
		uni.navigateBack({
			delta
		})
	}
	
	
	
			
	return {userInfo,hasLogin,loginSuccess,updateUserInfo,logout}
})

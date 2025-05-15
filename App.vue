<script setup>
import 'dayjs/locale/zh-cn';
import {onLaunch,onShow,onHide} from "@dcloudio/uni-app"
import {useUserStore} from "@/stores/user.js"

const uniIdCo = uniCloud.importObject('uni-id-co')
const userStore = useUserStore()
onLaunch(()=>{
	if((uniCloud.getCurrentUserInfo().tokenExpired - Date.now()) < 1000*60*60*5 ){
		userStore.logout();
	};	
	 
})

onShow(()=>{
	console.log('App Show')
})

onHide(()=>{
	console.log('App Hide')
})

</script>

<style lang="scss">
@import "common/style/common-style.scss";
@import "@/static/fonts/iconfont.css";
</style>

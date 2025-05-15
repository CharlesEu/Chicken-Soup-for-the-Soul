const configCenter = require("uni-config-center/uni-id/config.json")
const {appid,appsecret} = configCenter['mp-weixin']['oauth']['weixin'];
module.exports = {
	_before:async function () { // 通用预处理器
		let {data:{access_token}} = await uniCloud.httpclient.request("https://api.weixin.qq.com/cgi-bin/token",{
			method:"get",
			dataType:"json",
			data:{
				grant_type:"client_credential",
				appid,
				secret:appsecret
			}
		})
		this.access_token = access_token
	},
	async getUnlimited(opts={}){
		let {scene=1,page="pages/index/index",width=200,line_color={"r":0,"g":0,"b":0},auto_color=false} = opts
		let {data} =await uniCloud.httpclient.request("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token="+this.access_token,{
			method:"POST",
			dataType:"buffer",
			contentType:"json",
			data:{
				scene,
				page,
				width,
				line_color,
				auto_color
			}
		})
		
		return "data:image/jpeg;base64,"+data.toString('base64');
	}
	
}

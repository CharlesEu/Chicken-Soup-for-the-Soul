const UniSubscribemsg = require('uni-subscribemsg');
module.exports = {
	_before: function () { // 通用预处理器

	},
	async sendSubscribeMessage(params){
		const dbJQL = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data:{username,openid}} = await dbJQL.collection("uni-id-users").where(`_id == "${params.user_id}"`).field("username,wx_openid.mp as openid").get({getOne:true});
		
		
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__23B3761",
			provider: "weixin-mp",
		});
		// 发送订阅消息
		uniSubscribemsg.sendSubscribeMessage({
			touser:openid,
			template_id: "B5Y1YX8q2WhPV1qSOD0lOlGenO2J5L79NKPWFUZMO5w",
			page: "pages_self/soup/list", // 小程序页面地址
			miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			lang: "zh_CN",
			data: {
				thing1: {
					value: username
				},
				phrase2: {
					value: params.phrase2
				},
				time3: {
					value: params.time3
				},
				thing4: {
					value: params.thing4
				}
			}
		});
	}
}

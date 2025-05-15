const { promises } = require('fs');
const UniSecCheck = require('uni-sec-check');
const db = uniCloud.database();
module.exports = {
	_before: function () { // 通用预处理器

	},
	//文字校验
	async textSecCheck(content,openid,scene=2,version=2){
		const uniSecCheck = new UniSecCheck({ // 创建内容安全检测模块实例
			provider: 'mp-weixin', // 指定所使用服务的提供商，目前仅支持mp-weixin
			requestId: this.getUniCloudRequestId()
		})
		let checkRes =  await uniSecCheck.textSecCheck({
		    content, // 文本内容，不可超过500KB
		    openid, // 用户的openid
		    scene, // 场景值
			version
		})			
		if(checkRes.errCode ==='uni-sec-check-risk-content'){
			return {
				code:400,
				errMsg:'内容不合规',
				result:checkRes.result
			}
		}else if(checkRes.errCode){
			return {
				code:400,
				errMsg:checkRes.errMsg,
				result:checkRes.result
			}
		}			
		return {
			errCode:0,
			errMsg:'正常'
		};
		
	},
	async imgSecCheck({picurls,openid,scene=2,version = 2,coop_id}={}){
		const uniSecCheck = new UniSecCheck({
			provider: 'mp-weixin',
			requestId: this.getUniCloudRequestId(), // 云函数内则写 context.requestId
		});		
		
		for (let image of picurls) {
			let res = await uniSecCheck.imgSecCheck({
				image,
				openid,
				scene,
				version
			})			
			await db.collection("sec-check-img-log").add({
				coop_id,
				picurl:image,
				traceId:res.traceId,
				state:0,
				publish_date:Date.now()
			})
		}		
				
	}
}

// 增加积分
module.exports = {
	_before: function () { // 通用预处理器

	},
	async soupAdd(params){
		const db = uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})		
		let res1 =  await db.collection("soup-scores").where(`user_id == "${params.user_id}"`).orderBy("create_date","desc").limit(1).get();		
		let balance = 0
		if(res1.data.length){
			balance = res1.data[0].balance
		}		
		let res2 = await db.collection("soup-scores")
		.where(`user_id == "${params.user_id}" && soup_id == "${params.soup_id}"`).count();
		if(res2.total!=0){
			return {errMsg:"积分重复"}
		}			
		return await db.collection("soup-scores").add({
			...params,
			score:10,
			type:1,
			comment:"鸡汤投稿奖励",
			balance:balance+10
		})
	}
}

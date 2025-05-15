const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	trigger: {
		beforeCreate:async function({
			collection,
			operation,
			addDataList,
			clientInfo
		}){
			const addDataItem = addDataList[0];		
			const publish_ip = addDataItem.publish_ip;	
			
			let {data:{pro:publish_address}} = await uniCloud.request({
				url:"https://whois.pconline.com.cn/ipJson.jsp?ip="+publish_ip+"&json=true"
			})
			addDataItem.publish_address = publish_address			
		}		
		
		
		


	}
}
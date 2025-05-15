// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();	
module.exports = {
	_before: function () { // 通用预处理器

	},
	async userRead(){
		
		
	},	
	_timing:async function (param) {		
		let {data}= await db.collection("soup-today").get();
		let arrs=[];
		for(let i=0; i<data.length;i++){
			let item = data[i];
			if(item.soup_list.length){
				let idList = item.soup_list.filter(soup=>soup.is_read==true)
				.map(soup=>({soup_id:soup._id,user_id:item.user_id}))				
				arrs.push(db.collection("soup-user-read").add(idList))	
			}								
		}				
		await Promise.all(arrs);
		let remove =await db.collection("soup-today").remove();
		return remove;
	}
}

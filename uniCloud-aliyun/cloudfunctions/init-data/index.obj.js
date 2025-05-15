const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () { // 通用预处理器

	},
	async removeUserRead(){
		let res = await db.collection("soup-user-read").where({
			_id:dbCmd.nin(['661aad0f7ad52dfccc7ee464','661aad3999c6244dcfc08a44'])
		}).remove();
		return res;
	},
	async nicknameToUsername(){
		
		
		
		
		let arrs = []
		let res = await db.collection('uni-id-users').where({
			avatar_file:dbCmd.neq(null)
		}).skip(0).limit(100).get();
		
		
		 for(let i =0; i<res.data.length; i++){
			   let avatar_file = res.data[i].avatar_file;
			   let id = res.data[i]._id;
			   let row = await db.collection("uni-id-users").doc(id).update({				   
					avatar:avatar_file.url
			   })
			   arrs.push(row)
		 } 
		 
		 return arrs.length;
		 
		
		/*	
		
		let userList = []; // 所有用户列表
		let limit = 100; // 每次查询的数量
		let offset = 0; // 偏移量	
		let {total} = await db.collection('uni-id-users').where({username:dbCmd.not(dbCmd.neq(null))}).count(); // 总数量	
				
		do {
		  let res = await db.collection('uni-id-users').where({username:dbCmd.not(dbCmd.neq(null))}).skip(offset).limit(limit).get();
		  
		   for(let i =0; i<res.data.length; i++){
			   let nickname = res.data[i].nickname;
			   let row = await db.collection("uni-id-users").doc(res.data[i]._id).update({
				   username:nickname
			   })
		   } 
		
		  offset += limit; // 更新偏移量
		} while (offset < total);
		
		return offset		
		*/
	}
}

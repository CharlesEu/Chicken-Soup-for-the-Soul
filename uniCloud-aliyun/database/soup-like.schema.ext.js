const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	trigger: {
		//新增like记录触发
		afterCreate: async function({
			collection,
			operation,
			docId,
			updateData,
			clientInfo,
			addDataList
		} = {}) {
			let [{
				soup_id,
				like_type,
				comment_id
			}] = addDataList;
			
			if(like_type==0){
				db.collection("soup-chicken").doc(soup_id).update({
					like_count: dbCmd.inc(1)
				})
			}else if(like_type == 1){
				db.collection("soup-comments").doc(comment_id).update({
					like_count: dbCmd.inc(1)
				})
			}
			
			
		},
		//删除like点赞记录触发
		afterDelete: async function({
			collection,
			operation,
			docId,
			updateData,
			clientInfo,
			where
		} = {}) {
			let {
				soup_id,
				like_type,
				comment_id
			} = where
			
			if(like_type == 0){
				db.collection("soup-chicken").doc(soup_id).update({
					like_count: dbCmd.inc(-1)
				})
			}else if(like_type==1){
				db.collection("soup-comments").doc(comment_id).update({
					like_count: dbCmd.inc(-1)
				})
			}
			
		}


	}
}
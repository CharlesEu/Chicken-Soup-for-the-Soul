// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
// article.schema.ext.js
const db = uniCloud.database();
const dbCmd = db.command;

module.exports = {
	trigger: {
		afterRead: async function({
			collection,
			operation,
			where,
			field,
			result
		} = {}) {			
			let ids = result.data.map(item=>item._id);				
			db.collection("soup-chicken").where({
				_id:dbCmd.in(ids)
			}).update({				
				view_count:dbCmd.inc(3)
			})
		},

		beforeUpdate: async function({
			collection,
			operation,
			docId,
			updateData,
			clientInfo
		} = {}) {
			if (typeof docId === 'string') {
				updateData.last_modify_date = Date.now() // 更新数据的update_date字段赋值为当前服务器时间
			}
		}
	}
}
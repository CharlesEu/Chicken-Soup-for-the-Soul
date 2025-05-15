'use strict';
const crypto = require('crypto');


function getSignature(token, timestamp, nonce, msgEncrypt) {
	const str = [token, timestamp, nonce, msgEncrypt].sort().join('')
	return crypto.createHash('sha1').update(str).digest("hex")
}

function PKCS7Decode(buf) {
	let padSize = buf[buf.length - 1]
	return buf.slice(0, buf.length - padSize)
}

function decryptMsg(encodingAESKey, msgEncrypt) {
	const key = Buffer.from(encodingAESKey + '=', 'base64')
	const iv = key.slice(0, 16)

	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	decipher.setAutoPadding(false)

	let deciphered = Buffer.concat([decipher.update(msgEncrypt, 'base64'), decipher.final()])

	deciphered = PKCS7Decode(deciphered)

	const content = deciphered.slice(16)
	const length = content.slice(0, 4).readUInt32BE(0)

	return {
		message: JSON.parse(content.slice(4, length + 4).toString()),
		appId: content.slice(length + 4).toString()
	}
}
exports.main = async function(event, context) {
	const db = uniCloud.database();
	const {
		signature: signature,
		timestamp: timestamp,
		nonce: nonce,
		echostr: echostr
	} = event.queryStringParameters	
	let body = ''
	if (event.body !== '') {
		body = JSON.parse(event.body)
	}
	let result = body	
	const tmpStr = getSignature('xianxiami', timestamp, nonce)
	
	
	
    
	if (signature === tmpStr) {
		// 验证是从微信发来的消息
		if (body.Encrypt) {
			const decrypt = decryptMsg('mkrJ11nIa37utQeohIXgVgmZMgc6mcMeWwa1lyfOavA', body.Encrypt);
			//返回的所有数据
			result = decrypt.message
			//根据图片校验返回的审核ID，比对图片日志表，获取满足条件的数据，作为后续增删改查的依据
			let imgLogs = await db.collection("sec-check-img-log").where({traceId:result.trace_id}).get();
			let coop_id = imgLogs.data[0].coop_id;		
			let picurl = imgLogs.data[0].picurl;
			
			
			
			//图片合规处理函数
			if (result.result.suggest == 'pass') {
				//根据图片日志返回的coop_id获取圈子表中对应指定的数据
				let res = await db.collection("chicken-coop").where({
					_id:coop_id
				}).get();
				//修改图片状态，没必要可以删除
				await db.collection("sec-check-img-log").where({traceId:result.trace_id}).update({state:1});
				//只用状态为0草稿箱的才能修改圈子状态，1通过的不再修改，-1不通过的也过滤掉
				if(res.data[0].status==0){						
					await db.collection("chicken-coop").where({
						_id:coop_id
					}).update({
						status:1
					});		
				}					
			}
			
			//图片违规的处理函数
			if (result.result.suggest == 'risky') {
				//图片违规，立即将发布的圈子状态改为-1为审核不通过
				await db.collection("chicken-coop").where({
					_id:coop_id
				}).update({
					status:-1
				});
				//将图片日志的状态改为-1为不通过
				await db.collection("sec-check-img-log").where({traceId:result.trace_id}).update({state:-1});
								
			}
		}
		return 'success'
	} else {
		return 'success'
	}


}
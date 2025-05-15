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
	const {
		signature: signature,
		timestamp: timestamp,
		nonce: nonce,
		echostr: echostr
	} = event.queryStringParameters


	const tmpStr = getSignature('xianxiami', timestamp, nonce)

	if (signature === tmpStr) {
		return echostr
	} else {
		return 
	}
}
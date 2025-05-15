// 获取 extStorageManager 对象实例
const extStorageManager = uniCloud.getExtStorageManager({
	provider: "qiniu",
	domain: "soupcdn.qingnian8.com", // 域名地址
});
module.exports = {
	_before: function () { // 通用预处理器
		if(this.getClientInfo().appId!='__UNI__23B3761') throw new Error("没有权限");		
	},
	//上传图片
	getUploadFileOptions(data = {}) {		
		let { 
			cloudPath, // 前端传过来的文件路径
		} = data;
				
		// 最后调用 extStorageManager.getUploadFileOptions
		let uploadFileOptionsRes = extStorageManager.getUploadFileOptions({
			cloudPath: cloudPath,
			allowUpdate: false, // 是否允许覆盖更新，如果返回前端，建议设置false，代表仅新增，不可覆盖
			fsizeLimit:10485760
		});
		return uploadFileOptionsRes;
	},
	
	deleteFile(fileList = []){
		let res = extStorageManager.deleteFile({
			fileList// 待删除的文件地址列表
		});
		return res;
	}
}

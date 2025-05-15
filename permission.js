const db = uniCloud.database();


db.on("error",({code,message})=>{
	if(code == 'TOKEN_INVALID_ANONYMOUS_USER'){
	 	console.log(code);
	}
	if(code == 'PERMISSION_ERROR'){		
		uni.showModal({
			title:"警告",
			content:message,
			showCancel:false,
			success:res=>{
				if(res.confirm){
					uni.reLaunch({
						url:"/pages/index/index"
					})
				}
			}
		})		
	}
	console.log(code);
	console.log(message);
})

//封装弹窗
export function showToast(title="",icon="none",mask=true){
	let posttion = icon=='none' ? 'bottom' :"center";
	uni.showToast({
		title,
		icon,
		mask,
		posttion
	})
}


//审核状态组
export const stateLists = [{
	"value": 0,
	"text": "审核中",
	"color":"#F3A73F",
	"bgColor":"#FDEDD9"
},
{
	"value": 1,
	"text": "审核通过",
	"color":"#18BC37",
	"bgColor":"#D1F2D7"
},
{
	"value": 2,
	"text": "审核不通过",
	"color":"#E43D33",
	"bgColor":"#FAD8D6"
}]
//传入value值返回，状态对象
export function stateFormat(value){
	return stateLists.find(item=>item.value == value)
}

//判断管理员角色是否 
export function isAdminRole(){
	//unicloud内置的函数
	 return uniCloud.getCurrentUserInfo().role.includes('admin') ? true : false;
}


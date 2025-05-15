# 每日鸡汤小程序开发


### 1.将项目在HBuilder软件打开

### 2.在项目根目录下执行安装依赖

```
npm install
```
### 3.在uniCloud文件目录单击右键“关联云服务空间”

- 如果服务空间列表是空的，去新建一个'阿里云'的服务空间

- 如果存在服务空间，对业务不熟练，最好还行选择新建一个空白的

### 4.修改uni-id配置项，cloudfunctions->common->uni-config-center->uni-id->config.json

修改"mp-weixin"下的"weixin"内的appid和appsecret；

如果没有appid和appsecret，需要去注册  [https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)

### 5.对uniCloud内的两个目录cloudfunctions和database单击右键上传

如果出现弹窗，提示云端已存在，一律选择覆盖即可

### 6.根目录下找到manifest.json，点击‘微信小程序配置’，填入appid

此步骤就是为了将uniCloud云端的appid和客户端的appid想统一，不统一会出现无法运行的错误。

### 7.软件菜单，执行运行->运行到微信小程序模拟器

### 8.部署完成，可查看最终效果




#一个简单的对话框插件
基于jquery,样式、方法等还需要优化

#使用方法
```
//初始化
$('#dialog').dialog({
	title:'对话框示例',
	closecallback:function(){
		alert("对话框关闭了");
	},
	closebt:true,//是否有右上角叉叉
	close:true//初始关闭状态
});

$('#dialog').dialog('close',false)//打开对话框
$('#dialog').dialog('close',true)//关闭对话框
```
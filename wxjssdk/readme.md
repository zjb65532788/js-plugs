#微信jssdk 简单的封装
支持cmd模块加载,需要zepto或者jquery支持
使用方法
```
//非cmd
<script type="text/javascript" src="zepto.js"></script>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
/*wxjs.js中需要指定  请求微信config参数的接口地址，这里我们是jsonp方式请求
	function wxconfig(options) {
		var param = "url=" + window.location.href,
			url = "";//将url 替换成自己的地址即可
*/
<script type="text/javascript" src="wxjs.js"></script>
<script type="text/javascript">
	//使用1
	wxconfig({'chooseImage':option});//上传图片
	//或者
	$('#uploadimg').uploadwximg(option);
</script>
```

```
//cmd模块加载
<script type="text/javascript" src="zepto.js"></script>
<script type="text/javascript" src="seajs.js"></script>
<script type="text/javascript">
	seajs.use('wxjs',function(wxconfig){
		//使用1
		wxconfig({'chooseImage':option});//上传图片
		//或者
		$('#uploadimg').uploadwximg(option);
	});
</script>
```

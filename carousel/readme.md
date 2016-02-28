#轮播小插件
需要zepto、html5支持、若要支持非html5还需要改进一下方法、用jquery animation或者原生方法写

#使用方法

```
<div id="alumbscontainer" style="height:200px">
    <div class="item" style=""><img src="images/1.jpg" ></div>
    <div class="item" style=""><img src="images/2.jpg"></div>
    <div class="item" style=""><img src="images/3.jpg"></div>
</div>
```

```
$(function(){
    var demomove=new alumbs({container:$('#alumbscontainer')});
});
```

#参数
```
{//默认配置
	'container':$('#alumbscontainer'),//父容器
	'height':null,//高度 默认根据高度最小的图片来
	'interval':true,//是否自动播放
	'dote':true//轮播下标
}
```
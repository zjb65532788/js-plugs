#整屏切换小插件
使用于移动端、pC端（需要html5支持、zepto类库支持）
#使用方法
```html

<div class="main">
    <section class="allscreen pa active" style="background:red">
        1
    </section>
    <section class="allscreen pa" style="background-color:#fff4e5">
        2
    </section>
    <section class="allscreen pa"  style="background:#EEE">
        3
    </section>
</div>
```
```js

var demomove=new move_screen({
    obj:$('.allscreen'),//每一屏的jquery对象
    type:1//切换类型，现在支持3中 0为上下滑动切换、1为3d旋转切换、2为淡入淡出切换
});
```

#配置参数
```
new move_screen({
	'obj':null,//触屏滚动系列对象 jquery对象 如 $('.allscreen');
	'beforemove':function(){},//移动前事件
	'moving':function(){},//移动中事件
	'aftermove':function(){},//移动后事件
	'movestop':false,//移动停止状态 true为停止，false为移动
	'isdocument':true,//touchstart or mousedown 注册到哪个对象 true 直接注册到 $(document)
	'czy':20,//移动阀值 超过阀值松手才会换一屏 否则复位
	'time':500,//松开时移动的时间 默认500ms
	'type':0//0为翻页效果,1为翻滚效果
});
```
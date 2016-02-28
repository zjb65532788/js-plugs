/*轮播插件,需要jquery 支持*/
function alumbs(params) {
	this.defaults=$.extend({},t.defaults,params);
	this.init();
}
alumbs.prototype={
	'defaults':{//默认配置
		'container':$('#alumbscontainer'),//父容器
		'alumbsitem':$('.alumbsitem'),
		'width':'',//没有设置宽度，则为container的宽度
		'height':'100%',//高度 默认百分百
		'interval':false//是否自动播放
	},
	'index':0,//索引
	'movepd':true,//是否移动
	'init':function(){//初始化
		var t=this;
		if (t.defaults.container.length<1) {
			console.log("请设置父元素");
		}
		t.setstyle();
		if () {
			
		}
	},
	'setstyle':function(){//设置轮播样式等等
		addCss(".alumbscontainer{position:relative}/
				.alumbsitem{position:absolute;top:0;left:0;visibility:hidden;}
			");
		var t=this,
			itemwidth;//轮播图宽度
		if (t.defaults.width) {
			itemwidth=t.defaults.width;
		}else{
			itemwidth=t.defaults.container.width();
		}
		t.defaults.alumbsitem.css({width:itemwidth}).addClass('alumbsitem');
		t.defaults.eq(t.index).css({'visibility':'visible'});
	}
}
function addCss() {
	var doc, cssCode;

	if (arguments.length == 1) {
		doc = document;
		cssCode = arguments[0];
	} else if (arguments.length == 2) {
		doc = arguments[1];
		cssCode = arguments[0];
	} else {
		alert("请输入一至两个参数参数");
	}

	var head = doc.getElementsByTagName("head");
	if (head.length > 0) {
		head = head[0];
	} else {
		head = doc.createElement("head");
		var html = doc.getElementsByTagName("html")
		html.insertBefore(head, html.firstChild);
	}
	var style = head.getElementsByTagName("style");
	if (style.length == 0) {
		if (!+"\v1") {
			doc.createStyleSheet();
		} else {
			var newStyle = doc.createElement("style");
			newStyle.setAttribute('type', 'text/css');
			head.appendChild(newStyle);
		}
	}
	var styleElement = style[0];
	var media = styleElement.getAttribute("media");
	if (media != null && !/screen/.test(media.toLowerCase())) {
		styleElement.setAttribute("media", "screen");
	}
	if (!+"\v1") {
		styleElement.styleSheet.cssText += cssCode;
	} else if (/a/ [-1] == 'a') {
		styleElement.innerHTML += cssCode;
	} else {
		styleElement.appendChild(doc.createTextNode(cssCode));
	}
} // JavaScript Document 动态添加样式
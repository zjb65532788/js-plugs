/*轮播插件,需要jquery 支持*/
function alumbs(params) {
	var t=this;
	t.defaults=$.extend({},t.defaultload,params);
	t.init();
}
alumbs.prototype={
	'defaultload':{//默认配置
		'container':$('#alumbscontainer'),//父容器
		'height':null,//高度 默认根据高度最小的图片来
		'interval':true,//是否自动播放
		'dote':true//轮播下标
	},
	'index':0,//索引
	'movepd':0,//是否移动
	'ismoving':false,//移动状态
	'init':function(){//初始化
		var t=this;
		t.istouch="ontouchstart" in window?true:false;//判断事件
		t.events={start:t.istouch?'touchstart':'mousedown',move:t.istouch?'touchmove':'mousemove',end:t.istouch?'touchend':'mouseup'};
		if (t.defaults.container.length<1) {
			console.log("请设置父元素");
			return false;
		}
		t.width=t.defaults.container.width();
		$(window).resize(function(){
			t.width=t.defaults.container.width();
		});
		t.setstyle();
		t.alumbsitemlen=t.alumbsitem.length;
		t.setdote();
		t.setheight();
		if (t.alumbsitemlen>1) {
			t.bindinit(t.alumbsitem);
			if (t.defaults.interval) {
				t.setinterval();
			}
		}else{

		}
	},
	'setheight':function(){
		var t=this;
		if (t.defaults.height) {
			t.defaults.container.css({height:t.defaults.height});
		}else{
			t.alumbsitem.each(function(i){
				var t1=$(this),
					img=new Image();
				img.onload=function(){
					var oldheight=t.defaults.container.height()||0;
					var width=img.width,
						height=img.height,
						trueheight=t.width*height/width;
					if (oldheight==0) {
						t.defaults.container.css({height:trueheight});
					}else if (trueheight<oldheight) {
						t.defaults.container.css({height:trueheight});
					}
				}
				img.src=t1.find('img').eq(0).attr('src');
			});
		}
	},
	'interval':null,
	setinterval:function(){
		var t=this;
		t.interval=setInterval(function(){
				t.ismoving=true;
				t.nowobj = t.alumbsitem.eq(t.index);
				t.nextobj = t.alumbsitem.eq(t.index + 1);
				t.prevobj = t.alumbsitem.eq(t.index - 1); //当前对象
				if (t.nextobj.length < 1) {
					t.nextobj = t.alumbsitem.eq(0);
				}
				if (t.prevobj.length < 1) {
					t.prevobj = t.alumbsitem.eq(t.alumbsitemlen - 1);
				}
				t.nowobj.css({'left':0,'transform':'translate3D(0,0,0)','-webkit-transform':'translate3D(0,0,0)'});
				t.nextobj.css({'left':t.width,'visibility':'visible','transform':'translate3D(0,0,0)','-webkit-transform':'translate3D(0,0,0)'});
				setTimeout(function(){
					t.movenext(function(){
						t.ismoving=false;
						t.index++;
						if (t.index>t.alumbsitemlen-1) {
							t.index=0;
						}
						if (t.dote) {
							t.dote.find('li').removeClass('select').eq(t.index).addClass('select');
						}
					});
				},100);
			},6000);
	},
	'setdote':function(){
		var t=this,
			li=[],
			dote='';
		for(var i=0;i<t.alumbsitemlen;i++){
			if (i==0) {
				li.push("<li class='select'></li>");
			}else{
				li.push('<li></li>');
			}
		}
		dote='<div class="carouseldote" id="carouseldote">\
					<ul class="clearfloat">'+
						li.join('')
					+'</ul>\
				</div>';
		t.dote=$(dote);
		t.defaults.container.after(t.dote);
	},
	'bindinit':function(items){
		var t=this;
		items.each(function(){
			var t1=$(this);
			t1.bind(t.events.start,startmove);
		});
		function moving(e){
			e.preventDefault();
			t.moving();
		}
		function startmove(e){
			if (t.ismoving) {
				return false;
			}
			clearInterval(t.interval);
			t.ismoving=true;
			e.preventDefault();
			t.startmove(e);
			$(document).bind(t.events.move,moving);
			$(document).bind(t.events.end,moveend);
		}
		function moveend(e){
			e.preventDefault();
			t.moveend();
			$(document).unbind(t.events.move,moving);
			$(document).unbind(t.events.end,moveend);
		}
	},
	'startmove':function(e){
		var t=this,
			event=window.event;
		t.nowobj=t.alumbsitem.eq(t.index);
		t.nextobj=t.alumbsitem.eq(t.index+1);
		t.prevobj=t.alumbsitem.eq(t.index-1);//当前对象
		t.startX=t.istouch?event.touches[0].clientX:event.clientX;//触碰开始时手指或鼠标x坐标
		t.startY=t.istouch?event.touches[0].clientY:event.clientY;//触碰开始时手指或鼠标y坐标
		t.nowX=t.startX;
		t.nowY=t.startY;
		t.movepd=0;
		if (t.nextobj.length<1) {
			t.nextobj=t.alumbsitem.eq(0);
		}
		if (t.prevobj.length<1) {
			t.prevobj=t.alumbsitem.eq(t.alumbsitemlen-1);
		}
	},
	'moving':function(){
		var t=this,
			event=window.event;
		t.nowX=t.istouch?event.touches[0].clientX:event.clientX;//触碰开始时手指或鼠标x坐标
		t.nowY=t.istouch?event.touches[0].clientY:event.clientY;//触碰开始时手指或鼠标y坐标
		var czx=t.nowX-t.startX,
			czy=t.nowY-t.startY;
		if ((Math.abs(czx)>Math.abs(czy)&&Math.abs(czx)>10&&t.movepd==0)||t.movepd==1||!t.istouch) {
			t.movepd=1;
			if (czx<0) {
				var nowtransform="translate3D("+czx+"px,0,0)",
					resettransform="translate3D(0,0,0)";
				t.nowobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'visibility':'visible'});
				t.prevobj.css({'transform':resettransform,'-webkit-transform':resettransform,'left':0,'visibility':'hidden'});
				t.nextobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'left':t.width,'visibility':'visible'});
			}else if(czx>0){
				var nowtransform="translate3D("+czx+"px,0,0)",
					resettransform="translate3D(0,0,0)";
				t.nowobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'visibility':'visible'});
				t.nextobj.css({'transform':resettransform,'-webkit-transform':resettransform,'left':0,'visibility':'hidden'});
				t.prevobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'left':-t.width,'visibility':'visible'});
			}
		}else if((Math.abs(czy)>Math.abs(czx)&&Math.abs(zy)>10&&t.movepd==0)||t.movepd==2){
			t.movepd=2
		}
	},
	'moveend':function(){
		var t=this;
		if (t.movepd==1) {
			var czx=t.nowX-t.startX;
			if (czx>10) {
				t.moveprev(function(){
					t.ismoving=false;
					t.index--;
					if (t.index<0) {
						t.index=t.alumbsitemlen-1;
					}
					if (t.dote) {
						t.dote.find('li').removeClass('select').eq(t.index).addClass('select');
					}
					t.setinterval();
				});
			}else if(czx<-10){
				t.movenext(function(){
					t.ismoving=false;
					t.index++;
					if (t.index>t.alumbsitemlen-1) {
						t.index=0;
					}
					if (t.dote) {
						t.dote.find('li').removeClass('select').eq(t.index).addClass('select');
					}
					t.setinterval();
				});
			}
		}else{
			t.ismoving=false;
		}
	},
	'moveprev':function(callback){
		var t=this,
			nowtransform="translate3D("+(t.width)+"px,0,0)",
			endtransform="translate3D(0,0,0)";
		t.nowobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'transition':"all 500ms",'-webkit-transition':"all 500ms"});
		t.prevobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'transition':"all 500ms",'-webkit-transition':"all 500ms"});
		t.prevobj.bind('transitionend webkitTransitionEnd',function(){
			t.nowobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','visibility':'hidden'});
			t.nextobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','left':0,'visibility':'hidden'});
			t.prevobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','left':0,'visibility':'visible'});
			if (typeof callback=='function') {
				callback();
			}
			t.prevobj.unbind("transitionend webkitTransitionEnd");
		});
	},
	'movenext':function(callback){
		var t=this,
			nowtransform="translate3D("+(-t.width)+"px,0,0)",
			endtransform="translate3D(0,0,0)";
		t.nowobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'transition':"all 500ms",'-webkit-transition':"all 500ms"});
		t.nextobj.css({'transform':nowtransform,'-webkit-transform':nowtransform,'transition':"all 500ms",'-webkit-transition':"all 500ms"});
		t.nextobj.bind('transitionend webkitTransitionEnd',function(){
			t.nowobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','visibility':'hidden'});
			t.prevobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','left':0,'visibility':'hidden'});
			t.nextobj.css({transform:endtransform,"-webkit-transform":endtransform,transition:'','-webkit-transition':'','left':0,'visibility':'visible'});
			if (typeof callback=='function') {
				callback();
			}
			t.nextobj.unbind("transitionend webkitTransitionEnd");
		});
	},
	'setstyle':function(){//设置轮播样式等等
		addCss("#alumbscontainer{position:relative;overflow:hidden}\
				.alumbsitem{position:absolute;top:0;left:0;visibility:hidden;width:100%;overflow:hidden}\
				.carouseldote ul{width: 125px;text-align: center;margin: 10px auto;}\
				.carouseldote ul li{display: inline-block;width: 10px;height: 10px;background-color: #FFF;border-radius: 50%;margin-right: 5px;border: 1px solid #CCC;}\
				.carouseldote ul li.select{background-color:#007298; }\
			");
		var t=this,
			itemwidth;//轮播图宽度
		if (t.defaults.width) {
			itemwidth=t.defaults.width;
		}else{
			itemwidth=t.defaults.container.width();
		}
		t.alumbsitem=t.defaults.container.children().addClass('alumbsitem');
		t.alumbsitem.eq(t.index).css({'visibility':'visible'});
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
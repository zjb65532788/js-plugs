/*全屏切换效果 需要jquery 与html5支持*/
function move_screen (options) {
	this.init(options);
}
move_screen.prototype={
	'init':function(options){//插件初始化
		var t=this;
		for(var i in options){
			t.defaults[i]=options[i];//参数合并
		}
		if (!t.defaults.obj) {
			console.log('请设置移动对象');
			return false;
		}
		if (t.defaults.type==1) {//翻滚效果
			t.setfz();//设置翻转
		}
		t.seteventtype();
		/*移动对象事件绑定*/
		t.setmove();
	},
	'defaults':{//插件默认参数
		'obj':null,//触屏滚动系列对象 jquery对象 如 $('.allscreen');
		'beforemove':function(){},//移动前事件
		'moving':function(){},//移动中事件
		'aftermove':function(){},//移动后事件
		'movestop':false,//移动停止状态 true为停止，false为移动
		'isdocument':true,//touchstart or mousedown 注册到哪个对象 true 直接注册到 $(document)
		'czy':20,//移动阀值 超过阀值松手才会换一屏 否则复位
		'time':500,//松开时移动的时间 默认500ms
		'type':0//0为翻页效果,1为翻滚效果
	},
	'toptobottom':false,
	'seteventtype':function(){//设置事件
		this.eventtype="ontouchstart" in window?{'start':'touchstart','move':'touchmove','end':'touchend'}:{'start':'mousedown','move':'mousemove','end':'mouseup'};
		this.istouch="ontouchstart" in window?true:false;
	},
	'setfz':function(){//设置翻转时的样式
		var t=this,
			winheight=$(window).height(),
			transform="translateZ(-"+winheight/2+"px) translate(0px, 0px) rotateX(0deg);";
		t.parentdiv=t.defaults.obj.eq(0).parent();
		if (t.parentdiv.length>0&&t.parentdiv[0]!=$('body')[0]) {
			if (t.parentdiv.parent().length>0&&t.parentdiv.parent()[0]!=$('body')[0]) {
				t.parentdiv.parent().addClass('outerdiv');
			}else{
				var outerdiv=$('<div class="outerdiv"></div>').appendTo('body').css({
					position: 'relative',
  					width: '100%',
  					height: '100%',
					overflow: 'hidden',
					'-webkit-perspective': '800px',
					'perspective': '800px',
					'perspective-origin':'50% 50%',
				});
				t.parentdiv.appendTo(outerdiv);
			}
			t.parentdiv.css({'transform-style':'preserve-3d','-webkit-transform-style':'preserve-3d','transform':transform,'-webkit-transform':transform});
			t.defaults.obj.eq(t.index).css({'transform':'translateZ('+winheight/2+'px)  translate(0,0) ','-webkit-transform':'translateZ('+winheight/2+'px)  translate(0,0) '});
		}else{
			console.log('请设置父元素');
		}
	},
	'movepd':true,
	'stop':function(){//停止移动方法
		this.defaults.movestop=true;
	},
	'start':function(){//开始移动
		this.defaults.movestop=false;
	},
	'getevent':function(){//获取事件类型 touch事件 or mouse事件
		return "ontouchstart" in window?{'start':'touchstart','move':'touchmove','end':'touchend'}:{'start':'mousedown','move':'mousemove','end':'mouseup'};
	},
	'index':0,
	'setmove':function(){//移动对象事件绑定
		var t=this;
		if (t.defaults.isdocument||t.defaults.type==1) {
			$(document).bind(t.eventtype.start,movestart);
		}else{
			t.defaults.obj.each(function(){
				$(this).bind(t.eventtype.start,movestart);//绑定初始事件 touchstart or mousedown
			});
		}
		function movestart(e){
			if (t.movestop) {
				return;
			}
			if(!t.movepd){
				$(document).bind(t.eventtype.move,touchmove);//注册移动事件
				$(document).bind(t.eventtype.end,touchend);//注册结束事件
				function touchmove(e){
					e.preventDefault();
				}
				function touchend(e){
					$(document).unbind(t.eventtype.move,touchmove);//移除移动事件
					$(document).unbind(t.eventtype.end,touchend);//移除结束事件
				}
				return;
			}
			t.movepd=false;//movepd 设为false,触碰松开是在设 true
			t.movestart(e);
		}
	},
	'movestart':function(e){//开始移动
		var t=this,
			event=window.event,
			length=t.defaults.obj.length;
		t.winheight=$(window).height();
		//e.preventDefault();//手机端需要组织默认事件
		t.currentobj=t.defaults.obj.eq(t.index);//当前对象
		t.prevobj=t.currentobj.prev();//前一个对象
		t.nextobj=t.currentobj.next();
		if (length>2) {
			if (t.prevobj.length==0) {
				t.prevobj=t.defaults.obj.eq(length-1);
			}
			if (t.nextobj.length==0) {
				t.nextobj=t.defaults.obj.eq(0);
			}
		}
		t.csy="ontouchstart" in window?event.touches[0].clientY:event.clientY;//触碰开始时手指或鼠标y坐标
		t.nowy=t.csy;//当前鼠标y坐标
		t.czy=t.nowy-t.csy;
		if(typeof t.defaults.beforemove=='function'){
			t.defaults.beforemove();//移动前事件
		}
		$(document).bind(t.eventtype.move,touchmove);//注册移动事件
		$(document).bind(t.eventtype.end,touchend);//注册结束事件
		function touchmove(e){
			e.preventDefault();
			t.moving(e);
		}
		function touchend(e){
			t.touchend(e);
			$(document).unbind(t.eventtype.move,touchmove);//移除移动事件
			$(document).unbind(t.eventtype.end,touchend);//移除结束事件
		}
	},
	'moving':function(e){//对象移动事件
		var t=this,
			event=window.event;
		//e.preventDefault();//组织默认事件
		t.nowy=t.istouch?event.touches[0].clientY:event.clientY;//获得当前位置
		t.czy=t.nowy-t.csy;
		if(t.czy>0){//向下移
			if (t.index==0&&!t.toptobottom) {
				return false;
			}
			if (t.defaults.type==0) {
				var nowcss="translate3d(0,"+t.czy+"px,0)",
				prevcss="translate3d(0,"+(-t.winheight+t.czy)+"px,0)",
				nextcss="translate3d(0,"+t.winheight+"px,0)";
				t.currentobj.css({'transform':nowcss,'-webkit-transform':nowcss});
				t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss,'display':'block'});
				t.nextobj.css({'transform':nextcss,'-webkit-transform':nextcss});
			}else if(t.defaults.type==1){
				var nowcss='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX('+Math.round(-90*t.czy/t.winheight)+'deg)',
					prevtransform='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX(90deg)';
				t.parentdiv.css({transform:nowcss,"-webkit-transform":nowcss});
				t.prevobj.css({'display':'block',transform:prevtransform,'-webkit-transform':prevtransform,'transform-origin':'top','-webkit-transform-origin': 'top'});		
			}
		}else if(t.czy<0){//向上移
			if (t.nextobj.length==0) {
				return false;
			}
			if (t.defaults.type==0) {
				var nowcss="translate3d(0,"+t.czy+"px,0)",
				prevcss="translate3d(0,"+(-t.winheight)+"px,0)",
				nextcss="translate3d(0,"+(t.winheight+t.czy)+"px,0)";
				t.currentobj.css({'transform':nowcss,'-webkit-transform':nowcss});
				t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss});
				t.nextobj.css({'transform':nextcss,'-webkit-transform':nextcss,'display':'block'});
			}else if (t.defaults.type==1) {
				var nowcss='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX('+Math.round(-90*t.czy/t.winheight)+'deg)',
					nexttransform='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX(-90deg)';
				t.parentdiv.css({transform:nowcss,"-webkit-transform":nowcss});
				t.nextobj.css({'display':'block',transform:nexttransform,'-webkit-transform':nexttransform,'transform-origin':'bottom','-webkit-transform-origin': 'bottom'});
			}
		}else{
			if (t.defaults.type==0) {
				/*var nowcss="translate3d(0,0,0)",
					prevcss="translate3d(0,"+(-t.winheight)+"px,0)",
					nextcss="translate3d(0,"+(t.winheight)+"px,0)";
				t.currentobj.css({'transform':nowcss,'-webkit-transform':nowcss});
				t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss});
				t.nextobj.css({'transform':nextcss,'-webkit-transform':nextcss});*/
			}
		}
	},
	'touchend':function(e){//结束时间
		var t=this,
			fz=Math.abs(t.defaults.czy);//阀值

		if(t.czy>fz&&t.prevobj.length>0){
			if (t.index==0&&!t.toptobottom) {
				t.movepd=true;
				return false;
			}
			t.moveprev();//向下移
		}else if(t.czy<-fz&&t.nextobj.length>0){
			t.movenext();//向上移
		}else{
			t.movereset();//复位
		}
	},
	'moveprev':function(){//向下移
		var t=this,
			nowcss="translate3d(0,"+t.winheight+"px,0)",
			prevcss="translate3d(0,0,0)",
			transition="all "+t.defaults.time+"ms";
		if (t.defaults.type==0) {//滑动效果
			t.currentobj.css({'transform':nowcss,'-webkit-transform':nowcss,'transition':transition,'-webkit-transition':transition});//利用html5做动态效果
			t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':transition,'-webkit-transition':transition});//利用html5做动态效果
			t.nextobj.css({'transform':prevcss,'-webkit-transform':prevcss,'display':'none'});		
			t.prevobj.bind('webkitTransitionEnd transitionend',function(){
				t.currentobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.currentobj.css({'display':'none'});
				t.movepd=true;//判断标志设为true
				t.index--;
				if (t.index<0) {
					t.index=t.defaults.obj.length-1;
				}
				if (typeof t.defaults.aftermove=='function') {
					t.defaults.aftermove();
				}
				t.prevobj.unbind('webkitTransitionEnd transitionend');
			});
		}else if (t.defaults.type==1) {//翻滚效果
			var transform='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX('+(-90)+'deg)';
			t.parentdiv.css({'transform':transform,'-webkit-transform':transform,'transition':transition,'-webkit-transition':transition});
			t.parentdiv.bind('webkitTransitionEnd transitionend',function(){
				var transform="translateZ(-"+t.winheight/2+"px) translate(0px, 0px) rotateX(0deg);",
					nowcss='translateZ('+t.winheight/2+'px)  translate(0,0)',
					othercss="translate3d(0,0,0)";
				t.parentdiv.css({'transition':'','-webkit-transition':'',transition:'','-webkit-transition':'','transform-style':'preserve-3d','-webkit-transform-style':'preserve-3d','transform':transform,'-webkit-transform':transform});
				t.prevobj.css({transform:nowcss,'-webkit-transform':nowcss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.nextobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none'});
				t.movepd=true;//判断标志设为true
				t.index--;
				if (t.index<0) {
					t.index=t.defaults.obj.length-1;
				}
				if (typeof t.defaults.aftermove=='function') {
					t.defaults.aftermove();
				}
				t.parentdiv.unbind('webkitTransitionEnd transitionend');
			});
		}
		/*setTimeout(function(){
			if (t.defaults.type==0) {
				t.currentobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
			}else if(t.defaults.type==1){
				var transform="translateZ(-"+t.winheight/2+"px) translate(0px, 0px) rotateX(0deg);",
					nowcss='translateZ('+t.winheight/2+'px)  translate(0,0)',
					othercss="translate3d(0,0,0)";
				t.parentdiv.css({'transition':'','-webkit-transition':'',transition:'','-webkit-transition':'','transform-style':'preserve-3d','-webkit-transform-style':'preserve-3d','transform':transform,'-webkit-transform':transform});
				t.prevobj.css({transform:nowcss,'-webkit-transform':nowcss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.nextobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
			}
			t.currentobj.css({'display':'none'});
			t.movepd=true;//判断标志设为true
			t.index--;
			if (t.index<0) {
				t.index=t.defaults.obj.length-1;
			}
			if (typeof t.defaults.aftermove=='function') {
				t.defaults.aftermove();
			}
		},t.defaults.time);*/
	},
	'movenext':function(){//向上移
		var t=this,
			nowcss="translate3d(0,-"+t.winheight+"px,0)",
			prevcss="translate3d(0,0,0)",
			transition="all "+t.defaults.time+"ms";
		if (t.defaults.type==0) {
			t.currentobj.css({'transform':nowcss,'-webkit-transform':nowcss,'transition':transition,'-webkit-transition':transition});//利用html5做动态效果
			t.nextobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':transition,'-webkit-transition':transition});//利用html5做动态效果
			t.prevobj.css({'transform':prevcss,'-webkit-transform':prevcss,'display':'none'});		
			t.nextobj.bind('webkitTransitionEnd transitionend',function(){
				t.currentobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.nextobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.currentobj.css({'display':'none'});
				t.movepd=true;//判断标志设为true
				t.index++;
				if (t.index==t.defaults.obj.length-1&&!t.toptobottom) {
					t.toptobottom=true;
				}
				if (t.index>t.defaults.obj.length-1) {
					t.index=0;
				}
				if (typeof t.defaults.aftermove=='function') {
					t.defaults.aftermove();
				}
				t.nextobj.unbind("webkitTransitionEnd transitionend");
			});
		}else if (t.defaults.type==1) {
			var transform='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX('+90+'deg)';
			t.parentdiv.css({'transform':transform,'-webkit-transform':transform,'transition':transition,'-webkit-transition':transition});
			t.parentdiv.bind('webkitTransitionEnd transitionend',function(){
				var transform="translateZ(-"+t.winheight/2+"px) translate(0px, 0px) rotateX(0deg);",
					nowcss='translateZ('+t.winheight/2+'px)  translate(0,0)',
					othercss="translate3d(0,0,0)";
				t.parentdiv.css({'transition':'','-webkit-transition':'',transition:'','-webkit-transition':'','transform-style':'preserve-3d','-webkit-transform-style':'preserve-3d','transform':transform,'-webkit-transform':transform});
				t.nextobj.css({transform:nowcss,'-webkit-transform':nowcss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.prevobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none'});
				t.movepd=true;//判断标志设为true
				t.index++;
				if (t.index==t.defaults.obj.length-1&&!t.toptobottom) {
					t.toptobottom=true;
				}
				if (t.index>t.defaults.obj.length-1) {
					t.index=0;
				}
				if (typeof t.defaults.aftermove=='function') {
					t.defaults.aftermove();
				}
				t.parentdiv.unbind('webkitTransitionEnd transitionend');
			});
		}
		/*setTimeout(function(){
			if (t.defaults.type==0) {
				t.currentobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
				t.nextobj.css({'transform':prevcss,'-webkit-transform':prevcss,'transition':'','-webkit-transition':''});//利用html5做动态效果
			}else if(t.defaults.type==1){
				var transform="translateZ(-"+t.winheight/2+"px) translate(0px, 0px) rotateX(0deg);",
					nowcss='translateZ('+t.winheight/2+'px)  translate(0,0)',
					othercss="translate3d(0,0,0)";
				t.parentdiv.css({'transition':'','-webkit-transition':'',transition:'','-webkit-transition':'','transform-style':'preserve-3d','-webkit-transform-style':'preserve-3d','transform':transform,'-webkit-transform':transform});
				t.nextobj.css({transform:nowcss,'-webkit-transform':nowcss,'transform-origin':'','-webkit-transform-origin':''});
				t.currentobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
				t.prevobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
			}
			t.currentobj.css({'display':'none'});
			t.movepd=true;//判断标志设为true
			t.index++;
			if (t.index==t.defaults.obj.length-1&&!t.toptobottom) {
				t.toptobottom=true;
			}
			if (t.index>t.defaults.obj.length-1) {
				t.index=0;
			}
			if (typeof t.defaults.aftermove=='function') {
				t.defaults.aftermove();
			}
		},t.defaults.time);*/
	},
	'movereset':function(){
		var t=this,
			lastcss="translate3d(0,0,0)";		
		if (t.defaults.type==0) {
			t.currentobj.css({'transform':lastcss,'-webkit-transform':lastcss});//利用html5做动态效果
			t.nextobj.css({'transform':lastcss,'-webkit-transform':lastcss,'display':'none'});//利用html5做动态效果
			t.prevobj.css({'transform':lastcss,'-webkit-transform':lastcss,'display':'none'});
		}else if (t.defaults.type==1) {
			var transform='translateZ(-'+t.winheight/2+'px)  translate(0,0)  rotateX(0deg)',
				nowcss='translateZ('+t.winheight/2+'px)  translate(0,0)',
				othercss="translate3d(0,0,0)";
			t.parentdiv.css({transform:transform,'-webkit-transform':transform});
			t.currentobj.css({transform:nowcss,'-webkit-transform':nowcss,'transform-origin':'','-webkit-transform-origin':''});
			t.nextobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
			t.prevobj.css({'display':'none',transform:othercss,'-webkit-transform':othercss,'transform-origin':'','-webkit-transform-origin':''});
		}
		t.nextobj.css({'display':'none'});
		t.prevobj.css({'display':'none'});
		t.movepd=true;		
	}
}
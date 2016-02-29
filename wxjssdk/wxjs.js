! function(a,b){
	var wxconfig=null;
	if("function" == typeof define && define.cmd){
		define(function(require,exports,module){
			var wx=require("http://res.wx.qq.com/open/js/jweixin-1.0.0");
			wxconfig=b(wx);
			module.exports=wxconfig;
		});
	}else{
		wxconfig=b(wx);
		window.wxconfig=wxconfig;
	}
	if (typeof $ == 'function') {
		var upwximgdefault={
			count:9,
		    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) {
		        
		    }
		}
		$.fn.uploadwximg=function(options,value){
			var option=options||{};
    		option=$.extend({},upwximgdefault,option);
			return this.each(function(){
				var _t=this,
        		    _t1=$(this);
        		_t1.bind('click',function(){
        			wxconfig(
        				{
        					'chooseImage':option
        				}
        			);
        		});
			});
		}
		var prewximgdefault={
			    current: '', // 当前显示图片的http链接
	    		urls: [] // 需要预览的图片http链接列表
			};
		$.fn.previewwximg=function(options,value){
			var option=options||{};
    		option=$.extend({},prewximgdefault,option);
			return this.each(function(){
				var _t=this,
        		    _t1=$(this);
        		_t1.unbind('click').bind('click',function(){
        			wxconfig(
						{
							'previewImage':option
						}
					);
        		});
			});
		}
		var prewximgdefault1={
			    current: '', // 当前显示图片的http链接
	    		urls: [], // 需要预览的图片http链接列表
	    		chilidclass:'uploadwximgli',
	    		attr:'datasrc'
			};
		$.fn.previewwximg1=function(options,value){
			var option=options||{};
    		option=$.extend({},prewximgdefault1,option);
			return this.each(function(){
				var _t=this,
        		    _t1=$(this),
        		    preview=[],
        		    li=_t1.find('.'+option.chilidclass);
        		li.each(function(){
        			var t=$(this);
        			preview.push(t.attr(option.attr));
        		});
        		li.each(function(){
        			var t=$(this),
        				now=t.attr(option.attr);
        			var nowoption={
        				current: now, // 当前显示图片的http链接
	    				urls: preview,
        			};
        			t.bind('click',function(e){
        				wxconfig(
							{
								'previewImage':nowoption
							}
						);
        				e.stopPropagation();
        			});
        		})
        		
			});
		}
		var playvoicedefault={
			    localId:'',
			    attr:'localId'
			};
		$.fn.playwxvoice=function(options,value){
			var option=options||{};
    		option=$.extend({},playvoicedefault,option);
			return this.each(function(){
				var _t=this,
        		    _t1=$(this);
        		_t1.bind('click',function(){
        			if (option.attr&&option.attr!='') {
	        			option.localId=_t1.attr(option.attr);
	        		}
        			if (!_t1.attr('hasplaying')) {
        				_t1.attr('hasplaying',1);
        				_t1.find('.audioplaypng').hide();
						_t1.find('.audioplaygif').show();
        				wxconfig({
							'playVoice':1,
							'localId':option.localId
						});
						wxconfig({
							'onVoicePlayEnd':{
								'success':function(){
									_t1.removeAttr('hasplaying');
        							_t1.find('.audioplaypng').show();
									_t1.find('.audioplaygif').hide();
								}
							}
						});
        			}else{
        				_t1.removeAttr('hasplaying');
        				_t1.find('.audioplaypng').show();
						_t1.find('.audioplaygif').hide();
        				wxconfig({
							'stopVoice':{
								'localId':option.localId
							}
						});
        			}
        		});  
			});
		}
	}
}(this,function(wx){
	function wxconfig(options) {
		var param = "url=" + window.location.href,
			url = "";
		if (typeof $ == 'function' && typeof $.ajax == 'function') {
			if (!wxconfig.hasconfig) {
				$.ajax({
					type: "GET",
					data: {
						url: window.location.href
					},
					url: url,
					dataType: "jsonp",
					callback: 'json_callback',
					success: function(json) {
						setsuccess(json);
					},
					error: function() {}
				});
				wxconfig.hasconfig=true;
			}else{
				setsuccess();
			}
		} else {
			// 得到航班信息查询结果后的回调函数
			function flightHandler(json) {
				setsuccess(json);
			}
			window.flightHandler = flightHandler;

			function flightHandler0() {
				url = url + "?url=" + encodeURIComponent(window.location.href) + "&callback=flightHandler";
				// 创建script标签，设置其属性
				var script = document.createElement('script');
				script.setAttribute('src', url);
				// 把script标签加入head，此时调用开始
				document.getElementsByTagName('head')[0].appendChild(script);
			}
			if (!wxconfig.hasconfig) {
				flightHandler0();
				wxconfig.hasconfig=true;
			}else{
				setsuccess();
			}
		}

		function setsuccess(json) {
			if (!json) {

			}
			else if (json.status == 1) {
				wx.config(json.data);
				wx.error(function(res) {
					//alert(res.errMsg);
				});
			}
			if (options.share) {
				weixinshare(options.share);
			}
			if (options.weixinmap) {
				wx.openLocation(options.weixinmap);
			}
			if (options.chooseImage) {
				wx.ready(function(){
					wx.chooseImage(options.chooseImage);
				})
			}
			if (options.previewImage) {
				wx.previewImage(options.previewImage);
			}
			if (options.uploadImage) {
				wx.uploadImage(options.uploadImage);
			}
			if (options.startRecord) {
				wx.ready(function() {
					wx.startRecord(options.startRecord);
					if (options.ready_back) {
						options.ready_back();
					}
				});
			}
			if (options.onVoiceRecordEnd) {
				wx.ready(function(){
					wx.onVoiceRecordEnd(options.onVoiceRecordEnd);
				});
			}
			if (options.stopRecord) {
				wx.stopRecord(options.stopRecord);
			}
			if (options.playVoice) {
				wx.playVoice({
				    localId: options.localId // 需要播放的音频的本地ID，由stopRecord接口获得
				});
			}
			if (options.stopVoice) {
				wx.stopVoice(options.stopVoice);
			}
			if (options.pauseVoice) {
				wx.pauseVoice({
				    localId: options.localId // 需要停止的音频的本地ID，由stopRecord接口获得
				});
			}
			if (options.onVoicePlayEnd) {
				wx.ready(function() {
					wx.onVoicePlayEnd(options.onVoicePlayEnd);
				});
			}
			if (options.uploadVoice) {
				wx.uploadVoice(options.uploadVoice);
			}
			if (options.getLocation) {
				wx.ready(function() {
					wx.getLocation({
					    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					    success: function (res) {
					        if (options.suc_callback&&typeof options.suc_callback=='function') {
					        	options.suc_callback(res);
					        }
					    }
					});
				});
			}
			if (options.getLocationnew) {
				var locationop={
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				    success: function (res) {}
				};
				for(var i in locationop){
					if (options.getLocationnew[i]) {
						locationop[i]=options.getLocationnew[i];
					}
				}
				wx.ready(function() {
					wx.getLocation(locationop);
				});
			}
			if (options.translateVoice) {
				var translateVoiceop={
					localId: '', // 需要识别的音频的本地Id，由录音相关接口获得
				    isShowProgressTips: 1, // 默认为1，显示进度提示
				    success: function (res) {
				    }
				};
				for(var i in translateVoiceop){
					if (options.translateVoice[i]) {
						translateVoiceop[i]=options.translateVoice[i];
					}
				}
				wx.translateVoice(translateVoiceop);
			}
		}
		function weixinshare(shareData) {
			wx.ready(function() {
				wx.onMenuShareAppMessage(shareData);
				wx.onMenuShareTimeline(shareData);
				wx.onMenuShareQQ(shareData);
				wx.onMenuShareWeibo(shareData);
			});
			
		}
	}
	return wxconfig;
});
(function($){
   $.fn.dialog=function(options,value){
    if (typeof options=="string") {
    	return $.fn.dialog.method[options](this,value);
    }
    var option=options||{},
        closecallback1=option.closecallback,
        options=$.extend({},$.fn.dialog.defaults,option);
    return this.each(function(){
        var _t=this,
            _t1=$(this),
            dialogdiv=$("<div class='cli_dialog'></div>");
        dialogdiv.prepend(_t1);
        $('body').append(dialogdiv);
        var dialog_shadow="<i class='dialog_shadow_top'></i><i class='dialog_shadow_left'></i><i class='dialog_shadow_bottom'></i><i class='dialog_shadow_right'></i><i class='shadow_left_top shadow_round'></i><i class='shadow_left_bottom shadow_round'></i><i class='shadow_right_top shadow_round'></i><i class='shadow_right_bottom shadow_round'></i>"
        dialogdiv.css({'width':options.width+"px",'height':options.height+"px",'margin-left':-options.width/2+"px",'margin-top':-options.height/2+"px"}).append(dialog_shadow);
        dialogdiv.find(".dialog_shadow_top").css('width',options.width-20+"px");
        dialogdiv.find(".dialog_shadow_left").css('height',options.height-20+"px");
        dialogdiv.find(".dialog_shadow_right").css({'height':options.height-20+"px",'background-position':'-9px 0'});
        dialogdiv.find(".dialog_shadow_bottom").css({'width':options.width-20+"px",'background-position':'0 -9px'});
        dialogdiv.find(".shadow_left_top").css({'left':'-9px','top':'-9px'});
        dialogdiv.find(".shadow_right_top").css({'right':'-9px','top':'-9px','background-position':'19px 0'});
        dialogdiv.find(".shadow_right_bottom").css({'right':'-9px','bottom':'-9px','background-position':'19px 19px'});
        dialogdiv.find(".shadow_left_bottom").css({'left':'-9px','bottom':'-9px','background-position':'0 19px'});
        if (options.title!='') {
          var titlediv="<div class='dialog_title'>"+options.title+"</div><em class='dialog_closed'>×</em>"
          _t1.before(titlediv);
          dialogdiv.find(".dialog_closed").bind('click',function(){
            if (closecallback1) {
             closecallback1();
           }
             dialogdiv.css('display','none');
          });
        }else{
          var titlediv="<div class='dialog_closed'></div>"
          dialogdiv.append(titlediv);
          dialogdiv.find(".dialog_closed").bind('click',function(){
            if (closecallback1) {
             closecallback1();
           }
             dialogdiv.css('display','none');
          });
        }
        if (options.close) {
          dialogdiv.css('display','none');
        }
    });
   };
   $.fn.dialog.defaults={
   	 width:200,
   	 height:200,
     close:true,
     title:'',
     button:[],
     closecallback:function(){},
     closebt:true
   };
   $.fn.dialog.method={
     close:function(obj,value){
      if (value) {
       $(obj).parent().css('display','none');
      }
      else{
        $(obj).parent().css('display','block');
      }
     },
     changetitle:function(obj,value) {
       $(obj).parent().find('.dialog_title').html(value);
     }
   };
})(jQuery);
;(function(window, $) {
	var regexs = {
	    // 匹配 max_length(12) => ["max_length",12]
	    rule:/^(.+?)\((.+)\)$/,
	    // 数字
	    numericRegex:/^[0-9]+$/,
	    /**
	    * @descrition:邮箱规则
	    * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
	    * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
	    * 3.@符号是必填项
	    * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
	    * 5.邮件提供商域可以包含特殊字符-、_、.
	    */
	    email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
	    /**
	     * [ip ipv4、ipv6]
	     * "192.168.0.0"
	     * "192.168.2.3.1.1"
	     * "235.168.2.1"
	     * "192.168.254.10"
	     * "192.168.254.10.1.1"
	     */
	    ip:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
	    /**
	    * @descrition:判断输入的参数是否是个合格的固定电话号码。
	    * 待验证的固定电话号码。
	    * 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
	    **/
	    fax:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
	    /**
	    *@descrition:手机号码段规则
	    * 13段：130、131、132、133、134、135、136、137、138、139
	    * 14段：145、147
	    * 15段：150、151、152、153、155、156、157、158、159
	    * 17段：170、176、177、178
	    * 18段：180、181、182、183、184、185、186、187、188、189
	    * 国际码 如：中国(+86)
	    */
	    phone:/^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/,
	    /**
	     * @descrition 匹配 URL
	     */
	    url:/[a-zA-z]+:\/\/[^\s]/
	};

	var element = [];
	var fbOptions = [];
	var heightArray = []; //瀑布流高度储存---------
    var fbUi = function(args){
		if(typeof(args) == 'string'){
			element = [];
	   	 	element.push($(args));//储存节点
	   	 	return new fbUi();
	   	}
    };

	//********* 静态方法  **************
	
	//正则:验证手机号码
	fbUi.expPhone = function(test){
		var test = test;
	    if(!(/^1[34578]\d{9}$/.test(test))){ 
	        // alert("手机号码有误，请重填");  
	        return false; 
	    }
	    return true;
	};
	//正则：验证是否为空
	fbUi.expEmpty = function(test){  
		var test = test;
	    if(test.length == 0){ 
	        // alert("手机号码有误，请重填");  
	        return false; 
	    }
	    return true;
	};
	//发送验证码
	fbUi.getCode = function(src,fn){
	  var _this = this;
	  fn();
	  $.post(src, function(data){
	   if(data.code == 200){
		_this.fbNews({"type":"success","content":"获取验证码成功"});
	   }
	  }).error(function(){
		_this.fbNews({"type":"danger","content":"获取验证码失败"});

	  })
	};
	//监听是否到底部
	fbUi.monitorBottom = function(options){
		var defaults = {
            bottom : 100,//unit: 滑动速度
            arriveFun : null,
        };
		var fb = $.extend(defaults, options || {});
		fbOptions["monitorBottom"] = fb;
		$(window).on("scroll",addEvent);
		function addEvent(){
			var t = $(window).scrollTop();
			var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）    
		    var bScrollH = document.body.scrollHeight; // 滚动条总高度        
		    if (t + wInnerH >= bScrollH-fb.bottom) { 
		    	fb.arriveFun();
				$(window).off("scroll",addEvent);
		    }
		}
	}
	fbUi.monitorBottom.again = function(){
		fbUi.monitorBottom(fbOptions["monitorBottom"]); 
	}
	//瀑布流布局
    fbUi.waterfall = function(options){
		var defaults = {
			el:"body",
            width : 285,//unit: 每个的宽度
            column : 4,//unit:列数
            margin: 10,//间隔
            data:null,//数据
        };
		var fb = $.extend(defaults, options || {});
		var $el = $(fb.el);
		if(heightArray.length == 0){
			for(var i = 0 ; i < fb.column ; i++){
				heightArray.push(0)
			}
		}
		$.each(fb.data,function(a,b){
			var minInNumbers = Math.min.apply(Math, heightArray);
			var maxInNumbers = Math.max.apply(Math, heightArray);
			var min_index = heightArray.indexOf(minInNumbers);
			var html = '<div class="fb-position-absolute fb-waterfall-item" style="width:'+b.width+'px;height:'+b.height+'px;top:'+heightArray[min_index]+'px;left:'+(parseFloat(b.width)+parseFloat(fb.margin))*min_index+'px;">\
				<a href="'+b.href+'">\
					<img src="'+b.img+'" alt="" width="'+fb.width+'"/>\
					<div class="fb-text fb-position-absolute fb-table fb-transition">\
						<span class="fb-font14 fb-tableCell">'+b.name+'<br/>'+b.popularity+'</span>\
					</div>\
				</a>\
			</div>';
			heightArray[min_index] = parseFloat(minInNumbers)+(parseFloat(b.height)+parseFloat(fb.margin));
			maxInNumbers = Math.max.apply(Math, heightArray);
			$el.append(html).css("height",maxInNumbers)
		})
	};
	//重置瀑布流
	 fbUi.resetWaterfall = function(options){
	 	var defaults = {
			el:"body",
        };
		var fb = $.extend(defaults, options || {});
		var $el = $(fb.el);
		heightArray = [];
		$el.html("").css("height",0);
	};
	//​显示模态弹窗 showModal
	fbUi.showModal = function(options,succFn){
		var defaults = {
            title : '提示',//提示的标题
            content:'',//提示的内容
            textBox:'', //input：为input；textarea：为textarea
            placeholder:''//文本框提示
        };
		var fb = $.extend(defaults, options || {});
		$(".fb-showModal").remove();
		if(fb.textBox == 'input'){
			var html = '<div style="display:none;" class="fb-showModal fb-position-fixed fb-z999 fb-showModal-black" >\
				        <div class="fb-showModal-group fb-position-relative fb-transition startTop" >\
				            <div class="fb-showModal-title fb-font18">'+fb.title+'</div>\
				            <div class="fb-showModal-content fb-font14"><input class="fb-textBox" type="text" placeholder="'+fb.placeholder+'" /></div>\
				            <div class="fb-showModal-buttom ">\
				                <button class="fb-showModal-close fb-inlineBlock fb-font16">取消</button>\
				                <button class="fb-showModal-true fb-buttonFill-info fb-inlineBlock fb-font16" >确定</button>\
				            </div>\
				        </div>\
				    </div>';
		}else if(fb.textBox == 'textarea'){
			var html = '<div style="display:none;" class="fb-showModal fb-position-fixed fb-z999 fb-showModal-black" >\
				        <div class="fb-showModal-group fb-position-relative fb-transition startTop" >\
				            <div class="fb-showModal-title fb-font18">'+fb.title+'</div>\
				            <div class="fb-showModal-content fb-font14"><textarea class="fb-textBox"  placeholder="'+fb.placeholder+'" ></textarea></div>\
				            <div class="fb-showModal-buttom ">\
				                <button class="fb-showModal-close fb-inlineBlock fb-font16">取消</button>\
				                <button class="fb-showModal-true fb-buttonFill-info fb-inlineBlock fb-font16" >确定</button>\
				            </div>\
				        </div>\
				    </div>';
		}else{
			var html = '<div style="display:none;" class="fb-showModal fb-position-fixed fb-z999 fb-showModal-black" >\
				        <div class="fb-showModal-group fb-position-relative fb-transition startTop" >\
				            <div class="fb-showModal-title fb-font18">'+fb.title+'</div>\
				            <div class="fb-showModal-content fb-font14">'+fb.content+'</div>\
				            <div class="fb-showModal-buttom ">\
				                <button class="fb-showModal-close fb-inlineBlock fb-font16">取消</button>\
				                <button class="fb-showModal-true fb-buttonFill-info fb-inlineBlock fb-font16" >确定</button>\
				            </div>\
				        </div>\
				    </div>';
		}
		
		$("body").append(html);
		$(".fb-showModal").fadeIn(200).find(".fb-showModal-group").removeClass("startTop");

		//点击遮罩关闭
		$("body").on("click",".fb-showModal",function(e){
			if(e.target === $(this).get(0)){
				$(this).fadeOut(200);
				$("body").off("click",".fb-showModal-true",succFunction);
			}
		});
		//确定
		$("body").on("click",".fb-showModal-true",succFunction);
		function succFunction(){
			$(".fb-showModal").fadeOut(200);
			if(succFn){
				var val = $(".fb-textBox").val();
				succFn(val);
			}
		}
		//取消
		$("body").on("click",".fb-showModal-close",function(){
			$(".fb-showModal").fadeOut(200);
			// 解除确定
			$("body").off("click",".fb-showModal-true",succFunction);
			
		});
	};
	//​关闭模态弹窗 showModal
	fbUi.closeModal = function(){
		$(".fb-showModal").fadeOut(200);
	};
	//消息提示
	fbUi.fbNews = function(options){
		var defaults = {
			type:'info',
            content : null,
            time:3000
        };
		var fb = $.extend(defaults,options || {});
		var src,colorClass,id=Math.floor(Math.random()*9999);
		if(fb.type == 'info'){
			src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9pbmZvPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0xNTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDE1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25faW5mbyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzUwQkZGRiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMS42MTUzODQ2LDI2LjU0MzIwOTkgQzIxLjYxNTM4NDYsMjYuOTQ3ODc1MSAyMS40NTgzMzQ4LDI3LjI5MTgzNjggMjEuMTQ0MjMwOCwyNy41NzUxMDI5IEMyMC44MzAxMjY4LDI3Ljg1ODM2ODkgMjAuNDQ4NzE5NCwyOCAyMCwyOCBDMTkuNTUxMjgwNiwyOCAxOS4xNjk4NzMyLDI3Ljg1ODM2ODkgMTguODU1NzY5MiwyNy41NzUxMDI5IEMxOC41NDE2NjUyLDI3LjI5MTgzNjggMTguMzg0NjE1NCwyNi45NDc4NzUxIDE4LjM4NDYxNTQsMjYuNTQzMjA5OSBMMTguMzg0NjE1NCwxOS43NDQ4NTYgQzE4LjM4NDYxNTQsMTkuMzQwMTkwNyAxOC41NDE2NjUyLDE4Ljk5NjIyOSAxOC44NTU3NjkyLDE4LjcxMjk2MyBDMTkuMTY5ODczMiwxOC40Mjk2OTY5IDE5LjU1MTI4MDYsMTguMjg4MDY1OCAyMCwxOC4yODgwNjU4IEMyMC40NDg3MTk0LDE4LjI4ODA2NTggMjAuODMwMTI2OCwxOC40Mjk2OTY5IDIxLjE0NDIzMDgsMTguNzEyOTYzIEMyMS40NTgzMzQ4LDE4Ljk5NjIyOSAyMS42MTUzODQ2LDE5LjM0MDE5MDcgMjEuNjE1Mzg0NiwxOS43NDQ4NTYgTDIxLjYxNTM4NDYsMjYuNTQzMjA5OSBaIE0yMCwxNS44MDQyOTgxIEMxOS40NDQ0NDI3LDE1LjgwNDI5ODEgMTguOTcyMjI0LDE1LjYxOTM2ODcgMTguNTgzMzMzMywxNS4yNDk1MDQ2IEMxOC4xOTQ0NDI3LDE0Ljg3OTY0MDYgMTgsMTQuNDMwNTI1NSAxOCwxMy45MDIxNDkxIEMxOCwxMy4zNzM3NzI2IDE4LjE5NDQ0MjcsMTIuOTI0NjU3NSAxOC41ODMzMzMzLDEyLjU1NDc5MzUgQzE4Ljk3MjIyNCwxMi4xODQ5Mjk1IDE5LjQ0NDQ0MjcsMTIgMjAsMTIgQzIwLjU1NTU1NzMsMTIgMjEuMDI3Nzc2LDEyLjE4NDkyOTUgMjEuNDE2NjY2NywxMi41NTQ3OTM1IEMyMS44MDU1NTczLDEyLjkyNDY1NzUgMjIsMTMuMzczNzcyNiAyMiwxMy45MDIxNDkxIEMyMiwxNC40MzA1MjU1IDIxLjgwNTU1NzMsMTQuODc5NjQwNiAyMS40MTY2NjY3LDE1LjI0OTUwNDYgQzIxLjAyNzc3NiwxNS42MTkzNjg3IDIwLjU1NTU1NzMsMTUuODA0Mjk4MSAyMCwxNS44MDQyOTgxIFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
			colorClass = "fb-color-info";
		}else if(fb.type == 'success'){
			src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9zdWNjZXNzPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yMTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDIxMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25fc3VjY2VzcyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzEzQ0U2NiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNy44MjU1ODE0LDE3LjE0ODQzNTcgTDE5LjAxNzQ0LDI1LjgyODEyMTMgQzE4LjkwMTE2MDksMjUuOTQyNzA4MyAxOC43NjU1MDMzLDI2IDE4LjYxMDQ2NywyNiBDMTguNDU1NDI3LDI2IDE4LjMxOTc2OTMsMjUuOTQyNzA4MyAxOC4yMDM0ODY1LDI1LjgyODEyMTMgTDE4LjAyOTA3MTYsMjUuNjU2MjUgTDEzLjE3NDQxODYsMjAuODQzNzUgQzEzLjA1ODEzOTUsMjAuNzI5MTYzIDEzLDIwLjU5NTQ4MzcgMTMsMjAuNDQyNzA0NyBDMTMsMjAuMjg5OTI5MyAxMy4wNTgxMzk1LDIwLjE1NjI1IDEzLjE3NDQxODYsMjAuMDQxNjY2NyBMMTQuMzY2Mjc3MiwxOC44NjcxODU3IEMxNC40ODI1NiwxOC43NTI2MDIzIDE0LjYxODIxNzcsMTguNjk1MzEwNyAxNC43NzMyNTc3LDE4LjY5NTMxMDcgQzE0LjkyODI5NCwxOC42OTUzMTA3IDE1LjA2Mzk1MTYsMTguNzUyNjAyMyAxNS4xODAyMzA3LDE4Ljg2NzE4NTcgTDE4LjYxMDQ2NywyMi4yNzYwMzggTDI1LjgxOTc2OTMsMTUuMTcxODcxMyBDMjUuOTM2MDQ4NCwxNS4wNTcyODggMjYuMDcxNzA2LDE1IDI2LjIyNjc0MjMsMTUgQzI2LjM4MTc4MjMsMTUgMjYuNTE3NDQsMTUuMDU3Mjg4IDI2LjYzMzcyMjgsMTUuMTcxODcxMyBMMjcuODI1NTgxNCwxNi4zNDYzNTIzIEMyNy45NDE4NjA1LDE2LjQ2MDkzNTcgMjgsMTYuNTk0NjE1IDI4LDE2Ljc0NzM5NCBDMjgsMTYuOTAwMTczIDI3Ljk0MTg2MDUsMTcuMDMzODUyMyAyNy44MjU1ODE0LDE3LjE0ODQzNTcgTDI3LjgyNTU4MTQsMTcuMTQ4NDM1NyBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
			colorClass = "fb-color-success";
		}else if(fb.type == 'warning'){
			src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl93YXJuaW5nPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yNzIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMjcyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl93YXJuaW5nIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBmaWxsPSIjRjdCQTJBIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIxLjYxNTM4NDYsMjYuNTQzMjA5OSBDMjEuNjE1Mzg0NiwyNi45NDc4NzUxIDIxLjQ1ODMzNDgsMjcuMjkxODM2OCAyMS4xNDQyMzA4LDI3LjU3NTEwMjkgQzIwLjgzMDEyNjgsMjcuODU4MzY4OSAyMC40NDg3MTk0LDI4IDIwLDI4IEMxOS41NTEyODA2LDI4IDE5LjE2OTg3MzIsMjcuODU4MzY4OSAxOC44NTU3NjkyLDI3LjU3NTEwMjkgQzE4LjU0MTY2NTIsMjcuMjkxODM2OCAxOC4zODQ2MTU0LDI2Ljk0Nzg3NTEgMTguMzg0NjE1NCwyNi41NDMyMDk5IEwxOC4zODQ2MTU0LDE5Ljc0NDg1NiBDMTguMzg0NjE1NCwxOS4zNDAxOTA3IDE4LjU0MTY2NTIsMTguOTk2MjI5IDE4Ljg1NTc2OTIsMTguNzEyOTYzIEMxOS4xNjk4NzMyLDE4LjQyOTY5NjkgMTkuNTUxMjgwNiwxOC4yODgwNjU4IDIwLDE4LjI4ODA2NTggQzIwLjQ0ODcxOTQsMTguMjg4MDY1OCAyMC44MzAxMjY4LDE4LjQyOTY5NjkgMjEuMTQ0MjMwOCwxOC43MTI5NjMgQzIxLjQ1ODMzNDgsMTguOTk2MjI5IDIxLjYxNTM4NDYsMTkuMzQwMTkwNyAyMS42MTUzODQ2LDE5Ljc0NDg1NiBMMjEuNjE1Mzg0NiwyNi41NDMyMDk5IFogTTIwLDE1LjgwNDI5ODEgQzE5LjQ0NDQ0MjcsMTUuODA0Mjk4MSAxOC45NzIyMjQsMTUuNjE5MzY4NyAxOC41ODMzMzMzLDE1LjI0OTUwNDYgQzE4LjE5NDQ0MjcsMTQuODc5NjQwNiAxOCwxNC40MzA1MjU1IDE4LDEzLjkwMjE0OTEgQzE4LDEzLjM3Mzc3MjYgMTguMTk0NDQyNywxMi45MjQ2NTc1IDE4LjU4MzMzMzMsMTIuNTU0NzkzNSBDMTguOTcyMjI0LDEyLjE4NDkyOTUgMTkuNDQ0NDQyNywxMiAyMCwxMiBDMjAuNTU1NTU3MywxMiAyMS4wMjc3NzYsMTIuMTg0OTI5NSAyMS40MTY2NjY3LDEyLjU1NDc5MzUgQzIxLjgwNTU1NzMsMTIuOTI0NjU3NSAyMiwxMy4zNzM3NzI2IDIyLDEzLjkwMjE0OTEgQzIyLDE0LjQzMDUyNTUgMjEuODA1NTU3MywxNC44Nzk2NDA2IDIxLjQxNjY2NjcsMTUuMjQ5NTA0NiBDMjEuMDI3Nzc2LDE1LjYxOTM2ODcgMjAuNTU1NTU3MywxNS44MDQyOTgxIDIwLDE1LjgwNDI5ODEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDIwLjAwMDAwMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMjAuMDAwMDAwLCAtMjAuMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
			colorClass = "fb-color-warning";
		}else if(fb.type == 'danger'){
			src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9kYW5nZXI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iRWxlbWVudC1ndWlkZWxpbmUtdjAuMi40IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTWVzc2FnZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYwLjAwMDAwMCwgLTMzMi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW4puWAvuWQkV/kv6Hmga8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMzMyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl9kYW5nZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIGZpbGw9IiNGRjQ5NDkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuODE3MjYyNywxNi4zNDUxNzk2IEMyNS45MzkwOTAyLDE2LjIyMzM0ODMgMjYsMTYuMDc2MTQxOCAyNiwxNS45MDM1NTIzIEMyNiwxNS43MzA5NjI4IDI1LjkzOTA5MDIsMTUuNTgzNzU2MyAyNS44MTcyNjI3LDE1LjQ2MTkyODkgTDI0LjUwNzYxNTcsMTQuMTgyNzQxMSBDMjQuMzg1Nzg4MiwxNC4wNjA5MTM3IDI0LjI0MzY1NzUsMTQgMjQuMDgxMjE5NiwxNCBDMjMuOTE4NzgxNywxNCAyMy43NzY2NTEsMTQuMDYwOTEzNyAyMy42NTQ4MjM1LDE0LjE4Mjc0MTEgTDIwLDE3LjgzNzU2MzUgTDE2LjMxNDcyMTYsMTQuMTgyNzQxMSBDMTYuMTkyODkwMiwxNC4wNjA5MTM3IDE2LjA1MDc1OTUsMTQgMTUuODg4MzIxNiwxNCBDMTUuNzI1ODg3NiwxNCAxNS41ODM3NTY5LDE0LjA2MDkxMzcgMTUuNDYxOTI5NCwxNC4xODI3NDExIEwxNC4xNTIyODI0LDE1LjQ2MTkyODkgQzE0LjA1MDc1ODIsMTUuNTgzNzU2MyAxNCwxNS43MzA5NjI4IDE0LDE1LjkwMzU1MjMgQzE0LDE2LjA3NjE0MTggMTQuMDUwNzU4MiwxNi4yMjMzNDgzIDE0LjE1MjI4MjQsMTYuMzQ1MTc5NiBMMTcuODM3NTYwOCwyMC4wMDAwMDE5IEwxNC4xNTIyODI0LDIzLjY1NDgyNDMgQzE0LjA1MDc1ODIsMjMuNzc2NjUxNyAxNCwyMy45MjM4NTgyIDE0LDI0LjA5NjQ0NzcgQzE0LDI0LjI2OTAzNzIgMTQuMDUwNzU4MiwyNC40MTYyNDM3IDE0LjE1MjI4MjQsMjQuNTM4MDcxMSBMMTUuNDYxOTI5NCwyNS44MTcyNTg5IEMxNS41ODM3NTY5LDI1LjkzOTA4NjMgMTUuNzI1ODg3NiwyNiAxNS44ODgzMjE2LDI2IEMxNi4wNTA3NTk1LDI2IDE2LjE5Mjg5MDIsMjUuOTM5MDg2MyAxNi4zMTQ3MjE2LDI1LjgxNzI1ODkgTDIwLDIyLjE2MjQzNjUgTDIzLjY1NDgyMzUsMjUuODE3MjU4OSBDMjMuNzc2NjUxLDI1LjkzOTA4NjMgMjMuOTE4NzgxNywyNiAyNC4wODEyMTk2LDI2IEMyNC4yNDM2NTc1LDI2IDI0LjM4NTc4ODIsMjUuOTM5MDg2MyAyNC41MDc2MTU3LDI1LjgxNzI1ODkgTDI1LjgxNzI2MjcsMjQuNTM4MDcxMSBDMjUuOTM5MDkwMiwyNC40MTYyNDM3IDI2LDI0LjI2OTAzNzIgMjYsMjQuMDk2NDQ3NyBDMjYsMjMuOTIzODU4MiAyNS45MzkwOTAyLDIzLjc3NjY1MTcgMjUuODE3MjYyNywyMy42NTQ4MjQzIEwyMi4xMzE5ODA0LDIwLjAwMDAwMTkgTDI1LjgxNzI2MjcsMTYuMzQ1MTc5NiBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
			colorClass = "fb-color-danger";
		}
		var dom = '<div class="fb-message fb-position-fixed fb-transition " id="fb-'+id+'">\
			            <img class="fb-inlineBlock" src="'+src+'" alt="">\
			            <p class="fb-inlineBlock fb-font14 '+colorClass+'">'+fb.content+'</p>\
			        </div>';
		$("body").append(dom);
		var obj = $("#fb-"+id+"");
		setTimeout(function(){
			obj.addClass("fb-fade-enter");
		},0);
		setTimeout(function(){
			obj.removeClass("fb-fade-enter");
			setTimeout(function(){
				obj.remove();
			},100)
		},fb.time);
	};

	fbUi.loading = function(options){
		var that = this;
		this.mask();
		var defaults = {
			color:'#fff',
			time:null,
            content:'',
        };
		var fb = $.extend(defaults,options || {});
		var dom = '<div class="fb-loading fb-z1000 fb-position-fixed">\
				<svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\
				    <circle fill="none" stroke="'+fb.color+'" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" transform="rotate(19.7745 50 50)">\
				      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="5s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>\
				  </circle>\
				  <circle fill="none" stroke="'+fb.color+'" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39" transform="rotate(-19.7745 50 50)">\
				      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="5s" from="0 50 50" to="-360 50 50" repeatCount="indefinite"></animateTransform>\
				  </circle>\
				  <g fill="'+fb.color+'">\
				  <rect x="30" y="35" width="5" height="30" transform="translate(0 1.50709)">\
				    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.1"></animateTransform>\
				  </rect>\
				  <rect x="40" y="35" width="5" height="30" transform="translate(0 3.50709)">\
				    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.2"></animateTransform>\
				  </rect>\
				  <rect x="50" y="35" width="5" height="30" transform="translate(0 4.49291)">\
				    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>\
				  </rect>\
				  <rect x="60" y="35" width="5" height="30" transform="translate(0 2.49291)">\
				    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4"></animateTransform>\
				  </rect>\
				  <rect x="70" y="35" width="5" height="30" transform="translate(0 0.492914)">\
				    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.5"></animateTransform>\
				  </rect>\
				  </g>\
				</svg>\
				<p style="color:'+fb.color+'">'+fb.content+'</p>\
			</div>';
		$("body").append(dom);
		if(fb.time != null ){
			setTimeout(function(){
				that.closeLoading();
			},fb.time)
		}
	};
	fbUi.closeLoading = function(){
		$(".fb-loading").remove();
		this.closeMask();
	};
	fbUi.mask = function(options,callback){

		var defaults = {
			
        };
		var fb = $.extend(defaults,options || {});
		var dom = '<div class="fb-mask fb-z999"></div>';
		$("body").append(dom);
		if(callback){
			$(".fb-mask").one("click",function(){
				callback();
			})
		}
	};
	fbUi.closeMask = function(){
		$(".fb-mask").remove();
	}
	//********* 实例方法  **************
	












    //轮播图
    fbUi.prototype.banner_fade = function(options){
    	var $el = element[0];
		var defaults = {
            speed : 1200,//unit: 滑动速度
            interval : 5000,//unit:轮播图间隔
            autoPlay: true,
            width:1920,
            height:'100%',
            transitionalStyle:"fb-banner-img-big"
        };
		var fb = $.extend(defaults, options || {});
		var imgLength = $el.find(".fb-banner-fade-item").length    //图片个数
		,run = null //轮播图 ID
		,bannerIndex = 0 ;
		$el.find('.fb-banner-fade-item img').css({"width":fb.width,"height":fb.height,"marginLeft":"-"+fb.width/2+'px'})
		$el.find(".fb-spot-item").on("click",function(){
			var i = $(this).index();
			if(bannerIndex == i){
				return;
			}
			bannerIndex = i;
			go(i);
		});
		$el.find(".fb-banner-prev").on("click",{dir:0},pageGo);
		$el.find(".fb-banner-next").on("click",{dir:1},pageGo);
		//上一页 下一页
		function pageGo(event){
			$el.find(".fb-banner-prev").off("click",pageGo);
			$el.find(".fb-banner-next").off("click",pageGo);
			var flag = event.data.dir;
			if(!flag){
				i = --bannerIndex < 0 ? imgLength-1 : bannerIndex;
			}else{
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;

			}
			bannerIndex = i;
			go(i);
			setTimeout(function(){
				$el.find(".fb-banner-prev").on("click",{dir:0},pageGo);
				$el.find(".fb-banner-next").on("click",{dir:1},pageGo);
			},fb.speed)
		};
		function go(i){
			$el.find(".fb-banner-spot .fb-spot-item").eq(i).addClass("fb-spot-item-active").siblings(".fb-spot-item").removeClass("fb-spot-item-active");
			$el.find(".fb-banner-fade-item").eq(i).show().find("img").removeAttr("style").addClass(fb.transitionalStyle).animate({"width":fb.width,"height":fb.height,"marginLeft":"-"+fb.width/2,"opacity":"1"},fb.speed,function(){$(this).removeClass(fb.transitionalStyle)}).end().siblings(".fb-banner-fade-item").fadeOut("1000");
		};
		//定时
		if(fb.autoPlay){
			$el.hover(function(){clearInterval(run)},function(){bannerRun()});
			bannerRun();
		}function bannerRun(){
			run = setInterval(function(){
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;
				bannerIndex = i;
				go(i);
			},fb.interval);
		};
	};
	fbUi.prototype.banner_slide = function(options){
		var $el = element[0];
		var defaults = {
			speed : 500,//unit: 滑动速度
			interval : 5000,//unit:轮播图间隔
			autoPlay: true,
			width:$('.fb-banner-slide').width(),
		};
		var fb = $.extend(defaults, options || {});
		var imgLength = $el.find(".fb-banner-fade-item").length    //图片个数
			,run = null //轮播图 ID
			,bannerIndex = 0 ;
		$el.find('.fb-banner-slide-item img').css({"width":fb.width})
		$el.find(".fb-spot-item").on("click",function(){
			var i = $(this).index();
			if(bannerIndex == i){
				return;
			}
			bannerIndex = i;
			go(i);
		});
		$el.find(".fb-banner-prev").on("click",{dir:0},pageGo);
		$el.find(".fb-banner-next").on("click",{dir:1},pageGo);
		//上一页 下一页
		function pageGo(event){
			$el.find(".fb-banner-prev").off("click",pageGo);
			$el.find(".fb-banner-next").off("click",pageGo);
			var flag = event.data.dir;
			if(!flag){
				i = --bannerIndex < 0 ? imgLength-1 : bannerIndex;
			}else{
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;

			}
			bannerIndex = i;
			go(i);
			setTimeout(function(){
				$el.find(".fb-banner-prev").on("click",{dir:0},pageGo);
				$el.find(".fb-banner-next").on("click",{dir:1},pageGo);
			},fb.speed)
		};
		function go(i){
			$el.find(".fb-banner-spot .fb-spot-item").eq(i).addClass("fb-spot-item-active").siblings(".fb-spot-item").removeClass("fb-spot-item-active");
			var w = $el.width();
			$el.find(".fb-banner-slide-zone").animate({
				left: -w*i
			},fb.speed)
		};
		//定时
		if(fb.autoPlay){
			$el.hover(function(){clearInterval(run)},function(){bannerRun()});
			bannerRun();
		}function bannerRun(){
			run = setInterval(function(){
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;
				bannerIndex = i;
				go(i);
			},fb.interval);
		};
		$(window).on("resize",function(){
			var w = $el.width();
			$el.find('.fb-banner-slide-item img').css({"width":w});
			$el.find(".fb-banner-slide-zone").animate({
				left: -w*bannerIndex
			},fb.speed)
		})
	};
	// 多图轮播
	fbUi.prototype.figureCarousel = function(options){
		var $el = element[0];
		var defaults = {
            speed : 500,//unit: 滑动速度
            interval : 1000,//unit:轮播图间隔
            autoPlay: true,
            showNum:5,
            width:400, //图片宽度
            height:150, //图片高度
            boxWidth:400, //大盒子宽度  不传默认 = 图片
            boxHeight:150, //大盒子高度
			pagination:false //分页器
        };
		var fb = $.extend(defaults, options || {});
		if(!options.boxWidth)
			fb.boxWidth = fb.width;
		if(!options.boxHeight)
			fb.boxHeight = fb.height;
		var imgLength = Math.ceil($el.find(".fb-figureCarousel-item").length/fb.showNum)    //图片个数
		,bannerIndex = 0
		,boxWidth= $el.find(".fb-figureCarousel-boxOverflow").width() //父盒子的宽度
		,item_margin = (boxWidth-fb.boxWidth*fb.showNum)/(fb.showNum*2)  //小盒子的间距
		,figureCarouselTime=null //计时器;
		//设置每个子盒子的宽度
		$el.find(".fb-figureCarousel-item").css({"width":fb.boxWidth,"height":fb.boxHeight,"margin-left":item_margin,"margin-right":item_margin});
		$el.find(".fb-figureCarousel-item img").css({"width":fb.width,"height":fb.height});
		var PW=$el.find(".fb-figureCarousel-item").outerWidth(true)*fb.showNum;
		$el.find(".fb-figureCarousel-left").on("click",{dir:0},pageGo);
		$el.find(".fb-figureCarousel-right").on("click",{dir:1},pageGo);
		//上一页 下一页
		function pageGo(event){
			var i;
			$el.find(".fb-figureCarousel-left").off("click",pageGo);
			$el.find(".fb-figureCarousel-right").off("click",pageGo);
			var flag = event.data.dir;
			if(!flag){
				i = --bannerIndex < 0 ? imgLength-1 : bannerIndex;
			}else{
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;
			}
			bannerIndex = i;
			go(i);
			setTimeout(function(){
				$el.find(".fb-figureCarousel-left").on("click",{dir:0},pageGo);
				$el.find(".fb-figureCarousel-right").on("click",{dir:1},pageGo);
			},fb.speed)
		};
		function go(i){
			$el.find(".fb-figureCarousel-spot .fb-spot-item").eq(i).addClass("fb-spot-item-active").siblings(".fb-spot-item").removeClass("fb-spot-item-active");
			$el.find(".fb-figureCarousel-box").animate({
			 	"left":-PW*i
			 },fb.speed);
		};
		if(fb.autoPlay){
			//自动滚动
			autoPlayFun();
			function autoPlayFun(){
				figureCarouselTime = setInterval(function(){
					var i  = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;
					bannerIndex = i;
					go(i);
				},fb.interval);
			}
			
			$el.hover(function(){
				clearInterval(figureCarouselTime);
			},function(){
				autoPlayFun();
			})
		}
		if(fb.pagination){
			//imgLength
			var dom ='';
			for(var n = 0;n<imgLength;n++){
				if( n == 0){
					dom += '<div class="fb-spot-item fb-inlineBlock fb-spot-item-active"></div>';

				}else{
					dom += '<div class="fb-spot-item fb-inlineBlock"></div>';

				}
			}
			$el.find(".fb-figureCarousel-spot").html(dom);
			$el.find(".fb-spot-item").on("click",function(){
				var i = $(this).index(".fb-figureCarousel-spot .fb-spot-item");
				go(i);
			})
		}
	};
	// 无缝滚动  $fb(".one").seamlessScrolling();
	fbUi.prototype.seamlessScrolling = function(options){
		var $el = element[0];
		var defaults = {
            speed : 20,//unit: 滑动速度
            width : 200,
            height : 200,
            boxWidth: 200,//大盒子宽度  不传默认 = 图片
            boxHeight:200,
            margin : 20
        };
		var fb = $.extend(defaults, options || {});
        if(!options.boxWidth)
			fb.boxWidth = fb.width;
		if(!options.boxHeight)
			fb.boxHeight = fb.height;
		$el.find(".fb-seamlessScrolling-item").css({"width":fb.boxWidth,"height":fb.boxHeight,"margin-left":fb.margin,"margin-right":fb.margin});
		$el.find(".fb-seamlessScrolling-item img").css({"width":fb.width,"height":fb.height});
		var imgLength = $el.find(".fb-seamlessScrolling-item").length,
		itemWidth = $el.find(".fb-seamlessScrolling-item").outerWidth(true),
		se_t = null,se_long=0;
		$el.find(".fb-seamlessScrolling-overflow").css("width",itemWidth*imgLength*2).append($el.find(".fb-seamlessScrolling-overflow").html())
		seamlessScrolling_run();
		function seamlessScrolling_run(){
            se_t = setInterval(function(){
               		se_long += 1;
                	$el.find(".fb-seamlessScrolling-overflow").css("left",-se_long);
                if(se_long >= imgLength*220){
                    $el.find(".fb-seamlessScrolling-overflow").css("left",0);
                    se_long = 0;
                }
            },fb.speed)
        }
        $el.hover(function(){
        	clearInterval(se_t)
        },function(){
			seamlessScrolling_run();
        })
	}
	//判断盒子移入移出的方向  fbUi.MouseDirection(".entrance-item",{enter:function($element, dir,i){console.log(dir,i)},leave:function($element, dir,i){console.log(dir,i) }})
	fbUi.prototype.MouseDirection = function (opts) {
		    var $el = element[0];
		    //enter leave代表鼠标移入移出时的回调
		    opts = $.extend({}, {
		        enter: $.noop,
		        leave: $.noop
		    }, opts || {});

		    var dirs = ['top', 'right', 'bottom', 'left'];

		    var calculate = function (element, e) {
		        /*以浏览器可视区域的左上角建立坐标系*/

		        //表示左上角和右下角及中心点坐标
		        var x1, y1, x4, y4, x0, y0;

		        //表示左上角和右下角的对角线斜率
		        var k;

		        //用getBoundingClientRect比较省事，而且它的兼容性还不错
		        var rect = element.getBoundingClientRect();

		        if (!rect.width) {
		            rect.width = rect.right - rect.left;
		        }

		        if (!rect.height) {
		            rect.height = rect.bottom - rect.top;
		        }

		        //求各个点坐标 注意y坐标应该转换为负值，因为浏览器可视区域左上角为(0,0)，整个可视区域属于第四象限
		        x1 = rect.left;
		        y1 = -rect.top;

		        x4 = rect.left + rect.width;
		        y4 = -(rect.top + rect.height);

		        x0 = rect.left + rect.width / 2;
		        y0 = -(rect.top + rect.height / 2);

		        //矩形不够大，不考虑
		        if (Math.abs(x1 - x4) < 0.0001) return 4;

		        //计算对角线斜率
		        k = (y1 - y4) / (x1 - x4);

		        var range = [k, -k];

		        //表示鼠标当前位置的点坐标
		        var x, y;

		        x = e.clientX;
		        y = -e.clientY;

		        //表示鼠标当前位置的点与元素中心点连线的斜率
		        var kk;

		        kk = (y - y0) / (x - x0);

		        //如果斜率在range范围内，则鼠标是从左右方向移入移出的
		        if (isFinite(kk) && range[0] < kk && kk < range[1]) {
		            //根据x与x0判断左右
		            return x > x0 ? 1 : 3;
		        } else {
		            //根据y与y0判断上下
		            return y > y0 ? 0 : 2;
		        }
		    };

		    $el.on('mouseenter', function (e) {
		    	var i = $(this).index();
		        var r = calculate(this, e);
		        opts.enter($el,dirs[r],i);
		    }).on('mouseleave', function (e) {
		    	var i = $(this).index();
		        var r = calculate(this, e);
		        opts.leave($el, dirs[r],i);
		    });		
	};
	//在线客服   fbUi.online();
	fbUi.prototype.online = function(){
		$(".fb-aFloatTools_Show").click(function(){
	      $('.fb-divFloatToolsView').animate({width:'show',opacity:'show'},100,function(){$('.fb-divFloatToolsView').show();});
	      $('.fb-aFloatTools_Show').hide();
	      $('.fb-aFloatTools_Hide').show();
	    });
	    $(".fb-aFloatTools_Hide").click(function(){
	      $('.fb-divFloatToolsView').animate({width:'hide', opacity:'hide'},100,function(){$('.fb-divFloatToolsView').hide();});
	      $('.fb-aFloatTools_Show').show();
	      $('.fb-aFloatTools_Hide').hide();
	    });
	};
	//放大镜   fbUi.magnifier();
	fbUi.prototype.magnifier = function(options){
		var $el = element[0];
		var defaults = {
            width:660,
            height:440,
        };
		var fb = $.extend(defaults, options || {});
		var osmall = $(".fb-smallImg"),
		imgHover = $(".fb-imgHover"),
		obig = $(".fb-bigImg"),
		elTop = $el.offset().top
		;
		$el.css({"height":fb.height});
		osmall.find("img").css({"width":fb.width,"height":fb.height});
		obig.find("img").css({"width":fb.width*2,"height":fb.height*2});
		$el.on("mousemove",function(e){
			$(".fb-imgHover,.fb-bigImg").show();
			var e = e || window.event;
			var left = e.pageX - osmall.offset().left - 90 ; 
			var top =  e.pageY - osmall.offset().top - 90 ;
			left = left < 0 ? 0 : left;
			left = left > fb.width-180 ? fb.width-180 : left;
			top = top > fb.height-180? fb.height-180 : top;
			top = top < 0 ? 0 : top;
			imgHover.css({"top":top,"left":left})
			var bigleft = left * 2 ;
			var bigtop = top * 2 ;
			obig.find("img").css({"marginTop":-bigtop+"px","marginLeft":-bigleft+"px"})

		})
		$el.on("mouseout",function(){
			$(".fb-imgHover,.fb-bigImg").hide();
		})
		$(window).on("scroll",function(){
			var top = $(window).scrollTop();
			if(top > elTop+80){
				obig.css("top",top-elTop+80)
			}else{
				obig.css("top",80)

			}
		})
	};
	//时间控件
	fbUi.prototype.showDate = function(options,succfun){
		var $el = element[0];
		var defaults = {
           dateControl:true, //年
           monthControl:false, //月
           dayControl:false,//日
           timeControl:false, //时
           minuteControl:false,//分
           secondsControl:false,//秒
        };
		var fb = $.extend(defaults, options || {});
		var date = new Date(),
		nowyear = date.getFullYear(),
		yearDom='',
		monthDom='',
		dayDom='',
		value={
			year:"",month:"",day:"",hours:"",minutes:"",seconds:""
		}
		count=0,//总个数
		bindevent = {
			init: function(){
				//初始化控件
				var input_top = $el.offset().top+$el.outerHeight();
				var input_left = $el.offset().left;
				var initHtml = '<div class="fb-showdate fb-position-absolute" style="top:'+input_top+'px;left:'+input_left+'px">\
									<div class="fb-showdate-tab"><div class="fb-showdate-close fb-position-absolute">关闭</div></div>\
									<div class="fb-showdate-model"></div>\
								</div>';
				$(".fb-showdate").remove();//移除之前的控件
				$("body").append(initHtml);

				if(fb.dateControl){
					//存在年月日控件
					$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-year fb-float-left fb-font14 fb-color-222 ">年份<span class="fb-font12"></span></div>');
					$(".fb-showdate .fb-showdate-model").append('<div class="fb-showdate-model-item fb-showdate-model-year fb-clearfix" style="display:block"></div>');
	 				this.getYear()
					
					if(fb.monthControl){
						//存在日期控件控件
						$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-month fb-float-left fb-font14 fb-color-222 ">月份<span class="fb-font12"></span></div>')
						$(".fb-showdate .fb-showdate-model").append('<div class="fb-showdate-model-item fb-showdate-model-month fb-clearfix"></div>');
             		}
					if(fb.dayControl){
						//存在日期控件控件
						$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-day fb-float-left fb-font14 fb-color-222 ">日期<span class="fb-font12"></span></div>')
						$(".fb-showdate .fb-showdate-model").append('<div class="fb-showdate-model-item fb-showdate-model-day fb-clearfix"></div>');
             		}
				}
				if(fb.timeControl){
					//存在时 分 秒控件
					$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-hours fb-float-left fb-font14 fb-color-222 ">时<span></span></div>')
					$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-minutes fb-float-left fb-font14 fb-color-222 ">分<span></span></div>')
					if(fb.secondsControl){
						$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-seconds fb-float-left fb-font14 fb-color-222 ">秒<span></span></div>')
					}
				}
				count = $(".fb-showdate .fb-showdate-tab .fb-showdate-tab-item").length;
			},
			getYear : function(year,month){
				yearDom = ''; //清空前面的数据
				for(var i = 1990 ; i <= nowyear ; i++){
					yearDom += '<span class="fb-float-left fb-font14 " value="'+i+'">'+i+'</span>';
				}
				$(".fb-showdate-model-year").html(yearDom);

			},
			getMonth : function(){
				monthDom = ''; //清空前面的数据
				for(var i = 1 ; i <= 12 ; i++){
					var value = i < 10 ? "0"+i : i;
					
					monthDom += '<span class="fb-float-left fb-font14 " value="'+value+'">'+value+'</span>';
				}
				$(".fb-showdate-model-month").html(monthDom).fadeIn(200);

			},
			getDay : function(year,month){
				dayDom = ''; //清空前面的数据
				var dayNum = new Date(year,month,0).getDate();
				for(var i = 1 ; i <= dayNum ; i++){
					var value = i < 10 ? "0"+i : i;
					dayDom += '<span class="fb-float-left fb-font14 "  value="'+value+'">'+value+'</span>';
				}
				$(".fb-showdate-model-day").html(dayDom).fadeIn(200);
			},
			getValue : function(){
				$(".fb-showdate").remove();
				var val = '';
				if(fb.dateControl){
					val += '-'+value.year;
				}
				if(fb.monthControl){
					val += '-'+value.month;
				}
				if(fb.dayControl){
					val += '-'+value.day;
				}
				if(fb.timeControl){
					val += ' '+value.timeVal;
				}
				if(fb.minuteControl){
					val += ':'+value.minuteVal;
				}
				if(fb.secondsControl){
					val += ':'+value.secondsVal;
				}
				val = val.substring(1)
				$el.val(val);
				if(succfun){
					succfun(val);
				}
			},
			closeDate:function(){
				$(".fb-showdate").remove();
			}
		};
		// 选择年份
		$("body").on("click",".fb-showdate-model-year span",function(){
			$(".fb-showdate-model-year").hide();
			value.year = $(this).attr("value");
			$(".fb-showdate-tab-year span").text(value.year);
			bindevent.getMonth();
			if( !fb.monthControl && !fb.dayControl && !fb.timeControl && !fb.minuteControl && !fb.secondsControl ){
				bindevent.getValue();
			}
		})
		// 选择月份
		$("body").on("click",".fb-showdate-model-month span",function(){
			$(".fb-showdate-model-month").hide();
			value.month = $(this).attr("value");
			$(".fb-showdate-tab-month span").text(value.month);
			bindevent.getDay(value.year,value.month);
			if(!fb.dayControl && !fb.timeControl && !fb.minuteControl && !fb.secondsControl ){
				bindevent.getValue();
			}
		})
		// 选择日期
		$("body").on("click",".fb-showdate-model-day span",function(){
			$(".fb-showdate-model-month").hide();
			value.day = $(this).attr("value");
			$(".fb-showdate-tab-day span").text(value.day);
			if(fb.timeControl){
				//有时间控件
				// bindevent.getDay(value.year,value.month);
			}else{
				bindevent.getValue();
			}
			
		})
		//关闭
		$("body").on("click",".fb-showdate-close",function(){
			bindevent.closeDate();
		})
		$el.on("focus",function(){
			bindevent.init();
			$(this).blur();
		})

		
		
	};
	//模拟下拉
	fbUi.prototype.select = function(){
		var $el = element[0];
		var defaults = {
            con:[],
        };
		var fb = $.extend(defaults, options || {});
		$el.focus(function(){
			$('.artwork').addClass('show_div');
			$('#type').blur();
		});
	};
	// 表单验证 
	fbUi.prototype.formValidator = function(options,func){
		var $el = element[0];
		var fb_testHook = {
		    // 验证合法邮箱
		    is_email: function(field){return regexs.email.test( field );},
		    // 验证合法 ip 地址
		    is_ip: function(field){return regexs.ip.test( field);},
		    // 验证传真
		    is_fax:function(field){return regexs.fax.test( field );},
		    // 验证座机
		    is_tel:function(field){return regexs.fax.test( field );},
		    // 验证手机
		    is_phone:function(field){return regexs.phone.test( field );},
		    // 验证URL
		    is_url:function(field){return regexs.url.test( field );},
		    // 是否为必填
		    required: function(field) {
		        var value = field;
		        if ((field.type === 'checkbox') || (field.type === 'radio')) {
		            return (field.checked === true);
		        }
		        //不为空 ：true  为空 ：false
		        return (value.val() !== null && value.val() !== '');
		    },
		    // 最大长度
		    max_length: function(field, length){
		        if (!regexs.numericRegex.test(length)) return false;
		        //符合长度 ：true
		        return ( field.length <= parseInt(length, 10));
		    },
		    // 最小长度
		    min_length: function(field, length){
		        if (!regexs.numericRegex.test(length)) return false;
		        //符合长度 ：true
		        return ( field.length >= parseInt(length, 10));
		    },
		    // 验证是否为数字
		    is_number: function(field){return regexs.numericRegex.test(field);},
		    //验证是否相等 传name
		    is_equal:function(field01,field02){
		    	return field01 == field02;
		    }
		    
		}
		var defaults = {
            
        };
		var fb = $.extend(defaults, options || {});
		$el.on("submit",function(){
			$.each(fb,function(a,b){
				form_flag = false;
				if(b.rules){
					//有规则
					switch(b.rules) {
						case 'required': 
							var val = $el.find("[name=\""+b.name+"\"]");
							if(!fb_testHook.required(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_email': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(!fb_testHook.is_email(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_ip': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(fb_testHook.is_ip(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_tel': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(fb_testHook.is_tel(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_phone': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(fb_testHook.is_phone(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_url': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(fb_testHook.is_url(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_fax': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(fb_testHook.is_fax(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_number': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							if(!fb_testHook.is_number(val)){
								$fb.fbNews({"type":"danger","content":b.display});
								form_flag = true;
								return false;
							}
							break;
						case 'is_equal': 
							var val = $el.find("[name=\""+b.name+"\"]").val();
							var equalVal = $el.find("[name=\""+b.equalName+"\"]").val();
							if(!fb_testHook.is_equal(equalVal,val)){
								$fb.fbNews({"type":"danger","content":b.equaldisplay});
								form_flag = true;
								return false;
							}
							break;
						default:
							// $fb.fbNews({"type":"danger","content":""});
							break;
					}

				}

				//有限制字数
				if(b.maxLength){
					var val = $el.find("[name=\""+b.name+"\"]").val();
					if(!fb_testHook.max_length(val,b.maxLength)){
						if(b.maxdisplay)
							$fb.fbNews({"type":"danger","content":b.maxdisplay});
							form_flag = true;
							return false;
					}
				}
				if(b.minLength){
					var val = $el.find("[name=\""+b.name+"\"]").val();
					if(!fb_testHook.min_length(val,b.minLength)){
						if(b.mindisplay)
							$fb.fbNews({"type":"danger","content":b.mindisplay});
							form_flag = true;
							return false;
					}
				}
			});
			if(form_flag){
				return false;
			}
			if(func){
				func($el);
			}else{
			
				$el.onsubimt()
			}
			return false; //阻止form提交

		})
		
	};
   window.$fb = window.fbUi = fbUi;
})(window,$);

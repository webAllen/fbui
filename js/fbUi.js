;(function(window, $) {
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
	//​显示模态弹窗 showModal
	fbUi.showModal = function(options,succFn){
		var defaults = {
            title : '提示',//提示的标题
            content : '',//提示的内容
        };
		var fb = $.extend(defaults, options || {});
		$(".fb-showModal").remove();
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
				succFn();
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



	//********* 实例方法  **************
	
    //轮播图
    fbUi.prototype.banner_fade = function(options){
    	var $el = element[0];
		var defaults = {
            speed : 1200,//unit: 滑动速度
            interval : 5000,//unit:轮播图间隔
            autoPlay: true
        };
		var fb = $.extend(defaults, options || {});
		var imgLength = $el.find(".fb-spot-item").length    //图片个数
		,run = null //轮播图 ID
		,bannerIndex = 0 ;
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
			$el.find(".fb-banner-fade-item").eq(i).show().find("img").removeAttr("style").addClass("fb-banner-img-big").animate({"width":1920,"height":"500","marginLeft":"-960px","opacity":"1"},fb.speed,function(){$(this).removeClass("fb-banner-img-big")}).end().siblings(".fb-banner-fade-item").fadeOut("1000");
		};
		//定时
		if(fb.autoPlay){
			$el.hover(function(){clearInterval(run)},function(){bannerRun()});
			bannerRun();
		}
		
		function bannerRun(){
			run = setInterval(function(){
				i = ++bannerIndex > imgLength-1 ? 0 : bannerIndex;
				bannerIndex = i;
				go(i);
			},fb.interval);
		};
	};
	// 多图轮播
	fbUi.prototype.figureCarousel = function(options){
		var $el = element[0];
		var defaults = {
            speed : 500,//unit: 滑动速度
            interval : 5000,//unit:轮播图间隔
            autoPlay: true,
            showNum:5
        };
		var fb = $.extend(defaults, options || {});
		var imgLength = Math.ceil($el.find(".fb-figureCarousel-item").length/fb.showNum)    //图片个数
		,bannerIndex = 0,PW=$(".fb-figureCarousel-item").outerWidth(true)*fb.showNum;
		$el.find(".fb-figureCarousel-left").on("click",{dir:0},pageGo);
		$el.find(".fb-figureCarousel-right").on("click",{dir:1},pageGo);
		//上一页 下一页
		function pageGo(event){
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
			 $el.find(".fb-figureCarousel-box").animate({
			 	"left":-PW*i
			 },fb.speed);
		};

	};
	// 无缝滚动  $fb(".one").seamlessScrolling();
	fbUi.prototype.seamlessScrolling = function(options){
		var $el = element[0];
		var defaults = {
            speed : 20,//unit: 滑动速度
        };
		var fb = $.extend(defaults, options || {});
		// parameter =
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
                	console.log(se_long)
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
		console.log(obig.position())
	};
	//时间控件
	fbUi.prototype.showDate = function(options){
		var $el = element[0];
		var defaults = {
           dateControl:true,
           timeControl:false,
           dayControl:true,
           secondsControl:true,
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
				var initHtml = '<div class="fb-showdate">\
									<div class="fb-showdate-tab"></div>\
									<div class="fb-showdate-model"></div>\
								</div>';
				$(".fb-showdate").remove();//移除之前的控件
				$("body").append(initHtml);
				if(fb.dateControl){
					//存在年月日控件
					$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-year fb-float-left fb-font14 fb-color-222 ">年份<span class="fb-font12"></span></div>');
					$(".fb-showdate .fb-showdate-model").append('<div class="fb-showdate-model-item fb-showdate-model-year fb-clearfix" style="display:block"></div>');
	 				this.getYear()
					$(".fb-showdate .fb-showdate-tab").append('<div class="fb-showdate-tab-item fb-showdate-tab-month fb-float-left fb-font14 fb-color-222 ">月份<span class="fb-font12"></span></div>')
					$(".fb-showdate .fb-showdate-model").append('<div class="fb-showdate-model-item fb-showdate-model-month fb-clearfix"></div>');
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
				for(var i = 1990 ; i <= nowyear ; i++){
					yearDom += '<span class="fb-float-left fb-font14 " value="'+i+'">'+i+'</span>';
				}
				$(".fb-showdate-model-year").html(yearDom);

			},
			getMonth : function(){
				for(var i = 1 ; i <= 12 ; i++){
					var value = i < 10 ? "0"+i : i;
					console.log(value)
					monthDom += '<span class="fb-float-left fb-font14 " value="'+value+'">'+value+'</span>';
				}
				$(".fb-showdate-model-month").html(monthDom).fadeIn(200);
			},
			getDay : function(year,month){
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
				if(fb.timeControl){
					//有时间控件
					if(fb.dateControl){
						//有日期控件
						if(fb.secondsControl){
							//有秒控件
						}else{

						}
					}
				}else if(fb.dateControl){
					//有日期控件
					if(fb.dayControl){
						//有日数控件
						val = value.year + "-" + value.month + "-" + value.day ;
					}else{

					}
				}

				$el.val(val)
			}
		};
		// 选择年份
		$("body").on("click",".fb-showdate-model-year span",function(){
			$(".fb-showdate-model-year").hide();
			value.year = $(this).attr("value");
			$(".fb-showdate-tab-year span").text(value.year);
			bindevent.getMonth();
		})
		// 选择月份
		$("body").on("click",".fb-showdate-model-month span",function(){
			$(".fb-showdate-model-month").hide();
			value.month = $(this).attr("value");
			$(".fb-showdate-tab-month span").text(value.month);
			bindevent.getDay(value.year,value.month);
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
		bindevent.init();
		
	};
    window.$fb = window.fbUi = fbUi;



})(window,$);

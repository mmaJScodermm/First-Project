'use strict';
function VQuery(vArg){
	this.elements=[];
	this.domString='';
	switch(typeof vArg){
		case 'function':
			domReady(vArg);
			break;
		case 'string':
			if(vArg.indexOf('<')!=-1){
				this.domString=vArg;
			}else{
				this.elements=getEle(vArg);
			}
			break;
		default:
			this.elements.push(vArg);
	}
};
//find 在某个父级下找到需要的子级
VQuery.prototype.find=function(str){
	var aParent=this.elements;
	var aChild=getEle(str,aParent);
	return $(aChild);
};
VQuery.prototype.each=function(fn){
	for (var i=0;i<this.elements.length;i++) {
		fn.call(this.elements[i],i,this.elements[i]);
	}
};
//插件 $.fn.插件名=function(){code};    VQuery.prototype.插件名=function(){code}
$.fn=VQuery.prototype;
$.fn.extend=VQuery.prototype.extend=function(json){
	for(var name in json){
		VQuery.prototype[name]=json[name];
	}
};
//获取当前的index值
VQuery.prototype.index=function(){
	var obj=this.elements[0];
	var oParent=obj.parentNode;
	for(var i=0;i<oParent.children.length;i++){
		if(obj==oParent.children[i]){
			return i;
		}
	}
	return this;
};

//eq 获取某一个元素 返回的是vquery对象
VQuery.prototype.eq=function(n){
	return $(this.elements[n]);
};
//get 将vq对象转换成js对象
VQuery.prototype.get=function(n){
	return this.elements[n];
};
//非标单内容设置 .html
VQuery.prototype.html=function(str){
	if(str || str==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML=str;
		}
	}else{
		return this.elements[0].innerHTML;
	}
	return this;
}
//表单元素内容设置 .val
VQuery.prototype.val=function(str){
	if(str || str==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].value=str;
		}
	}else{
		return this.elements[0].value;
	}
	return this;
};
//show()
VQuery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='block';
	}
	return this;
};
VQuery.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
	}
	return this;
};
//removeCLass
VQuery.prototype.removeClass=function(sClass){
	var reg=new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<this.elements.length;i++){
		if(reg.test(this.elements[i].className)){
			this.elements[i].className=this.elements[i].className.replace(/^\w+|\w+$/g,'').replace(reg,'').replace(/\w+/g,' ');
		}
	}
	return this;
};
//添加一个class
VQuery.prototype.addClass=function(sClass){
	var reg=new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className){
			if(!reg.test(this.elements[i].className)){
				this.elements[i].className=''+sClass;
			}
		}else{
			this.elements[i].className=sClass;
		}
	}
	return this;
};
//子级追加到父级 $('<div></div>').appendTo('#div1')
VQuery.prototype.appendTo=function(str){
	var aParent=getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
	}
	return this;
};
VQuery.prototype.prependTo=function(str){
	var aParent=getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('afterBegin',this.domString);
	}
	return this;
};
VQuery.prototype.insertBefore=function(str){
	var aParent=getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
	}
	return this;
};
VQuery.prototype.insertAfter=function(str){
	var aParent=getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertadjacentHTML('afterEnd',this.domString);
	}
	return this;
};
'click mouseover mousedown mouseup mousemove mouseout keydown keyup load resize focus blur'.replace(/\w+/g,function(sEv){
	VQuery.prototype[sEv]=function(fn){
		for(var i=0;i<this.elements.length;i++){

			addEvent(this.elements[i],sEv,fn);
		}
		return this;
	};
});
VQuery.prototype.remove=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
	return this;
};
VQuery.prototype.mouseover=function(fn){
	for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],'mouseenter',fn);
		}
	return this;
};
VQuery.prototype.mouseout=function(fn){
	for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],'mouseleave',fn);
		}
	return this;
};
VQuery.prototype.hover=function(fnover,fnout){
	this.mouseover(fnover);
	this.mouseout(fnout);
	return this;
};
//设置css  .css();
VQuery.prototype.css=function(name,value){
	if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[name]=value;
		}
	}else{
		if(typeof name=='string'){

			return getStyle(this.elements[0],name)
		}else{
			var json = name;
			for(var i=0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].style[name]=json[name];
				};
			}
		}
	}
	return this;
};
//设置自定义属性
VQuery.prototype.attr=function(name,value){
	if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value)
		}
	}else{
		if(typeof name=='string'){
			return this.elements[0].getAttribute(name);
		}else{
			var json = name;
			for(var i=0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].setAttribute(name,json[name])
				};
			}
		}
	}
	return this;
};
//添加绑定事件
VQuery.prototype.on=function(sEv,fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],sEv,fn);
	}
}
//getStyle
function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
};
function $(vArg){
	return new VQuery(vArg);
}
//domreay
function domReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			fn && fn();
		},false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn && fn();
			}
		})
	}
}
//addEvent
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var oEvent=ev || event;
			if(fn.apply(obj,arguments)==false){
				oEvent.cancelBubble=true;
				oEvent.preventDefault();
			}
		},false);
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			var oEvent=ev || event;
			if(fn.apply(obj,arguments)==false){
				oEvent.cancelBubble=true;
				return false;
			}
		});
	}
}
//toggle
VQuery.prototype.toggle=function(){
	var arg=arguments;
	var count=0;
	var _this=this;
	for(var i=0;i<this.elements.length;i++){
		(function(count){
			addEvent(_this.elements[i],'click',function(){
				var fn=arg[count%arg.length];
				fn && fn();
				count++;
			})
		})(0)
	}
	return this;
}
function getEle(str,aParent){
	var aChild=[];
	var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);
	var aParent=aParent || [document];
	
	for (var i = 0; i < arr.length; i++) {
		aChild=getStr(aParent,arr[i]);
		aParent=aChild;
	}
	return aChild;
}
function getStr(aParent,str){
	var aChild=[];
	for(var i=0;i<aParent.length;i++){
		switch(str.charAt(0)){
			case '#':
			    var obj=document.getElementById(str.substring(1));
				aChild.push(obj);
				break;
			case '.':
				var aEle=getByClass(aParent[i],str.substring(1));
				for(var j=0;j<aEle.length;j++){
					aChild.push(aEle[j]);
				}
				break;
			default:
				if(/\w+\.\w+/.test(str)){
					var aStr=str.split('.')
					var aEle=aParent[i].getElementsByTagName(aStr[0]);
					var reg=new RegExp('\\b'+aStr[1]+'\\b')
					for(var j=0;j<aEle.length;j++){
						if(reg.test(aEle[j].className)){
							aChild.push(aEle[j]);
						}
					}
				}else if(/\w+:\w+(\(\d+\))?/.test(str)){
					var aStr=str.split(/:|\(|\)/);
					var aEle=aParent[i].getElementsByTagName(aStr[0]);
					switch(aStr[1]){
						case 'first':
							aChild.push(aEle[0]);
							break;
						case 'last':
							aChild.push(aEle[aEle.length-1]);
							break;
						case 'odd'://奇数个
							for(var j=1;j<aEle.length;j+=2){
								aChild.push(aEle[j]);
							}
							break;
						case 'even':
							for(var j=0;j<aEle.length;j+=2){
								aChild.push(aEle[j]);
							}
							break;
						case 'eq':
							aChild.push(aEle[aStr[2]]);
							break;
						case 'lt':
							var n=aStr[2];
							for(var j=0;j<n;j++){
								aChild.push(aEle[j]);
							}
							break;
						case 'gt':
							var n=aStr[2];
							for(var j=n;j<aEle.length;j++){
								aChild.push(aEle[j]);
							}
							break;
						default:
							break;
					}
				}else{
					var aEle=aParent[i].getElementsByTagName(str);
					for(var j=0;j<aEle.length;j++){
						aChild.push(aEle[j]);
					}
				}
				break;
		};
	}
	return aChild;
}
function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var aEle=oParent.getElementsByTagName('*');
		var reg=new RegExp('\\b'+sClass+'\\b');
		var arr=[];
		for(var i=0;i<aEle.length;i++){
			if(reg.test(aEle[i].className)){
				arr.push(aEle[i]);
			}
		}
		return arr;
	}
}
VQuery.prototype.animate=function(json,options){
	
	for (var i=0;i<this.elements.length;i++) {

		move(this.elements[i],json,options);
	};
	return this;
};
$.ajax=VQuery.ajax=function(json){
	ajax(json);
};
$.jsonp=VQuery.jsonp=function(json){
	jsonP(json);
};


//ajax
function ajax(json){
	json=json || {};
	if(!json.url){
		console.log('url别忘记了！');
		return;
	}
	json.type=json.type || 'get';//提交类型
	json.data=json.data || {};
	json.time=json.time  || 5000;
	var timer=null;
	clearTimeout(timer);
	if (window.XMLHttpRequest) {
		var oAjax=new XMLHttpRequest();
	} else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
	}
	switch (json.type.toLowerCase()){
		case 'get':
			oAjax.open('GET',json.url+'?'+json2url(json.data),true);
			oAjax.send();
			break;
		case 'post':
			oAjax.open('POST',json.url,true);
			oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			oAjax.send(json2url(json.data));
			break;
	}
	//网络加载
	json.fnLoading &&　json.fnLoading();
	
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4)
		{
			json.complete && json.complete();
			if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
				json.success && json.success(oAjax.responseText);
			}else{
				json.error && json.error(oAjax.status);
			}
			clearTimeout(timer);
		}
	};
	//网络超时
	timer=setTimeout(function(){
		alert('您的网络不给力啊');
		oAjax.onreadystatechange=null;
	},json.time);
};
function json2url(json){
	json.t=Math.random();
	var arr=[];
	for(var name in json){
		arr.push(name+'='+json[name]);
	}
	return arr.join('&');
};
//jsonp
function jsonP(json){
	json=json || {};
	if(!json.url){
		console.log('请传接口链接地址');
		return;
	}
	json.data=json.data || {};
	json.cbName=json.cbName || 'cb';
	
	var fnName='jsonp_'+Math.random();
	fnName=fnName.replace('.','');
	window[fnName]=function(jsonD){
		json.success &&　json.success(jsonD);
		
		//删除script
		oHead.removeChild(oS);
	};
	json.data[json.cbName]=fnName;
	var arr=[];
	for (var name in json.data) {
		arr.push(name+'='+json.data[name]);
	}
	var oHead=document.getElementsByTagName('head')[0];
	var oS=document.createElement('script');
	oS.src=json.url+'?'+arr.join('&');
	oHead.appendChild(oS);
};
//move
function move(obj,json,options){
	options=options || {};
	options.duration=options.duration || 1000;
	options.easing=options.easing || 'ease-out';
	clearInterval(obj.timer);
	var count=Math.floor(options.duration/30);
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		dis[name]=json[name]-start[name];

	}
	var n=0;

	obj.timer=setInterval(function(){
		n++;	
		for(var name in json){
			switch(options.easing){
				case 'linear':
				var a=n/count;
				var cur=start[name]+dis[name]*a;
				break;
				case 'ease-in':
				var a=n/count;
				var cur=start[name]+dis[name]*Math.pow(a,3);
				break;
				case 'ease-out':
				var a=1-n/count;
				var cur=start[name]+dis[name]*(1-Math.pow(a,3));
				break;
			}
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.complete && options.complete();
		}
	},30)
}



























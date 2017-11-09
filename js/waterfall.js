var _scrollTop;
+function(){
     waterfall('main','box');
	 window.onscroll = scroll;
	 
	 var main = document.getElementById('main');
     var larBox = document.getElementById('larBox'); 
     main.addEventListener('click',loadLargeImg,false);
	 larBox.addEventListener('click',function(){
	 	main.style.display = 'block';
	 	window.onscroll = scroll;
	 	document.documentElement.scrollTop = _scrollTop;
	 	document.body.scrollTop = _scrollTop;
		//重置大图src
		var larImg = larBox.getElementsByTagName('img')[0];
		larImg.src = "";
		larBox.style.display = 'none';

	 },false);   
}();







function waterfall(parent,box){
	//将main下的所有class为box的元素取出来
     var oParent = document.getElementById(parent);
	 var boxes = getByClass(oParent,box);   //存放所有的box的数组
	 //计算整个页面显示的页数
	 var boxW = boxes[0].offsetWidth;  //content+padding+border
	 var cols = Math.floor(document.documentElement.clientWidth/boxW);
     //为了居中和在浏览器视口改变时保持列数一定，需要main具有宽度且宽度不变
	 oParent.style.cssText = "width:"+boxW*cols+"px";

	 var hArr = []; //存放每一行元素高度的数组
	 for (var i= 0;i<boxes.length ;i++ ){
		 if(i<cols){
		     hArr.push(boxes[i].offsetHeight);
		 }else{
			 var minH = Math.min.apply(null,hArr);
			 var index = getMinHIndex(hArr,minH);
		     boxes[i].style.position = 'absolute';
			 boxes[i].style.top = minH+'px';
			 boxes[i].style.left = boxes[index].offsetLeft+'px';  //index*boxW+'px';
			 hArr[index] += boxes[i].offsetHeight;
		}
	 }
}

function getByClass(parent,claName){
     var boxArr = new Array(),  //用来存储获取到的所有class为指定参数的元素
           oElements = parent.getElementsByTagName('*');
     for(var i=0; i<oElements.length; i++){
	       if(oElements[i].className == claName){
		        boxArr.push(oElements[i]);
		   }
	 }
	 return boxArr;
}

//添加class
function addClass(ele,className){
     if(ele.className){
		 var claArr = ele.className.split(' ');
		 for(var i in claArr){   //如果元素中原来有这个class，那么就没必要再添加
			 if (claArr[i]==className){
				 return;
			 }
		 }	 
	     ele.className += (' '+className);
	 }else{
	     ele.className = className;
	 }
}

//获取数组中最小值
function getMinHIndex(arr,val){
    for(var i=0;i<arr.length;i++){
	    if(arr[i] == val){
		   return i;
		}
	}
}

//检测是否具备加载数据块的条件
function checkScrollSlide(){
    var oParent = document.getElementById('main');
	var boxes = getByClass(oParent,'box');
	var lastBoxH = boxes[boxes.length-1].offsetTop+Math.floor(boxes[boxes.length-1].offsetHeight/2);
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var winHeight = document.body.clientHeight || document.documentElement.clientHeight;
	return (lastBoxH<scrollTop+winHeight)?true:false;
}
//滚动事件触发时调用函数
function scroll(){
    if(checkScrollSlide()){
	     loadImg();
		 waterfall('main','box');
    }
}

//当滚动条到达页面底部时动态加载图片
function loadImg(){
    var oParent = document.getElementById('main');
	var boxes = getByClass(oParent,'box');
	//每次加载10张
	for(var i=0;i<=10;i++){
	   var box = document.createElement('div');
	   box.className = 'box';
	   oParent.appendChild(box);
	   var img = document.createElement('img');
	   img.src = "./images/preImg/"+(boxes.length+i)+".jpg";
	   box.appendChild(img);
	}	
}

// 获取事件对象
function getEvent(event){
     return event || window.event;
}
function getScroll(string){
	 if(string.toLowerCase()=='top'){
		 return document.body.scrollTop||document.documentElement.scrollTop;
	 }else if(string.toLowerCase()=='height'){
	     return document.body.scrollHeight||document.documentElement.scrollHeight;
	 }else if(string.toLowerCase()=='wdith'){
		 return document.body.scrollWdith||document.documentElement.scrollWdith;
	 }     
}
//仅用于此例消除代码冗余的函数
function setScrollTop(winH){   
	     document.documentElement.scrollTop = (getScroll('height')-winH)/2;
	     document.body.scrollTop = (getScroll('height')-winH)/2;
}

function loadLargeImg(event){
     var event = getEvent(event);
	 var main = document.getElementById('main');
	 var larBox = document.getElementById('larBox');
	 var larImg = larBox.getElementsByTagName('img');
	
	 _scrollTop = getScroll('top');
	 window.onscroll = null;

	 larImg[0].src = event.target.src.replace("/preImg", "");
     //var reaW = larImg[0].width;     //这两句放在这里的话在IE那里会有奇葩的表现。。。不知道为什么
	 //var reaH = larImg[0].height;		//ie和其它主流浏览器对于img的宽高问题有出入
	 var winW = document.body.clientWidth || document.documentElement.clientWidth;
	 var winH = document.body.clientHeight || document.documentElement.clientHeight;
	 
	 main.style.display = 'none';
	 larBox.style.display = 'block';
	 larBox.style.height = winH+'px';
     larBox.style.zIndex = 99;
     //reset，防止横竖图切换带来的各种乱七八糟的Bug
	 larImg[0].style.width = 'auto';
	 larImg[0].style.height = 'auto';
	 larImg[0].style.marginTop = 0+'px';

	 var reaW = larImg[0].width;    //所以放在这里(设定了style.width后面)
	 var reaH = larImg[0].height;   //

	 if(reaW/reaH < 1.2){    //竖图
	      larImg[0].style.height = winH+'px';	
	 }else if(reaW>winW){   //宽度大于屏幕宽度的横图
	      larImg[0].style.width = winW+"px";
		  
		  (winH-larImg[0].scrollHeight>0)?(larImg[0].style.marginTop = (winH-larImg[0].scrollHeight)/2 + 'px'):(setScrollTop(winH));		  
	 }else if(reaH>winH){    //宽度小于屏幕宽度,高度大于屏幕高度的横图
	     larBox.style.height = reaH+'px';
		 setScrollTop(winH);
	 }else{     //宽度小于屏幕宽度，高度小于屏幕高度的横图
      	 larImg[0].style.marginTop = (winH-reaH)/2 + 'px';
	 }
	 addClass(larImg[0],'slideIn');
}   

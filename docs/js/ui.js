// 하위 브라우저 호환
document.createElement("article");
document.createElement("section");
document.createElement("aside");
document.createElement("nav");
document.createElement("header");
document.createElement("footer");
document.createElement("main");

// IE 하위 브라우저에 .ie_old 클래스 추가 => 프로젝트에 따라 변경될 수 있습니다.
getInternetExplorerVersion();
function getInternetExplorerVersion() {
	var rv = -1; // Return value assumes failure.
	$("html").addClass(navigator.appName);
	if (navigator.appName != "Microsoft Internet Explorer"){
		return;
	}
	else {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	if(rv < 11){ // IE브라우저 8버전 이하 시 ie_old 추가
		rv = 10;
		$("html").addClass("ie_old");
	}
	$("html").addClass("ie"+rv);
}


$(function(){ 
	//header 스크롤 올리면 보이고 내리면 사라지고
	let prevScrollpos = $(document).scrollTop();
	let scrollPosition = 0;
	let state="down";
	$(window).on('scroll', function(){
		var currentScrollPos = $(document).scrollTop();
		if (prevScrollpos > currentScrollPos) {
			$(".header").removeClass("hidden");
			state="up";
		} else {
			$(".header").addClass("hidden").removeClass("open");
			state="down";
			if($(document).scrollTop() <= 0){
				$(".header").removeClass("hidden");
			}
		}
		prevScrollpos = currentScrollPos;
	});

	$(window).on("touchmove",function(e){	
		e.stopPropagation();	
		if(state=="up") $(".header").removeClass("hidden");
	});

	$(".btn_clear").click(function(){
		$(this).prev().val("").focus();
	});
	//menu
	$(".btn_menu").click(function(){
		$(".header").addClass("open");
		scrollPosition = $(document).scrollTop();
		$("body").css({"overflow":"hidden", "top": (scrollPosition*-1)});
	});
	$(".btn_menu_close").click(function(){
		$(".header").removeClass("open");
		$("body").css({"overflow":"", "top":""});
		scrollPosition = 0;
	});
	$(document).on("click", function(e){
		e.stopPropagation();
		var temp = e.target.className;
		if(temp.indexOf("gnb") > -1){
			$(".header").removeClass("open");
			$("body").css({"overflow":"", "top":""});
			scrollPosition = 0;
		}
	});
	
	for (var i =0; i < $(".bx_slct").length; i++) {
		var target = $(".bx_slct").eq(i);
		if($.trim(target.find(".slct_tit").text()) === "")
		target.find(".slct_tit").text(target.find(".slct_cont .select").text());
	}
	$(".slct_tit").on("click", function (e) {
		if($(this).parent().hasClass("dis") !== true){
			if($(this).parent().hasClass("on") === true) {
				$(this).parent().removeClass("on");
			}else {
				$(".bx_slct").removeClass("on");
				$(this).parent().addClass("on");
			}
		}
	});
	$(".slct_cont li").on("click", function(){
		$(this).parents(".bx_slct").find(".slct_tit").text($(this).text());
		$(this).parent().find("li").removeClass("select");
		$(this).addClass("select");
		$(this).parents(".bx_slct").removeClass("on");
	});
	$(document).on("click", function(e){
		if(e.target.className === "bx_slct" || e.target.className === "slct_tit" || e.target.className === "slct_cont") {return false;}
		$(".bx_slct").removeClass("on");
	});
	$(".btn_search_open").on("click", function(){
		$("header .area_filter_search").addClass("on");
	});
	// 검색 영역 외 클릭시 검색창 닫기
	$(document).on("click", function(e){
		if ((e.target.className).indexOf("btn_search") > -1) { return true }
		if($(e.target).parents(".area_filter_search").length > 0 || e.target.className === "btn_search_open") {return false;}
		$("header .area_filter_search").removeClass("on");
	});
	$(document).on("click", function (e) {
		if (e.target.className === "btn_search") { return true }
		if ($(e.target).parents(".area_filter_search").length > 0 || e.target.className === "btn_search_open") { return false; }
		$("header .area_filter_search").removeClass("on");
	});
	$(".btn_search_sm_open").on("click", function(){
		$(".area_search_sm").addClass("on");
	});
	// 검색 영역 외 클릭시 검색창 닫기
	$(document).on("click", function(e){
		if ((e.target.className).indexOf("btn_search") > -1) { return true }
		if($(e.target).parents(".area_search_sm").length > 0 || e.target.className === "btn_search_sm_open") {return false;}
		$(".area_search_sm").removeClass("on");
	});

	//s:터치 이벤트 닫기
	var initialX = null;
	var initialY = null;
	var touchState = null;
	var touchStart = false;
	
	function initTouch(e) {
		initialX = `${e.touches ? e.touches[0].clientX : e.clientX}`;
		initialY = `${e.touches ? e.touches[0].clientY : e.clientY}`;
	};
	
	function swipeDirection(e) {
		if (initialX !== null && initialY !== null) {
			const currentX = `${e.touches ? e.touches[0].clientX : e.clientX}`,
			currentY = `${e.touches ? e.touches[0].clientY : e.clientY}`;
		
			var diffX = initialX - currentX,
			diffY = initialY - currentY;
		
			touchState = Math.abs(diffX) > Math.abs(diffY)? (0 < diffX? "top":"right"): (0 < diffY? "up": "down")
		
			initialX = null;
			initialY = null;
		}
	}
	//s:터치 이벤트 닫기 영역 조정
	window.addEventListener("touchstart", function(e){
		initTouch(e);
		if(e.target.className == "area_close" || e.target.className  == "btn_p_close") touchStart = true;
	});
	window.addEventListener("touchmove", function(e){
		if($(".pop_filter").hasClass("open") && touchStart== true){
			swipeDirection(e);
		}
	});
	//e:터치 이벤트 닫기 영역 조정
	window.addEventListener("touchend", function(e){
		var view = window.innerWidth >= 1080? "pc" : "mobile";
		if(touchState=="down" && view == "mobile"){
			$(".pop_filter").removeClass("open");
            $("body").css({"overflow":"", "top":""});
            scrollPosition = 0;
			touchState = null;
			touchStart = false;
		}
	});
	//e:터치 이벤트 닫기
	//v:20240319 - s:툴팁 동작
	$(".tooltip").mouseover(function(e){
		if(!fnCheckDevice()) $(e.target).parents(".tooltip").addClass("on");
	});
	$(".tooltip").mouseleave(function(e){
		if(!fnCheckDevice()) $(e.target).parents(".tooltip").removeClass("on");
	});
	$(".btn_tooltip").click(function(e){
		var target = $(e.target).parents(".tooltip");
		if(fnCheckDevice()){
			if (!target.hasClass("on")){
				$(".tooltip").removeClass("on");
				target.addClass("on");
			}
			else target.removeClass("on");
		}
	});
	$(document).on("click", function(e){
		if(fnCheckDevice() && $(".tooltip.on").length>0){
			if($(e.target).parents(".tooltip").length == 0){
				$(".tooltip").removeClass("on");
			}
		}
	});
	//v:20240319 - e:툴팁 동작

});
$(window).resize(function(){
	if($( window ).width() > 1003 && $(".header").hasClass("open")){
		$(".header").removeClass("open");
		$("body").css({"overflow":"", "top":""});
		scrollPosition = 0;
	}
});
//v:20240319 - s:툴팁 동작
function fnCheckDevice(){
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
	return isMobile;
}
//v:20240319 - e:툴팁 동작
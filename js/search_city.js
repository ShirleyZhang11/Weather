
//通过获取城市的ID来搜索天气信息比较准确	
var getCity = function(){	
	var name = $("#citySelect").val();
	var cityId = '';
	var url = "https://free-api.heweather.com/v5/search?city=" + name + "&key=3a422078f1b64362b087b05629f26ace";
	//因为ajax是以异步形式请求的，所以getjson不能改变全局的变量
	//要把加载形式改变成同步才能改变全局变量
	//var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srlimit=5&continue=-%7C%7C&sroffset=1&srsearch=rihanna&&callback=?';
	$.ajaxSettings.async = false;

	$.getJSON(url,function(data){
		
		if(!data["HeWeather5"][0]['basic']){//当搜索不到城市时添加提示信息

			
			$("#tip").text("请输入正确的城市名称");
			
			
		}
		else{

			cityId= data["HeWeather5"][0]["basic"]["id"];
			
		}
		
	});//end getjson
	
	return cityId;
	
};

//获取城市目前天气信息
var getCurrentData = function(){

	var city = getCity();

	var url = "https://free-api.heweather.com/v5/now?key=3a422078f1b64362b087b05629f26ace&city="+city ;
	
	$.getJSON(url,function(data){
		
		addData(data);		
	});
};

//添加城市目前天气信息到html上
var addData = function(data){
	var info = data['HeWeather5'][0]['now'];
	/*把content设置在这里，这样再次输入城市的时候，内容就不会重叠了*/
	var content = '';
	content += "<div>"
	content+="<h4>" + data['HeWeather5'][0]['basic']['city']+ "目前的天气状况"+ "</h4>";
	content+="<p><img src=" + " 'http://files.heweather.com/cond_icon/" + info['cond']['code'] + ".png'/>" + "</p>";
	content+= "<p>" + "天气状况: " + info['cond']["txt"] + "</p>";
	content+="<p>" + "温度: " + info['tmp'] + "</p>";
	content+="<p>" + "降水量: "+ info['pcpn'] + 'mm' + "</p>";
	content += "<p>" + "风向： " + info['wind']['dir'] + "</p>";
	content+="<p>" + "相对湿度: " + info['hum'] + "</p>";
	content+="<p>" + "更新于： " + data['HeWeather5'][0]['basic']['update']['loc'] + "</p>";
	// content+="<a href=" + "a.html"+">更多</a>"; 
	content +="</div>";
	$("#today").html(content);
};

//获取城市未来三天的天气信息
var getFutureData = function(){

	var city = getCity();
	
	var url = "https://free-api.heweather.com/v5/forecast?key=3a422078f1b64362b087b05629f26ace&city="+city;
	
	$.getJSON(url,function(data){
		
		addFutureData(data);	
		
	});
}
//把城市未来三天的天气信息添加到html上
var addFutureData = function(data){

	var info = data['HeWeather5'][0]['daily_forecast'];
	var content='';

	for(var i=0;i<info.length;i++){
		content+= "<div>";
		content+= "<h5>" + info[i]['date'] + "</h5>";
		content+= "<p>"  + "白天天气： "+ info[i]['cond']['txt_d'] +"<img src=" + "'http://files.heweather.com/cond_icon/" + info[i]['cond']['code_d'] + ".png'/>" + "</p>";
		content+= "<p>" + "夜间天气： " + info[i]['cond']['txt_n'] + "<img src=" + "'http://files.heweather.com/cond_icon/" + info[i]['cond']['code_n'] + ".png'/>" + "</p>";
		content+= "<p>" + "最高温度： " + info[i]['tmp']['max'] + "</p>";
		content+= "<p>" + "最低温度： " + info[i]['tmp']['min'] + "</p>";
		content+= "<p>" + "降水量： " + info[i]['pcpn'] +"mm" +  "</p>";
		content+= "<p>" + "相对湿度： "+  info[i]['hum'] + "</p>";
		content+="</div>";
	}
	//text和html都具有先清空再添加的特点
	$("#future_title").text( data['HeWeather5'][0]['basic']['city'] + "未来三天的天气预报");
	
	$("#future_data").html(content);
	
}
//
var begin = function(){

	var name = $("#citySelect").val();	
	//每次获取城市之前先把错误提示清空
	$("#tip").text("");
	//如果有输入内容才进行搜索
	if(name){
		getCurrentData();
		getFutureData();
		
	}else{

		$("#tip").text("请输入城市名称");
		
	};
};

$(function(){
	//点击事件触发函数获取
	$("#n_btn").on('click',begin);
	//回车事件触发
	$("#citySelect").on('keydown',function(ev){
		var ev = window.event || ev;
		if(ev.keyCode ==13 ){
			begin();
		}
	})
})








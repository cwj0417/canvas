var canvas=document.createElement('canvas');
		canvas.width=700;
		canvas.height=400;
		document.querySelectorAll('.canvas')[0].appendChild(canvas);
		ctx=canvas.getContext('2d');
		var lg=ctx.createLinearGradient(0, 250, 0, 650);
		lg.addColorStop(0,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
		lg.addColorStop(0.5,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
		lg.addColorStop(1,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
canvas.onclick=function(){
		lg=ctx.createLinearGradient(0, 250, 0, 650);
		lg.addColorStop(0,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
		lg.addColorStop(0.5,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
		lg.addColorStop(1,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
}
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var ac=new (window.AudioContext || window.webkitAudioContext);
var source=ac.createBufferSource();
var gain=ac.createGain();
	gain.gain.value=0.25;
    var ana=ac.createAnalyser();
    var size=128
    ana.fftSize=size*2;
//angular
var app=angular.module('music',[]);
app.controller('musicCtrl', function($scope,getlist){
	$scope.buffer='';
	$scope.offset=0;
	$scope.name='';
	$scope.url='';
	$scope.xhr=new XMLHttpRequest();
	getlist.success(function(a){
		$scope.musiclist=a;
	})
	$scope.playmusic=function(a,b){
		if($scope.url==a){return;}
		//get info
		$scope.canvasload();
		$scope.name=b;
		$scope.url=a;
		$scope.xhr.open('GET','songs/'+a);
		$scope.xhr.responseType = 'arraybuffer';
		$scope.xhr.onload=function(){
			ac.decodeAudioData($scope.xhr.response,function(buffer){
			$scope.buffer=buffer;
            $scope.play();
           })
		}
		$scope.xhr.send();
		
	}
	$scope.play=function(){
		source.buffer=$scope.buffer;
        source.connect(ana);
       	ana.connect(gain);
        gain.connect(ac.destination);
       	$scope.analyse();
       	source.start();
	}
	$scope.analyse=function(){
		var arr=new Uint8Array(ana.frequencyBinCount);
        requestAnimationFrame(animate);
        function animate(){
            ana.getByteFrequencyData(arr);
            $scope.draw(arr);
            requestAnimationFrame(animate);
        }
	}
	$scope.draw=function(arr){
		ctx.clearRect(0, 0, 700, 400);
		ctx.fillStyle = lg;
		var w=700/size;
		for(var i=0;i<size;i++){
			var h=arr[i]/256*400*Math.sqrt(gain.gain.value);
			ctx.fillRect(i*w, 420-h, w, h);
		}
	}
	$scope.canvasload=function(){
		ctx.clearRect(0, 0, 700, 400);
		ctx.fillStyle = "black";
		ctx.font = "bold 20px MicrosoftYahei";
		ctx.fillText("加载中，请稍候，单击改变颜色…………", 100, 100);
	}
	$scope.curmusic=function(a){
		return {a:'asdf'};
	}
})
.factory('getlist', ['$http', function ($http) {//get music list
	return $http.get('getmusiclist.php');
}])
.directive('list',function(getlist){
	return{
		restrict:'E',
		templateUrl:'tpls/list.html'
	}
})
.directive('action', function () {
	return {
		restrict: 'A',
		link: function (scope,element,attr) {
			element.bind('click',function(){
				scope.$apply(attr.action)
			})
		}
	};
})
.directive('status',function(){
	return{
		restrict:'A',
		templateUrl:'tpls/status.html',
		link:function(scope,element,attr){
			scope.$watch('volumn',function(a){
				gain.gain.value=a*a/10000;
			})
		}
	}
})
.directive('detectactive',function(){
	return{
		restrict:'A',
		link:function(s,e,a){
			console.log(s.music.name)
			var cur=s.$apply(a.detectactive);
		}
	}
})
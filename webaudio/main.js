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
//angular
var app=angular.module('music',[]);
app.factory('getlist', ['$http', function ($http) {//get music list
	return $http.get('getmusiclist.php');
}])
.factory('curinfo',function(){
	return {
		status:'stop',
		name:'',
		url:'',
		buffer:'',
		gain:0.25
	}
})
.controller('musicCtrl', function($scope,getlist,curinfo){
	$scope.buffer=curinfo.buffer;
	$scope.offset=curinfo.offset;
	$scope.name=curinfo.name;
	$scope.url=curinfo.url;
	$scope.playtime=0;
	$scope.playhd=null;//counthandler
	$scope.period=0;
	$scope.isanimate=false;
	$scope.isplaying=false;
	$scope.ispause=false;
	$scope.mode='loop';
	$scope.xhr=new XMLHttpRequest();
	getlist.success(function(a){
		$scope.musiclist=a;
	})
	$scope.playmusic=function(a,b){
		if($scope.url==a){
			if(curinfo.status=='start'){$scope.pause();}else{$scope.continue();}
			return;
		}
		//get info
		if(curinfo.status=='stop'){
			curinfo.status='start';
		}else{
			$scope.source.stop();
			$scope.xhr.abort();
		}
		$scope.newcontext();
		$scope.canvasload();
		$scope.name=b;
		$scope.url=a;
		$scope.xhr.open('GET','songs/'+a);
		$scope.xhr.responseType = 'arraybuffer';
		$scope.gain.gain.value=$scope.volumnagent*$scope.volumnagent/10000;
		$scope.xhr.onload=function(){
			$scope.ac.decodeAudioData($scope.xhr.response,function(buffer){
			$scope.buffer=buffer;
            $scope.play();
           })
		}
		$scope.xhr.send();
		
		
	}
	$scope.play=function(){
		var offset=arguments[0]?arguments[0]:0;
		$scope.source.buffer=$scope.buffer;
        $scope.source.connect($scope.ana);
       	$scope.ana.connect($scope.gain);
        $scope.gain.connect($scope.ac.destination);
       	$scope.analyse();
       	$scope.source.start(0,offset,$scope.source.buffer.duration-offset);
       	$scope.period=$scope.source.buffer.duration;
       	$scope.playtime=offset;
       	$scope.isplaying=true;
        $scope.playhd=setInterval(function(){
        	$scope.$apply(function(){
        		$scope.playtime++;
        	})
        },1000)
       	
	}
	$scope.analyse=function(){
		var arr=new Uint8Array($scope.ana.frequencyBinCount);
		if($scope.isanimate){return;}
		$scope.isanimate=true;
        requestAnimationFrame(animate);
        function animate(){
            $scope.ana.getByteFrequencyData(arr);
            $scope.draw(arr);
            requestAnimationFrame(animate);
        }
	}
	$scope.draw=function(arr){
		ctx.clearRect(0, 0, 700, 400);
		ctx.fillStyle = lg;
		var w=700/$scope.size;
		for(var i=0;i<$scope.size;i++){
			var h=arr[i]/256*400*Math.sqrt($scope.gain.gain.value);
			ctx.fillRect(i*w, 420-h, w, h);
		}
	}
	$scope.canvasload=function(){
		ctx.clearRect(0, 0, 700, 400);
		ctx.fillStyle = "black";
		ctx.font = "bold 20px MicrosoftYahei";
		ctx.fillText("加载中，请稍候，单击改变颜色…………", 100, 100);
	}
	$scope.pause=function(){
		$scope.source.stop();
		curinfo.status='stop';
		clearInterval($scope.playhd);
		$scope.xhr.abort();
		$scope.isplaying=false;
		$scope.ispause=true;
	}
	$scope.continue=function(){
		$scope.newcontext();
		$scope.play($scope.playtime);
		curinfo.status='start';
		$scope.ispause=false;
		$scope.isplaying=true;
	}
	$scope.newcontext=function(){
		$scope.ac=new (window.AudioContext || window.webkitAudioContext);
		$scope.source=$scope.ac.createBufferSource();
		$scope.gain=$scope.ac.createGain();
		$scope.ana=$scope.ac.createAnalyser();
		$scope.size=128
		$scope.ana.fftSize=$scope.size*2;
		$scope.source.onended=function(){
			if($scope.playtime==Math.floor($scope.source.buffer.duration)){
				switch($scope.mode) {
					case 'loop':
						$scope.newcontext();
						$scope.playtime=0;
						$scope.play($scope.playtime);
						$scope.ispause=false;
						$scope.isplaying=true;
						break;
					case 'order':
						console.log('order')
						break;
					case 'random':
						console.log('random')
						break;
				}
			}
		}
	}
	$scope.test=function(){
		console.log($scope)
	}
	$scope.$watch('volumnagent',function(a){
		$scope.gain.gain.value=a*a/10000;
	})
})
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
				scope.$apply(attr.action);
				element.siblings().removeClass('selected');
				element.addClass('selected');
			})
		}
	};
})
.directive('status',function(curinfo){
	return{
		restrict:'A',
		templateUrl:'tpls/status.html'
	}
})
.directive('processbar',function(curinfo){
	return{
		restrict:'AE',
		template:"<input type='range' value='0' min='0' step='1' max='100'>",
		link:function(s,e,a){
			var bar=e[0].firstChild;
			bar.style.width='500px';
			s.$watch('playtime',function(a){
				bar.value=a;
				bar.title=a;
			})
			s.$watch('period',function(a){
				bar.max=a;
			})
			bar.onchange=function(){
				s.pause();
				s.playtime=bar.value;
				s.continue();
			}
		}
	}
})
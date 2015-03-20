var app=angular.module('music',[]);
app.controller('musicCtrl', function($scope,getlist){
	getlist.success(function(a){
		$scope.musiclist=a;
	})
	$scope.playmusic=function(a){
		
	}
})
.factory('getlist', ['$http', function ($http) {
	return $http.get('getmusiclist.php');
}])
.directive('list',function(getlist){
	return{
		restrict:'E',
		templateUrl:'tpls/list.html',
		link:function(){

		}
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
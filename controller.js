angular.module('ArteHack', [])

.controller('mainController', function($scope, $http) {

	$scope.ARTE_BASE_URL = 'http://arte.tv/papi/tvguide/videos/stream/player/F/'; //044979-004_PLUS7-F/HBBTV/SQ.json

	$scope.video_format = 'HBBTV';
	$scope.video_quality = 'SQ';
	$scope.arte_url = '';
	$scope.video_url = ''


	$scope.showURL = function () {

		var videoIdPattern = new RegExp(/\d*\-\d*/);

		//$scope.video_url 
		var videoId = videoIdPattern.exec($scope.arte_url)[0];

		var urlJSON = $scope.ARTE_BASE_URL + videoId + '_PLUS7-F/' + $scope.video_format + '/' + $scope.video_quality + '.json';
		var responsePromise = $http.get(urlJSON);

        responsePromise.success(function(data, status, headers, config) {
        	var videosObj = data.videoJsonPlayer.VSR
        	
        	for (var key in videosObj) {
        		if (!videosObj.hasOwnProperty(key)) {
        			continue;
        		}

        		if (videosObj[key].versionCode == "VOF-STF") {
        			$scope.video_url = videosObj[key].url;
        			break;
        		}
        	}
        });

        responsePromise.error(function(data, status, headers, config) {
            alert('Oops... Something bad happened :(');
        });
	}
});

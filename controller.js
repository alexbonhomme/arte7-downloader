angular.module('ArteHack', [])

.controller('mainController', function($scope, $http) {

	$scope.ARTE_BASE_URL = 'http://arte.tv/papi/tvguide/videos/stream/player/F/'; //044979-004_PLUS7-F/HBBTV/SQ.json

	$scope.video_format = 'HBBTV';
	$scope.video_quality = 'SQ';
	$scope.video_lang = 'VF';

	$scope.arte_url = '';
	$scope.video_url = '';


	$scope.showURL = function () {
		if (! $scope.arte_url ) {
			return false;
		}

		var videoIdPattern = new RegExp(/\d*\-\d*/);
		var videoId = videoIdPattern.exec($scope.arte_url)[0];

		var urlJSON = $scope.ARTE_BASE_URL + videoId + '_PLUS7-F/' + $scope.video_format + '/' + $scope.video_quality + '.json';
		var responsePromise = $http.get(urlJSON);

        responsePromise.success(function(data, status, headers, config) {
        	var videosObj = data.videoJsonPlayer.VSR
        	
        	var videoLangPattern = buildLangPattern($scope.video_lang);

        	for (var key in videosObj) {
        		if (!videosObj.hasOwnProperty(key)) {
        			continue;
        		}

        		if (videoLangPattern.test(videosObj[key].versionCode)) {
        			$scope.video_url = videosObj[key].url;
        			break;
        		}
        	}

        	if (! $scope.video_url) {
        		addAlert('Oops... I have not found the video in this language :-/');
        	}
        });

        responsePromise.error(function(data, status, headers, config) {
            addAlert('Oops... Something really bad happened :-(');
        });
	}

	/* 
	   Return a regex obj to match the correct libelle in the JSON file
	   regarding to the selected language for the video.
	 */
	function buildLangPattern(lang) {
		switch(lang) {
			case 'VA':
				return new RegExp(/^V[O]?A/);

			case 'VF':
				return new RegExp(/^V[O]?F/);
		}
	}


	function addAlert(message) {
		var escapedMessage = message.replace(/'/g, "\\\'");

		$('#alert').append('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><p>' + escapedMessage + '</p></div>');
	}
});

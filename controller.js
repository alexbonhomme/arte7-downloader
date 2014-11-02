angular.module('ArteHack', [])

.controller('mainController', function($scope, $http) {

    const ARTE_BASE_URL = 'http://arte.tv/papi/tvguide/videos/stream/player/{text_lang}/{video_id}_PLUS7-{text_lang}/{video_format}/{video_quality}.json';
    const VIDEO_TO_TEXT_LANG = {
        'VF': 'F',
        'VA': 'D'
    }

    $scope.params = {};
    $scope.params.video_format = 'HBBTV';
    $scope.params.video_quality = 'SQ';
    $scope.params.video_lang = 'VF';
    $scope.params.text_lang = 'F';

    $scope.arte_url = '';

    $scope.video_url = '';
    $scope.video_title = '';
    $scope.video_sub_title = '';
    $scope.video_description = '';
    $scope.video_duration = '';


    $scope.showURL = function () {
        if (! $scope.arte_url ) {
            return false;
        }

        // get the video id from given url
        var videoIdPattern = new RegExp(/\d*\-\d*/);
        $scope.params.video_id = videoIdPattern.exec($scope.arte_url)[0];

        // set the text lang code
        $scope.params.text_lang = VIDEO_TO_TEXT_LANG[$scope.params.video_lang];

        // build the JSON url and GET the file
        var urlJSON = buildJSONUrl($scope.params);
        var responsePromise = $http.get(urlJSON);

        // process JSON file
        responsePromise.success(function(data, status, headers, config) {
            
            // Get some meta data about the video
            $scope.video_title = data.videoJsonPlayer.VTI;
            $scope.video_sub_title = data.videoJsonPlayer.VSU;
            $scope.video_description = data.videoJsonPlayer.VDE;
            $scope.video_duration = data.videoJsonPlayer.VDU;

            var videosObj = data.videoJsonPlayer.VSR
            
            // build regex pattern form lang code
            var videoLangPattern = buildLangPattern($scope.params.video_lang);

            // search the video link according to the language
            for (var key in videosObj) {
                if (!videosObj.hasOwnProperty(key)) {
                    continue;
                }

                if (videoLangPattern.test(videosObj[key].versionCode)) {
                    $scope.video_url = videosObj[key].url;
                    break;
                }
            }

            // no video found
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
    function buildLangPattern (video_lang) {
        switch(video_lang) {
            case 'VA':
                return new RegExp(/^V[O]?A/);

            case 'VF':
                return new RegExp(/^V[O]?F/);
        }
    }

    function addAlert (message) {
        var escapedMessage = message.replace(/'/g, "\\\'");

        $('#alert').append('<div class="alert alert-danger alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><p>' + escapedMessage + '</p></div>');
    }

    /*
        Return the url to the required video 
        according to the given parameters
    */
    function buildJSONUrl(parameters) {
        return ARTE_BASE_URL.replace(/{[^{}]+}/g, function (key) {
            return parameters[key.replace(/[{}]+/g, '')] || '';
        });
    }
});

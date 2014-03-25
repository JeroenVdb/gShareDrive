'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('mainController', ['$scope', function($scope) {
	}])
	.controller('fileListController', ['$scope', function($scope) {
		$scope.items = [];
	}])
	.controller('MyCtrl1', [function() {

	}])
	.controller('MyCtrl2', [function() {

	}]);

// var myApp = angular.module('myApp', []);

// myApp.controller('MyCtrl1', function ($scope, $http, $interval) {
// 	$scope.name = "jeroen";
// });

// myApp.controller('MyCtrl2', function ($scope, $http, $interval) {
// 	$scope.name = "jeroen2";
// });

var gComm = (function () {

	var checkAuth = function() {

		gapi.auth.authorize(
			{'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},
			handleAuthResult
		);

	}

	function handleAuthResult(authResult) {

		if (authResult) {
			// Access token has been successfully retrieved, requests can be sent to the API
			gapi.client.load('drive', 'v2', authCallback);
		} else {
			// No access token could be retrieved, force the authorization flow.
			gapi.auth.authorize(
				{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
				handleAuthResult
			);
		}
	}

	function authCallback() {

		getShareFolder();
		getUserInfo();

	}

	function getShareFolder() {

		var request = gapi.client.drive.files.list({
			'q': "title = 'Share'"
		});

		request.execute(function(resp) {
			var folderId = resp.items[0].id;

			getFilesFromSharedFolder(folderId);
		});
	}

	function getFilesFromSharedFolder(folderId) {

		var request = gapi.client.drive.children.list({
			'folderId' : folderId
		}); 

		request.execute(function(resp) {

			for(var i = 0; i < resp.items.length; i++) {
				var fileId = resp.items[i].id;
				getFileData(fileId)
			}
		});
	}

	function getFileData(fileId) {
		
		var request = gapi.client.drive.files.get({
			'fileId': fileId
		});

		request.execute(function(resp) {

			if (resp.hasOwnProperty('thumbnailLink')) {
				var scope = angular.element(document.getElementById('fileListController')).scope();
				scope.$apply(function(){
					scope.items.push(resp);
				})

				var client = new ZeroClipboard(document.getElementsByTagName('button'));
			}

		});
	}

	function getUserInfo() {

		var request = gapi.client.drive.about.get();
		request.execute(function(resp) {
			var scope = angular.element(document.getElementById('mainController')).scope();
			scope.$apply(function(){
				scope.name = resp.name
			})
		});

	}

	return {
		checkAuth:checkAuth,
		getShareFolder:getShareFolder,
		getUserInfo:getUserInfo
	};

})();
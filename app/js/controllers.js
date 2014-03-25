'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('mainController', ['$scope', function($scope) {
		console.log("jeroen");
		$scope.name = "jeroen";
	}])
	.controller('fileListController', ['$scope', function($scope) {
		$scope.name = 'jeroen2'
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
			gapi.client.load('drive', 'v2', getShareFolder);
		} else {
			// No access token could be retrieved, force the authorization flow.
			gapi.auth.authorize(
				{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
				handleAuthResult
			);
		}
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

			// var scope = angular.element(document.getElementById('fileListController')).scope();
		 //    scope.$apply(function(){
		 //        scope.name = 'Superhero';
		 //    })

			// for(var i = 0; i < resp.items.length; i++) {
			// 	var fileId = resp.items[i].id;
			// 	getFileData(fileId)
			// }
		});
	}

	function getFileData(fileId) {
		
		var request = gapi.client.drive.files.get({
			'fileId': fileId
		});

		request.execute(function(resp) {
			console.log('Title: ' + resp.thumbnailLink);

			if (resp.hasOwnProperty('thumbnailLink')) {
				var img = new Image();  ///params are optional 
				img.src = resp.thumbnailLink;
				document.body.appendChild(img);
			}

		});
	}

	return {
		checkAuth:checkAuth,
		getShareFolder:getShareFolder
	};

})();
'use strict';

/* App Module */
var favoureat = angular.module('ionicApp', ['ionic'])

favoureat.run(['$rootScope', function($scope) {
    Parse.initialize('Y1B5hJLHBTc1rd2n2yaDLfQnZ3tiYjY3gWpkpwUA', 'ZKvNGea8hIMfRxAjld4cY6kDkep9sZJiC6mKTqIt');
    var user = Parse.User.current();
    var post = Parse.Object.extend("Posting");
    var Comment = Parse.Object.extend("Comments");
    var search = Parse.Object.extend("Search");	
    $scope.user = user;
/*     console.log($scope.user.attributes.preferLimit); */
    $scope.post = post;
    $scope.Comment = Comment;
    $scope.search = search;
    var now = moment().format('LL');
    var fromNow = moment().startOf('day').fromNow();
    $scope.now = now;
    $scope.fromNow = fromNow;
    
    ionic.Platform.ready(function(){
    	if(ionic.Platform.isIOS) {
    		ionic.Platform.fullScreen(true, false);
    	} else {
	    	alert('android');
	    	ionic.Platform.fullScreen(true, false);
    	}
	});
}])

favoureat.config(function ($stateProvider, $urlRouterProvider) {
    
	$stateProvider
	    
		.state('main', {
			url: "/main",
			abstract: true,
			templateUrl: "mainMenu.html",
			controller: 'MenuCtrl',
		})
		
		.state('main.home', {
			url: "/home",
			views: {
			  'menuContent' :{
			    templateUrl: "home.html",
			    controller: "HomeCtrl"
			  }
			}
		})

		
		.state('main.listUpmyPosting', {
			url: "/listUpmyPosting",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpmyPosting.html",
			    controller: "ListUpmyPostingCtrl"
			  }
			}
		})
		
		.state('main.listUpMyPostingMap', {
			url: "/listUpMyPostingMap",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpMyPostingMap.html",
			    controller: "ListUpMyPostingMapCtrl"
			  }
			}
		})
		
		.state('main.listUpmyLike', {
			url: "/listUpmyLike",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpmyLike.html",
			    controller: "ListUpmyLikeCtrl"
			  }
			}
		})
		
		.state('main.listUpmyCheckList', {
			url: "/listUpmyCheckList",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpmyCheckList.html",
			    controller: "ListUpmyCheckListCtrl"
			  }
			}
		})
		
		.state('main.signIn', {
			url: "/signIn",
			views: {
			  'menuContent' :{
			    templateUrl: "signIn.html",
			    controller: "SignInCtrl"
			  }
			}
		})
		
		.state('main.logOut', {
			url: "/logOut",
			views: {
			  'menuContent' :{
			    templateUrl: "logOut.html",
			    controller: "LogOutCtrl"
			  }
			}
		})
		
		.state('main.signOut', {
			url: "/signOut",
			views: {
			  'menuContent' :{
			    templateUrl: "signOut.html",
			    controller: "SignOutCtrl"
			  }
			}
		})
		
		.state('main.listUpPosting', {
			url: "/listUpPosting",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpPosting.html",
			    controller: "ListUpPostingCtrl"
			  }
			}
		})
		
		.state('main.listUpComments', {
			url: "/listUpComments",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpComments.html",
			    controller: "ListUpCommentsCtrl"
			  }
			}
		})
		
		.state('main.listUpOurPostingMap', {
			url: "/listUpOurPostingMap",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpOurPostingMap.html",
			    controller: "ListUpOurPostingMapCtrl"
			  }
			}
		})
		
		.state('main.listUpLike', {
			url: "/listUpLike",
			views: {
			  'menuContent' :{
			    templateUrl: "listUpLike.html",
			    controller: "ListUpLikeCtrl"
			  }
			}
		})
	   
	    
	  
	    .state('forgotpassword', {
	      url: "/forgot-password",
	      templateUrl: "forgot-password.html"
	    })

	$urlRouterProvider.otherwise("/main/home");
})
'use strict';

favoureat.controller('MenuCtrl', function($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicLoading, service) {

	$ionicSideMenuDelegate.canDragContent(false);
		
	service.userCheck();
//    var query = new Parse.Query("Posting");
//    query.limit(50).descending("createdAt").find({
//        success : function(results) {
//            console.log(results);
//            var itemList = [];
//            for(var i in results) {
//                var item = results[i];
//                itemList.push(item);
//                $rootScope.items = itemList;
//                $rootScope.$apply();
//                var chartID = "."+item.id+"chart";
//                var total = item.attributes.valueTotal/21*100+"%";
//                var totalBar = chartID+" .total";
//                jQuery(totalBar).css({
//                    width:total
//                });
//            }
//            $state.go('main.listUpPosting');
//
//        },
//        error : function(error) {
//            console.log('error');
//        }
//    });


    $scope.toListUpmyLike = function () {
    	service.listUpmyLike();
    };
    
    $scope.toListUpmyCheckList = function () {
    	service.listUpmyCheckList();
    };
    
    $scope.toListUpMyComments = function() {
    	service.listUpMyComments();
    };
    
    $scope.toListUpLike = function () {
        service.listUpLike();
    };
	  
    $scope.closeMenu = function() {
      $ionicSideMenuDelegate.toggleLeft(false);
    };

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
      $ionicLoading.hide();
    };

    $scope.toggleRight = function() {
      $ionicSideMenuDelegate.toggleRight();
      $ionicLoading.hide();
    };
})

favoureat.controller('HomeCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, service) {

    $ionicSideMenuDelegate.canDragContent(false);






//    jQuery('.slideImage1').css({
//        'background-image' : "url("+item.attributes.photo.url()+")"
//    })
})

favoureat.controller('addPostCtrl', function ($scope, $state, $rootScope, $ionicLoading, $ionicModal, service, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);

    var Posting = Parse.Object.extend("Posting");
    $scope.post.head = "";
    $scope.post.body = "";
    $scope.sliderTaste = {};
    $scope.sliderService = {};
    $scope.sliderPrice = {};
    $scope.sliderTaste.rangeValue = 4;
    $scope.sliderService.rangeValue = 4;
    $scope.sliderPrice.rangeValue = 4;
    $scope.photoData = {};
    $scope.getPhoto = function(){
        navigator.camera.getPicture(
            function(imageData){
                $scope.photoData = imageData;
                jQuery('.photoBtn').html('Got it!!');
                service.checkLocation();
            },
            function(error){
                alert(error);
            }
            , {
                quality: 95,
                destinationType:navigator.camera.DestinationType.DATA_URL,
                sourceType:navigator.camera.PictureSourceType.CAMERA,
                allowEdit : true,
                targetWidth: 150,
                targetHeight: 150,
                correctOrientation:true
            }
        );
    };

    $scope.postSend = function(){
        $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var post = new Posting();
        var point = new Parse.GeoPoint($rootScope.location);
        var valueTaste = parseInt($scope.sliderTaste.rangeValue);
        var valueService = parseInt($scope.sliderService.rangeValue);
        var valuePrice = parseInt($scope.sliderPrice.rangeValue);
        var valueTotal = valueTaste + valueService + valuePrice;
        var parseFile = new Parse.File($rootScope.now, {base64:$scope.photoData});
        if(navigator.camera) {
            parseFile.save().then(function() {
                post.set("head", $scope.head);
                post.set("body", $scope.body);
                post.set("valueTaste", valueTaste);
                post.set("valueService", valueService);
                post.set("valuePrice", valuePrice);
                post.set("valueTotal", valueTotal);
                post.set("location", point);
                post.set("creator", $rootScope.user.id);
                post.set("when", $rootScope.now);
                //            post.setACL(new Parse.ACL($rootScope.user.id));
                post.set("photo", parseFile);
                post.save(null, {
                    success:function(post) {
                        $ionicLoading.hide();
                        $scope.modal.hide();
                        console.log(post);
                        service.listUpPosting();
                    },
                    error:function(post, error) {
                        $ionicLoading.hide();
                        $scope.modal.hide();
                        alert("Error saving"+error);

                    }
                });
            });
        } else {
            post.set("head", $scope.post.head);
            post.set("body", $scope.post.body);
            post.set("valueTaste", valueTaste);
            post.set("valueService", valueService);
            post.set("valuePrice", valuePrice);
            post.set("valueTotal", valueTotal);
            post.set("location", point);
            post.set("creator", $rootScope.user.id);
            post.set("when", $rootScope.now);
            //            post.setACL(new Parse.ACL($rootScope.user.id));
            post.save(null, {
                success:function(post) {
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    console.log(post);
                    service.listUpPosting();
                },
                error:function(post, error) {
                    $ionicLoading.hide();
                    $scope.modal.hide();
                    alert("Error saving"+error);
                }
            });
        }

    };
})

favoureat.controller('SignInCtrl', function($scope, $state, $ionicLoading, $rootScope, service, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back =function(){
        service.back();
    };
    
    $scope.signIn = function (userData) {
        $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        console.log(userData);
        var user = new Parse.User();
        user.set("username", userData.name);
        user.set("password", userData.password);
        user.set("email", userData.email);
        user.signUp(null, {
            success: function(user) {
/*                 	var user = Parse.User.current(); */
            	$rootScope.user = user;
                $scope.user = {};
				$scope.error = {};
				$state.go('main.home');
				$ionicLoading.hide();
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.user = {};
				$scope.error = {};
                $scope.$apply();
            }
        });
    };
})

favoureat.controller('LogOutCtrl', function($scope, $state, $rootScope, $ionicSideMenuDelegate, service){
    
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.back =function(){
        service.back();
    };
    
    $scope.logOut = function(form) {
        Parse.User.logOut();
        $rootScope.user = null;
        alert('signOut');
/*         $state.go('signIn'); */
    };
})

favoureat.controller('SignOutCtrl', function($scope, $state, $rootScope, $ionicSideMenuDelegate, service){
    
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.back =function(){
        service.back();
    };
    
    $scope.signOut = function() {
    	Parse.Cloud.run('getPostMyItem', { creator : $rootScope.user.id },{
			success: function(results) {
				for (var i in results){
					var bin = results[i];
					bin.destroy({
						success: function(bin) {
							console.log('delete postings');
						},
						error: function(bin, error) {
							console.log('error');
						}
					});
				}				
			},
			error: function(error) {
				console.log(error+'error');
			}
		});
		
		var relationLike = $rootScope.user.relation("likes");
    	var query = relationLike.query();
		query.find({
			success: function(results) {
				for (var i in results){
					var bin = results[i];
					bin.destroy({
						success: function(bin) {
							console.log('delete likes');
						},
						error: function(bin, error) {
							console.log('error');
						}
					});
				}
			},
			error: function(results, error) {
				console.log(error);
			}
		});
		
		var query = new Parse.Query($rootScope.Comment);
		query.equalTo("creator", $rootScope.user);
		query.find({
			success: function(results) {
				for (var i in results){
					var bin = results[i];
					bin.destroy({
						success: function(bin) {
							console.log('delete comments');
						},
						error: function(bin, error) {
							console.log('error');
						}
					});
				}
			},
			error: function(results, error) {
				console.log(error);
			}
		});
		
		var relation = $rootScope.user.relation("check");
    	var query = relation.query();
		query.find({
			success: function(results) {
				for (var i in results){
					var bin = results[i];
					bin.destroy({
						success: function(bin) {
							console.log('delete checklists');
						},
						error: function(bin, error) {
							console.log('error');
						}
					});
				}
			},
			error: function(results, error) {
				console.log(error);
			}
		});
		
		$rootScope.user.destroy({
			success: function(results) {
				alert('delete complete!!');
			},
			error: function(results, error) {
				console.log(error);
			}
		});
        Parse.User.logOut();
        $rootScope.user = null;
        alert('sign out complete!!');
    };
})


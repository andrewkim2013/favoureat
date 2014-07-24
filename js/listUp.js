'use strict';

favoureat.controller('ListUpPostingCtrl', function($scope, $state, $rootScope, service, $ionicPopup, $timeout, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);

    service.listUpPosting();

    $scope.back = function(){
        service.back();
    };

    $scope.toListUpMyPosting = function(){
        service.listUpmyPosting();
    }

    $scope.doRefresh = function() {
        console.log('Refreshing!');
        $timeout(function() {
            service.listUpPosting();
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);

    };

    $scope.putCheck = function (item) {
        var relationUserCheck = $rootScope.user.relation("check");
        relationUserCheck.add(item);
        $ionicPopup.confirm({
            title: 'check',
            subTitle: 'you really want to check?'
        }).then(function (res) {
            if(res){
                $rootScope.user.save(null, {
                    success: function(result) {
                        console.log('success');
                    },
                    error: function(result, error) {
                        console.log(error);
                    }
                });
            } else {
                console.log('not sure');
            }
        });
    };

    $scope.popMap = function(item){
        service.viewMap(item);
    };

    $scope.popPhoto = function(item){
        service.viewPhoto(item);
        var notepad = "." + item.id+"notepadArea";
        jQuery(notepad).toggle();
    };

    $scope.popChart = function(item){
        service.viewChart(item);
    };

    $scope.showCommentTaste = function(item){
        var commentTaste = "."+item.id+"commentTaste";
        jQuery(commentTaste).fadeIn('slow', function(){
            jQuery(commentTaste).animate({
                marginLeft:170,
            }, 2000, function(){
                jQuery(commentTaste).fadeOut('slow', function(){
                    jQuery(commentTaste).css({
                        marginLeft:0,
                    });
                });
            });
        });
    };

    $scope.showCommentService = function(item){
        var commentService = "."+item.id+"commentService";
        jQuery(commentService).fadeIn('slow', function(){
            jQuery(commentService).animate({
                marginLeft:170,
            }, 2000, function(){
                jQuery(commentService).fadeOut('slow', function(){
                    jQuery(commentService).css({
                        marginLeft:0,
                    });
                });
            });
        });
    };

    $scope.showCommentPrice = function(item){
        var commentPrice = "."+item.id+"commentPrice";
        jQuery(commentPrice).fadeIn('slow', function(){
            jQuery(commentPrice).animate({
                marginLeft:170,
            }, 2000, function(){
                jQuery(commentPrice).fadeOut('slow', function(){
                    jQuery(commentPrice).css({
                        marginLeft:0,
                    });
                });
            });
        });
    };

    $scope.showComments = function(item) {
        var commentBtn = "."+item.id+"commentBtn";
        jQuery('.notepadArea').addClass('blur');
        jQuery('.postRightBtn').fadeOut('fast', function(){
            jQuery('.closeComments').fadeIn();
            jQuery('.postLeftBtn').fadeOut('fast', function(){
                jQuery('.commentBtn').fadeIn();
            });
            service.queryComments(item);
        });





        jQuery('.commentBtn').on('click', function(){
            var comment = new $scope.Comment();

            $ionicPopup.prompt({
                title: 'Comments',
                subTitle: 'What is your comments?'
            }).then(function (res) {
                if(res){
                    comment.save( {
                        creator: $scope.user,
                        Comments: res,
                        when: $rootScope.now,
                    }, {
                        success: function(result) {
                            console.log(result);
                            var relation = item.relation("comment");
                            relation.add(comment);
                            item.save(null, {
                                success : function(res){
                                    console.log('comment save');
                                    service.queryComments(item);
                                },
                                error : function(res, err){
                                    console.log('not save');
                                }
                            });
                        },
                        error: function(result, error) {
                            console.log(error);
                        }
                    });
                } else {
                    console.log('not sure');
                }
            });
        });
    };

    $scope.closeComments = function(){
        jQuery('.popComments').fadeOut('fast', function(){
            jQuery('.closeComments').fadeOut('fast', function(){
                jQuery('.postRightBtn').fadeIn();
                jQuery('.commentBtn').fadeOut('fast', function(){
                    jQuery('.postLeftBtn').fadeIn();
                });
            });
            jQuery('.notepadArea').removeClass('blur');
        });
    };



})

favoureat.controller('ListUpmyPostingCtrl', function($scope, $state, $rootScope, service, $ionicSideMenuDelegate, $ionicModal) {

	$ionicSideMenuDelegate.canDragContent(false);

    service.listUpmyPosting();



    $scope.back = function(){
        service.back();
    };

	$scope.showContent = function(myItem){
    	console.log(myItem.id);
    	service.viewContents();
    };

	$scope.getComments = function(myItem){
		service.listUpCommentsTome(myItem);
	}

    $scope.removePosting = function(myItem){
        console.log(myItem);
		myItem.destroy({
			success : function(res) {
				console.log(res);
				service.listUpmyPosting();
			},
			error : function(error) {
				console.log(error);
			}
		});
    };

    $scope.toViewMap = function(item){
        service.viewMap(item);
    }

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

// function to open the modal
    $scope.openModal = function () {
        $scope.head = "";
        $scope.modal.show();

        $scope.postSend = "";
        $scope.postSend = "";
        $scope.postSend = "";
        $scope.postSend = "";
        $scope.postSend = "";

    };

// function to close the modal
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.toListUpPosting = function () {
        $state.go('main.listUpPosting');
    };
})

favoureat.controller('ListUpOurPostingMapCtrl', function ($scope, $rootScope, $state, $ionicLoading, service, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };

    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {stylers: [{ visibility: 'simplified' }]},
            {elementType: 'labels', stylers: [{ visibility: 'off' }]}
        ]
    };

    var map = new google.maps.Map(document.getElementById("map"),mapOptions);

    $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
    });

    if(navigator.geolocation) {
        var watchID = navigator.geolocation.watchPosition(function(pos){
            var currentLocation = {longitude:pos.coords.longitude, latitude:pos.coords.latitude};
            var locations=[];
            locations.push(currentLocation);
            if(currentLocation) {
                console.log(locations);
                map.setCenter(new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude));
                $ionicLoading.hide();
                navigator.geolocation.clearWatch(watchID);
                var last2Weeks = new Date();
                last2Weeks.setDate(last2Weeks.getDate()-77);
                var query = new Parse.Query($rootScope.post);
                query.withinMiles("location", currentLocation, 5).greaterThan("createdAt", last2Weeks).find({
                    success: function (results) {
                        console.log(results);
                        var markers = [];
                        var marker = {};
                        for (var i in results) {
//                            var markerPin = "img/iconThumb.png";
                            var infoContent = '<div class="notepaper"><figure class="quote"><blockquote class="curly-quotes">but the set of the sail.</blockquote><figcaption class="quote-by">— Jim Rohn</figcaption></figure></div>';
                            //	                    var infoContent = "<div id='topPopup'><p id='titlePopup'>"+results[i].attributes.head+"</p><img src='"+results[i].attributes.photo.url()+"' alt='thumbnail image "+results[i].attributes.head+"'id='topImg'/><a class='thumbUp'></a><div id='bottomPopup'><div id='bottomPopupContents'>"+results[i].attributes.body+"</div></div></div>";
                            var marker = new Marker({
//                                id: i,
                                map: map,
                                zIndex: 10,
                                draggable: false,
                                title: infoContent,
                                animation: google.maps.Animation.DROP,
                                position:  new google.maps.LatLng(results[i].attributes.location.latitude, results[i].attributes.location.longitude),
                                icon: {
                                    path: SQUARE_PIN,
                                    fillColor: 'rgba(237, 160, 43, 0.7);',
                                    fillOpacity: 1,
                                    strokeColor: '',
                                    strokeWeight: 0,
                                    scale: 1/3,
                                },
                                label: "<i class='map-icon-post-office redFont'></i>",
                            });
//                            var marker = new google.maps.Marker({
//                                position: new google.maps.LatLng(results[i].attributes.location.latitude, results[i].attributes.location.longitude), map: map, id: i, draggable: true, animation: google.maps.Animation.DROP, icon: markerPin, title: infoContent});

                            var infoWindow = new google.maps.InfoWindow();
                            google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.setContent(this.title);
                                infoWindow.open(map, this);
                                jQuery('.gm-style-iw').prev('div').children('div:nth-child(4)').addClass('notepaper');
                                jQuery('.gm-style-iw').prev('div').children().css({
                                    'border-radius': '5px',
                                });
                            });
                            /*
                             google.maps.event.addListener(marker, 'touchend', function() {
                             infoWindow.setContent(this.title);
                             infoWindow.open(map, this);
                             service.aboutInfoWindow(this);
                             });
                             */
                            markers.push(marker);
                        }
                        var mc = new MarkerClusterer(map, markers);
                        $ionicLoading.hide();
                        google.maps.event.addListener(map, 'click', function () {
                            infoWindow.close(map, this);
                        });
                        /*
                         google.maps.event.addListener(map, 'touchend', function() {
                         infoWindow.close(map, this);
                         });
                         */

                    }, error: function (results, error) {
                        console.log("query fail", error);
                        $ionicLoading.hide();
                    }
                })
            }
        }, function(error){
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            console.log("Error: " + errors[error.code]);
            $ionicLoading.hide();
        },{maximumAge:0, maxWait:15000, enableHighAccuracy: true});
    } else {
        console.log("navigator fail", error);
        $ionicLoading.hide();
    }

    $scope.toListUpMyPostingMap = function () {
        $state.go('main.listUpMyPostingMap');
    };
})

favoureat.controller('ListUpMyPostingMapCtrl', function ($scope, $rootScope, $state, $ionicLoading, service, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };

    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {stylers: [{ visibility: 'simplified' }]},
            {elementType: 'labels', stylers: [{ visibility: 'off' }]}
        ]
    };

    var map = new google.maps.Map(document.getElementById("myPostingMap"),mapOptions);
    $scope.map = map;

    $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
    });

    if(navigator.geolocation) {
        var watchID = navigator.geolocation.watchPosition(function(pos){
            var currentLocation = {longitude:pos.coords.longitude, latitude:pos.coords.latitude};
            var locations = [];
            locations.push(currentLocation);
            if(currentLocation && pos.coords.accuracy <=30) {
                alert(locations);
                map.setCenter(new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude));
                $ionicLoading.hide();
                navigator.geolocation.clearWatch(watchID);
                var query = new Parse.Query($rootScope.post);
                query.equalTo('creator', $rootScope.user.id).find({
                    success: function (results) {
                        console.log(results);
                        var markers = [];
                        var marker = {};
                        for (var i in results) {
//                            var markerPin = "img/iconThumb.png";
                            var infoContent = '<div class="notepaper"><figure class="quote"><blockquote class="curly-quotes">but the set of the sail.</blockquote><figcaption class="quote-by">— Jim Rohn</figcaption></figure></div>';
                            //	                    var infoContent = "<div id='topPopup'><p id='titlePopup'>"+results[i].attributes.head+"</p><img src='"+results[i].attributes.photo.url()+"' alt='thumbnail image "+results[i].attributes.head+"'id='topImg'/><a class='thumbUp'></a><div id='bottomPopup'><div id='bottomPopupContents'>"+results[i].attributes.body+"</div></div></div>";
                            var marker = new Marker({
//                                id: i,
                                map: map,
                                zIndex: 10,
                                draggable: false,
                                title: infoContent,
                                animation: google.maps.Animation.DROP,
                                position:  new google.maps.LatLng(results[i].attributes.location.latitude, results[i].attributes.location.longitude),
                                icon: {
                                    path: SQUARE_PIN,
                                    fillColor: 'rgba(237, 160, 43, 0.7);',
                                    fillOpacity: 1,
                                    strokeColor: '',
                                    strokeWeight: 0,
                                    scale: 1/3,
                                },
                                label: "<i class='map-icon-post-office redFont'></i>",
                            });
//                            var marker = new google.maps.Marker({
//                                position: new google.maps.LatLng(results[i].attributes.location.latitude, results[i].attributes.location.longitude), map: map, id: i, draggable: true, animation: google.maps.Animation.DROP, icon: markerPin, title: infoContent});

                            var infoWindow = new google.maps.InfoWindow();
                            google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.setContent(this.title);
                                infoWindow.open(map, this);
                                jQuery('.gm-style-iw').prev('div').children('div:nth-child(4)').addClass('notepaper');
                                jQuery('.gm-style-iw').prev('div').children().css({
                                    'border-radius': '5px',
                                });
                            });
                            /*
                             google.maps.event.addListener(marker, 'touchend', function() {
                             infoWindow.setContent(this.title);
                             infoWindow.open(map, this);
                             service.aboutInfoWindow(this);
                             });
                             */
                            markers.push(marker);
                        }
                        var mc = new MarkerClusterer(map, markers);
                        $ionicLoading.hide();
                        google.maps.event.addListener(map, 'click', function () {
                            infoWindow.close(map, this);
                        });
                        /*
                         google.maps.event.addListener(map, 'touchend', function() {
                         infoWindow.close(map, this);
                         });
                         */

                    }, error: function (results, error) {
                        console.log("query fail", error);
                        $ionicLoading.hide();
                    }
                })
            }
        }, function(error){
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            alert("Error: " + errors[error.code]);
            $ionicLoading.hide();
        },{maximumAge:0, maxWait:15000, enableHighAccuracy: true});
    } else {
        console.log("no GPS");
        $ionicLoading.hide();
    }

    $scope.toListUpOurPostingMap = function () {
        $state.go('main.listUpOurPostingMap');
    };
})




favoureat.controller('ListUpmyCheckListCtrl', function($scope, $state, $rootScope, service, $ionicPopup, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };



    $scope.toListUpmyCheckMap = function () {
        $state.go('listUpmyCheckMap');
    };

    $scope.getCheckListInfo = function (item) {
    	service.viewMap(item);
    };

    $scope.putLike = function(likeItem){
		var relationUserLike = $rootScope.user.relation("likes");
		relationUserLike.add([likeItem]);
		$rootScope.user.save(null, {
			success : function(res){
				console.log('userLikeSaved');
			},
			error : function(res, err){
				console.log(err);
			}
		});

		var relationLikePost = likeItem.relation("likes");
		var colorHeart = "color"+ likeItem.id;
		relationLikePost.add([$rootScope.user]);
		likeItem.save(null, {
			success : function(res){
				var countRelationLikePost = relationLikePost.query();
				countRelationLikePost.count({
					success : function(res){
						console.log(res);
						likeItem.set('countLikes', res);
						likeItem.save(null, {
							success : function(res){
								console.log('success save count: ' + res);
							},
							error : function(res, err){
								console.log(err);
							}
						});

					},
					error : function(res, err){
						console.log(err);
					}
				});
				console.log('postLikeSaved');
				console.log(likeItem);
				jQuery('#'+colorHeart).addClass('colorRed');
				setInterval(function(){
					jQuery('#'+colorHeart).fadeOut('slow').fadeIn('slow');
				}, 1000);
				setTimeout(function(){
					var relationUserCheck = $rootScope.user.relation('check');
					relationUserCheck.remove(likeItem);
					$rootScope.user.save(null,{
						success : function(res){
							console.log(res);
							service.listUpmyCheckList();
						},
						error : function(res, err){
							console.log(err);
						}
					})
				}, 3000)
			},
			error : function(res, err){
				console.log(err);
			}
		});
    };

    $scope.removeCheck = function(likeItem){
        console.log(likeItem);
        var relation = $rootScope.user.relation("check");
        relation.remove(likeItem);
		$rootScope.user.save(null, {
			success : function(res) {
				console.log(res);
				service.listUpmyCheckList();
			},
			error : function(error) {
				console.log(error);
			}
		});
    };

})

favoureat.controller('ListUpmyLikeCtrl', function($scope, $state, $rootScope, service, $ionicPopup, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };

    $scope.toListUpmyCheckMap = function () {
        $state.go('listUpmyCheckMap');
    };

    $scope.getCheckListInfo = function (item) {
    	service.viewMap(item);
    };

    $scope.removeLike = function(likeItem){
        console.log(likeItem);
        var relationUserLike = $rootScope.user.relation("likes");
        relationUserLike.remove(likeItem);
		$rootScope.user.save(null, {
			success : function(res) {
				console.log(res);
				console.log('success remove like from user');
			},
			error : function(error) {
				console.log(error);
			}
		});
		var relationLikePost = likeItem.relation("likes");
        relationLikePost.remove($rootScope.user);
		likeItem.save(null, {
			success : function(res) {
				console.log(res);
				console.log('success remove like from post');
				var countRelationLikePost = relationLikePost.query();
				countRelationLikePost.count({
					success : function(res){
						console.log(res);
						likeItem.set('countLikes', res);
						likeItem.save(null, {
							success : function(res){
								console.log('success save count: ' + res);
								service.listUpmyLike();
							},
							error : function(res, err){
								console.log(err);
							}
						});

					},
					error : function(res, err){
						console.log(err);
					}
				});
			},
			error : function(error) {
				console.log(error);
			}
		});
    };
})

favoureat.controller('ListUpmyCommentsCtrl', function($scope, $state, $rootScope, service, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };

    $scope.removeComment = function(myComment){
        console.log(myComment);
        /* var comment = myComment; */
		myComment.destroy({
			success : function(res) {
				console.log(res);
				service.listUpMyComments(myComment);
			},
			error : function(error) {
				console.log(error);
			}
		});
    };
})





favoureat.controller('ListUpLikeCtrl', function($scope, $state, $rootScope, service, $ionicPopup, $ionicSideMenuDelegate) {

	$ionicSideMenuDelegate.canDragContent(false);

    $scope.back = function(){
        service.back();
    };

    $scope.getPeopleCheckListInfo = function (item) {
    	service.viewMap(item);
    };

    $scope.putCheck = function (item) {
		var relationUserCheck = $rootScope.user.relation("check");
		relationUserCheck.add(item);
			$ionicPopup.confirm({
			title: 'check',
			subTitle: 'you really want to check?'
		}).then(function (res) {
			if(res){
				$rootScope.user.save(null, {
					success: function(result) {
						console.log('success');
					},
					error: function(result, error) {
						console.log(error);
					}
				});
			} else {
				console.log('not sure');
			}
		});
	};
})


/* --------?? */
favoureat.controller('ListUpCommentsTomeCtrl', function($scope, $state, $rootScope, service) {

	$scope.tomain = function () {
        $state.go('listUpmyPosting');
    };
})
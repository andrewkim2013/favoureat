'use strict';

/* Services */
favoureat.factory('service', function($state, $rootScope, $window) {
    return {
    
    	userCheck : function(){
	    	if ($rootScope.user) {
		        $state.go('main.home');
		        console.log("currentUser : "+ $rootScope.user.id);
		    } else {
		        $state.go('main.signIn');
		        console.log('new!!');
		    };
    	},

        back : function(){
            $window.history.back();
        },
    	
        listUpmyPosting : function(){
        	var myItems = {};
        	var myItem = "";
            Parse.Cloud.run('getPostMyItem', { creator : $rootScope.user.id },{
				success: function(results) {
					var myItemList = "";
					var myItemList = [];
					for(var i in results) {
					    var result = results[i];
					    var myItem = result;
					/*                 var likeUser = $rootScope.user.relation("likes"); */
					    myItemList.push(myItem);
					    $rootScope.myItems = myItemList;
					    $rootScope.$apply();
					}
					if(myItemList.length>0){
	                	console.log(myItemList);
	                	$state.go('main.listUpmyPosting');
	                }
	                else {
	                	console.log('no data');
	                	$state.go('main.home');
	                }
				},
				error: function(error) {
					console.log(error+'error');
				}
			});
        },
        
        listUpmyLike: function(){
        	var relationLike = $rootScope.user.relation("likes");
        	var query = relationLike.query();
			query.descending("createdAt");
			query.find({
				success: function(results) {
					console.log(results);
					var likeItem = "";
				    var likeItemList = [];
				    for(var i in results) {
				        var likeItem = results[i];
	                    likeItemList.push(likeItem);
	                    $rootScope.likeItems = likeItemList;
	                    $rootScope.$apply();
	                }
	                if(likeItemList.length>0){
	                	console.log(likeItemList);
	                	$state.go('main.listUpmyLike');
	                }
	                else {
	                	console.log('no data');
	                	$state.go('main.home');
	               
	                }
				},
				error: function(results, error) {
					console.log(error);
				}
			});
        },
        
        listUpMyComments: function(myComment) {
        	var query = new Parse.Query($rootScope.Comment);
			query.equalTo("creator", $rootScope.user);
			query.descending("createdAt");
			query.find({
				success: function(results) {
					var myComments = "";
				    var myCommentsList = [];
				    for(var i in results) {
				        var pic = results[i].get("photo");
				        var myComment = results[i];
	                    myCommentsList.push(myComment);
	                    $rootScope.myComments = myCommentsList;
	                    $rootScope.$apply();
	                }
	                console.log(myCommentsList);
	                if(myCommentsList.length>0){
	                	$state.go('main.listUpMyComments');
	                }
	                else {
	                	console.log('no data');
	                	$state.go('main.home');
	                }
				},
				error: function(error) {
					console.log(error);
				}
			});
        },
        
        listUpmyCheckList: function(){
        	var relation = $rootScope.user.relation("check");
        	var query = relation.query();
        	console.log(query);
			query.descending("createdAt");
			query.find({
				success: function(results) {
					console.log(results);
					var likeItem = "";
				    var likeItemList = [];
				    for(var i in results) {
				        var likeItem = results[i];
	                    likeItemList.push(likeItem);
	                    $rootScope.likeItems = likeItemList;
	                    $rootScope.$apply();
	                }
	                if(likeItemList.length>0){
	                	console.log(likeItemList);
	                	$state.go('main.listUpmyCheckList');
	                }
	                else {
	                	console.log('no data');
	                	$state.go('main.home');
	                	
	                }
				},
				error: function(results, error) {
					console.log(error);
				}
			});
        },
                                
        listUpPosting : function(){
        	var query = new Parse.Query("Posting");
/* 		    query.limit($rootScope.user.attributes.preferLimit); */
			query.descending("createdAt");
			query.limit(50);
		    query.find({
		        success : function(results) {
		            console.log(results);
		            var itemList = "";
					var itemList = [];
					var resultList = [];
					for(var i in results) {
					    var item = results[i];
					    itemList.push(item);
					    $rootScope.items = itemList;
					    $rootScope.$apply();
					    var chartID = "."+item.id+"chart";
						var total = item.attributes.valueTotal/21*100+"%";
						var totalBar = chartID+" .total";
						jQuery(totalBar).css({
							width:total,
						});
					}					
		            $state.go('main.listUpPosting');
		            
		        },
		        error : function(error) {
		            console.log('error');
		        }
		    });		    
        },
                
        viewMap : function(item){
        	var mapBtn = "."+item.id+"mapBtn";
        	jQuery(mapBtn).fadeOut();
        	var checkBtn = "."+item.id+"checkBtn";
        	var closeMap = "." + item.id+"closeMap";
        	jQuery(checkBtn).fadeOut('fast', function(){
	        	jQuery(closeMap).fadeIn();
        	});
        	var smallPhoto = "."+item.id+"smallPhoto";
	    	var notepad = "." + item.id+"notepadArea";
	    	var popMap = "." + item.id+"popMap";
	    	var mapCSS = "#"+item.id+"map";
	    	var mapArea = item.id+"map";
	    	
	    	jQuery(notepad).addClass('blur');
	    	jQuery(smallPhoto).css({
		    	backgroundColor: '#f3816a',
	    	});
        	jQuery(popMap).fadeIn();
        	jQuery(mapCSS).css({
	        	position: 'absolute',
				top: 0,
				left: '2%',
				width: '96%',
				height: 260,
			    margin: 'auto',
			    boxShadow:"0 3px 25px black",
        	});
        			
        	var mapOptions = {
	            center: new google.maps.LatLng(item.attributes.location.latitude, item.attributes.location.longitude),
	            zoom: 14,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	        var map = new google.maps.Map(document.getElementById(mapArea),mapOptions);
	        $rootScope.map = map;
	        var markerPin = "img/iconThumb.png";
	        var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.attributes.location.latitude, item.attributes.location.longitude), 
                map: $rootScope.map, 
                draggable: true, 
                animation: google.maps.Animation.DROP, 
                icon: markerPin, 
            });
            jQuery(closeMap).unbind('click').on('click', function(){
				jQuery(popMap).fadeOut('fast', function(){
					jQuery(closeMap).fadeOut('fast', function(){
			        	jQuery(checkBtn).fadeIn();
		        	});
					jQuery(notepad).removeClass('blur');
					jQuery(mapBtn).fadeIn();
				});			
			});
        },
        
        viewPhoto : function(item){
        	var mapBtn = "."+item.id+"mapBtn";
        	jQuery(mapBtn).fadeOut();
        	var checkBtn = "."+item.id+"checkBtn";
        	var closePhoto = "." + item.id+"closePhoto";
        	jQuery(checkBtn).fadeOut('fast', function(){
	        	jQuery(closePhoto).fadeIn();
        	});
        	var smallPhoto = "."+item.id+"smallPhoto";
	    	var notepad = "." + item.id+"notepadArea";
	    	jQuery(notepad).addClass('blur');
	    	jQuery(smallPhoto).css({
		    	backgroundColor: '#f3816a',
	    	});
        	var popPhoto = "." + item.id+"popPhoto";
        	var notepad = "." + item.id+"notepadArea";
	        jQuery(popPhoto).empty().fadeIn().append("<div class='item item-body popColor'><img class='popContentPhoto' src="+item.attributes.photo.url()+"></div>");
	        
	        jQuery(closePhoto).unbind('click').on('click', function(){
				jQuery(popPhoto).fadeOut('fast', function(){
					jQuery(closePhoto).fadeOut('fast', function(){
			        	jQuery(checkBtn).fadeIn();
		        	});
					jQuery(notepad).removeClass('blur');
					jQuery(mapBtn).fadeIn();
				});			
			});
        },
        
        viewChart : function(item){
        	var mapBtn = "."+item.id+"mapBtn";
        	jQuery(mapBtn).fadeOut();
        	var checkBtn = "."+item.id+"checkBtn";
        	var closeChart = "." + item.id+"closeChart";
        	jQuery(checkBtn).fadeOut('fast', function(){
	        	jQuery(closeChart).fadeIn();
        	});
	        var notepad = "." + item.id+"notepadArea";
	    	var popChart = "." + item.id+"popChart";
	    	var chartID = "."+item.id+"chart";
	    	var taste = item.attributes.valueTaste/7*100+"%";
	    	var tasteBar = chartID+" #taste";
	    	var service = item.attributes.valueService/7*100+"%";
	    	var serviceBar = chartID+" #service";
	    	var price = item.attributes.valuePrice/7*100+"%";
	    	var priceBar = chartID+" #price";
	    	jQuery(notepad).addClass('blur');
	    	jQuery(popChart).fadeIn().empty().append("<div class='container barChart "+item.id+"chart'><div class='progress'><span class='progress-info'><i class='icon ion-beer greyblueFont'></i></span><span class='progress-val'>"+item.attributes.valueTaste+"</span><span class='progress-bar'><span class='progress-in' id='taste'></span></span></div><div class='progress'><span class='progress-info'><i class='icon ion-ios7-timer greyblueFont'></i></span><span class='progress-val'>"+item.attributes.valueService+"</span><span class='progress-bar'><span class='progress-in' id='service'></span></span></div><div class='progress'><span class='progress-info'><i class='icon ion-card greyblueFont'></i></span><span class='progress-val'>"+item.attributes.valuePrice+"</span><span class='progress-bar'><span class='progress-in' id='price'></span></span></div><p class='padding floatRight'><span id='"+item.id+"'></span></p></div>");
		    jQuery(tasteBar).animate({
				width:taste,
			});
			jQuery(serviceBar).animate({
				width:service,
			});
			jQuery(priceBar).animate({
				width:price,
			});
			
			jQuery(closeChart).unbind('click').on('click', function(){
				jQuery(popChart).fadeOut('fast', function(){
					jQuery(closeChart).fadeOut('fast', function(){
			        	jQuery(checkBtn).fadeIn();
		        	});
					jQuery(notepad).removeClass('blur');
					jQuery(mapBtn).fadeIn();
				});			
			});
        },
        
        queryComments : function(item){
        	var comments = "";
			var commentsList = [];
        	var queryComment = new Parse.Query($rootScope.Comment);
        	var relationComment = item.relation("comment");
        	var query = relationComment.query();
			query.descending("createdAt");
			query.find({
				success: function(results) {
				    for(var i in results) {
				        var result = results[i];
				        var pic = result.get("photo");
				        var comment = result;
	                    commentsList.push(comment);
	                    $rootScope.comments = commentsList;
	                    $rootScope.$apply();
	                    console.log(comment);
				        var fromNow = moment(comment.createdAt).startOf('day').fromNow();
				        var before = "#"+comment.id+"before";
				        console.log(before);
				        jQuery(before).empty().append(fromNow);
	                    
	                }
	                if(commentsList.length>0){
	                	console.log(commentsList);
				    	jQuery('.popComments').fadeIn('fast');
				    	
	                } else {
	                	console.log('no data');
	                	jQuery('.popComments').fadeOut();
	                }
				},
				error: function(error) {
					console.log(error);
				}
			});
        },
                
        aboutInfoWindow : function(results){
        	console.log(results);
	        /* infowindow style */
			jQuery('.gm-style-iw').prev('div').children('div:nth-child(4)').css({
				'background': 'url("img/ionic.png")',
				'background-position': 'center',
				'background-repeat': 'repeat',
				'overflow': 'hidden',
				'box-shadow': '8px 8px 4px #888888',
			}); 
			jQuery('.gm-style-iw').prev('div').children().css({
				'border-radius':'2%',
				'':'',
			}); 
			
			/* infowindow action */ 
			jQuery('.gm-style-iw').on('click', results, function(e){
				e.stopPropagation();
				jQuery('.gm-style-iw').prev('div').children('div:nth-child(4)').css({
					'background': 'url("img/iconThumb.png")',	
				}); /* infowindow color */
				jQuery('.gm-style-iw #titlePopup').hide('fade');
				jQuery('.gm-style-iw #topImg').animate({
					'width':'80px',
					'height':'80px',
					'border-radius': '100%',
				}, 500, function(e){
					jQuery('.thumbUp').show('fade');
					jQuery('#bottomPopup').show();
					jQuery('.thumbUp').unbind("click").click(function(e){
						e.stopPropagation();
						console.log('thumbUp1');
					});
				});					
			}); 
        },
        
        checkLocation : function(){
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos){
                    var currentLocation = {longitude:pos.coords.longitude, latitude:pos.coords.latitude};
                    $rootScope.location = currentLocation;
                    console.log(currentLocation);
                    $rootScope.$apply();
                }, function(error){
                    console.log(error);
                });
            } else {
                console.log("Please! turn on the GPS!");
            }
        },
        
        listUpLike : function(){
	    	var query = new Parse.Query($rootScope.post);
	    	query.greaterThan('countLikes', 0);
			query.descending("countLikes");
			query.limit(10);
			query.find({
				success: function(results) {
					console.log(results);
					var likeItem = "";
				    var likeItemList = [];
				    for(var i in results) {
				        var result = results[i];
				        var likeItem = result;
	                    likeItemList.push(likeItem);
	                    $rootScope.likeItems = likeItemList;
	                    $rootScope.$apply();
	                }
	                if(likeItemList.length>0){
	                	$state.go('main.listUpLike');
	                }
	                else {
	                	console.log('no data');
	                	$state.go('main.home');
	                }
				},
				error: function(results, error) {
					console.log(error);
				}
			});
        },
        
        
        listUpCommentsTome : function(myItem){
        	console.log(myItem.id);
        	var relationTome = myItem.relation('comment');
        	var query = relationTome.query();
			query.descending("createdAt");
			query.find({
				success: function(results) {
					var comments = "";
				    var commentsList = [];
				    for(var i in results) {
				        var result = results[i];
				        var pic = result.get("photo");
				        var comment = result;
	                    commentsList.push(comment);
	                    $rootScope.comments = commentsList;
	                    $rootScope.$apply();
	                }
	                if(commentsList.length>0){
	                	console.log(commentsList);
	                	$state.go('listUpCommentsTome');
	                }
	                else {
	                	console.log('no data');
	                }
				},
				error: function(error) {
					console.log(error);
				}
			});
        },
    }
})
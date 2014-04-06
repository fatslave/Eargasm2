$(function() {
			
				var stopanim = 0;
			  //remove js-disabled class
				//$("#viewer").removeClass("js-disabled");
			
			  //create new container for images
				$("<div>").attr("id", "imgcontain").css({position:"relative"}).width(7500).height(150).appendTo("div#viewer");
				
				
				
				//start anim
				//animator($("div#imgcontain"), duration, direction);
				
				//pause on mouseover
				$("a.wrapper").live("mouseover", function() {
				  
					//stop anim
					$("div#imgcontain").stop(true);
					
					//show controls
					($("div#controls").length == 0) ? $("<div>").attr("id", "controls").appendTo("div#outerContainer").css({ opacity:0.7 }).slideDown("slow") : null ;
					($("a#rtl").length == 0) ? $("<a>").attr({ id:"rtl", href:"#", title:"rtl" }).appendTo("#controls") : null ;
					($("a#ltr").length == 0) ? $("<a>").attr({ id:"ltr", href:"#", title:"ltr" }).appendTo("#controls") : null ;
					
					//variable to hold trigger element
					var title = $(this).attr("title");
					
					//add p if doesn't exist, update it if it does
					($("p#title").length == 0) ? $("<p>").attr("id", "title").text(title).appendTo("div#controls") : $("p#title").text(title) ;
				});
				
				//restart on mouseout
				$("a.wrapper").live("mouseout", function(e) {
				  
				  if(stopanim!=1){
					//hide controls if not hovering on them
					(e.relatedTarget == null) ? null : (e.relatedTarget.id != "controls") ? $("div#controls").slideUp("slow").remove() : null ;
					
					//work out total travel distance
					var totalDistance = parseInt($("div#imgcontain").width()) + parseInt($("div#viewer").width());
														
					//work out distance left to travel
					var distanceLeft = ($("div#imgcontain").hasClass("ltr")) ? totalDistance - (parseInt($("div#imgcontain").css("left")) + parseInt($("div#imgcontain").width())) : totalDistance - (parseInt($("div#viewer").width()) - (parseInt($("div#imgcontain").css("left")))) ;
					
					//new duration is distance left / speed)
					var newDuration = distanceLeft / speed;
				
					//restart anim
					animator($("div#imgcontain"), newDuration, $("div#imgcontain").attr("class"));
					}

				});
												
				//handler for ltr button
				$("#ltr").live("click", function() {
					stopanim =0;
				 					
					//stop anim
					$("div#imgcontain").stop(true);
				
					//swap class names
					$("div#imgcontain").removeClass("rtl").addClass("ltr");
										
					//work out total travel distance
					var totalDistance = parseInt($("div#imgcontain").width()) + parseInt($("div#viewer").width());
					
					//work out remaining distance
					var distanceLeft = totalDistance - (parseInt($("div#imgcontain").css("left")) + parseInt($("div#imgcontain").width()));
					
					//new duration is distance left / speed)
					var newDuration = distanceLeft / speed;
					
					//restart anim
					animator($("div#imgcontain"), newDuration, "ltr");
				});
				
				//handler for rtl button
				$("#rtl").live("click", function() {
						
					stopanim =0;
					//stop anim
					$("div#imgcontain").stop(true);
					
					//swap class names
					$("div#imgcontain").removeClass("ltr").addClass("rtl");
					
					//work out total travel distance
					var totalDistance = parseInt($("div#imgcontain").width()) + parseInt($("div#viewer").width());

					//work out remaining distance
					var distanceLeft = totalDistance - (parseInt($("div#viewer").width()) - (parseInt($("div#imgcontain").css("left"))));
					
					//new duration is distance left / speed)
					var newDuration = distanceLeft / speed;
				
					//restart anim
					animator($("div#imgcontain"), newDuration, "rtl");
				});

				//handler for dblclick on image
				$("a.wrapper").live('dblclick', function() {
					$("#videos").css({'top':'50%', 'height':'35%'});
					$("#videos").show();
					var artist = $(this).attr("title");
					getTopTracks(artist);
				});
				
				

				 $('a.wrapper').live('mousedown', function(e) {
					// context menu here
					if( (e.which == 3) ) {
						thisartist = $(this).attr("title");
						$('#nameofartist').attr("title",thisartist);
						$('.vmenu').css({ left: e.pageX, top: e.pageY, zIndex: '101' }).show();
						return false;
					   $('.vmenu').hide();
				   }
				   else if((e.which == 2)) 
				   {
                       //if playing
                       if (stopanim==1) {
                           var totalDistance = parseInt($("div#imgcontain").width()) + parseInt($("div#viewer").width());
                           var distanceLeft = totalDistance - (parseInt($("div#imgcontain").css("left")) + parseInt($("div#imgcontain").width()));
                           var newDuration = distanceLeft / speed;
                           animator($("div#imgcontain"), newDuration, "ltr");
                           stopanim=0;
                        }
                       else if(stopanim==0) {
					        $("div#imgcontain").stop(true);
					    stopanim=1;
                        }


				}
					e.preventDefault();
					}).live('contextmenu', function(e){
							e.preventDefault();
				});
				
	
				
});
			
			
			
//animator function
var animator = function(el, time, dir) {
				 
					//which direction to scroll
					if(dir == "rtl") {
					  
					  //add direction class
						el.removeClass("ltr").addClass("rtl");
					 		
						//animate the el
						el.animate({ left:"-" + el.width() + "px" }, time, "linear", function() {
												
							//reset container position
							$(this).css({ left:$("div#imageScroller").width(), right:"" });
							
							//restart animation
							animator($(this), duration, "rtl");
							
							//hide controls if visible
							($("div#controls").length > 0) ? $("div#controls").slideUp("slow").remove() : null ;			
											
						});
					} else {
					
					  //add direction class
						el.removeClass("rtl").addClass("ltr");
					
						//animate the el
						el.animate({ left:$("div#viewer").width() + "px" }, time, "linear", function() {
												
							//reset container position
							$(this).css({ left:0 - $("div#imgcontain").width() });
							
							//restart animation
							animator($(this), duration, "ltr");
							
							//hide controls if visible
							($("div#controls").length > 0) ? $("div#controls").slideUp("slow").remove() : null ;			
						});
					}
		}
				
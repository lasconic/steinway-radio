 $(document).ready(function() {
 	$('#submit').click(function(event) {
 		var v = $("#msurl").val();
 		console.log(v);
 		if($.trim(v)) {
 			$.get("/playlist/push?url=" + v, function(data) {
 					console.log(data);
 					$('#message').html(data);
 					$("#msurl").val("");
 			});
 		}
 		event.preventDefault();
 	});
 	
 	getPlaylist();

	var client = new Faye.Client('/faye');
    var subscription = client.subscribe('/notification', function(message) {
    	console.log(message); 
    	if(message.command === "pop") {
    		$("#nowplaying-track").html("");
    		var score = $.parseJSON(message.score);
    		$("#nowplaying-track").append('<a href="'+score.permalink+'">'+ score.title + '</a>');
    	}
    	getPlaylist();
    });

 });

 function getPlaylist() {
 	$.getJSON("/playlist", function(data){
 		console.log(data);
 		$('#playlist').html('');
 		$.each(data.reverse(), function(index, value) {
		  	$('#playlist').append('<div><a href="'+value.permalink+'">'+ value.title + '</a></div>');
		});
 	});
 }
 $(document).ready(function() {
 	$('#submit').click(function() {
 		var v = $("#msurl").value();
 		console(v);
 		if(!empty($.trim(v)) {
 			$.get("/playlist/push?url=" + $('#msurl').value(), function(data) {
 					console.log(data);
 					$('#message').html(data);
 			});
 		}
 		return false;
 	});
 });
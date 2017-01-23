$(document).ready(function() {
	createHeatmap();
	var json = (function() {
		var json = null;
		$.ajax({
			'async': false,
			'global': false,
			'url': 'rooms.json',
			'dataType': "json",
			'success': function(data) {
				json = data;
			}
		});
		return json;
	})();

	function hashTag() {
		var hashTag, hash2;

		hashTag = location.hash;
		hashTag = hashTag.replace(/#*/, '');

		if (hashTag.length > 0) {
			for (i = 0; i < json.rooms.length; i++) {
				if (json.rooms[i].roomId === hashTag) {
					document.getElementById('room_info').innerHTML = '<img src="images/' + json.rooms[i].image + '" /><h4>' + json.rooms[i].name +
						'</h4>' + json.rooms[i].HTMLdescrip;
				}
			}
		}
	}

	function setHash() {
		window.location.hash = this.id;
	}

	function setHTML() {
		for (i = 0; i < json.rooms.length; i++) {
			if (json.rooms[i].roomId === this.id) {
				document.getElementById('room_info').innerHTML = '<img src="images/' + json.rooms[i].image + '" /><h4>' + json.rooms[i].name +
					'</h4>' + json.rooms[i].HTMLdescrip;
			}
		}
	}

	
	window.onload = hashTag();
	$(".active").click(setHash);
	$(".active").mouseenter(setHTML);
	$(".active").mouseleave(hashTag);
});
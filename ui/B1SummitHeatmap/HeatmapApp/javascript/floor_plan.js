$(document).ready(function() {
	//createHeatmap();
	//createHeatmapTest();
	createHeatmaps();
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
			for (var i = 0; i < json.rooms.length; i++) {
				if (json.rooms[i].roomId === hashTag) {
					document.getElementById('room_info').innerHTML = '<img src="images/' + json.rooms[i].image + '" /><h4>' + json.rooms[i].name +
						'</h4>' + json.rooms[i].HTMLdescrip;
				}
			}
		}
	}

	function setHash(id) {
		//window.location.hash = this.id;
		window.location.hash = id;
	}

	function setHTML(id) {
		for (var i = 0; i < json.rooms.length; i++) {
			if (json.rooms[i].roomId === id) {
				document.getElementById('room_info').innerHTML = '<img src="images/' + json.rooms[i].image + '" /><h4>' + json.rooms[i].name +
					'</h4>' + json.rooms[i].HTMLdescrip;
				if ((typeof json.rooms[i].BeaconId !== "undefined") && (json.rooms[i].BeaconId !== ENTRANCE_BEACON)) {
					$.ajax({
						'url': '/b1sa/beaconsOne/services/getBeaconItems.xsjs?beaconId=' + json.rooms[i].BeaconId,
						'dataType': "json",
						'success': function(result) {
							if (result.BeaconItems.value.length > 0) {
								var innerTableHTML = '<table id=\"tbLitems\" class=\"DetailTable\"><tr><th>ItemCode</th><th>In Stock</th></tr>';
								for (var i in result.BeaconItems.value) {
									innerTableHTML += '<tr><td><a href=\"#OpenItem\" onclick=\"return OpenItemForm(\'' + result.BeaconItems.value[i].ItemCode +
										'\')\">' + result.BeaconItems.value[i].ItemCode + '</a></td><td>' + result.BeaconItems.value[i].QuantityOnStock + '</td></tr>';
								}
								innerTableHTML += '</table>';
								if (document.getElementById('room_info').innerHTML.includes('<table id=\"tbLitems\"') === false)
								    document.getElementById('room_info').innerHTML += innerTableHTML;
							}
						}
					});
				}
			}
		}
	}

	function onClick(id) {
		setHash(id);
		setHTML(id);
	}

	window.onload = hashTag();
	$(".active").click(function() {
		onClick(this.id);
	});

	//$(".active").mouseenter(setHTML);
	//$(".active").mouseleave(hashTag);
});
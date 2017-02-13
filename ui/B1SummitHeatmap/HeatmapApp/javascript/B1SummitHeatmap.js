var heatmap;
var dataPoints;
var beaconList = [
	{
		"beaconId": "65483",
		"shelfId": "UL77",
		"XPosition": 205,
		"MaxPointsCount": 5,
		"image": "chocolate_shelf.jpg",
		"ShelfTitle": "Chocolate(BeaconId: 65483) <p>A00001 - A00003</p>",
		"area": {
			"x1": 190,
			"y1": 186,
			"x2": 220,
			"y2": 408
		}
    },
	{
		"beaconId": "65473",
		"shelfId": "UL89",
		"ShelfTitle": "Wines(BeaconId: 65473) <p>A00004 - A00006</p>",
		"XPosition": 380,
		"MaxPointsCount": 5,
		"image": "wine_shelf.jpg",
		"area": {
			"x1": 365,
			"y1": 186,
			"x2": 395,
			"y2": 408
		}
    },
	{
		"beaconId": "65484",
		"shelfId": "UL101",
		"ShelfTitle": "Cheese(BeaconId: 65484) <p>A00007 - A00009</p>",
		"XPosition": 510,
		"MaxPointsCount": 5,
		"image": "cheese_shelf.jpg",
		"area": {
			"x1": 495,
			"y1": 186,
			"x2": 525,
			"y2": 408
		}
    },
    {
		"beaconId": "65485",
		"shelfId": "UL103",
		"ShelfTitle": "Entrance(BeaconId: 65485)",
		"XPosition": 895,
		"MaxPointsCount": 5,
		"image": "entrance_gate.jpg",
		"area": {
			"x1": 880,
			"y1": 186,
			"x2": 910,
			"y2": 408
		}
    }];
//55606: entry
//56126: third
var userList = [];

function randomY() {
	return 200 + Math.random() * 160;
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  };
}

function getOffset2( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function createHeatmap() {
    /*******
    var ul77 = document.getElementById('UL77');
    var rect = ul77.getBoundingClientRect();
    //console.log("UL77-left: "+ul77.position.left +"\nUL77-top: "+ul77.position.top);
    console.log("top: " ,rect.top, "right:", rect.right, "bottom: ", rect.bottom, "left: ", rect.left);
    console.log(JSON.stringify(getOffset(ul77)));
    console.log(JSON.stringify(getOffset2(ul77)));
   ********/
	heatmap = h337.create({
		container: document.getElementById('heatmapContainer'),
		//container: document.getElementById('content_wrapper'),
		//container: $("#heatmapContainer"),
		maxOpacity: .6,
		radius: 15,
		blur: .90
		// backgroundColor with alpha so you can see through it
		//backgroundColor: 'rgba(0, 0, 58, 0.96)'
	});

	//var heatmapContainer = document.getElementById('heatmapContainerWrapper');
	var heatmapContainer = document.getElementById('heatmapContainer');
	//test data only.
	//Left beacon: x=205
	//Mid beacon: x=380
	//Right beacon:x=510
	//refreshHeatmapSyn();
	//refreshHeatmapAsyn();
	refresh();
	window.setInterval(refresh, 5000);
	//window.setInterval(refreshHeatmapAsyn, 10000);
	//window.setInterval(refreshHeatmapSyn, 10000);

	//heatmapContainer.app
	/******
	heatmapContainer.onmousemove = heatmapContainer.ontouchmove = function(e) {
		// we need preventDefault for the touchmove
		e.preventDefault();
		var x = e.layerX;

		var y = e.layerY;
		if (e.touches) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}

		heatmap.addData({
			x: x,
			y: y,
			value: 1
		});
	};
    *****/
	heatmapContainer.onclick = function(e) {
		var x = e.layerX;
		var y = e.layerY;
		//console.log("click on x: " + x +", y: " + y);
		//console.log(JSON.stringify(heatmap.getData()));
		//beacon id: 56126
		for (var bi in beaconList) {
			var beacon = beaconList[bi];
			if ((beacon.area.x1 <= x && x <= beacon.area.x2) && (beacon.area.y1 <= y && y <= beacon.area.y2)) {
				var html = '<img src="images/' + beacon.image + '" /><h4></h4>'; 
				html += '<h4>'+beacon.ShelfTitle+'</h4>';
				html += '<h4>';

				for (var i in userList) {
					if (userList[i].BeaconID === beacon.beaconId && userList[i].users.length >= 0) {
						console.log("Users in beacon(" + beacon.beaconId + "): " + JSON.stringify(userList[i].users));
						html += userList[i].users.length + ' Customers:</h4>';
						if(userList[i].users.length > 0)
						    html += '<table id=\"tblCustomers\"><tr><th>Customer Code</th><th>Recommendation</th></tr>';
						for (var j in userList[i].users) {
							html += '<tr><td>' + userList[i].users[j].UserId + '</td><td>' +'</td></tr>';
						}
						if(userList[i].users.length > 0)
						    html += '</table>';
						break;
					}
				}
				document.getElementById('room_info').innerHTML = html;
				break;
			}
		}
		/*if ((190 <= x && x <= 220) && (186 <= y && y <= 408)) {
			var html = '<img src="images/chocolate_shelf.jpg" /><h4>Customers: </h4>';

			for (var i in userList) {
				if (userList[i].BeaconID === "56127" && userList[i].users.length > 0) {
					console.log(JSON.stringify(userList[i].users));
					for (var j in userList[i].users) {
						html += '<p>' + userList[i].users[j].UserId + '</p>';
					}
					break;
				}
			}
			document.getElementById('room_info').innerHTML = html;
		} else if ((495 <= x && x <= 525) && (186 <= y && y <= 408)) {
			var html = '<img src="images/wine_shelf.jpg" /><h4>Customers: </h4>';

			for (var i in userList) {
				if (userList[i].BeaconID === "56128" && userList[i].users.length > 0) {
					console.log(JSON.stringify(userList[i].users));
					for (var j in userList[i].users) {
						html += '<p>' + userList[i].users[j].UserId + '</p>';
					}
					break;
				}
			}
			document.getElementById('room_info').innerHTML = html;
		}*/
		/*heatmap.addData({
			x: x,
			y: y,
			value: 1
		});*/
	};
}

function drawHeatPoints(value, maxPointCount, factor, xPosition) {
	if (value > 0) {
		//if user count less than, then draw two heatmap points. otherwise, just one
		var pointCount; //number of points to be drew.
		var count = value < maxPointCount ? value : maxPointCount;
		pointCount = Math.round(Math.random() * count);
		pointCount = pointCount < 1 ? 1 : pointCount;
		pointCount = pointCount < 2 && value >=2? 2:pointCount;
		
		var valueEx = value * factor;
		var valueAccumulated = 0;
		for (var i = 0; i < pointCount && valueAccumulated < valueEx; i++) {
			//var randomValue = Math.round((Math.random() * valueEx + Math.random() * valueEx)/2);
			var randomValue = Math.round(((Math.random() + Math.random()) * value)/2)*factor;
			if (i === pointCount - 1) {
				randomValue = valueEx - valueAccumulated;
			}
			dataPoints.push({
				"x": xPosition,
				"y": randomY(),
				"value": randomValue
			});
			valueAccumulated += randomValue;
		}

		/*if (value <= 2) {
			dataPoints.push({
				"x": xPosition,
				"y": randomY(),
				"value": count * factor
			});
		} else {
			dataPoints.push({
				"x": xPosition,
				"y": randomY(),
				"value": Math.round(count / 2) * factor
			});

			dataPoints.push({
				"x": xPosition,
				"y": randomY(),
				"value": (count - Math.round(count / 2)) * factor
			});
		}*/
	}
	var data = {
		min: 0,
		max: 20,
		data: dataPoints
	};
	console.log(JSON.stringify(dataPoints));
	//heatmap.addData(dataPoints);
	heatmap.setData(data);
}

function refreshHeatmapAsyn() {

	console.log("Refreshing heatmap asynchronously");
	//for-each beacon.
	dataPoints = [];
	userList = [];
	/***
	heatmap.setData({
		min: 0,
		max: 20,
		data: dataPoints
	});
    ***/

	for (var beacon in beaconList) {
		console.log(JSON.stringify(beacon));
		$.ajax({
			url: "/b1sa/beaconsOne/services/getUsersPosition.xsjs?beaconId=" + beaconList[beacon].beaconId,
			type: "GET",
			dataType: "json",
			//async: false,
			success: function(result, xhr) {
				console.log(JSON.stringify(result));
				var xPosition;
				var beacon;
				for (var i in beaconList) {
					if (beaconList[i].beaconId === result.BeaconID) {
					    beacon=beaconList[i];
						xPosition = beacon.XPosition;
						//console.log(result.BeaconID);
						//console.log(xPosition);
						break;
					}
				}
				var count = result.users.length;
				userList.push(result);
				console.log("count of users in beacon("+result.BeaconID+")" +count);
				drawHeatPoints(count, beacon.MaxPointsCount, 5, xPosition)
				//console.log(beaconList[beacon].XPosition);
				//var count = 5;
				/*if (count > 0) {
					//if user count less than, then draw two heatmap points. otherwise, just one
					if (count <= 2) {
						dataPoints.push({
							"x": xPosition,
							"y": randomY(),
							"value": count * 5
						});
					} else {
						dataPoints.push({
							"x": xPosition,
							"y": randomY(),
							"value": Math.round(count / 2) * 5
						});

						dataPoints.push({
							"x": xPosition,
							"y": randomY(),
							"value": (count - Math.round(count / 2)) * 5
						});
					}
				}
				var data = {
					min: 0,
					max: 20,
					data: dataPoints
				};
				console.log(JSON.stringify(dataPoints));
				//heatmap.addData(dataPoints);
				heatmap.setData(data);*/
			},
			error: function(xhr, status, errorThrown) {
				console.log("Error: " + errorThrown);
				console.log("Status: " + status);
				alert(errorThrown);
			}
		});
	}
}

function refreshHeatmapSyn() {

	console.log("Refreshing heatmap synchronus");
	//for-each beacon.
	dataPoints = [];
	//heatmap.setData(dataPoints);

	for (var beacon in beaconList) {
		console.log(JSON.stringify(beacon));
		var resultText = $.ajax({
			url: "/b1sa/beaconsOne/services/getUsersPosition.xsjs?beaconId=" + beaconList[beacon].beaconId,
			type: "GET",
			dataType: "json",
			async: false
		}).responseText;
		console.log(resultText);
		var result = JSON.parse(resultText);
		var xPosition = beaconList[beacon].XPosition;

		var count = result.users.length;

		console.log(count);
		//console.log(beaconList[beacon].XPosition);
		//var count = 5;
		if (count > 0) {
			//if user count less than, then draw two heatmap points. otherwise, just one
			if (count <= 2) {
				dataPoints.push({
					"x": xPosition,
					"y": randomY(),
					"value": count * 5
				});
			} else {
				dataPoints.push({
					"x": xPosition,
					"y": randomY(),
					"value": Math.round(count / 2) * 5
				});

				dataPoints.push({
					"x": xPosition,
					"y": randomY(),
					"value": (count - Math.round(count / 2)) * 5
				});
			}
		}
		var data = {
			min: 0,
			max: 20,
			data: dataPoints
		};
		heatmap.setData(data);
		//heatmap.addData(dataPoints);
	}
	console.log(JSON.stringify(dataPoints));
}

function refreshTotalUserCount() {
	$.ajax({
		url: "/b1sa/beaconsOne/services/getUsersPosition.xsjs?",
		type: "GET",
		dataType: "json",
		success: function(result, xhr) {
			var count = result.users.length;
			document.getElementById('total_customer_no').innerHTML = '<h4>Total No. of Customers in Store: ' + count + '</h4>';
		},
		error: function(xhr, status, errorThrown) {
			console.log("failed to retrieve the total user count in store")
			console.log("Error: " + errorThrown);
			console.log("Status: " + status);
			//alert(errorThrown);
		}
	});
}

function refresh() {
	refreshTotalUserCount();
	refreshHeatmapAsyn();
}
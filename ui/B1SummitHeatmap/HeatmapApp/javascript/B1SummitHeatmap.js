var heatmap;
var heatmap4Chocolate, heatmap4Wine, heatmap4Cheese, heatmap4Entrance;
var heatmapList = [];
var dataPoints;
var beaconList = [
	{
		"beaconId": CHOCOLATE_BEACON,
		"shelfId": "UL77",
		"heatmapContainerId": "heatmapContainer_chocolate", 
		"heatmap": {},
	    "DataPoints": [],
		"XPosition": X_POSITION_IE,
		"MaxPointsCount": MAX_POINTS_COUNT,
		"image": "chocolate_shelf.jpg",
		"ShelfTitle": "Chocolates"
    },
	{
		"beaconId": WINE_BEACON,
		"shelfId": "UL89",
		"heatmapContainerId": "heatmapContainer_wine", 
		"heatmap": {},
	    "DataPoints": [],
		"ShelfTitle": "Wines",
		"XPosition": X_POSITION_IE,
		"MaxPointsCount": MAX_POINTS_COUNT,
		"image": "wine_shelf.jpg"
    },
	{
		"beaconId": CHEESE_BEACON,
		"shelfId": "UL101",
		"heatmapContainerId": "heatmapContainer_cheese", 
		"heatmap": {},
	    "DataPoints": [],
		"ShelfTitle": "Cheese",
		"XPosition": X_POSITION_IE,
		"MaxPointsCount": MAX_POINTS_COUNT,
		"image": "cheese_shelf.jpg"
    },
    {
		"beaconId": ENTRANCE_BEACON,
		"shelfId": "UL103",
		"heatmapContainerId": "heatmapContainer_entrance", 
		"heatmap": {},
	    "DataPoints": [],
		"ShelfTitle": "Entrance",
		"XPosition": X_POSITION_IE,
		"MaxPointsCount": MAX_POINTS_COUNT,
		"image": "entrance_gate.jpg"
    }];

var userList = [];

function randomY() {
	return RADIUS + Math.random() * HEATMAP_HEIGHT_IE;
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

function createHeatmap(index)
{
    beaconList[index].heatmap = h337.create({
		container: document.getElementById(beaconList[index].heatmapContainerId),
		maxOpacity: .6,
		radius: 15,
		blur: .90
		// backgroundColor with alpha so you can see through it
		//backgroundColor: 'rgba(0, 0, 58, 0.96)'
	});

	var heatmapContainer = document.getElementById(beaconList[index].heatmapContainerId);
	heatmapContainer.onclick = function(e) {
			var beacon = beaconList[index];
			var html = '<img src="images/' + beacon.image + '" /><h4></h4>'; 
				html += '<h4>'+beacon.ShelfTitle+'</h4>';
				html += '<h4>';
				for (var i in userList) {
					if (userList[i].BeaconID === beacon.beaconId && userList[i].users.length >= 0) {
						//console.log("Users in beacon(" + beacon.beaconId + "): " + JSON.stringify(userList[i].users));
						html += userList[i].users.length + ' Customers:</h4>';
						if(userList[i].users.length > 0)
						    html += '<table id=\"tblCustomers\" class=\"DetailTable\"><tr><th>User Id</th><th>Customer Code</th></tr>';
						for (var j in userList[i].users) {
							html += '<tr><td><a href=\"#OpenBP\" onclick=\"return OpenBPForm(\'' + userList[i].users[j].CardCode + '\')\">' + userList[i].users[j].UserId + '</a></td><td><a href=\"#OpenBP\" onclick=\"return OpenBPForm(\'' + userList[i].users[j].CardCode + '\')\">' + userList[i].users[j].CardCode + '</a></td></tr>';
						}
						if(userList[i].users.length > 0)
						    html += '</table>';
						break;
					}
				}//<a href="#Foo" onclick="runMyFunction(); return false;">Do it!</a>
				document.getElementById('room_info').innerHTML = html;
	};

	
	/**
	heatmapContainer.onmousemove = heatmapContainer.ontouchmove = function(e) {
		// we need preventDefault for the touchmove
		e.preventDefault();
		var x = e.layerX;

		var y = e.layerY;
		if (e.touches) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}

        console.log("x: " + x + "; y: " + y );
		heatmap4Chocolate.addData({
			x: x,
			y: y,
			value: 1
		});
	};
	***/
}

function createHeatmaps()
{
    for(var i in beaconList)
    {
        createHeatmap(i);
    }
    
    refresh();
	window.setInterval(refresh, REFRESH_INTERVAL_MS);
}

function drawHeatPoints(beaconIndex,value) {
    var beacon = beaconList[beaconIndex]
    beacon.DataPoints = [];
	if (value > 0) {
		//if user count less than, then draw two heatmap points. otherwise, just one
		var pointCount; //number of points to be drew.
		var count = value < beacon.MaxPointsCount ? value : beacon.MaxPointsCount;
		pointCount = Math.round(Math.random() * count);
		pointCount = pointCount < 1 ? 1 : pointCount;
		pointCount = pointCount < 2 && value >=2? 2:pointCount;
		
		var valueEx = value * FACTOR;
		var valueAccumulated = 0;
		for (var i = 0; i < pointCount && valueAccumulated < valueEx; i++) {
			//var randomValue = Math.round((Math.random() * valueEx + Math.random() * valueEx)/2);
			var randomValue = Math.round(((Math.random() + Math.random()) * value)/2)*FACTOR;
			if (i === pointCount - 1) {
				randomValue = valueEx - valueAccumulated;
			}
			beacon.DataPoints.push({
				"x": beacon.XPosition,
				"y": randomY(),
				"value": randomValue
			});
			valueAccumulated += randomValue;
		}
	}
	var data = {
		min: 0,
		max: 20,
		data: beacon.DataPoints
	};
	beacon.heatmap.setData(data);
}

function refreshHeatmapAsyn() {

	console.log("Refreshing heatmap asynchronously");
	//for-each beacon.
	dataPoints = [];
	userList = [];

	for (var beacon in beaconList) {
		$.ajax({
			url: "/b1sa/beaconsOne/services/getUsersPosition.xsjs?beaconId=" + beaconList[beacon].beaconId,
			type: "GET",
			dataType: "json",
			//async: false,
			success: function(result, xhr) {
				var xPosition;
				var beacon;
				var i=0;
				for (i in beaconList) {
					if (beaconList[i].beaconId === result.BeaconID) {
					    beacon=beaconList[i];
						xPosition = beacon.XPosition;
						//console.log(result.BeaconID);
						//console.log(xPosition);
						break;
					}
				}
				//var heatmap_inst = heatmapList[i].heatmap;
				var count = result.users.length;
				userList.push(result);
				//console.log("count of users in beacon("+result.BeaconID+")" +count);
				//drawHeatPoints(heatmap_inst, count, beacon.MaxPointsCount, 5, xPosition)
				drawHeatPoints(i, count)
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

	for (var beacon in beaconList) {
		console.log(JSON.stringify(beacon));
		var resultText = $.ajax({
			url: "/b1sa/beaconsOne/services/getUsersPosition.xsjs?beaconId=" + beaconList[beacon].beaconId,
			type: "GET",
			dataType: "json",
			async: false
		}).responseText;
		
		var result = JSON.parse(resultText);
		var xPosition = beaconList[beacon].XPosition;

		var count = result.users.length;
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
		}
	});
}

function refresh() {
	refreshTotalUserCount();
	refreshHeatmapAsyn();
}
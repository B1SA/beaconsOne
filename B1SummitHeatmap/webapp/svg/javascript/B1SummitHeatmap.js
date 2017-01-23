function createHeatmap() {

	var heatmap = h337.create({
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
	heatmap.addData({
		x: 205,
		y: 300,
		value: 5
	});
	heatmap.addData({
		x: 205,
		y: 290,
		value: 6
	});
	heatmap.addData({
		x: 205,
		y: 280,
		value: 8
	});
	heatmap.addData({
		x: 205,
		y: 270,
		value: 7
	});
	heatmap.addData({
		x: 205,
		y: 260,
		value: 10
	});
	heatmap.addData({
		x: 205,
		y: 250,
		value: 10
	});
	heatmap.addData({
		x: 205,
		y: 240,
		value: 8
	});
	heatmap.addData({
		x: 205,
		y: 230,
		value: 7
	});
	heatmap.addData({
		x: 205,
		y: 220,
		value: 2
	});
	heatmap.addData({
		x: 205,
		y: 210,
		value: 1
	});

	heatmap.addData({
		x: 510,
		y: 300,
		value: 5
	});
	heatmap.addData({
		x: 510,
		y: 290,
		value: 2
	});
	heatmap.addData({
		x: 510,
		y: 280,
		value: 3
	});
	heatmap.addData({
		x: 510,
		y: 270,
		value: 4
	});
	heatmap.addData({
		x: 510,
		y: 260,
		value: 7
	});
	heatmap.addData({
		x: 510,
		y: 250,
		value: 2
	});
	heatmap.addData({
		x: 510,
		y: 240,
		value: 9
	});
	heatmap.addData({
		x: 510,
		y: 230,
		value: 10
	});
	heatmap.addData({
		x: 510,
		y: 220,
		value: 2
	});
	heatmap.addData({
		x: 510,
		y: 210,
		value: 1
	});

	//heatmapContainer.app
	/******/
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

	heatmapContainer.onclick = function(e) {
		var x = e.layerX;
		var y = e.layerY;
		heatmap.addData({
			x: x,
			y: y,
			value: 1
		});
	};
	//$('#heatmapContainer').load('floor_plan.svg');
	/******/
	// your code
}
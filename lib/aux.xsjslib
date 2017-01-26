//Auxiliar functions for data manipulation
$.import("b1sa.beaconsOne.lib", "B1SLLogic");

function formatData(json) {
	//Convert a set of Users to an Array of Users
	var newUsers = [];
	for (var i = 0; i < Object.keys(json['USERS']).length; i++) {
		var user = json['USERS'][i];
		newUsers.push(user);
	}
	return newUsers;
}

function getUserCardCode(userId) {
	return 'C20000';
}

function getBeaconItem(beaconId) {
	return 'I00005';
}

function formatOfferWithPics(body) {
	var response = $.b1sa.beaconsOne.lib.B1SLLogic.SLEasyLogin();
	var SESSIONID, NODEID;

	SESSIONID = response.SessionID;
	NODEID = response.NodeID;

	var images = $.b1sa.beaconsOne.lib.B1SLLogic.GetItemsPictures(body, SESSIONID, NODEID);
	images = JSON.parse(images.body.asString());
	images = images.value;
	
	for (var i = 0; i < body.length; i++) {
		for (var j = 0; j < images.length; j++) {
			if (body[i].ItemCode === images[j].ItemCode) {
				body[i].PictureURL =
					images[j][$.b1sa.beaconsOne.lib.constants.getPicProperty()]
			}
		}
	}
	
	return body;
}

function quotes(val) {
	return "%27" + val + "%27";
}

function op(op) {
	return "%20" + op + "%20";
}
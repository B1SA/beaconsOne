//Auxiliar functions for data manipulation
$.import("b1sa.beaconsOne.lib", "B1SLLogic");
$.import("b1sa.beaconsOne.lib", "constants");


function formatData(json) {
	//Conver    t a set of Users to an Array of Users
	var newUsers = [];
	for (var i = 0; i < Object.keys(json['USERS']).length; i++) {
		var user = json['USERS'][i];
		newUsers.push(user);
	}
	return newUsers;
}

function getUserCardCode(userId) {
	//Initate SQL connection
	var connection = $.hdb.getConnection();

	//List of Users to receive a Welcome Offer
	var getUserBP = connection.loadProcedure("BEACONSONE",
		"b1sa.beaconsOne.procedures.mobile::getUserBP");

	var CardCode = getUserBP(userId);
	connection.close();
    
    //Return Generic CardCode if customer is not mapped
    if(!CardCode.CARDCODE){
        return $.b1sa.beaconsOne.lib.constants.getGenCardCode();
    }

	return CardCode.CARDCODE;
}

function getUserDeviceToken(userId) {
	//Initate SQL connection
	var connection = $.hdb.getConnection();
	
	var getUserDevice = connection.loadProcedure("BEACONSONE",
		"b1sa.beaconsOne.procedures.mobile::getUserDevice");
	
	var DeviceToken = getUserDevice(userId);
	connection.close();
	
	return DeviceToken.DEVICETOKEN;
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
/** To be called via XSJOB **/
/** Send Welcome Offer for each new user that have not 
received it yet, based on the amount of time spent near a beacon
 via Apple Push Notification (APN) **/

var durations = [];
var output = {};
var job = 0;

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "aux");
$.import("b1sa.beaconsOne.lib", "B1XAFLogic");
$.import("b1sa.beaconsOne.lib", "APN");

function addDuration(beaconId, duration) {

	for (var i = 0; i < durations.length; i++) {
		if (durations[i].BeaconId === beaconId) {
			durations[i].Duration += duration;
			return;
		}
	}

	durations.push({
		BeaconId: beaconId,
		Duration: duration
	});
}

function getMaxDurationBeacon() {
	var maxBeaconIndex = 0;
	var maxDuration = 0;
	for (var i = 0; i < durations.length; i++) {
		if (durations[i].Duration > maxDuration) {
			maxDuration = durations[i].Duration;
			maxBeaconIndex = i;
		}
	}
	return maxBeaconIndex;

}

function run() {

	try {

		job = $.b1sa.beaconsOne.lib.constants.jobsActivaded();
		var APN = [];

		//Initate SQL connection
		var connection = $.hdb.getConnection();
		//List of Users to receive an Item Recomendation
		var getUserDuration = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::getUserDuration");
		//Procedure to update User status
		var setUserItemRec = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::setUserItemRec");

		// Retrieve the list of users that are in the shop
		var toItemRecUsers = connection.executeQuery(
			' SELECT DISTINCT "UserId", "Date"' +
			' FROM "_SYS_BIC"."b1sa.beaconsOne.models/SAP_CA_ACTIVEUSERS"' +
			' WHERE "RecItemRecom" = 0');

		//Log in Xapp Framework (to retrieve recommendations later)
		var b1XappCon = $.b1sa.beaconsOne.lib.B1XAFLogic.loginCookies();

		if (b1XappCon === false) {
			throw 'Error connecting to B1 Xapp Framework'
		}

		//Add Xapp Framework connection IDs to the output
		output.B1XAF = b1XappCon;

		//For each user in the Shop that have not received an Item Recommendation
		for (var i = 0; i < Object.keys(toItemRecUsers).length; i++) {
			var userDuration = $.b1sa.beaconsOne.lib.aux.formatData(
				getUserDuration(
					toItemRecUsers[i].UserId));

			var prevBeacon = null;
			durations = [];

			//Find the duration of each user per Beacon (and also the user path)
			for (var j = 0; j < Object.keys(userDuration).length; j++) {
				if (userDuration[j].BeaconIdFrom !== userDuration[j].BeaconIdTo) {
					if (userDuration[j].BeaconIdFrom !== prevBeacon) {
						addDuration(userDuration[j].BeaconIdFrom, userDuration[j].Duration);
						prevBeacon = userDuration[j].BeaconIdFrom;
					}
				} else if (j == Object.keys(userDuration).length - 1) {
					//this is the last user position. There is no "entrance time"
					//on a next beacon. Therefore we need to calculate the duration here.
					var startDate = userDuration[j].DateFrom;
					var endDate = new Date();
					var lastDuration = (endDate.getTime() - startDate.getTime()) / 1000;

					addDuration(userDuration[j].BeaconIdFrom, lastDuration);

				}

			}

			var maxBeaconId = getMaxDurationBeacon();

			if (durations[maxBeaconId].Duration >= $.b1sa.beaconsOne.lib.constants.getRecomIntervall()) {
				// Send Item recommendation of this beacon to this user
				var body = {};
				body.CardCode = $.b1sa.beaconsOne.lib.aux.getUserCardCode(toItemRecUsers[i].UserId);

				body.ItemCode = $.b1sa.beaconsOne.lib.aux.getBeaconItemCode(durations[maxBeaconId].BeaconId);

				var recom = $.b1sa.beaconsOne.lib.B1XAFLogic.ItemRecommend(body, b1XappCon.SessionID, b1XappCon.NodeID);

				var ItemRec = {
					UserId: toItemRecUsers[i].UserId,
					Date: toItemRecUsers[i].Date,
					BeaconId: durations[maxBeaconId].BeaconId,
					Duration: durations[maxBeaconId].Duration,
					CardCode: body.CardCode,
					ItemCode: body.ItemCode
					
					
				};

				try {
					ItemRec.Offer = JSON.parse(recom.body.asString());
				} catch (e) {
					ItemRec.Offer = recom.body.asString();
				}

                //Get the Item Picture for each Recommendaed Item
			    ItemRec.Offer.resultSet = $.b1sa.beaconsOne.lib.aux.formatOfferWithPics(ItemRec.Offer.resultSet);
				
				//Update user status (Received Item Recom = true)
				setUserItemRec(ItemRec.UserId, ItemRec.Date);

				APN.push(ItemRec);
			}
		}

		//Send APN 
		$.b1sa.beaconsOne.lib.APN.sendItemRecom(APN);

		//Add sent offers to the output
		output.APN = APN;

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		connection.close();

		//Build the response
		if (job != false) {
			$.response.contentType = "application/json";
			$.response.status = $.net.http.OK;
			$.response.setBody(JSON.stringify(output));
		}
	} catch (e) {
		if (job != false) {

			$.response.contentType = "application/json";
			$.trace.warning("call B1 Xapp Framework  Exception: " + e.message);
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody(JSON.stringify({
				"error": e.message
			}));
		}
	}
}
run();
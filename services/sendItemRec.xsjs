/** To be called via XSJOB **/
/** Send Welcome Offer for each new user that have not 
received it yet, based on the amount of time spent near a beacon
the via Apple Push Notification (APN) **/

var durations = {};
var output = {};
var job = 0;

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");
$.import("b1sa.beaconsOne.lib", "B1XAFLogic");
$.import("b1sa.beaconsOne.lib", "APN");

function addDuration(beacon, duration) {
    
    durations[beacon] += duration;
    
    /**
	for (var i = 0; i < durations.length; i++) {
		if (durations[i].BeaconId === duration.BeaconId) {
			durations[i].Duration += duration.Duration;
			return;
		}
	}
	durations.push(duration);
	**/
}

function getMaxDurationBeacon()
{
    var maxBeacon = null;
    var duration = null
    for ( var index in durations ) {
    
        return;
    }
    
}


function run() {

	try {
		
		job = $.b1sa.beaconsOne.lib.constants.jobsActivaded();
		
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

		//For each user in the Shop that have not received an Item Recommendation
		for (var i = 0; i < Object.keys(toItemRecUsers).length; i++) {
			var userDuration = $.b1sa.beaconsOne.lib.users.formatData(
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
				}
			}
			var maxBeaconId = getMaxDurationBeacon();
			//Show results in the output
			
			
		}
		return;
	

		//Connects to the B1 Xapp Framework
		var b1XappCon = $.b1sa.beaconsOne.lib.B1XAFLogic.loginCookies();

		if (b1XappCon === false) {
			throw 'Error connecting to B1 Xapp Framework'
		}

		//Add Xapp Framework connection IDs to the output
		output.B1XAF = b1XappCon;

		//Array of offers to be sent via Apple Push Notification
		var APN = [];

		/**
            var recom =
				$.b1sa.beaconsOne.lib.B1XAFLogic.SaleRecommend(
					toWelcUsers[i].UserId,
					b1XappCon.SessionID,
					b1XappCon.NodeID);

			var welcOffer = {
				UserId: toWelcUsers[i].UserId,
				Date: toWelcUsers[i].Date
			}
			try {
				welcOffer.Offer = JSON.parse(recom.body.asString());
			} catch (e) {
				welcOffer.Offer = recom.body.asString();
			}

			//Update user status (ReceivedWelcomeOffer = true)
			setUserItemRec(welcOffer.UserId, welcOffer.Date);

			APN.push(welcOffer);
		 * 
		 **/

		//Send APN 
		$.b1sa.beaconsOne.lib.APN.sendItemRecom(APN);

		//Add sent offers to the output
		output.APN = APN;

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		connection.close();

		//Build the response
		if (job != true) {

			$.response.contentType = "application/json";
			$.response.status = $.net.http.OK;
			$.response.setBody(JSON.stringify(output));
		}
	} catch (e) {
		if (job != true) {

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
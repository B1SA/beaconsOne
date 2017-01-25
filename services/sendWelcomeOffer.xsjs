/** To be called via XSJOB **/
/** Send Welcome Offer for each new user that have not 
received it yet via Apple Push Notification (APN) **/

var output = {};
var job = 0;

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");
$.import("b1sa.beaconsOne.lib", "B1XAFLogic");
$.import("b1sa.beaconsOne.lib", "APN");

function run() {

	try {
		job = $.b1sa.beaconsOne.lib.constants.jobsActivaded();

		//Initate SQL connection
		var connection = $.hdb.getConnection();
		//List of Users to receive a Welcome Offer
		var getNotWelcUser = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::getNotWelcomedUsers");
		//Procedure to update User status
		var setUserWelcOffer = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::setUserWelcOffer");

		//Call Procedures to retrieve users to welcome on friendly format
		var toWelcUsers = $.b1sa.beaconsOne.lib.users.formatData(getNotWelcUser());

		//Connects to the B1 Xapp Framework
		var b1XappCon = $.b1sa.beaconsOne.lib.B1XAFLogic.loginCookies();

		if (b1XappCon === false) {
			throw 'Error connecting to B1 Xapp Framework'
		}

		//Add Xapp Framework connection IDs to the output
		output.B1XAF = b1XappCon;

		//Array of offers to be sent via Apple Push Notification
		var APN = []

		//Get B1 Item Recommendations for each user
		for (var i = 0; i < toWelcUsers.length; i++) {
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
			setUserWelcOffer(welcOffer.UserId, welcOffer.Date);

			APN.push(welcOffer);
		}

		//Send APN 
		$.b1sa.beaconsOne.lib.APN.sendWelcomeOffer(APN);

		//Add sent offers to the output
		output.APN = APN;

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		connection.close();

		//Build the response
        $.trace.debug("Send Welcome offer Done! " + JSON.stringify(output));
		if (job != true) {
			$.response.contentType = "application/json";
			$.response.status = $.net.http.OK;
			$.response.setBody(JSON.stringify(output));
		}
	} catch (e) {
		$.trace.error("Send Welcome offer Exception: " + e.message);
		if (job != true) {
			$.response.contentType = "application/json";
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody(JSON.stringify({
				"error": e.message
			}));
		}
		
	}
}
run();
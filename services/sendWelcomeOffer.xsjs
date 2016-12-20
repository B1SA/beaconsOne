/** Send Welcome Offer for each new user that have not 
    received it yet via Apple Push Notification (APN) **/
var output = {};
$.response.contentType = "application/json";

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");
$.import("b1sa.beaconsOne.lib", "B1XAFLogic");

try {
	//Initate SQL connection
	var connection = $.hdb.getConnection();
	var getNotWelcUser = connection.loadProcedure("BEACONSONE",
		"b1sa.beaconsOne.procedures::getNotWelcomedUsers");
	
	//Get Constant Values
	output.Interval = $.b1sa.beaconsOne.lib.constants.getUserInterval();

	//Call Procedures to retrieve users to welcome on friendly format
	var toWelcUsers = $.b1sa.beaconsOne.lib.users.formatData(
		getNotWelcUser(output.Interval));
	
	//Connects to the B1 Xapp Framework
	var b1XappCon = $.b1sa.beaconsOne.lib.B1XAFLogic.loginCookies();

	if (b1XappCon === false) {
		throw 'Error connecting to B1 Xapp Framework'
	}

	output.B1XAF = b1XappCon;

	//Get B1 Item Recommendations for each user
	for (var i = 0; i < toWelcUsers.length; i++) {
		var recom =
			$.b1sa.beaconsOne.lib.B1XAFLogic.SaleRecommend(
				toWelcUsers[i].UserId,
				b1XappCon.SessionID,
				b1XappCon.NodeID);
		try {
			toWelcUsers[i].welcOffer = JSON.parse(recom.body.asString());
		} catch (e) {
			toWelcUsers[i].welcOffer = recom.body.asString();
		}
	}

	//connection.commit();
	connection.close();
	output.APN = toWelcUsers;

	//Build the response
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(output));
} catch (e) {
	$.trace.warning("call B1 Xapp Framework  Exception: " + e.message);
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	//	$.response.setBody(JSON.stringify({
	//		"error": e.message
	//	}));
}
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

	//Get B1 Item Recommendations for each user
	for (var i = 0; i < toWelcUsers.length; i++) {
		toWelcUsers[i].recomendation =
		        $.b1Assistant.lib.B1XAFLogic.SaleRecommend(body,SESSIONID,NODEID);
	}

	//connection.commit();
	connection.close();
    output.result = toWelcUsers;
	
	//Build the response
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(output));
} catch (e) {
	$.trace.warning("call B1 Xapp Framework  Exception: " + e.message);
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(JSON.stringify({
		"error": e.message
	}));
}
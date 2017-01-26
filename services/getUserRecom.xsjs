/** Retrieve Item Recommendations based on a User **/

var output = {};
$.response.contentType = "application/json";
$.import("b1sa.beaconsOne.lib", "B1XAFLogic");

function getItemRecommendation(user) {
	try {
		//Connects to the B1 Xapp Framework
		var b1XappCon = $.b1sa.beaconsOne.lib.B1XAFLogic.loginCookies();

		if (b1XappCon === false) {
			throw 'Error connecting to B1 Xapp Framework'
		}

		output.B1XAF = b1XappCon;

		var recom = $.b1sa.beaconsOne.lib.B1XAFLogic.SaleRecommend(
			user,
			b1XappCon.SessionID,
			b1XappCon.NodeID);
		try {
			output.welcOffer = JSON.parse(recom.body.asString());
		} catch (e) {
			output.welcOffer = recom.body.asString();
		}

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
}

var user = $.request.parameters.get('user');
getItemRecommendation(user);
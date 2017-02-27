/** Register a Mobile devide Token and User **/
$.import("b1sa.beaconsOne.lib", "aux");
$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "APN");


var output = {};
$.response.contentType = "application/json";

function run(body) {
	try {
		output.RecBody = body;

		//Open connection and load procedure to retrieve last users positions
		var connection = $.hdb.getConnection();
		var setDevice = connection.loadProcedure("BEACONSONE", "b1sa.beaconsOne.procedures.mobile::setDevice");

		//Store User/DeviceToken on HCP Table
		var respInsert = setDevice(body.DeviceToken, body.UserId);
		
		//Register DeviceToken on HCP Mobile Services:
		var userAppId = $.b1sa.beaconsOne.lib.constants.getMobileAppNameWSep() + body.DeviceToken;

		
		var respHCPMobile = $.b1sa.beaconsOne.lib.APN.registerHCPMobileService(body, userAppId);
	    
	    
	    try {
			respHCPMobile = JSON.parse(respHCPMobile);
		} catch (e) {
		    respHCPMobile = respHCPMobile.body.asString();
		};


		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		//Build the response
		output.retInsert = respInsert;
		output.retHCPMobile = respHCPMobile;
		connection.close();
		$.response.status = $.net.http.OK;
		$.response.setBody(JSON.stringify(output));

	} catch (e) {
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

var reqBody;// = {UserId:"trm7_1", DeviceToken: "19223sjafjaisfa242181ud1982jesss1982ej1928her191"};
reqBody = $.request.body.asString();
reqBody = JSON.parse(reqBody);
run(reqBody);
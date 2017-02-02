/** Register a Mobile devide Token and User **/
$.import("b1sa.beaconsOne.lib", "constants");

var output = {};
$.response.contentType = "application/json";

function run(body) {
	try {
		output.RecBody = body;

		//Open connection and load procedure to retrieve last users positions
		var connection = $.hdb.getConnection();
		var setDevice = connection.loadProcedure("BEACONSONE", "b1sa.beaconsOne.procedures.mobile::setDevice");

		//Retrieve Info
		var resp = setDevice(body.DeviceToken, body.UserId);

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		//Build the response
		output.retInsert = resp;
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

var reqBody;
/*{UserId:"trm7", DeviceToken: "19281ud1982je1982ej1928her191"}*/
reqBody = $.request.body.asString();
reqBody = JSON.parse(reqBody);
run(reqBody);
/** To be called via XSJOB **/
/** Find not Active users in the shop and set them as Left on the Entrance Tab;e **/

var output = {};
var job = 0;

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");

function run() {
	try {
		job = $.b1sa.beaconsOne.lib.constants.jobsActivaded();

		//Initate SQL connection
		var connection = $.hdb.getConnection();
		//List of Users to receive a Welcome Offer
		var getNotActiveUsers = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::getNotActiveUsers");
		//Procedure to update User status
		var setUserLeft = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::setUserLeft");

		//Get Constant Values
		output.Interval = $.b1sa.beaconsOne.lib.constants.getUserInterval();

		//Call Procedures to retrieve not active users
		var notActiveUsers = $.b1sa.beaconsOne.lib.users.formatData(
			getNotActiveUsers(output.Interval));

		//Set each user as left
		for (var i = 0; i < notActiveUsers.length; i++) {
			setUserLeft(notActiveUsers[i].UserId, notActiveUsers[i].Date);
		}

		//Add sent offers to the output
		output.UsersLeft = notActiveUsers;

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		connection.close();

		//Build the response
        $.trace.debug("Find Users Left Done! " + JSON.stringify(output));
		if (job != true) {
			$.response.contentType = "application/json";
			$.response.status = $.net.http.OK;
			$.response.setBody(JSON.stringify(output));
		}
	} catch (e) {
		$.trace.error("Find Users Left Exception: " + e.message);
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
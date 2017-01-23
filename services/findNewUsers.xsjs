 /** To be called via XSJOB **/
/** Populates newUser table with new records **/

var output = {};
var job = 0;
$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");

function run() {
	try {
        job  = $.b1sa.beaconsOne.lib.constants.jobsActivaded();
		var connection = $.hdb.getConnection();
		var getNewUsers = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::getNewUsers");

		var setUserEntrance = connection.loadProcedure("BEACONSONE",
			"b1sa.beaconsOne.procedures::setUserEntrance");

		//Get Constant Values
		output.Interval = $.b1sa.beaconsOne.lib.constants.getUserInterval();
		output.EntBeacon = $.b1sa.beaconsOne.lib.constants.getEntranceBeacon();

		//Call Procedures to retrieve new users on friendly format
		var newUsers = $.b1sa.beaconsOne.lib.users.formatData(
			getNewUsers(
				output.EntBeacon,
				output.Interval));

		//Insert new users on NewUsersTable 
		for (var i = 0; i < newUsers.length; i++) {
			var err = setUserEntrance(
				newUsers[i].UserId,
				newUsers[i].Date,
				output.Interval)

			if (err.INSERERROR) {
				//Error, entry already exists
				//Delete from new users array
				newUsers.splice(i, 1);
			}
		}

		if ($.b1sa.beaconsOne.lib.constants.shouldCommit()) {
			connection.commit();
		}

		connection.close();

		output.NewUsers = newUsers;
		//Build the response if not running on job
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
/** Populates newUser table with new records **/

var output = {};
$.response.contentType = "application/json";
$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "users");

try {

	//Initate SQL connection
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
		newUsers[i].status = setUserEntrance(newUsers[i].UserId,newUsers[i].Date);
		newUsers[i].status = newUsers[i].status.EX_MESSAGE;
	}
	connection.commit();
	connection.close();

	output.NewUsers = newUsers;
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
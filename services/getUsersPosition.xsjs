/** Retrieves the last beacon on each user**/

$.import("b1sa.beaconsOne.lib","constants"); 
$.import("b1sa.beaconsOne.lib", "users");


var results = {};
var connection = $.hdb.getConnection();
var getLastPositions = connection.loadProcedure("BEACONSONE", "b1sa.beaconsOne.procedures::getUsersPosition");
results.interval = $.b1sa.beaconsOne.lib.constants.getUserInterval();

results.users =  $.b1sa.beaconsOne.lib.users.formatData(getLastPositions(null,results.interval));
connection.close();	 


//Build the response
$.response.contentType = "application/json";
$.response.status = $.net.http.OK;
$.response.setBody(JSON.stringify(results));


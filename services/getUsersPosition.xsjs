/** Retrieves the last beacon on each user**/
/** Optional parameters:
 * 
 *  entrance (bool) - Return users on the Entrance Beacon (/lib/constants.xsjs)
 *  beaconId - Return users on the specific beacon area
 *
 **/

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "aux");

try {
	var beaconId;
	var results = {};
	results.BeaconID = null;

	//Parameter can get users on Entrance beacon or on an specific beacon
	beaconId = $.request.parameters.get('entrance');

	//Should return users on the entrance area??
	if (beaconId == 1) {
		results.BeaconID = $.b1sa.beaconsOne.lib.constants.getEntranceBeacon();
	} else {
		beaconId = $.request.parameters.get('beaconId');
		//Another Beacon
		if (beaconId != undefined) {
			results.BeaconID = beaconId;
		}
	}

	//Open connection and load procedure to retrieve last users positions
	var connection = $.hdb.getConnection();
	var getLastPositions = connection.loadProcedure("BEACONSONE", "b1sa.beaconsOne.procedures::getUsersPosition");

	//Get the default interval
	results.interval = $.b1sa.beaconsOne.lib.constants.getUserInterval();

	//Retrieve Info
	results.users = $.b1sa.beaconsOne.lib.aux.formatData(getLastPositions(results.BeaconID, results.interval));

	connection.close();

	//Build the response
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(results));

} catch (e) {
	$.trace.warning("call B1 Xapp Framework  Exception: " + e.message);
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(JSON.stringify({
		"error": e.message
	}));
}
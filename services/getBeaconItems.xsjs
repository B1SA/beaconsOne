/** Retrieve Item Recommendations based on a User **/

var output = {};
$.response.contentType = "application/json";
$.import("b1sa.beaconsOne.lib", "B1SLLogic");

function getBeaconItems(beacon) {
	try {
	    //Initate SQL connection
		var connection = $.hdb.getConnection();
		
		//Procure to load Item Group of this beacon
		var getBeaconItem = connection.loadProcedure("BEACONSONE",
		                	"b1sa.beaconsOne.procedures::getBeaconItem");
	    
		//Connects to the B1 SL
		var b1SlCon = $.b1sa.beaconsOne.lib.B1SLLogic.SLEasyLogin();

		if (b1SlCon === false) {
			throw 'Error connecting to Service Layer'
		}

		output.beaconId = beacon;
	    output.SessionID = b1SlCon.SessionID;
	    output.NodeID = b1SlCon.NodeID;
		
		
		output.beaconId = beacon;
		var ItemGrp = 	getBeaconItem(beacon);
		output.ItemGroupCode = ItemGrp.ITEMSGROUPCODE;

		//Get list of items of a Beacon Item Group
		var recom = $.b1sa.beaconsOne.lib.B1SLLogic.getItemsbyGroup(
                                                			output.ItemGroupCode,
                                                			output.SessionID,
                                                			output.NodeID);
		try {
			output.BeaconItems = JSON.parse(recom.body.asString());
		} catch (e) {
			output.BeaconItems = recom.body.asString();
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

var beaconId = $.request.parameters.get('beaconId');
getBeaconItems(beaconId);
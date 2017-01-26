/** Create a Sales Order using Service Layer **/
$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "B1SLLogic");
$.response.contentType = "application/json";

var output = {};

function run(body) {
	try {

		var response = $.b1sa.beaconsOne.lib.B1SLLogic.SLEasyLogin();
		var SESSIONID, NODEID;

		output.SLConnect = response;
		SESSIONID = response.SessionID;
		NODEID = response.NodeID;

		var d = new Date();
		var DocDueDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

		body.DocDueDate = DocDueDate;
		output.RecOder = body;

		response = $.b1sa.beaconsOne.lib.B1SLLogic.PostOrder(JSON.stringify(body), SESSIONID, NODEID);

		// Handle Results
		for (var i in response.headers) {
			if (response.headers[i].name == "~status_code") {
				output.StatusCode = response.headers[i].value;
				break;
			}
		}

		//Parse response body
		body = JSON.parse(response.body.asString());
		output.DocNum = body.DocNum;
		output.DocEntry = body.DocEntry;
		output.DocTotal = body.DocTotal;
		output.DocCurrency = body.DocCurrency;

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

var reqBody = $.request.body;

if (reqBody === undefined || reqBody === null) {

	/**	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify({
		"error": 'Mensagem sem Corpo'
	})); 
	**/
	/** Only for Testing **/
	reqBody = {
		"CardCode": 'C20000',
		"DocDueDate": "2017-01-90",
		"Comments": "Test Order is ON"
	};
	var lines = [];

	lines.push({
		"ItemCode": "R00001",
		"Quantity": 1
	});
	lines.push({
		"ItemCode": "A00001",
		"Quantity": 1
	});
	reqBody.DocumentLines = lines;
}

run(reqBody);
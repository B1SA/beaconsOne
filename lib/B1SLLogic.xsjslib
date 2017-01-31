var B1SLAddress = "/b1s/v1/";

var job = 0;
$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib", "aux");

function callServiceLayer(path, method, body, sessionID, routeID) {
	try {
		job = $.b1sa.beaconsOne.lib.constants.jobsActivaded();

		$.trace.debug("callServiceLayer (path: " + path + ", method: " + method + ", body: " + body + ", sessionID: " + sessionID + ", routeID: " +
			routeID + ")");

		//B1SL.xshttpdest
		var destination = $.net.http.readDestination("b1sa.beaconsOne.lib.http", "B1SLcds");
		var client = new $.net.http.Client();

		var header = "";
		if (method === $.net.http.PATCH) {
			method = $.net.http.POST;
			header = "X-HTTP-Method-Override: PATCH";
		}

		var req = new $.web.WebRequest(method, path);

		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
		}

		if (body) {
			req.setBody(body);
		}

		if (sessionID) {
			req.cookies.set("B1SESSION", sessionID);
		}
		if (routeID) {
			req.cookies.set("ROUTEID", routeID);
		}

		client.request(req, destination);

		var response = client.getResponse();

		//The rest of the file (attached) is just a default forward of the response  
		var myCookies = [],
			myHeader = [],
			myBody = null;

		//Cookies  
		for (var c in response.cookies) {
			myCookies.push(response.cookies[c]);
		}
		//Headers  
		for (var h in response.headers) {
			myHeader.push(response.headers[h]);
		}
		//Body  
		if (response.body)
			try {
				myBody = JSON.parse(response.body.asString());
			} catch (e) {
				myBody = response.body.asString();
			}

		$.trace.debug("call Service Layer Done! - " + JSON.stringify(response.body));
		return response;
	} catch (e) {
		$.trace.error("Call Service Layer Exception: " + JSON.stringify(e.message));

		if (job != true) {
			$.response.contentType = "application/json";
			$.response.setBody(JSON.stringify({
				"error": e.message
			}));
		}
	}
}

function SLLogin(body, sessionID, routeID) {
	var path = B1SLAddress + "Login";
	return callServiceLayer(path, $.net.http.POST, body, sessionID, routeID);
}

function SLEasyLogin() {

	// SL credentials
	var loginInfo = {};
	loginInfo.UserName = $.b1sa.beaconsOne.lib.constants.getB1User();
	loginInfo.Password = $.b1sa.beaconsOne.lib.constants.getB1Password();
	loginInfo.CompanyDB = $.b1sa.beaconsOne.lib.constants.getB1Company();

	var response = SLLogin(JSON.stringify(loginInfo), null, null);

	var output = {};
	// B1SESSION and ROUTEID cookies returned by Login
	for (var j in response.cookies) {
		if (response.cookies[j].name === "B1SESSION") {
			output.SessionID = response.cookies[j].value;
		} else if (response.cookies[j].name === "ROUTEID") {
			output.NodeID = response.cookies[j].value;
		}
	}

	return output;
}

function PostOrder(body, sessionID, routeID) {
	var path = B1SLAddress + "Orders";
	return callServiceLayer(path, $.net.http.POST, body, sessionID, routeID);
}

function GetItemsPictures(body, sessionID, routeID) {
	//Expect a body with a JSON of ItemCodes
	var filter = "$select=ItemCode," + $.b1sa.beaconsOne.lib.constants.getPicProperty();
	filter += "&$filter=";

	for (var i = 0; i < body.length; i++) {
		filter += "%20ItemCode"+ $.b1sa.beaconsOne.lib.aux.op('eq') + $.b1sa.beaconsOne.lib.aux.quotes(body[i].ItemCode);
		if (i !== body.length - 1) {
			filter += $.b1sa.beaconsOne.lib.aux.op('or');;
		}
	}
	var path = B1SLAddress + "Items" + "?" + filter;
	return callServiceLayer(path, $.net.http.GET, null, sessionID, routeID);
}
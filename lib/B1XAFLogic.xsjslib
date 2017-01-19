$.import("b1sa.beaconsOne.lib", "constants");

var B1XAddress = "/sap/sbo/";

function callB1XAF(path, method, body, sessionID, routeID) {
	try {
		$.trace.debug("callB1XAF (path: " + path + ", method: " + method + ", body: " + body + ", sessionID: " + sessionID + ", routeID: " +
			routeID + ")");

		//B1SL.xshttpdest
		var destination = $.net.http.readDestination("b1sa.beaconsOne.lib.http", "B1XAF");
		var client = new $.net.http.Client();

		var req = new $.web.WebRequest(method, path);
		req.contentType = "application/json";

		/**
		var usern = $.util.codec.encodeBase64($.b1sa.beaconsOne.lib.constants.getHanaUser());
		var header = "Basic " + usern + ":" + $.b1sa.beaconsOne.lib.constants.getHanaPass();
		req.headers.set("Authorization", header);
        **/

		if (body) {
			req.setBody(body);
		}

		if (sessionID) {
			req.cookies.set("sapxslb", sessionID);
		}

		if (routeID) {
			req.cookies.set(routeID.name, routeID.value);
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
		if (response.body) {
			try {
				myBody = JSON.parse(response.body.asString());
			} catch (e) {
				myBody = response.body.asString();
			}
		}

		$.trace.debug("call B1 Xapp Framework  response status: " + $.response.status);
		return response;
	} catch (e) {
		response = null;
		$.trace.warning("call B1 Xapp Framework  Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
		return false;
	}
}

function login(body) {

	//Return full login body
	var path = B1XAddress + "platform/login";
	return callB1XAF(path, $.net.http.POST, body, null, null);
}

function loginCookies(body) { /* Return only the login cookies */

	var loginInfo = {};
	loginInfo.username = $.b1sa.beaconsOne.lib.constants.getB1User();
	loginInfo.password = $.b1sa.beaconsOne.lib.constants.getB1Password();
	loginInfo.company = $.b1sa.beaconsOne.lib.constants.getB1Company();

	var output = {};
	var NODEID = {};
	var response = login(JSON.stringify(loginInfo));

	if (response) {
		for (var j in response.cookies) {
			if (response.cookies[j].name === "sapxslb") {
				output.SessionID = response.cookies[j].value;
			} else if (response.cookies[j].name) {
				NODEID.name = response.cookies[j].name;
				NODEID.value = response.cookies[j].value;
				output.NodeID = NODEID;
			}
		}
		return output;
	}
	return false;

}

function SaleRecommend(cardCode, sessionID, routeID) {
	cardCode = 'C20000';
	var path = B1XAddress +
		"pervasive/IMCC/srv/pa/service/sale_recommend" +
		"?cardcode=" + cardCode;

	return callB1XAF(path, $.net.http.GET, null, sessionID, routeID);
}

function ItemRecommend(body, sessionID, routeID) {
	//Temporary
	body.CardCode = 'C20000';
	body.ItemCode = 'I00005';
	
	var path = B1XAddress +
		"pervasive/IMCC/srv/pa/service/sale_related" +
		"?cardcode=" + body.CardCode +
		"&itemcode=" + body.ItemCode;

	return callB1XAF(path, $.net.http.GET, null, sessionID, routeID);
}

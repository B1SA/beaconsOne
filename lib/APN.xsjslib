/*Library to send Apple Push Notifications*/

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib","aux");

function callHCPPush(path, method, body, data) {
	try {

		$.trace.debug("callHCPPush (path: " + path + ", method: " + method + ", body: " + body);

		var destination = $.net.http.readDestination("b1sa.beaconsOne.lib.http", "pushRest");
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

		req.headers.set("Content-Type", "application/json");
		req.headers.set("Authorization", "Basic RDA1Mjc1ODpJMDEzMjc5JQ==");

		/*
        req.headers.set("Content-Type:application/json");
        req.headers.set("Authorization: basic Basic RDA1Mjc1ODpJMDEzMjc5JA==");
*/
		if (body) {
			//		    body = JSON.stringify(body);
			body = body + data;
			body = body + ",sound = soundval,}";
			req.setBody(body);
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

		$.trace.debug("callHCPPush response status: " + $.response.status);
		return response;
	} catch (e) {
		$.trace.warning("callHCPPush Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
}

function DebugAPNCall() {
	/*
     * Hardcoded test function to confirm APN is working should only be called when troubleshooting
     * Values to pass ot APN
     {
        "customParameters": {
            "apns.category": "WelcomeOffer"
        },
	"alert":  "Now add more content to your Push Notifications!", 
         "badge": 1, 
         "data": "[{\"ItemCode\":\"I00008\",\"ItemName\":\"Rainbow Nuance Ink 6-Pack and Photo Paper Kit\",\"CardCode\":\"C99998\",\"Price\":39,\"Currency\":\"$\",\"Probability\":2.457943925233645,\"PictureURL\":\"http://i.imgur.com/BDkbtor.jpg\"},{\"ItemCode\":\"I00007\",\"ItemName\":\"Rainbow Printer 9.5 Inkjet Cartridge\",\"CardCode\":\"C99998\",\"Price\":28,\"Currency\":\"$\",\"Probability\":2.4375,\"PictureURL\":\"http://i.imgur.com/BDkbtor.jpg\"}]",
         "sound": "soundval"
}
 */
	var apnBody = {};
	apnBody.customParameters = {
		"apns.category": "WelcomeOffer"
	};
	apnBody.alert = 'Your Welcome Offer ';
	apnBody.badge = 5;
	apnBody.data = "[{";
	apnBody.data = apnBody.data +
		"\"ItemCode\":\"I00008\",\"ItemName\":Rainbow Nuance Ink 6-Pack and Photo Paper Kit\",\"CardCode\":\"C99998\",\"Price\":39,\"Currency\":\"$\",\"Probability\":2.457943925233645,\"PictureURL\":\"http://i.imgur.com/BDkbtor.jpg\"},{\"ItemCode\":\"I00007\",\"ItemName\":\"Rainbow Printer 9.5 Inkjet Cartridge\",\"CardCode\":\"C99998\",\"Price\":28,\"Currency\":\"$\",\"Probability\":2.4375,\"PictureURL\":\"http://i.imgur.com/BDkbtor.jpg\"";
	apnBody.data = apnBody.data + "}]";
	apnBody.sound = 'soundval';
	callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, JSON.stringify(apnBody));

}

function addslashes(str) {
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function EscapeSequence(data) {

	var updatedData = addslashes(JSON.stringify(data));
	return updatedData;

}

function sendWelcomeOffer(json) {
	/** Handle Json **/

	/*
 * function below used to prove APNs can be sent from HCP
   DebugAPNCall(); 
  */

	var apnBody;
	 for (var i = 0; i<json.length; i++){
//	    var deviceToken = $.b1sa.beaconsOne.lib.aux.getUserDeviceToken(json[i].UserId);
        apnBody = {};
        apnBody.customParameters = {"apns.category": "WelcomeOffer"};
        apnBody.alert = 'Your Welcome Offer'; //+ json[i].UserId;
        apnBody.badge = 5;
        //apnBody.data = json[i].Offer.resultSet[0].CardCode;
        var RS = EscapeSequence(json[i].Offer.resultSet);
        callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, JSON.stringify(apnBody), RS);
   }
 

}//sendWelcomeOffer

function sendItemRecom(json) {
//	callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, json);
    var apnBody;
	 for (var i = 0; i<json.length; i++){
        apnBody = {};
        apnBody.customParameters = {"apns.category": "WelcomeOffer"};
        apnBody.alert = 'Your Welcome Offer'; //+ json[i].UserId;
        apnBody.badge = 5;
        //apnBody.data = json[i].Offer.resultSet[0].CardCode;
        var RS = EscapeSequence(json[i].Offer.resultSet);
        callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, JSON.stringify(apnBody), RS);
   }

    
}

function registerDevice(userID, deviceToken)
{
    //getDeviceRegPath()
    try {

		$.trace.debug("registerDevice (userID: " + userID + ", deviceToken: " + deviceToken);

		var destination = $.net.http.readDestination("b1sa.beaconsOne.lib.http", "DeviceReg");
		var client = new $.net.http.Client();
        var method = $.net.http.POST; 
        
		var req = new $.web.WebRequest(method, $.b1sa.beaconsOne.lib.constants.getDeviceRegPath());
		var path = $.b1sa.beaconsOne.lib.constants.getDeviceRegPath();
	
        var header = ""; 
		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
	
		}

//		req.headers.set("Content-Type", "application/json");
		req.headers.set("Authorization", "Basic QkVBQ09OU09ORTpCMXNhdGVhbQ==");

		if (userID) {
					var body = {};
					body.UserId = userID;
					body.DeviceToken = deviceToken;
					req.setBody(JSON.stringify(body));
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

		$.trace.debug("registerDevice response status: " + $.response.status);
		return response;
	} catch (e) {
		$.trace.warning("registerDevice Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}	
}
/*Library to send Apple Push Notifications*/

$.import("b1sa.beaconsOne.lib", "constants");
$.import("b1sa.beaconsOne.lib","aux");

function fixBody(body)
{
    var toBeReplaced = "}\"data\"";
    var newString = ",\"data\"";
    //body = body.replace(toBeReplaced,newString);
    return body.replace(toBeReplaced,newString);
}
function addslashes(str) {
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function EscapeSequence(data) {

    var addData = "\"data\":\"";
	var updatedData =  addslashes(JSON.stringify(data));
	return addData + updatedData;

}

function registerHCPMobileService(body, userAppId)
{
    	try {
    	$.trace.debug("registerHCPMobileService (body:" + body + " userAppId: " + userAppId);
		

		var destination = $.net.http.readDestination("b1sa.beaconsOne.lib.http", "pushRest");
		var client = new $.net.http.Client();

		var header = "";
		var method  = $.net.http.POST;
		if (method === $.net.http.PATCH) {
			method = $.net.http.POST;
			header = "X-HTTP-Method-Override: PATCH";
		}
		
		var path = $.b1sa.beaconsOne.lib.constants.getHCPDeviceRegPath();

		var req = new $.web.WebRequest(method, path);

		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
		}

		req.headers.set("Content-Type", "application/json");
		req.headers.set("X-SMP-APPCID", userAppId);
		
		//Ralph: This should be filled on the xs/admin dashboard
		//in the property of the xshttpdest file
		req.headers.set("Authorization", "Basic RDA1Mjc1ODpJMDEzMjc5JQ==");


//		var body = {};
		

		if (body) {
		/*	body.ApnsDeviceToken = devToken;
		*/
			var regBody = {};
			regBody.ApnsDeviceToken = body.DeviceToken;
			regBody.DeviceType = $.b1sa.beaconsOne.lib.constants.getiOSDeviceType();
			body = JSON.stringify(regBody);
			req.setBody(JSON.stringify(regBody));
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

		$.trace.debug("registerHCPMobileService response status: " + $.response.status);
		return response;
	} catch (e) {
		$.trace.warning("callHCPPush Exception: " + e.message);
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify({
			"error": e.message
		}));
	}
    
    
}

function callHCPPush(path, method, body, data) {
	try {

		$.trace.debug("callHCPPush (path: " + path + ", method: " + method + ", body: " + body);
  //      body = JSON.PARSE (body);
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


		if (body) {
//		    body = JSON.stringify(body);
            data = data + "\"";
            body = body + data;
            body = fixBody(body);
            body = body + ",\"sound\": \"sound.caf\"}";
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
         "sound": "sound.caf"
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
//	apnBody.sound = 'sound.caf';
	callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, JSON.stringify(apnBody));

}



function sendWelcomeOffer(json) {
	/** Handle Json **/

	/*
 * function below used to prove APNs can be sent from HCP
   DebugAPNCall(); 
  */

	var apnBody;
	 for (var i = 0; i<json.length; i++){
// use $.b1sa.beaconsOne.lib.aux.getUserAppId("trm7") to get app id for specific user
//	    var deviceToken = $.b1sa.beaconsOne.lib.aux.getUserDeviceToken(json[i].UserId);
      //  var appID = $.b1sa.beaconsOne.lib.aux.getUserAppId(json[i].UserId);
        apnBody = {};
        apnBody.customParameters = {"apns.category": "WelcomeOffer"};
        apnBody.alert = 'Welcome to our shop  ' + json[i].UserId + ".  Check today's personalized offers";
        apnBody.badge = 5;
       // apnBody.RS = EscapeSequence(json[i].Offer.resultSet);
    //   apnBody.data = encodeURIComponent(JSON.stringify(json[i].Offer.resultSet));
     //   apnBody.sound = 'sound.caf';
        //apnBody.data = json[i].Offer.resultSet[0].CardCode;
        var RS = EscapeSequence(json[i].Offer.resultSet);
        var path = $.b1sa.beaconsOne.lib.constants.getAPNPath() + $.b1sa.beaconsOne.lib.aux.getUserAppId(json[i].UserId);
        callHCPPush(path, $.net.http.POST, JSON.stringify(apnBody), RS);
   }
 

}//sendWelcomeOffer

function sendItemRecom(json) {
//	callHCPPush($.b1sa.beaconsOne.lib.constants.getAPNPath(), $.net.http.POST, json);
    var apnBody;
	 for (var i = 0; i<json.length; i++){
        apnBody = {};
        apnBody.customParameters = {"apns.category": "RecOffer"};
        apnBody.alert = 'Would you like some recommendations based on your current location?'; //+ json[i].UserId;
        apnBody.badge = 5;
        //apnBody.data = json[i].Offer.resultSet[0].CardCode;
        var RS = EscapeSequence(json[i].Offer.resultSet);
        var path = $.b1sa.beaconsOne.lib.constants.getAPNPath() + $.b1sa.beaconsOne.lib.aux.getUserAppId(json[i].UserId);
        callHCPPush(path, $.net.http.POST, JSON.stringify(apnBody), RS);
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
				//	body = JSON.stringify(body);
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
$.import("b1sa.beaconsOne.lib","APN");
 
 
function Push() {
    
/*  var b = "{\n";
	b = b + "\"alert\": \"alertval\",\n";
	b = b + "\"data\": \"testData\",\n";
	b = b + "\"badge\": 1,\n";
	b = b + "\"sound\": \"soundval\"\n}";
*/
   var b = {};
   b = { alert: "alertval", data: "TestData", badge: 1, sound: "soundaal" }; 
   b = JSON.stringify(b);
   /*
   { "alert": "New vacation request", "customParameters": { "apns.category": "NEW_MESSAGE_CATEGORY" } }
   */
   
   //build apnBody that uses a customer category
   var apnBody ="{ \"alert\": \"Now add more content to your with data line Push Notifications!\", \"customParameters\": { \"apns.category\": \"WelcomeOffer\" }, ";
   apnBody = apnBody +  "\n\"badge\": 5,\n";
   //apnBody = apnBody + "\"data\":{\"B1XAF\": {\"SessionID\": \"ABCD\",\"NodeID\": {\"named\": \"xsID1234\"}},";
   apnBody = apnBody + " \"data\": \"B1XAF\", ";
   apnBody = apnBody + "\n\"sound\": \"soundval\""; 

   apnBody = apnBody +  "\n}";//Final curly bracket for alert text

        
   

    var method = $.net.http.POST;
    //var req = new $.web.WebRequest(method, path);
    //var req = new $.web.WebRequest(method, "http://hcpms-d052758trial.hanatrial.ondemand.com/restnotification/application/com.sap.B1.InnovationSummit2017");
    //req.setBody(b);
    var APNPath="/restnotification/application/com.sap.B1.InnovationSummit2017";
    
//    var resp =  $.b1sa.beaconsOne.lib.APN.callHCPPush(APNPath,method, b);
    var resp =  $.b1sa.beaconsOne.lib.APN.callHCPPush(APNPath,method, apnBody);
	
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(resp.headers));
    
    
}
Push();
$.import("b1sa.beaconsOne.lib","APN");
 
 
function Push() {
    
/*  var b = "{\n";
	b = b + "\"alert\": \"alertval\",\n";
	b = b + "\"data\": \"testData\",\n";
	b = b + "\"badge\": 1,\n";
	b = b + "\"sound\": \"soundval\"\n}";
*/
   var b = {};
   b = { alert1: "alertval", data: "TestData", badge: 1, sound: "soundaal" }; 
   b = JSON.stringify(b);
   
   
    var method = $.net.http.POST;
    //var req = new $.web.WebRequest(method, path);
    //var req = new $.web.WebRequest(method, "http://hcpms-d052758trial.hanatrial.ondemand.com/restnotification/application/com.sap.B1.InnovationSummit2017");
    //req.setBody(b);
    var APNPath="/restnotification/application/com.sap.B1.InnovationSummit2017";
    $.b1sa.beaconsOne.lib.APN.callHCPPush(APNPath,method, b);
}
Push();
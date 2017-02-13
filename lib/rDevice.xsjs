$.import("b1sa.beaconsOne.lib","APN");

function callRegistration()
{
    var userID = "duncanClone1", DeviceToken="MyLongDeviceToken";
    var resp =  $.b1sa.beaconsOne.lib.APN.registerDevice(userID,DeviceToken);
    $.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(resp.headers));
    
}

callRegistration();

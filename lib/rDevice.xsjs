$.import("b1sa.beaconsOne.lib","APN");

function callRegistration()
{
    //d5b0ba43a6ec094f075866ce3bfa9b7fa960b6effb048c4dfba86a8dfcbd692c
//    var userID = "duncans74", DeviceToken="d5b0ba43a6ec094f075866ce3bfa9b7fa960b6effb048c4dfba86a8dfcbd692c";
    var userID = "duncan", DeviceToken = "d5b0ba43a6ec094f075866ce3bfa9b7fa960b6effb048c4dfba86a8dfcbd692c";
    var resp =  $.b1sa.beaconsOne.lib.APN.registerDevice(userID,DeviceToken);
    $.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
	$.response.setBody(JSON.stringify(resp.headers));
    
}

callRegistration();

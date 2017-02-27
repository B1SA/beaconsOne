$.import("b1sa.beaconsOne.lib","APN");
$.import("b1sa.beaconsOne.lib","aux"); 
$.import("b1sa.beaconsOne.lib","constants"); 
 
 function registerHCPMS()
 {
     
      //49b06a9385f9a7ce95327f639a04b6c445826f6d3091f27ec7ef6362c2a1c529 Trinidad
      //d5b0ba43a6ec094f075866ce3bfa9b7fa960b6effb048c4dfba86a8dfcbd692c Duncan
        var devToken = "d5b0ba43a6ec094f075866ce3bfa9b7fa960b6effb048c4dfba86a8dfcbd692c";
      	var body = {};
  //    		var appID = $.b1sa.beaconsOne.lib.constants.getMobileAppNameWSep() + devToken; 
      	body.UserId = "duncan";
      	//body.ApnsDeviceToken = devToken;
      	body.DeviceToken = devToken;
			
	  var userAppId = $.b1sa.beaconsOne.lib.aux.createUserAppId(devToken);
      var resp =  $.b1sa.beaconsOne.lib.APN.registerHCPMobileService(body, userAppId);
      
     $.response.contentType = "application/json";
	 $.response.status = $.net.http.OK;
	 $.response.setBody(JSON.stringify(resp.headers));
	 
 }
 
 registerHCPMS();
 
/*var resp = $.b1sa.beaconsOne.lib.aux.getUserAppId("trm7");

     $.response.contentType = "application/json";
	 $.response.status = $.net.http.OK;
	 $.response.setBody(JSON.stringify(resp.headers));
 */
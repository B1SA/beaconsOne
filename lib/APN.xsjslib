/*Library to send Apple Push Notifications*/
function callHCPPush(path, method, body) {
    try {
        //$.trace.debug("callServiceLayer (path: " + path + ", method: " + method + ", body: " + body + ", sessionID: " + sessionID + ", routeID: " + routeID + ")");
        $.trace.debug("callServiceLayer (path: " + path + ", method: " + method + ", body: " + body);

        //B1SL.xshttpdest
//        var destination = $.net.http.readDestination("RO_WSRD.ServiceLayer", "B1SL");
        var destination = $.net.http.readDestination("b1sa.beaconsOne.lib","pushRest");
        var client = new $.net.http.Client();

        var header = "";
        if (method === $.net.http.PATCH) {
            method = $.net.http.POST;
            header = "X-HTTP-Method-Override: PATCH";
        }

        var req = new $.web.WebRequest(method,path);

        if (header !== "") {
            req.headers.set("X-HTTP-Method-Override", "PATCH");
        }
        
        req.headers.set("Content-Type:","application/json");
        req.headers.set("Authorization:", "basic Basic RDA1Mjc1ODpJMDEzMjc5JA==");

/*
        req.headers.set("Content-Type:application/json");
        req.headers.set("Authorization: basic Basic RDA1Mjc1ODpJMDEzMjc5JA==");
*/
        if (body) {
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


        $.trace.debug("callServiceLayer response status: " + $.response.status);
        return response;
    } catch (e) {
        $.trace.warning("callServiceLayer Exception: " + e.message);
        $.response.contentType = "application/json";
        $.response.setBody(JSON.stringify({
            "error": e.message
        }));
    }
}
function sendWelcomeOffer(json){
    
}

function sendItemRecom(json){
    
}
    

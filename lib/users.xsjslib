//Auxiliar functions to user daat manipulation


function formatData(json){
    //Convert a set of Users to an Array of Users
    var newUsers = [];
    for (var i = 0; i < Object.keys(json['USERS']).length; i++) {
	    var user = {};
    	user.UserId = json['USERS'][i].UserId;
    	user.Date   = json['USERS'][i].Date;
	    newUsers.push(user);
    }
   return newUsers;
}
 
//Auxiliar functions to user daat manipulation


function formatData(json){
    //Convert a set of Users to an Array of Users
    var newUsers = [];
    for (var i = 0; i < Object.keys(json['USERS']).length; i++) {
        var user = json['USERS'][i];
	    newUsers.push(user);
    }
   return newUsers;
}
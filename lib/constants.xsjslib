/*
    This library provide hardcoded constants
*/

/******************* B1 CONSTANTS *********************/
var b1User = "manager";
var b1Pass = "1234";
//var b1Comp = "SBODEMOUS";
// B1 CDS
/*
var b1User = "I830656";
var b1Pass = "Passw0rd1";
*/
var b1Comp = "DEMO_LPE";
var picProperty = 'User_Text'; // Item property to retrieve the Item img URL
var genCardCode = 'C99998'; // Generic CardCode


/****************APPLICATION CONSTANTS*******************/
var entraceBeaconId = "65485";
var APNPath= "/restnotification/application/APNSB1BeaconsDemo";

//Interval for a user to be considered Active
var userInterval = 600; // 10 minutes
//Interval near a beacon in order to a user receive an Item Recommendation
var recomInterval= 10;

/***************** DEBUG CONSTANTS *********************/
var doCommit = true; //commit data to user tables
var jobsActive = false; //Services are running 



/******************* RETRIVAL FUNCTIONS *******************/
function getB1User() {
	return b1User;
}

function getB1Password() {
	return b1Pass;
}

function getB1Company() {
	return b1Comp;
}

function getEntranceBeacon() {
	return entraceBeaconId;
}

function getUserInterval() {
	return userInterval;
}

function getRecomIntervall() {
	return recomInterval;
}

function getPicProperty(){
    return picProperty;
}

// Commit DB changes
function shouldCommit() {
	return doCommit;
}

// Prepare service outputs according to XSJOB prerequisites
function jobsActivaded() {
	return jobsActive;
}

function getAPNPath(){
    return APNPath;
}

function getGenCardCode(){
    return genCardCode;
}
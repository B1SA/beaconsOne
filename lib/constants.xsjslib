/*
    This library provide hardcoded constants
*/

/******************* B1 CONSTANTS *********************/
var b1User = "manager";
var b1Pass = "abc123";
var b1Comp = "SBODEMOUS";

var picProperty = 'User_Text'; // Item property to retrieve the Item img URL
var genCardCode = 'C99998'; // Generic CardCode

/****************APPLICATION CONSTANTS*******************/
//Beacon ID placed on the Shop Entrance
var entraceBeaconId = "65485";

//var APNPath= "/restnotification/application/APNSB1BeaconsDemo";
var APNPath = "/restnotification/application/com.sap.B1.InnovationSummit2017";
var deviceRegPath = "/b1sa/beaconsOne/services/mobile/registerDevice.xsjs";

//Interval for a user to be considered Active
var userInterval = 600; // 10 minutes

//Interval near a beacon in order to a user receive an Item Recommendation
var recomInterval= 10;

//Used on the Mobile Services Platform
var mobileAppName = "APNSB1BeaconsDemo"
var mobileAppSep = "-"

/***************** DEBUG CONSTANTS *********************/
var doCommit = true; //commit data to user tables
var jobsActive = true; //Services are running via XSJSJOB

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

function getDeviceRegPath()
{
    return deviceRegPath;   
}

function getGenCardCode(){
    return genCardCode;
}

function getMobileAppName(){
    return mobileAppName;
}

function getMobileAppSep(){
    return mobileAppSep;
}

function getMobileAppNameWSep(){
    return mobileAppName+mobileAppSep;
}


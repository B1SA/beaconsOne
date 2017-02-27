/*
    This library provide hardcoded constants
*/

/******************* B1 CONSTANTS *********************/
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

var picProperty = 'User_Text'; // Item property to retrieve the Item img URL
var genCardCode = 'C20000'; // Generic CardCode

/****************APPLICATION CONSTANTS*******************/
//Beacon ID placed on the Shop Entrance
var entraceBeaconId = "EntryBeacon";

/*
 * APNSB1BeaconsDemo app constants
 */
// this sends to all users on below  send to one but must provide X-SMP-APPCID var APNPath= "/restnotification/application/APNSB1BeaconsDemo";
var APNPath= "/restnotification/registration/";
var hcpDeviceRegPath = "/odata/applications/v4/APNSB1BeaconsDemo/Connections";


/*
 * com.sap.B1.InnovationSummit2017 (Duncan's test app) constants
 */
// this sends to all users on below  send to one but must provide X-SMP-APPCID var APNPath = "/restnotification/application/com.sap.B1.InnovationSummit2017";


/*var APNPath = "/restnotification/registration/";
var hcpDeviceRegPath = "/odata/applications/v4/com.sap.B1.InnovationSummit2017/Connections";

var deviceRegPath = "/b1sa/beaconsOne/services/mobile/registerDevice.xsjs";
*/
var iOSDeviceType = "iPhone";

//Interval for a user to be considered Active
var userInterval = 300; // 10 minutes

//Interval near a beacon in order to a user receive an Item Recommendation
var recomInterval= 10;

//Used on the Mobile Services Platform
var mobileAppName = "APNSB1BeaconsDemo";
var mobileAppSep = ".";

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

function getHCPDeviceRegPath()
{
    return hcpDeviceRegPath;
}

function getiOSDeviceType()
{
    return iOSDeviceType;
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


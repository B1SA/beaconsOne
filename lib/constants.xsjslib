/*
    This library provide hardcoded constants
*/

//B1 Constants
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

var picProperty = 1; // Item property to retrieve the Item img URL

//Application Constants
var entraceBeaconId = "55606";

//Interval for a user to be considered Active
var userInterval = 36000; // 5 minutes

//Interval near a beacon in order to a user receive an Item Recommendation
var recomInterval= 10; // 2 minutes

//Debug Constants
var doCommit = true; //commit data to user tables
var jobsActive = true; //Services are running 

/******** Constant retrival functions ********/

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
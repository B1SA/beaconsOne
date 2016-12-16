/*
    This library provide generic functions and hardcoded constants
*/

//Environment Constants
var b1Host = "52.67.35.51"; // Currently AWS (Alexa system) to be replaced by B1 CDS
//Credential Constants
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

//Application Constants
var entraceBeaconId = "b01";
var logInterval = 600;   // in seconds. Time to check log and refresh control tables
var userInterval = 906000;  // Refresh interval to provide user location


function getB1User(){
    return b1User;
}

function getB1Password(){
    return b1Pass;
}

function getB1Company(){
    return b1Comp;
}

function getB1Host(){
    return b1Host;
}

function getEntranceBeacon(){
    return entraceBeaconId;
}

function getUserInterval(){
    return userInterval;
}
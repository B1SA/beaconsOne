/*
    This library provide generic functions and hardcoded constants
*/

//Environment Constants
//var host = "52.67.35.51"; // Currently AWS (Alexa system) to be replaced by B1 CDS
var host = "10.0.0.150"; // DeathStar
var hanaUser = "SYSTEM";
var hanaPass = "manager";
//Credential Constants
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

//Application Constants
var entraceBeaconId = "55606";
var logInterval = 600;   // in seconds. Time to check log and refresh control tables
var userInterval = 906000;  // Interval (in sec) to identify New users, User whos left, last position etc..


function getB1User(){
    return b1User;
}

function getB1Password(){
    return b1Pass;
}

function getB1Company(){
    return b1Comp;
}

function getHost(){
    return host;
}

function getHanaUser(){
    return hanaUser;
}

function getHanaPass(){
    return hanaPass;
}


function getEntranceBeacon(){
    return entraceBeaconId;
}

function getUserInterval(){
    return userInterval;
}
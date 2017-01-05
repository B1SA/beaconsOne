/*
    This library provide generic functions and hardcoded constants
*/

//Credential Constants
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

//Application Constants
var entraceBeaconId = "55606";
var logInterval = 300;   // in seconds. Time to check log and refresh control tables
// Interval (in sec) to identify New users, User whos left, last position etc..
var userInterval = 300; // One Week 


//Debug Constants
var doCommit = true; //commit data to user tables




function getB1User(){
    return b1User;
}

function getB1Password(){
    return b1Pass;
}

function getB1Company(){
    return b1Comp;
}

function getEntranceBeacon(){
    return entraceBeaconId;
}

function getUserInterval(){
    return userInterval;
}

function shouldCommit(){
    return doCommit;
}
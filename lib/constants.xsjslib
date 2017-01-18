/*
    This library provide hardcoded constants
*/

//Credential Constants
var b1User = "manager";
var b1Pass = "1234";
var b1Comp = "SBODEMOUS";

//Application Constants
var entraceBeaconId = "55606";
var userInterval = 300; // One Week 

//Debug Constants
var doCommit = true; //commit data to user tables
var jobsActive = true; //Services are running 




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

// Commit DB changes
function shouldCommit(){
    return doCommit;
}

// Prepare service outputs according to XSJOB prerequisites
function jobsActivaded(){
    return jobsActive;
}
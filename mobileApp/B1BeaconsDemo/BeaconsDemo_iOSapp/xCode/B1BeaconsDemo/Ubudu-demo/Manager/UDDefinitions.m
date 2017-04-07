//
//  UDDefinitions.m
//  B1Beacons-demo
//
//  Created by i029162 on 16/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UDDefinitions.h"

@implementation UDDefinitions

// Flag that shows more information and notifications for debug mode
// on -> Notifications and extra messages sent
// off -> Less notifications and messages (as should be on end user)
NSString *const testFlag = @"off";

NSString *const userKey = @"user";
NSString *const kUDDefaultClientName = @"Enter User Name";

// HCP PROD account
// Root url for HCP account
#define HCP_ACCOUNT_URL @"hcpaccount"
// Root url for iotmms service
#define HCP_IOT_ROOT_URL @"https://iotmms"
// HCP HANA System
#define HCP_XS_ROOT_URL @"https://hanasystem"
#define HCP_URL @".hana.ondemand.com"

// IoT mesage parameters
// URL to send messages to IoT
NSString *const iotURL = HCP_IOT_ROOT_URL HCP_ACCOUNT_URL HCP_URL @"/com.sap.iotservices.mms/v1/api/http/data/45db7368-05ab-4eed-b9e9-5927f5f2febc";
// Authentication required to send messages to HCP IoT platform
NSString *const iotAuth = @"Bearer XXXYYYYXXX";
// IoT Msg type defined in HCP IoT platform
NSString *const iotMsgType = @"XXXYYYYXXX";

// Create SO
//https://xs01ada8016be.hana.ondemand.com/b1sa/beaconsOne/services/createOrder.xsjs
NSString *const createSO_URL = HCP_XS_ROOT_URL HCP_ACCOUNT_URL HCP_URL @"/b1sa/beaconsOne/services/createOrder.xsjs";
// HCP HANA XS Authentication required to call xsjs services
NSString *const xsjsAuth = @"Basic XXXYYYZZZ";

// Register device to HCP
NSString *const registerDeviceURL = HCP_XS_ROOT_URL HCP_ACCOUNT_URL HCP_URL @"/b1sa/beaconsOne/services/mobile/registerDevice.xsjs";

@end

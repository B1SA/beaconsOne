//
//  UDDefinitions.h
//  B1Beacons-demo
//
//  Copyright (c) 2016 SAP. All rights reserved.
//

#import "OrdersModel.h"

@interface UDDefinitions : NSObject

#pragma mark - Shared data

extern NSString *const testFlag;

// User management
extern NSString *const userKey;
extern NSString *const kUDDefaultClientName;
extern NSString *gUbuduUser;

// HCP URL
extern NSString *const hcpURL;

// HCP Authentication
extern NSString *const xsjsAuth;

// IoT mesage parameters
extern NSString *const iotURL;
extern NSString *const iotAuth;
extern NSString *const iotMsgType;
extern NSString *device_id;

// Create SO
extern OrdersModel *currentOrder;
extern NSString *const createSO_URL;
extern NSString *const createSO_URL_public;

// Register Device Token
extern NSString *const registerDeviceURL;

// Save latest offer
extern NSArray *lastOffer;

// Keep main navigator
extern UINavigationController *mainNavigationController;

@end

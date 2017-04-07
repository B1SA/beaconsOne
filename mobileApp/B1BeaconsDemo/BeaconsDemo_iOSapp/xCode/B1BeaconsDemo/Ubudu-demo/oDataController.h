//
//  oDataController.h
//  B1Beacons-demo
//
//  Created by i029162 on 15/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import "OrdersModel.h"
#import "OrderViewController.h"

@interface oDataController : NSObject

// Register for Push Notifications
- (void)registerForPushNotifications: (NSString *)user_id device_token:(NSString *)deviceToken;

// Call HCP IoT oData service to send beacon's details
- (void)sendBeaconsInfo: (NSString *)beacon_id userId:(NSString *)user_id timeStamp:(NSString *)time;

// Call HCP service to add a B1 SalesOrder
- (void)createB1SO: (OrdersModel *)salesOrder orderVC:(OrderViewController *)orderViewCtrl;

@end

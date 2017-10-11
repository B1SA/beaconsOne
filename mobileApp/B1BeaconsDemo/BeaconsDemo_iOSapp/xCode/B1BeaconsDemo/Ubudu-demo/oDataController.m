//
//  oDataController.m
//  B1Beacons-demo
//
//  Created by i029162 on 15/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UbuduSDK/UbuduSDK.h>

#import "oDataController.h"
#import "UDDefinitions.h"


@interface oDataController ()

@end

@implementation oDataController

// Register mobile device for PushNotifications
- (void)registerForPushNotifications: (NSString *)user_id device_token:(NSString *)deviceToken
{
    NSURL *url = [NSURL URLWithString:registerDeviceURL];
    
    // Create the request
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    // Specify POST
    request.HTTPMethod = @"POST";
    
    // Set header fields
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-type"];
    [request setValue:xsjsAuth forHTTPHeaderField:@"Authorization"];
    
    // Set the body
    NSString *msg = [NSString stringWithFormat:@"{\"UserId\":\"%@\",\"DeviceToken\":\"%@\"}", user_id, deviceToken];
    
    NSData *requestBodyData = [msg dataUsingEncoding: NSUTF8StringEncoding];
    request.HTTPBody = requestBodyData;
    
    // Create url connection and fire request
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *connectError) {
                                                
                                                if (data.length > 0 && connectError == nil)
                                                {
                                                    NSError *errorMsg = nil;
                                                    NSDictionary *response = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&errorMsg];
                                                    NSLog(@"registerDevice response %@", [response objectForKey:@"retHCPMobile"]);
                                                }
                                            }];
    [task resume];
}

// Send Beacons information to IoT HCP
- (void)sendBeaconsInfo: (NSString *)beacon_id userId:(NSString *)user_id timeStamp:(NSString *)timestamp
{
    @try {
        
        NSLog(@"SEND BEACONS INFO");
        
        NSURL *url = [NSURL URLWithString:iotURL];
        
        // Create the request
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
        
        // Specify POST
        request.HTTPMethod = @"POST";
        
        // Set header fields
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-type"];
        [request setValue:iotAuth forHTTPHeaderField:@"Authorization"];
        
        // Set the body
        NSString *msg = [NSString stringWithFormat:@"{\"mode\":\"sync\",\"messageType\":\"%@\",\"messages\":[{\"dev_id\":\"%@\",\"beacon_id\":\"%@\",\"user_id\":\"%@\",\"timestamp\":%@}]}", iotMsgType, device_id, beacon_id, gUbuduUser, timestamp];
        
        msg = [NSString stringWithFormat:@"%@]}", msg];
        
        NSData *requestBodyData = [msg dataUsingEncoding: NSUTF8StringEncoding];
        request.HTTPBody = requestBodyData;
        
        // Create url connection and fire request
        NSURLSession *session = [NSURLSession sharedSession];
        
        NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                                completionHandler:^(NSData *data, NSURLResponse *response, NSError *connectError) {
                                                    @try {
                                                        if (data.length > 0 && connectError == nil)
                                                        {
                                                            NSError *errorMsg = nil;
                                                            NSDictionary *response = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&errorMsg];
                                                            NSLog(@"%@", [response objectForKey:@"msg"]);
                                                            [self sendNotifTest:[response objectForKey:@"msg"]];
                                                        }
                                                        else {
                                                            NSString *msg = @"data empty or connectError";
                                                            [self sendNotifTest:msg];
                                                        }
                                                        
                                                    } @catch (NSException *exception) {
                                                        NSLog(@"%@",exception.reason);
                                                        [self sendNotifTest:exception.reason];

                                                    }
                                                }];
        [task resume];
    } @catch (NSException *exception) {
        NSLog(@"CATCH: %@",exception.reason);
        //[self sendNotifTest:exception.reason];
    } @finally {
        NSLog(@"FINALLY: after sending msg to IoT");
    }
}

// Only used to send notifications for testing
- (void)sendNotifTest: (NSString *)msg {
    if ([testFlag isEqualToString:@"on"])
    {
        UNMutableNotificationContent* notifContent = [[UNMutableNotificationContent alloc] init];
        notifContent.title = @"IoT";
        notifContent.body = msg;

        // Create the request object.
        UNNotificationRequest* request = [UNNotificationRequest
                                          requestWithIdentifier:@"TestIoT" content:notifContent trigger:nil];
        
        UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
        [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
            if (error != nil) {
                NSLog(@"%@", error.localizedDescription);
            }
        }];
    }
}

// Call createOrder XSJS service (running on HCP and creating B1 SO via Service Layer)
- (void)createB1SO: (OrdersModel *)salesOrder orderVC:(OrderViewController *)orderViewCtrl;
{
    NSURL *url = [NSURL URLWithString:createSO_URL];
    
    NSLog(@"%@", createSO_URL);

    // Create the request
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    // Specify POST
    request.HTTPMethod = @"POST";
    
    // Set header fields for Authentication
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-type"];
    [request setValue:xsjsAuth forHTTPHeaderField:@"Authorization"];
    
    // Set the body
    
    //UserCode (to be mapped by HCP with B1 user!)
    NSString *user = gUbuduUser;
    
    // Formatter configuration
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    NSLocale *posix = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US_POSIX"];
    [formatter setLocale:posix];
    [formatter setDateFormat:@"yyyy-MM-dd"];
    // Date to string
    NSDate *now = [NSDate date];
    NSString *prettyDate = [formatter stringFromDate:now];
    
    NSString *msg = [NSString stringWithFormat:@"{\"UserId\":\"%@\",\"DocDueDate\":\"%@\",\"DocumentLines\":[", user, prettyDate];
    // Add each order line
    NSInteger lineNb = 0;
    for (OrderLinesModel *line in salesOrder.lines) {
        msg = [NSString stringWithFormat:@"%@{\"ItemCode\":\"%@\",\"Quantity\":%ld}", msg, line.itemCode, (long)line.quantity];
        if (lineNb < salesOrder.lines.count - 1)
            msg = [NSString stringWithFormat:@"%@,", msg];
        lineNb++;
    }
    
    msg = [NSString stringWithFormat:@"%@]}", msg];
    
    NSData *requestBodyData = [msg dataUsingEncoding: NSUTF8StringEncoding];
    request.HTTPBody = requestBodyData;
    
    // Create url connection and fire request
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *connectError) {
                                                
                                                if (data.length > 0 && connectError == nil)
                                                {
                                                    NSError *errorMsg = nil;
                                                    
                                                    NSDictionary *response = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&errorMsg];
                                                    NSLog(@"%@", [response objectForKey:@"StatusCode"]);
                                                    
                                                    NSString *statusCode = [response objectForKey:@"StatusCode"];
                                                    NSString *title = @"";
                                                    NSString *msg = @"";
                                                    
                                                    if ([statusCode  isEqual: @"201"]) {
                                                        title = @"SAP Business One Order confirmation";
                                                        NSString *docNum = [response objectForKey:@"DocNum"];
                                                        msg = [NSString stringWithFormat:@"Your order with DocNum %@ has been successfuly created in SAP Business One!", docNum];
                                                    }
                                                    else {
                                                        title = @"SAP Business One Order confirmation";
                                                        msg = [NSString stringWithFormat:@"An error occurred while trying to access SAP Business One, please check your system is up and running."];
                                                    }
                                                    
                                                    //Send the alert
                                                    [orderViewCtrl confirmB1OrderCreation:title confirmMessage:msg];
                                                }
                                            }];
    [task resume];
}

@end

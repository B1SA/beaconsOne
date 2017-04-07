//
//  UDAppDelegate.h
//  Ubudu-demo
//
//  Created by Jean-Baptiste Quesney on 3/5/14.
//  Copyright (c) 2014 Ubudu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

@interface UDAppDelegate : UIResponder <UIApplicationDelegate, UNUserNotificationCenterDelegate>

@property (strong, nonatomic) UIWindow *window;

@end

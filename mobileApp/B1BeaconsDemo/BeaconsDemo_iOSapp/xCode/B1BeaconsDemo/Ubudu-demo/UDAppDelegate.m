//
//  UDAppDelegate.m
//  Ubudu-demo
//
//  Created by Jean-Baptiste Quesney on 3/5/14.
//  Modified by B1SA on 01/02/2017
//  Copyright (c) 2014 Ubudu. All rights reserved.
//

#import <UbuduSDK/UbuduSDK.h>

#import "UDAppDelegate.h"
#import "UDDefinitions.h"
#import "UDAislePromotionViewController.h"
#import "OrdersModel.h"
#import "oDataController.h"

#define SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)

@interface UDAppDelegate () <UbuduSDKDelegate>

@end

NSString *gUbuduUser = @"Initial";
NSString *device_id = @"Initial";


OrdersModel *currentOrder;


@implementation UDAppDelegate

#pragma mark - AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    //Get user from NSUserDefaults
    gUbuduUser = [[NSUserDefaults standardUserDefaults] stringForKey:userKey];
    if ([gUbuduUser length] == 0)
        gUbuduUser = kUDDefaultClientName;
    
    // Register for notifications
    [self registerForRemoteNotification];
    
    // Get device_id
    device_id = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    
    //Initialize currentOrder
    currentOrder = [[OrdersModel alloc] init];
    if (!currentOrder)
        NSLog(@"ERROR on currentOrder Initialization");
    
    NSError *error = nil;
    [UbuduSDK sharedInstance].appNamespace = @"ae2e06528d33454a9ad0ba692b1e0ec7ec41d54e";
    [UbuduSDK sharedInstance].delegate = self;
    
    [[UbuduSDK sharedInstance] setUser:[[UbuduUser alloc] initWithID:gUbuduUser] success:nil failure:nil];
    BOOL started = [[UbuduSDK sharedInstance] start:&error];
    if (!started) {
        NSLog(@"UbuduSDK start error: %@", error);
    }
    NSLog(@"%@", [UbuduSDK sharedInstance].SDKVersion);
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    NSLog(@"applicationDidEnterBackground");
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    
    // Reset app icon badge when the app becomes foreground
    application.applicationIconBadgeNumber = 0;
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    NSLog(@"applicationWillTerminate");
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
    NSLog(@"didReceiveLocalNotification %@, %@", notification.userInfo.allKeys, notification.userInfo.allValues);
    
    
    // From Ubudu sample
    // If the notification contains a custom payload that we want to handle
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification EVT " message:notification.alertBody delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
    
    // Send back to the SDK the notification (that may have been received in background)
    // So it can trigger the right action (passbook or web view for example)
    [[UbuduSDK sharedInstance] executeLocalNotificationActions:notification];

    // Clear the received notification
    [application cancelLocalNotification:notification];
    application.applicationIconBadgeNumber--;
}

#pragma mark - UbuduSDKDelegate

// Uncommented and implement any of the methods below if you want to programatically control the execution of the actions.
// Please check on the manager platform if the feature you want to implement to control the triggering of the rules is not already built-in, as it would be less work for you.

//- (BOOL)ubudu:(UbuduSDK *)ubuduSDK shouldExecuteServerNotificationRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger {}

// Called even if the iPhone app is in background
- (BOOL)ubudu:(UbuduSDK *)ubuduSDK shouldExecuteLocalNotificationRequest:(UILocalNotification *)localNotification triggeredBy:(UbuduTriggerSource)trigger
{
    NSLog(@"shouldExecuteLocalNotificationRequest %@", localNotification.userInfo.allValues);

    // Send data to HCP server side
    NSTimeInterval timeStmp = [[NSDate date] timeIntervalSince1970];
    NSInteger time = round(timeStmp);
    NSUInteger indexOfBeaconId = [localNotification.userInfo.allKeys indexOfObject:@"beacon_id"];
    NSString *beacon_id = localNotification.userInfo.allValues[indexOfBeaconId];;
    oDataController *odatactrl = [[oDataController alloc] init];
    [odatactrl sendBeaconsInfo:beacon_id userId:gUbuduUser timeStamp:[NSString stringWithFormat:@"%ld",(long)time]];
    
    return true;
}

// Called even if the iPhone app is in background
- (BOOL)ubudu:(UbuduSDK *)ubuduSDK shouldExecuteOpenWebPageRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger
{ 
    NSLog(@"shouldExecuteOpenWebPageRequest %@", url.absoluteString);
    return true;
}

//- (BOOL)ubudu:(UbuduSDK *)ubuduSDK shouldExecuteOpenPassbookRequest:(NSURL *)passUrl triggeredBy:(UbuduTriggerSource)trigger {}
//- (BOOL)ubudu:(UbuduSDK *)ubuduSDK shouldExecuteOpenDeepLinkRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger {}


// Uncomment and implement any of the methods below to customize the execution of any type of action.

//- (void)ubudu:(UbuduSDK *)ubuduSDK executeServerNotificationRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger
//      success:(void (^)())successHandler failure:(void (^)(NSError* error))failureHandler {}

//- (void)ubudu:(UbuduSDK *)ubuduSDK executeLocalNotificationRequest:(UILocalNotification *)localNotification triggeredBy:(UbuduTriggerSource)triggeredBy
//{
//    // That is what the SDK does by default
//    [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
//}

//- (void)ubudu:(UbuduSDK *)ubuduSDK executeOpenWebPageRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger
//{
//    NSLog(@"executeOpenWebPageRequest %@", url.absoluteString);
//}

//- (void)ubudu:(UbuduSDK *)ubuduSDK executeOpenPassbookRequest:(NSURL *)passbookUrl triggeredBy:(UbuduTriggerSource)trigger {}

//- (void)ubudu:(UbuduSDK *)ubuduSDK executeOpenDeepLinkRequest:(NSURL *)url triggeredBy:(UbuduTriggerSource)trigger {}

- (void)ubudu:(UbuduSDK *)ubuduSDK didReceiveErrorNotification:(NSError *)error;
{
    NSLog(@"UBUDU SDK ERROR: %@", error);
}

// Beacons related callbacks

// Only when entering a new beacon region (big distance covered by a region!)
- (void)ubudu:(UbuduSDK *)ubuduSDK didEnterBeaconRegion:(NSString *)regionUUID userInfo:(NSDictionary *)userInfo
{
    NSLog(@"Ubudu didEnterBeaconRegion userInfo = %@ regionUUID = %@", userInfo, regionUUID);
}

- (void)ubudu:(UbuduSDK *)ubuduSDK didExitBeaconRegion:(NSString *)regionUUID userInfo:(NSDictionary *)userInfo
{
    NSLog(@"Ubudu didExitBeaconRegion userInfo = %@", userInfo);
}


- (void)ubudu:(UbuduSDK *)ubuduSDK didFindNewBeacon:(NSString *)beaconName userInfo:(NSDictionary *)userInfo
{
    NSLog(@"Ubudu didFindNewBeacon userInfo = %@", userInfo);
}

// Called every time the phone receives a signal from a Beacon (not linked to WebApp limits)
// Gives proximity information but accuracy is not good enough...
//- (void)ubudu:(UbuduSDK *)ubuduSDK didReceivePingFromBeacon:(NSString *)beaconName userInfo:(NSDictionary *)userInfo
//{
//    NSLog(@"Ubudu didReceivePingFromBeacon userInfo = %@", userInfo);
//}

- (void)ubudu:(UbuduSDK *)ubuduSDK didUpdateBeacon:(NSString *)beaconName userInfo:(NSDictionary *)userInfo
{
    //NSLog(@"Ubudu didUpdateBeacon userInfo = %@", userInfo);
}

- (void)ubudu:(UbuduSDK *)ubuduSDK didLoseBeaconSignal:(NSString *)beaconName userInfo:(NSDictionary *)userInfo
{
    NSLog(@"Ubudu didLoseBeaconSignal userInfo = %@", userInfo);
}

#pragma mark - Alerts

// To Delete if not used
- (void)displayOrderAwaitingAlert:(NSString *)message
{
    UIAlertView *alert = [[UIAlertView alloc] init];
    [alert setTitle:@"Your order"];
    [alert setMessage:message];
    [alert setDelegate:self];
    [alert addButtonWithTitle:@"No, I'll do it later"];
    [alert addButtonWithTitle:@"Yes"];
    [alert show];
}

#pragma mark - UNUserNotificationCenter Delegate // >= iOS 10

// Called when a notification is delivered to a foreground app.
// Also called for internal notifications from Beacons
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
    
    NSLog(@"willPresentNotification");
    
    NSLog(@"willPresentNotification = %@ %@",notification.request.content.categoryIdentifier, notification.request.content.userInfo);
    
    // WelcomeOffer or RecOffer
    if ([notification.request.content.categoryIdentifier isEqualToString:@"WelcomeOffer"] ||
        [notification.request.content.categoryIdentifier isEqualToString:@"RecOffer"]) {

        @try {
            // extract data information containing the promotion from the notification
            NSError *error;
            NSString *dictString=[notification.request.content.userInfo objectForKey:@"data"];
            NSData *jsonData = [dictString dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData
                                                                 options:NSJSONReadingMutableContainers
                                                                   error:&error];
            // Send offers to UDAislePromotionViewController
            UDAislePromotionViewController *offersVC = (UDAislePromotionViewController *)[self.window.rootViewController.storyboard instantiateViewControllerWithIdentifier:@"OffersViewID"];
            [offersVC SetOffers:json];
        } @catch (NSException *exception) {
            NSLog(@"%@",exception.reason);
        } @finally {
            
        }
    }
 
    // Internal for testing only
    else if ([notification.request.content.categoryIdentifier isEqualToString:@"WelcOffer"] ||
        [notification.request.content.categoryIdentifier isEqualToString:@"RecoOffer"]) {
        
        @try {
            // extract data information containing the promotion from the notification
            // for demo purpuse only, should be only done if user selects the notification
            NSError *error;
            NSDictionary *dict=[notification.request.content.userInfo objectForKey:@"data"];
            
            // Send offers to UDAislePromotionViewController
            UDAislePromotionViewController *offersVC = (UDAislePromotionViewController *)[self.window.rootViewController.storyboard instantiateViewControllerWithIdentifier:@"OffersViewID"];
            [offersVC SetOffers:dict];
        }
        @catch (NSException *exception) {
            NSLog(@"%@",exception.reason);
        }
        @finally {
            
        }
    }

    // Testing only
    else if ([notification.request.content.title isEqualToString:@"IoT"]) {
        NSLog(@"RECEIVED IOT NOTIFICATION");
    }
    // Beacons notification - categoryIdentifier empty, type="tracking"
    else {
        NSLog(@"RECEIVED OTHER NOTIFICATION");
        @try {
            
            
            // Obtain information from the Ubudu payload message
            NSDictionary *payload = [notification.request.content.userInfo objectForKey:@"payload"];
            if (payload)
            {
                NSLog(@"WITH PAYLOAD");
                NSString *type = [payload objectForKey:@"type"];
                
                if ([type isEqualToString:@"tracking"]) {
                    NSLog(@"TYPE TRACKING");
                    NSString *beacon_id = [payload objectForKey:@"id"];
                    //NSString *shopName = [payload objectForKey:@"shop"];
                    
                    // Send data to HCP server side
                    NSTimeInterval timeStmp = [[NSDate date] timeIntervalSince1970];
                    NSInteger time = round(timeStmp);
                    //NSUInteger indexOfBeaconId = [notification.request.content.userInfo.allKeys indexOfObject:@"beacon_id"];
                    //NSString *beacon_id = notification.request.content.userInfo.allValues[indexOfBeaconId];
                    
                    NSLog(@"BEFORE DATA CONTROLLER");
                    
                    // Send beacons info to HCP IOT platform
                    oDataController *odatactrl = [[oDataController alloc] init];
                    [odatactrl sendBeaconsInfo:beacon_id userId:gUbuduUser timeStamp:[NSString stringWithFormat:@"%ld",(long)time]];
                    
                    NSLog(@"AFTER DATA CONTROLLER");
                    
                    if ([testFlag isEqualToString:@"off"])
                        return;
                }
            }
            else {
                NSLog(@"Warning: No payload = %@", notification.request.content.userInfo);
            }
        }
        @catch (NSException *ex) {
            NSLog(@"DELEGATE CATCH %@", ex.reason);
        }
        @finally {
            NSLog(@"DELEGATE FINALLY");
        }
        
    }
    
    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
}

// willPresentNotification not called when app in background!!
// Use getDeliveredNotificationsWithCompletionHandler to get notifications in iPhone
-(void)getDeliveredNotificationsWithCompletionHandler:(void (^)(NSArray<UNNotification *> *notifications))completionHandler {
    NSLog(@"getDeliveredNotificationsWithCompletionHandler");
}

//Called to let your app know which action was selected by the user for a given notification.
// Only called when the user does an action after receiving the notification, if no action done by the user this method is not called
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler{
    
    NSLog(@"didReceiveNotificationResponse = %@ %@ %@",response.notification.request.content.categoryIdentifier, response.actionIdentifier, response.notification.request.content.userInfo);

    // Only managed for WelcomeOffer and RecommendationOffer
    if ([response.notification.request.content.categoryIdentifier isEqualToString:@"WelcomeOffer"] ||
        [response.notification.request.content.categoryIdentifier isEqualToString:@"RecOffer"] ||
        [response.notification.request.content.categoryIdentifier isEqualToString:@"WelcOffer"] ||
        [response.notification.request.content.categoryIdentifier isEqualToString:@"RecoOffer"]) {

        // The user tapped on the notification
        // Open Offers View to show the offers
        if ([response.actionIdentifier isEqualToString:UNNotificationDefaultActionIdentifier]) {

            // for demo purposes only, data should be only extracted here from notification if the user selects the notification
            // extract data information containing the promotion from the notification
            // already done when receiving the notification to allways keep details even if the user didn't select the notification
            /*NSError *error;
            NSString *dictString=[response.notification.request.content.userInfo objectForKey:@"data"];
            NSData *jsonData = [dictString dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                      error:&error];*/
            // Send offers to UDAislePromotionViewController
            UDAislePromotionViewController *offersVC = (UDAislePromotionViewController *)[self.window.rootViewController.storyboard instantiateViewControllerWithIdentifier:@"OffersViewID"];
            //[offersVC SetOffers:json];
            
            // Show UDAislePromotionViewController
            // Use mainNavigationController extern variable
            [mainNavigationController pushViewController:offersVC animated:YES ];
        }
        
        // Completion Handler
        completionHandler();
    }
}

- (void)defineCustomActions
{
    // WELCOME OFFER
    // Create the custom actions for Welcome Offer notifications.
    UNNotificationAction* showOffersAction = [UNNotificationAction
                                              actionWithIdentifier:@"ShowOffers"
                                              title:@"Check offers"
                                              options:UNNotificationActionOptionForeground];
    //AuthenticationRequired, Destructive, Foreground, None
    
    UNNotificationAction* ignoreOffersAction = [UNNotificationAction
                                                actionWithIdentifier:@"IgnoreOffers"
                                                title:@"Ignore"
                                                options:UNNotificationActionOptionNone];
    
    // Create the categories with the custom actions.
    UNNotificationCategory* welcomeOfferCategory = [UNNotificationCategory
                                                    categoryWithIdentifier:@"WelcomeOffer"
                                                    actions:@[showOffersAction, ignoreOffersAction]
                                                    intentIdentifiers:@[]
                                                    options:UNNotificationCategoryOptionNone];
    // Create the categories with the custom actions.
    UNNotificationCategory* recommendationOfferCategory = [UNNotificationCategory
                                                    categoryWithIdentifier:@"RecOffer"
                                                    actions:@[showOffersAction, ignoreOffersAction]
                                                    intentIdentifiers:@[]
                                                    options:UNNotificationCategoryOptionNone];
    
    // LOCALIZATION OFFER
    
    // Register the notification categories.
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    [center setNotificationCategories:[NSSet setWithObjects:welcomeOfferCategory, recommendationOfferCategory, nil]];
}

/**
 Notification Registration
 */
- (void)registerForRemoteNotification {
    if(SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(@"10.0")) {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        center.delegate = self;
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
            if( !error ){
                [[UIApplication sharedApplication] registerForRemoteNotifications];
            }
        }];
        
        // Create Custom Actions
        [self defineCustomActions];
    }
    else {
        NSLog(@"Only supporting iOS > 10.0");
    }
}

// To be used in order to get the device_token of a mobile device to be used to send Push Notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    
    NSString * tokenAsString = [[[deviceToken description]
                                 stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]]
                                stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSLog(@"%@", tokenAsString);
    
    // Register device to HCP
    oDataController *odatactrl = [[oDataController alloc] init];
    [odatactrl registerForPushNotifications:gUbuduUser device_token:tokenAsString];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    
    NSLog(@"app didFailToRegisterForRemoteNotificationsWithError: %@", error.description);
}

@end

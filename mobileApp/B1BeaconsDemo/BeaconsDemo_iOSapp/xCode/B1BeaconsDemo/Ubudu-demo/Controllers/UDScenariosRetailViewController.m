//
//  UDScenariosRetailViewController.m
//  Ubudu-demo
//
//  Created by Ubudu on 3/5/14.
//  Updated by B1SA on 2016.
//  Copyright (c) 2014 Ubudu. All rights reserved.
//

#import <UbuduSDK/UbuduSDK.h>
#import <UserNotifications/UserNotifications.h>

#import "UIViewController+MMDrawerController.h"

#import "UDScenariosRetailViewController.h"
#import "UDClickAndCollectViewController.h"
#import "UDDefinitions.h"
#import "oDataController.h"
#import "UDAislePromotionViewController.h"
#import "UDAisleDemoPromotionViewController.h"

@interface UDScenariosRetailViewController () <UITableViewDelegate>

@end

UINavigationController *mainNavigationController;

@implementation UDScenariosRetailViewController

#pragma mark - View Lifecycle

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

// Save mainNavigationController
- (void)viewWillAppear:(BOOL)anim
{
    [super viewWillAppear:anim];
    
    mainNavigationController = self.navigationController;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - Status Bar

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

#pragma mark - Navigation

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Disable menu opening while in a scenario
    [self.mm_drawerController setOpenDrawerGestureModeMask:MMOpenDrawerGestureModeNone];
}

- (IBAction)unwindToScenarios:(UIStoryboardSegue *)segue
{
    // Re-enable the menu opening
    [self.mm_drawerController setOpenDrawerGestureModeMask:MMOpenDrawerGestureModeAll];
}

#pragma mark - UI Touch Events

- (IBAction)resetButtonTouched:(id)sender {
    [self promptUserName];
}

- (IBAction)leftDrawerButtonTouched:(id)sender
{
    [self.mm_drawerController toggleDrawerSide:MMDrawerSideLeft animated:YES completion:nil];
}

//TODO: Remove for publishing, only for testing
// Send a Local Notification
// Recommendation based on location
- (IBAction)touchUpInsideButtonEventRecom:(id)sender
{
    UNMutableNotificationContent* notifContent = [[UNMutableNotificationContent alloc] init];
    notifContent.title = @"Check our special offers";
    notifContent.body = @"Would you like some recommendations based on your current location?";
    notifContent.categoryIdentifier = @"RecoOffer";
    NSString * offersJSON = @"{\"data\": [{\"ItemCode\": \"C00003\",\"ItemName\": \"Vegan Chocolate\",\"CardCode\": \"C30000\",\"Price\": 42,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/fz5pCij.png\",\"Probability\": 2.6},{\"ItemCode\": \"A00003\",\"ItemName\": \"Dark Chocolate\",\"CardCode\": \"C30000\",\"Price\": 30,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/A2ZoWbu.jpg\",\"Probability\": 2.5}, {\"ItemCode\": \"A00001\",\"ItemName\": \"White Chocolate\",\"CardCode\": \"C30000\",\"Price\": 40,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/gkMT1ID.jpg\",\"Probability\": 2.3}, {\"ItemCode\": \"A00002\",\"ItemName\": \"Milk Chocolate\",\"CardCode\": \"C99998\",\"Price\": 25,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/jUPRyiH.jpg\",\"Probability\": 2}, {\"ItemCode\": \"A00006\",\"ItemName\": \"Chocolate a la taza\",\"CardCode\": \"C30000\",\"Price\": 22,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/XtS1qVF.png\",\"Probability\": 1.3}]}";

    NSData* offersJSONdata = [offersJSON dataUsingEncoding:NSUTF8StringEncoding];
    
    NSError * error=nil;
    notifContent.userInfo = [NSJSONSerialization JSONObjectWithData:offersJSONdata options:kNilOptions error:&error];

    // Create the request object.
    UNNotificationRequest* request = [UNNotificationRequest
                                      requestWithIdentifier:@"WelcomeOffer" content:notifContent trigger:nil];
    
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"%@", error.localizedDescription);
        }
    }];
}

//TODO: Remove for publishing, only for testing
// Send a Local Notification
// Welcome Offer
- (IBAction)touchUpInsideButtonEvent:(id)sender
{
    UNMutableNotificationContent* notifContent = [[UNMutableNotificationContent alloc] init];
    notifContent.title = @"Welcome to our shop";
    notifContent.body = @"Check today's personalized offers.";
    notifContent.categoryIdentifier = @"WelcOffer";
    NSString * offersJSON = @"{\"data\": [{\"ItemCode\": \"P10004\",\"ItemName\": \"Lambrusco\",\"CardCode\": \"C30000\",\"Price\": 37.5,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/EakPObM.jpg\",\"Probability\": 2.5},{\"ItemCode\": \"C00004\",\"ItemName\": \"Provolone\",\"CardCode\": \"C30000\",\"Price\": 35,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/K1jBshd.jpg\",\"Probability\": 2},{\"ItemCode\": \"A00001\",\"ItemName\": \"White Chocolate\",\"CardCode\": \"C30000\",\"Price\": 40,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/gkMT1ID.jpg\",\"Probability\": 1.3},{\"ItemCode\": \"I00002\",\"ItemName\": \"American Cheese\",\"CardCode\": \"C30000\",\"Price\": 12,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/Y3xiAVh.png\",\"Probability\": 2},{\"ItemCode\": \"C00007\",\"ItemName\": \"Gorgonzola\",\"CardCode\": \"C30000\",\"Price\": 16,\"Currency\": \"$\",\"PictureURL\": \"http://i.imgur.com/kAv0vs0.png\",\"Probability\": 1.3}]}";
    
    NSData* offersJSONdata = [offersJSON dataUsingEncoding:NSUTF8StringEncoding];
    
    NSError * error=nil;
    notifContent.userInfo = [NSJSONSerialization JSONObjectWithData:offersJSONdata options:kNilOptions error:&error];
    
    // Create the request object.
    UNNotificationRequest* request = [UNNotificationRequest
                                      requestWithIdentifier:@"WelcomeOffer" content:notifContent trigger:nil];
    
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"%@", error.localizedDescription);
        }
    }];
}

#pragma mark - User Name Alert

- (void)promptUserName
{
    UIAlertController *alert = [UIAlertController
                                 alertControllerWithTitle:@"User Name"
                                 message:@"Enter your name"
                                 preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *ok = [UIAlertAction
                         actionWithTitle:@"OK"
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction *actionOK)
                         {
                             // Get user name from alert
                             gUbuduUser = alert.textFields.firstObject.text;
                             
                             // Store user name into Ububdu framework
                             // version 1.22.0 [[UbuduSDK sharedInstance] setUser:[[UbuduUser alloc] initWithID:gUbuduUser withProperties:nil]];
                             // version 1.23.1
                             // TODO Check latest version API
                             // Exception: Thread 1:EXC_BAD_ACCESS(code=1,address=0x10)
                             [[UbuduSDK sharedInstance] setUser:[[UbuduUser alloc] initWithID:gUbuduUser withProperties:nil] success:nil failure:nil];
                             
                             // Save user in NSUserDefaults (to be kept after stopping app)
                             [[NSUserDefaults standardUserDefaults] setObject:gUbuduUser forKey:userKey];
                             [[NSUserDefaults standardUserDefaults] synchronize];
                             
                             // Change button label with entered user name
                             // TODO
                             //[self.navigationItem.rightBarButtonItem setTitle:gUbuduUser];
                             
                             [alert dismissViewControllerAnimated:YES completion:nil];

                         }];
    
    UIAlertAction *cancel = [UIAlertAction
                         actionWithTitle:@"Cancel"
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction *actionCancel)
                         {
                             [alert dismissViewControllerAnimated:YES completion:nil];
                         }];
    
    // Add ok and cancel actions to the alert
    [alert addAction:ok];
    [alert addAction:cancel];
    
    // Add TextField into the alert to get user name
    [alert addTextFieldWithConfigurationHandler:^(UITextField *textField){
        textField.placeholder = gUbuduUser;
    }];
    
    // Show the alert
    [self presentViewController:alert animated:YES completion:nil];
}

#pragma mark - Handle click on Aisle Promotion

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"Selected row %ld at section %ld", (long)indexPath.row, (long)indexPath.section);
    
    // Open offers page if available offers, if not show process image
    if (indexPath.row == 2)
    {
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
        
        // Check if available offers
        if (lastOffer.count > 0)
        {
            // Show last offers
            UDAislePromotionViewController *offersVC = (UDAislePromotionViewController *)[storyboard instantiateViewControllerWithIdentifier:@"OffersViewID"];
            
            // Show UDAislePromotionViewController
            [self.navigationController pushViewController:offersVC animated:YES ];
        }
        else {
            // Show process image
            UDAisleDemoPromotionViewController *offersVC = (UDAisleDemoPromotionViewController *)[storyboard instantiateViewControllerWithIdentifier:@"OfferDemoProcess"];
            
            // Show UDAisleDemoPromotionViewController
            [self.navigationController pushViewController:offersVC animated:YES ];
        }
    }
}

@end

//
//  UDVIPWelcomeViewController.m
//  Ubudu-demo
//
//  Created by Jean-Baptiste Quesney on 3/5/14.
//  Updated by B1SA on 01/02/2017
//  Copyright (c) 2014 Ubudu. All rights reserved.
//

#import <UbuduSDK/UbuduSDK.h>

#import "UDVIPWelcomeViewController.h"
#import "UDDefinitions.h"

@interface UDVIPWelcomeViewController ()

@property (weak, nonatomic) IBOutlet UIButton *changeButton;
@property (weak, nonatomic) IBOutlet UILabel *clientNameLabel;

@end

@implementation UDVIPWelcomeViewController

#pragma mark - View Lifecycle

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.navigationItem.hidesBackButton = YES;
    self.clientNameLabel.text = gUbuduUser;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - User Name Alert

- (void)promptUserName
{
    UIAlertView * alert = [[UIAlertView alloc] initWithTitle:@"Change Name" message:@"What's you name?" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
    alert.alertViewStyle = UIAlertViewStylePlainTextInput;
    [alert show];
}


// Save User name
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    gUbuduUser = [[alertView textFieldAtIndex:0] text];
    self.clientNameLabel.text = gUbuduUser;

    //version 1.22.0 [[UbuduSDK sharedInstance] setUser:[[UbuduUser alloc] initWithID:gUbuduUser withProperties:nil]];
    //version 1.23.1
    [[UbuduSDK sharedInstance] setUser:[[UbuduUser alloc] initWithID:gUbuduUser withProperties:nil] success:nil failure:nil];
    
    // Save user in NSUserDefaults
    [[NSUserDefaults standardUserDefaults] setObject:gUbuduUser forKey:userKey];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

#pragma mark - UI Touch Events

- (IBAction)changeButtonTouched:(id)sender {
    [self promptUserName];
}

@end

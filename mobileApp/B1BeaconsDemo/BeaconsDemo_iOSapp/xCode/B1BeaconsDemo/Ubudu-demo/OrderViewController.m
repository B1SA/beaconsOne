//
//  OrderViewController.m
//  B1Beacons-demo
//
//  Created by i029162 on 13/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "UDDefinitions.h"
#import "OrderViewController.h"
#import "OrderTableViewCell.h"
#import "OrderTableViewCheckoutCell.h"
#import "oDataController.h"

@interface OrderViewController ()<UITableViewDataSource, UITableViewDelegate>

@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (weak, nonatomic) IBOutlet UINavigationItem *navigationItem;

//NSMutableArray
@property (nonatomic, strong)NSString *docCurrency;

@property (strong, nonatomic) IBOutlet UILabel *TotalLabel;

@end

@implementation OrderViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    [_navigationItem setTitle:@"Sales Order"];
    _TotalLabel.text = @(currentOrder.totalAmount).stringValue;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
}

- (void)adjustHeightOfTableview
{
    CGFloat height = _tableView.contentSize.height;
}

#pragma mark - <UITableViewDataSource>

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
        return [currentOrder.lines count] + 1;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
    UITableViewCell *cell;
    
    if (indexPath.row < [currentOrder.lines count])
    {
        static NSString *CellIdentifier = @"Cell";
        cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        OrderTableViewCell *cell2 = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        
        OrderLinesModel *currentLine = [currentOrder.lines objectAtIndex:indexPath.row];
        
        cell2.itemCodeLabel.text = currentLine.itemCode;
        cell2.itemNameLabel.text = currentLine.itemName;
        cell2.itemImage.image = currentLine.image;
        cell2.priceLabel.text = [@(currentLine.price) stringValue];
        cell2.currencyLabel.text = currentLine.currency;
        cell2.quantity.text = [@(currentLine.quantity) stringValue];
    }
    else {
        static NSString *CellIdentifier = @"CheckoutCell";
        cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        OrderTableViewCheckoutCell *cell2 = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        cell2.totalAmountLabel.text = @(currentOrder.totalAmount).stringValue;
    }
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
        return 60;
}

#pragma mark - <UITableViewDelegate>

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self.tableView reloadData];
    if (indexPath.row == [currentOrder.lines count])
    {
        UIAlertController *alert = [UIAlertController
                                alertControllerWithTitle:@"Order Submission"
                                message:@"Please confirm!"
                                preferredStyle:UIAlertControllerStyleAlert];
    
        UIAlertAction *ok = [UIAlertAction
                             actionWithTitle:@"Confirm"
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction *actionOK)
                             {
                                 // Create Order in B1
                                 oDataController *odatactrl = [[oDataController alloc] init];
                                 [odatactrl createB1SO:currentOrder orderVC:self];

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
    
        // Show the alert
        [self presentViewController:alert animated:YES completion:nil];
    }
}


#pragma mark - Submit button

- (IBAction)pushSubmitButton:(id)sender {

    UIAlertController *alert = [UIAlertController
                                alertControllerWithTitle:@"B1 Innovation Summit"
                                message:@"Your order has been submited!"
                                preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *cancel = [UIAlertAction
                             actionWithTitle:@"Close"
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction *actionCancel)
                             {
                                 [alert dismissViewControllerAnimated:YES completion:nil];
                             }];
    
    // Add ok and cancel actions to the alert
    [alert addAction:cancel];
    
    // Show the alert
    [self presentViewController:alert animated:YES completion:nil];
}

- (IBAction)pushBack:(id)sender {
}

#pragma mark - Order Confirmation
- (void)confirmB1OrderCreation:(NSString *)confirmTitle confirmMessage:(NSString *)msg
{
    UIAlertController *alert = [UIAlertController
                                alertControllerWithTitle:confirmTitle
                                message:msg
                                preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *ok = [UIAlertAction
                         actionWithTitle:@"Ok"
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction *actionOK)
                         {
                             [alert dismissViewControllerAnimated:YES completion:nil];
                         }];
    
    // Add ok actions to the alert
    [alert addAction:ok];
    
    // Show the alert
    [self presentViewController:alert animated:YES completion:nil];

}

@end

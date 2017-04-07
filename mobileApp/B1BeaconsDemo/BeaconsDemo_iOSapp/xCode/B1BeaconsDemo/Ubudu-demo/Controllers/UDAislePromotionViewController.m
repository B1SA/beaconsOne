//
//  UDAislePromotionViewController.m
//  Ubudu-demo
//
//  Created by Jean-Baptiste Quesney on 3/6/14.
//  Modified by B1SA on 01/02/2017
//  Copyright (c) 2014 Ubudu. All rights reserved.
//

#import <UbuduSDK/UbuduSDK.h>

#import "UDAislePromotionViewController.h"
#import "UDDefinitions.h"
#import "OrderViewController.h"
#import "OffersModel.h"
#import "AddToCartTableViewBtn.h"
#import "OfferDetailsViewController.h"

@interface UDAislePromotionViewController () <UITableViewDelegate, UITableViewDataSource>

@property (weak, nonatomic) IBOutlet UITableView *tableView;

@end

NSArray *lastOffer;

@implementation UDAislePromotionViewController

#pragma mark - View Lifecycle

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

static NSString *reuseId = @"hero";


- (void)SetOffers:(NSDictionary *)offersDictionary
{
    NSMutableArray *nmArray = [NSMutableArray array];
    for (NSDictionary *dic in offersDictionary) {
        [nmArray addObject:[OffersModel offersWithDic:dic]];
    }
    
    lastOffer = nmArray;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


#pragma mark - <UITableViewDataSource>

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return lastOffer.count;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
    //return 2;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
    UITableViewCell *cell;
    NSInteger index = 0;
    
    static NSString *CellIdentifier = @"OfferCell";
    cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    index = indexPath.row;
    
    OffersModel *model = lastOffer[index];
    
    // Set offer price
    AddToCartTableViewBtn * itemPriceBtn = (AddToCartTableViewBtn *)[cell.contentView viewWithTag:102];
    NSString *price = [NSString stringWithFormat:@"%@%@", @(model.Price).stringValue, model.Currency];
    [itemPriceBtn setTitle:price forState:UIControlStateNormal];
    itemPriceBtn.indexPath = indexPath;
    
    // Set offer label
    UILabel * offerLabel = [cell.contentView viewWithTag:104];
    offerLabel.text = model.ItemName;
    
    // Set offer image
    UIImageView * itemImage = (UIImageView *)[cell.contentView viewWithTag:103];
    
    /////////////////////////////////////////////////////////////////////////////////////
    itemImage.image = [model getItemImage];
    
    return cell;
}

///////////////////////////////////////////////////////////////////////////////////////

- (void)downloadImageWithURL:(NSURL *)url completionBlock:(void (^)(BOOL succeeded, UIImage *image))completionBlock
{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [NSURLConnection sendAsynchronousRequest:request
                                       queue:[NSOperationQueue mainQueue]
                           completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {
                               if ( !error )
                               {
                                   UIImage *image = [[UIImage alloc] initWithData:data];
                                   completionBlock(YES,image);
                               } else{
                                   completionBlock(NO,nil);
                               }
                           }];
}
///////////////////////////////////////////////////////////////////////////////////////


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(nonnull NSIndexPath *)indexPath
{
    return 200;
}

#pragma mark - <UITableViewDelegate>

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // TODO: Open detail page of product or package
    NSLog(@"Selected row %ld at section %ld", (long)indexPath.row, (long)indexPath.section);
}

-(void)prepareForSegue:(UIStoryboardSegue*)segue sender:(UITableView *)sender
{
    OfferDetailsViewController *destViewController = (OfferDetailsViewController *)segue.destinationViewController;
    
    if ([segue.identifier isEqualToString:@"OfferDetails"]) {
        NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        destViewController.offer = [lastOffer objectAtIndex:indexPath.row];
    }
}

- (IBAction)orderPushButton:(id)sender {
    [self openOrderView];
}

- (IBAction)addToCartPushButton:(id)sender {
    
    AddToCartTableViewBtn * itemPriceBtn = (AddToCartTableViewBtn *)sender;
    
    NSLog(@"IndexPath row %ld section %ld", (long)itemPriceBtn.indexPath.row, (long)itemPriceBtn.indexPath.section);
    
    // Get Data from current selected product
    OffersModel *model = lastOffer[itemPriceBtn.indexPath.row];
    
    // Send alert for confirmation to the user
    NSString *title = [NSString stringWithFormat:@"Add item to basket"];
    NSString *msg = [NSString stringWithFormat:@"Please confirm item %@", model.ItemCode];
    UIAlertController *alert = [UIAlertController
                                alertControllerWithTitle:title
                                message: msg
                                preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *ok = [UIAlertAction
                         actionWithTitle:@"Ok"
                         style:UIAlertActionStyleDefault
                         handler:^(UIAlertAction *actionOK)
                         {
                             //Add new line to the Order
                             [currentOrder addLine:model];
                             
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

- (void)openOrderView
{
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
    OrderViewController *detailvc = [storyboard instantiateViewControllerWithIdentifier:@"OrderViewController"];
    [detailvc setModalPresentationStyle:UIModalPresentationFullScreen];
    [self.navigationController pushViewController:detailvc animated:YES];
}

@end

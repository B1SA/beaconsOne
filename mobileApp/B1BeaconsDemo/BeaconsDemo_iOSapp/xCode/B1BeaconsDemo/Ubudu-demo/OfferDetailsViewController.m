//
//  OfferDetailsViewController.m
//  B1BeaconsDemo
//
//  Created by i029162 on 25/01/2017.
//  Copyright © 2017 Ubudu. All rights reserved.
//

#import "OfferDetailsViewController.h"

@interface OfferDetailsViewController ()
@property (weak, nonatomic) IBOutlet UILabel *offerItemCode;
@property (weak, nonatomic) IBOutlet UILabel *offerItemName;
@property (weak, nonatomic) IBOutlet UIImageView *offerImage;
@property (weak, nonatomic) IBOutlet UILabel *offerPrice;

@end

@implementation OfferDetailsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.offerItemCode.text = _offer.ItemCode;
    self.offerItemName.text = _offer.ItemName;
    self.offerImage.image = [_offer getItemImage];
    self.offerPrice.text = [NSString stringWithFormat:@"%@%@", _offer.Currency, @(_offer.Price).stringValue];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end

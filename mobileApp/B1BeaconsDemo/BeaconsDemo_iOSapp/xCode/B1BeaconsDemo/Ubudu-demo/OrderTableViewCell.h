//
//  OrderTableViewCell.h
//  B1Beacons-demo
//
//  Created by i029162 on 13/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface OrderTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *itemCodeLabel;

@property (weak, nonatomic) IBOutlet UILabel *itemNameLabel;

@property (nonatomic, weak) IBOutlet UILabel *priceLabel;
@property (nonatomic, weak) IBOutlet UILabel *currencyLabel;
@property (nonatomic, weak) IBOutlet UIImageView *itemImage;
@property (weak, nonatomic) IBOutlet UILabel *quantity;

@end

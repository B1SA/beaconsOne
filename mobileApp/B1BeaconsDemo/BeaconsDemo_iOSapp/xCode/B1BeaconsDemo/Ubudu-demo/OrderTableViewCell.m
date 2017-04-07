//
//  OrderTableViewCell.m
//  B1Beacons-demo
//
//  Created by i029162 on 13/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import "OrderTableViewCell.h"

@implementation OrderTableViewCell

@synthesize itemCodeLabel = _itemCodeLabel;
@synthesize itemNameLabel = _itemNameLabel;
@synthesize itemImage = _itemImage;
@synthesize priceLabel = _priceLabel;
@synthesize currencyLabel = _currencyLabel;


- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end

//
//  OfferCell.m
//  B1Beacons-demo
//
//  Created by i029162 on 07/12/2016.
//  Copyright © 2016 Ubudu. All rights reserved.
//

#import "OfferCell.h"
#import "OffersModel.h"
@interface OfferCell ()

@property (nonatomic, weak)UIImageView *iconImage;
@property (nonatomic, weak)UILabel *nameLabel;
@property (nonatomic, weak)UILabel *priceLabel;
@property (nonatomic, weak)UILabel *offerPriceLabel;


@end


@implementation OfferCell

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        UIImageView *iconImage = [[UIImageView alloc] init];
        [self.contentView addSubview:iconImage];
        self.iconImage = iconImage;
        
        UILabel *nameLabel = [[UILabel alloc] init];
        [self.contentView addSubview:nameLabel];
        self.nameLabel = nameLabel;
        
        UILabel *offerpriceLabel = [[UILabel alloc] init];
        [self.contentView addSubview:offerpriceLabel];
        self.offerPriceLabel = offerpriceLabel;
        
        UIButton *shopButton = [[UIButton alloc] init];
        [self.contentView addSubview:shopButton];
        [shopButton setImage:[UIImage imageNamed:@"b1_addtocart"] forState:UIControlStateNormal];
        [shopButton setBackgroundColor:[UIColor colorWithRed:0.082 green:0.502 blue:0.471 alpha:1.0]];
        self.shopButton = shopButton;
        
        // Offers background color
        self.backgroundColor = [UIColor whiteColor];
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    //////////////////////////////////////////////
    CGFloat iconW = 100;
    CGFloat iconH = 80;
    CGFloat iconX = 25;
    CGFloat iconY = 5;
    self.iconImage.frame = CGRectMake(iconX, iconY, iconW, iconH);
    
    self.nameLabel.frame = CGRectMake(10, 90, 150, 15);
    [self.nameLabel setFont:[UIFont fontWithName:@"HelveticaNeue" size:15]];
    [self.nameLabel setTextAlignment:NSTextAlignmentCenter];
    
    self.offerPriceLabel.frame = CGRectMake(0, 110, 150, 15);
    [self.offerPriceLabel setFont:[UIFont fontWithName:@"HelveticaNeue" size:15]];
    [self.offerPriceLabel setTextColor:[UIColor blueColor]]; //modColor
    [self.offerPriceLabel setTextAlignment:NSTextAlignmentCenter];
    
    self.shopButton.frame = CGRectMake(50, 130, 24, 24);
    
}

- (void)setOffer:(OffersModel *)offer
{
    _offer = offer;
    self.iconImage.image = [UIImage imageNamed:offer.PictureURL];
    self.nameLabel.text = offer.ItemName;
    self.offerPriceLabel.text = [NSString stringWithFormat:@"%@%@", offer.Currency, @(offer.Price).stringValue];
    self.shopButton.titleLabel.text = @"S";
}


@end

//
//  OfferCell.h
//  B1Beacons-demo
//
//  Created by i029162 on 07/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <UIKit/UIKit.h>

@class OffersModel;
@interface OfferCell : UICollectionViewCell

@property (nonatomic, strong)OffersModel *offer;

@property (nonatomic, strong)UIButton *shopButton;

@end

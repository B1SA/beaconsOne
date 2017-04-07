//
//  OfferTableViewCell.h
//  B1Beacons-demo
//
//  Created by i029162 on 28/12/2016.
//  Copyright © 2016 Ubudu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "OffersModel.h"

@interface OfferTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *priceLabel;

@property (nonatomic, strong)OffersModel *offer;

@end

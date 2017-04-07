//
//  OrderLinesModel.h
//  B1Beacons-demo
//
//  Created by i029162 on 14/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OrderLinesModel : NSObject

@property (nonatomic)NSString *icon;

@property (nonatomic, copy)UIImage *image;

@property (nonatomic)NSString *itemCode;

@property (nonatomic)NSString *itemName;

@property (nonatomic)float price;

@property (nonatomic)NSString *currency;

@property (nonatomic)NSInteger quantity;

@end

//
//  OffersModel.h
//  Beacons-demo
//
//  Created by i029162 on 07/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OffersModel : NSObject

@property (nonatomic, copy)NSString *PictureURL;

@property (nonatomic, copy)NSString *ItemCode;

@property (nonatomic, copy)NSString *ItemName;

@property (nonatomic)float Price;

@property (nonatomic)NSString *Currency;

@property (nonatomic, copy)UIImage *itemImage;

// Properties not used
@property (nonatomic, copy)NSString *CardCode;
@property (nonatomic, copy)NSString *Probability;


- (UIImage *)getItemImage;

- (instancetype)initWithDic: (NSDictionary *)dic;
+ (instancetype)offersWithDic: (NSDictionary *)dic;

@end

//
//  HerosModel.h
//  CollectionViewTest
//
//  Created by smile on 2/19/16.
//  Copyright © 2016 smile. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface OffersModel : NSObject

@property (nonatomic, copy)NSString *icon;

@property (nonatomic, copy)NSString *intro;

@property (nonatomic, copy)NSString *name;

- (instancetype)initWithDic: (NSDictionary *)dic;
+ (instancetype)offersWithDic: (NSDictionary *)dic;

@end

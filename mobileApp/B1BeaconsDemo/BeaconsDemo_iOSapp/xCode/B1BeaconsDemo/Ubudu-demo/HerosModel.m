//
//  HerosModel.m
//  CollectionViewTest
//
//  Created by smile on 2/19/16.
//  Copyright © 2016 smile. All rights reserved.
//

#import "OffersModel.h"

@implementation OffersModel


- (instancetype)initWithDic:(NSDictionary *)dic
{
    if (self == [super init])
    {
        [self setValuesForKeysWithDictionary:dic];
    }
    return self;
}

+ (instancetype)offersWithDic:(NSDictionary *)dic
{
    return [[self alloc] initWithDic:dic];
}

@end

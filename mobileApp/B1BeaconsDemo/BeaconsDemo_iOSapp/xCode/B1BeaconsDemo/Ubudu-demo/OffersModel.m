//
//  OffersModel.m
//  Beacons-demo
//
//  Created by i029162 on 07/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import "OffersModel.h"

@implementation OffersModel

- (UIImage *)getItemImage
{
    NSError* error = nil;
    
    //TODO: Register domain in Info.plist file
    NSURL *imgURL = [NSURL URLWithString:_PictureURL];
    NSData* imageData = [NSData dataWithContentsOfURL:imgURL options:NSDataReadingUncached error:&error];
    if (error) {
        NSLog(@"%@", [error localizedDescription]);
    }
    
    _itemImage = [[UIImage alloc] initWithData:imageData];
    
    return _itemImage;
}

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

//
//  OrdersModel.h
//  B1Beacons-demo
//
//  Created by i029162 on 14/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OrderLinesModel.h"
#import "OffersModel.h"

@interface OrdersModel : NSObject

@property (nonatomic)NSMutableArray *lines;

@property (nonatomic)float totalAmount;

- (id) init;

- (void) addLine: (OffersModel *)offer;

- (OrderLinesModel *)isLine:(OrderLinesModel *)newLine;
    
@end

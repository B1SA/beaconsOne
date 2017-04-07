//
//  OrdersModel.m
//  B1Beacons-demo
//
//  Created by i029162 on 14/12/2016.
//  Copyright © 2016 SAP. All rights reserved.
//

#import "OrdersModel.h"
#import "OrderLinesModel.h"


@implementation OrdersModel

- (id) init {
    
    if (self = [super init]) {
        _lines = [[NSMutableArray alloc] init];
        _totalAmount = 0;
    }
    
    return self;
}

- (void) addLine: (OffersModel *)offer {
    OrderLinesModel *line = [[OrderLinesModel alloc] init];
    line.itemCode = offer.ItemCode;
    line.itemName = offer.ItemName;
    line.icon = offer.PictureURL;
    line.image = offer.itemImage;
    line.price = offer.Price;
    line.quantity = 1;
    
    OrderLinesModel * existingLine = [self isLine:line];
    if (existingLine == nil)
    {
        [self.lines addObject:line];
    }
    else
    {
        existingLine.price += (existingLine.price / existingLine.quantity);
        existingLine.quantity += 1;
    }
    
    self.totalAmount = self.totalAmount + offer.Price;
}

- (OrderLinesModel *)isLine:(OrderLinesModel *)newLine {
    for (OrderLinesModel *line in self.lines){
        if ([newLine.itemCode isEqualToString:line.itemCode])
            return line;
    }
    
    return nil;
}

@end

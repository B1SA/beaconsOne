sap.ui.define([
       'sap/viz/ui5/format/ChartFormatter',
       'sap/viz/ui5/api/env/Format'
   ], function(ChartFormatter,Format) {
    return {
        FIORI_LABEL_SHORTFORMAT_10 : "__UI5__ShortIntegerMaxFraction10",
        FIORI_LABEL_FORMAT_2 : "__UI5__FloatMaxFraction2",
        FIORI_LABEL_SHORTFORMAT_2 : "__UI5__ShortIntegerMaxFraction2",
        FIORI_PERCENTAGE_FORMAT_2 : "__UI5__PercentageMaxFraction2",
        MFS1 : "month_s1",
        MFS2 : "month_s2",
        MFS3 : "month_s3",
        MFS4 : "month_s4",
        MDFS1 : "month_day_s1",
        MDFS2 : "month_day_s5",
        MDFS3 : "month_day_s6",
        YFS0 : "year_s0",
        YFS1 : "year_s1",
        YFS2 : "year_s2",
        chartFormatter : null,
        registerCustomFormat: function() {
            var chartFormatter = this.chartFormatter = ChartFormatter.getInstance();
            chartFormatter.registerCustomFormatter(this.FIORI_LABEL_SHORTFORMAT_10, 
                function(value) {
                    var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({
                        style: "short",
                        maxFractionDigits: 10
                    });
                    return fixedInteger.format(value);
            });
            chartFormatter.registerCustomFormatter(this.FIORI_LABEL_FORMAT_2, 
                function(value) {
                    var fixedFloat = sap.ui.core.format.NumberFormat.getFloatInstance({
                        style: 'Standard',
                        maxFractionDigits: 2
                    });
                    return fixedFloat.format(value);
            });
            chartFormatter.registerCustomFormatter(this.FIORI_LABEL_SHORTFORMAT_2, 
                function(value) {
                    var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({
                        style: "short",
                        maxFractionDigits: 2
                    });
                    return fixedInteger.format(value);
            });
            chartFormatter.registerCustomFormatter(this.FIORI_PERCENTAGE_FORMAT_2, 
                function(value) {
                var percentage = sap.ui.core.format.NumberFormat.getPercentInstance({
                    style: 'precent',
                    maxFractionDigits: 2
                });
                return percentage.format(value);
            });
            function registerTime(key, formatString){
                chartFormatter.registerCustomFormatter(key, function(value) {
                    var dateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: formatString});
                    return dateFormatter.format(value);
                });
            }
            var patterns = {"month_s1" : "M", "month_s2" : "MM", "month_s3" : "MMM", "month_s4" : "MMMM",
                    "month_day_s1" : 'MM/dd', "month_day_s5" : 'MMM d', "month_day_s6" : 'MMMM d',
                    "year_s0" : 'yy', "year_s1" : 'yyy', "year_s2" : 'yyyy', "YearMonthDay" : "MM/dd/yy"};
            for ( var key in patterns) {
                if (patterns.hasOwnProperty(key)) {
                    registerTime(key,patterns[key]);
                }
            }
            Format.numericFormatter(chartFormatter);
        }
    };
});
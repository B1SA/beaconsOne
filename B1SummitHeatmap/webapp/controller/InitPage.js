sap.ui.define([
   ], function() {
    return {
        initPageSettings : function(oView) {
            // Hide Settings Panel for phone
            if (sap.ui.Device.system.phone) {
                var oSettingsPanel = oView.byId('settingsPanel');
                if(oSettingsPanel){
                    oSettingsPanel.setExpanded(false);
                }
            }

            // try to load sap.suite.ui.commons for using ChartContainer
            // sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
            var bSuiteAvailable = jQuery.sap.sjax({
                type : "HEAD",
                url : sap.ui.resource("sap.suite.ui.commons", "library.js")
            }).success;
            if (bSuiteAvailable) {
                sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
                var vizframe = oView.byId("idVizFrame");
                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://horizontal-bar-chart",
                    title : "vizFrame Bar Chart Sample",
                    content : [ vizframe ]
                });
                var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                    content : [ oChartContainerContent ]
                });
                oChartContainer.setShowFullScreen(true);
                oChartContainer.setAutoAdjustHeight(true);
                oView.byId('chartFixFlex').setFlexContent(oChartContainer);
            }
        }
    };
});
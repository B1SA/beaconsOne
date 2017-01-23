/***
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("SAPUI5_TEST.controller.Main", {

	});

});
**/
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'./CustomerFormat',
	'./InitPage',
	'./Timer'
], function(jQuery, Controller, JSONModel, FeedItem, CustomerFormat, InitPageUtil, TimerUtil) {
	"use strict";

	var Controller = Controller.extend("B1SummitHeatmap.controller.Main", {

		//dataPath : "/sap/ui5/1/test-resources/sap/viz/demokit/dataset",
		dataPath: "./model/",

		settingsModel: {
			dataset: {
				name: "Dataset",
				defaultSelected: 1,
				values: [{
					name: "By Shelf",
					value: "Customers_by_Shelf_Product.json"
				}, {
					name: "By Product",
					value: "Customers_by_Shelf_Product.json"
				}]
			},
			dataLabel: {
				name: "No. of Cust by Sect.",
				defaultState: true
			},
			axisTitle: {
				name: "Axis Title",
				defaultState: true
			},
			interval: {
				name: "Refresh Interval",
				defaultValue: 10,
				defaultState: true
			},
			color: {
				name: "Color",
				defaultSelected: 1,
				values: [{
					name: "3 Sections",
					value: [{
						"feed": "color",
						"type": "color",
						"numOfSegments": 3,
						"palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1",
							"sapUiChartPaletteSequentialHue1Dark2"
						]
					}]
				}, {
					name: "5 Sections",
					value: [{
						"feed": "color",
						"type": "color",
						"numOfSegments": 5,
						"palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1Light1",
							"sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark1",
							"sapUiChartPaletteSequentialHue1Dark2"
						]
					}]
				}, {
					name: "9 Sections",
					value: [{
						"feed": "color",
						"type": "color",
						"numOfSegments": 9,
						"palette": ["sapUiChartPaletteSemanticGoodLight3", "sapUiChartPaletteSemanticGoodLight1",
							"sapUiChartPaletteSemanticGoodDark1", "sapUiChartPaletteSemanticCriticalLight3",
							"sapUiChartPaletteSemanticCriticalLight2", "sapUiChartPaletteSemanticCritical",
							"sapUiChartPaletteSemanticBadLight3", "sapUiChartPaletteSemanticBadLight2",
							"sapUiChartPaletteSemanticBadLight1"
						]
					}]
				}]
			}
		},

		oTotalCustNoTile: null,
		oVizFrame: null,
		datasetRadioGroup: null,
		colorRadioGroup: null,
		timer: null,
		firstInterval: null,

		onInit: function(evt) {
			this.initCustomFormat();
			// set explored app's demo model on this sample
			var oModel = new JSONModel(this.settingsModel);
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			this.getView().setModel(oModel);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");

			oVizFrame.setVizProperties({
				plotArea: {
					background: {
						border: {
							top: {
								visible: false
							},
							bottom: {
								visible: false
							},
							left: {
								visible: false
							},
							right: {
								visible: false
							}
						}
					},
					dataLabel: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
						visible: true
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				},
				categoryAxis2: {
					title: {
						visible: true
					}
				},
				legend: {
					visible: true,
					formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10,
					title: {
						visible: false
					}
				},
				title: {
					visible: false,
					text: 'Customers in Store'
				},
				interaction: {
					behaviorType: null,
					selectability: {
						mode: 'SINGLE'
					}
				}
			});
			var oTotalCustNoTile = this.getView().byId("__tile00");
			var totalCustNoModel = new JSONModel(this.dataPath + "Total_Customer_No.json");
			oTotalCustNoTile.setModel(totalCustNoModel);

			var dataModel = new JSONModel(this.dataPath + "Customers_by_Shelf_Product.json");
			//oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			oVizFrame.setModel(dataModel);

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

			InitPageUtil.initPageSettings(this.getView());

			//refrehsing the data in 10 seconds
			var firstInterval = window.setInterval(function() {
			//JSONModel.refresh(true) doesn't work. Have to recreate the jsonmodel and bind again.
			//oVizFrame.getModel().refresh(true);
			//dataModel.refresh(true);
			console.log("first interval running");
			var oTotalCustNoTile = this.getView().byId("__tile00");
			var totalCustNoModel = new JSONModel(this.dataPath + "Total_Customer_No.json");
			oTotalCustNoTile.setModel(totalCustNoModel);
			
			var dataModel = new JSONModel(this.dataPath + "Customers_by_Shelf_Product.json");
			var oVizFrame = this.getView().byId("idVizFrame");
			//oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			oVizFrame.setModel(dataModel);
			//oVizFrame.getModel().getData();
			}.bind(this), 10000);
			console.log("first intval:"+firstInterval);
			// this.setupTimer(this.bindModels(oTotalCustNoTile, oVizFrame), 10000);
			// this.timer = new TimerUtil.Timer(this.getView() , function() {
			// 	var oTotalCustNoTile = this.getView().byId("__tile00");
			// 	var totalCustNoModel = new JSONModel(this.dataPath + "Total_Customer_No.json");
			// 	oTotalCustNoTile.setModel(totalCustNoModel);

			// 	var dataModel = new JSONModel(this.dataPath + "Customers_by_Shelf_Product.json");
			// 	var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			// 	oVizFrame.setModel(dataModel);
			// }, 10000);
		},
		bindModels: function(oTotalCustNoTile, oVizFrame) {
			//var oTotalCustNoTile = oView.byId("__tile00");
			var totalCustNoModel = new JSONModel("./model/Total_Customer_No.json");
			oTotalCustNoTile.setModel(totalCustNoModel);

			var dataModel = new JSONModel("./model/Customers_by_Shelf_Product.json");
			//var oVizFrame = oView.byId("idVizFrame");
			oVizFrame.setModel(dataModel);
		},
		setupTimer: function(fn, intervalS) {
			if (this.timer === null) {
				this.timer = new TimerUtil.Timer(this.bindModels, intervalS);
			} else {
				this.timer.reset(intervalS);
			}
		},
		onAfterRendering: function() {
			this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
			this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

			this.colorRadioGroup = this.getView().byId('colorRadioGroup');
			this.colorRadioGroup.setSelectedIndex(this.settingsModel.color.defaultSelected);
		},
		onDatasetSelected: function(oEvent) {
			var datasetRadio = oEvent.getSource();
			if (this.oVizFrame && datasetRadio.getSelected()) {
				var bindValue = datasetRadio.getBindingContext().getObject();
				var dataModel = new JSONModel(this.dataPath + bindValue.value);
				this.oVizFrame.setModel(dataModel);
			}
		},
		onDataLabelChanged: function(oEvent) {
			if (this.oVizFrame) {
				this.oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: oEvent.getParameter('state')
						}
					}
				});
			}
		},
		onAxisTitleChanged: function(oEvent) {
			if (this.oVizFrame) {
				var state = oEvent.getParameter('state');
				this.oVizFrame.setVizProperties({
					valueAxis: {
						title: {
							visible: state
						}
					},
					categoryAxis: {
						title: {
							visible: state
						}
					},
					categoryAxis2: {
						title: {
							visible: state
						}
					}
				});
			}
		},
		onColorSelected: function(oEvent) {
			var colorRadio = oEvent.getSource();
			if (this.oVizFrame && colorRadio.getSelected()) {
				var bindValue = colorRadio.getBindingContext().getObject();
				this.oVizFrame.setVizScales(bindValue.value);
			}
		},
		onParseError: function(oEvent) {
			var intervalTxt = oEvent.getSource();
			intervalTxt.text = "";
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.error("Error", {
				title: "Invalid internal. Enter an integer number", // default
				onClose: null, // default
				styleClass: "", // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});
		},
		onIntervalChange: function(oEvent) {
			var intervalTxt = oEvent.getSource();
			//var setupInterval = this.setupInterval;
			//var lastInterval = setInterval("", 10000);
			//console.log(this.firstInterval);
			window.clearInterval(14);
			//window.clearInterval(lastInterval);
			
			var newInterval = window.setInterval(function() {
				//JSONModel.refresh(true) doesn't work. Have to recreate the jsonmodel and bind again.
				//oVizFrame.getModel().refresh(true);
				//dataModel.refresh(true);
				//var oTotalCustNoTile = this.getView().byId("__tile00");
				console.log("updated interval running");
				console.log(intervalTxt.getValue() * 1000);
				var oTotalCustNoTile = this.getView().byId("__tile00");
				var totalCustNoModel = new JSONModel(this.dataPath + "Total_Customer_No.json");
				oTotalCustNoTile.setModel(totalCustNoModel);

				var dataModel = new JSONModel(this.dataPath + "Customers_by_Shelf_Product.json");
				//oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
				oVizFrame.setModel(dataModel);
			}.bind(this), intervalTxt.getValue() * 1000);
			console.log("New interval id:" + newInterval);
		},
		onHeatmapSelected: function(oEvent) {
			var heatmap = oEvent.getSource();
			//var selectedData = heatmap.vizSelection();
			var selectedData = oEvent.mParameters.data;
			var dataModel = heatmap.getModel();
			var index = selectedData[0].data._context_row_number;
			var shelfs = dataModel.getProperty("/Store");
			var customers = shelfs[index].Customers;
			//[{"data":{"Section":"Section 2","Shelf":"3-Accessories","NO. of customers nearby":8,"_context_row_number":14}}]
			var msg = "";
			for (var i in customers) {
				var cardCode = customers[i].CardCode;
				var cardName = customers[i].CardName;
				msg += cardCode + " - " + cardName + "\n";
			}

			if (msg === "") {
				msg = "No customers around in this section";
			}

			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.information(msg, {
				title: "Customers around this section", // default
				onClose: null, // default
				styleClass: "", // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});
		},
		initCustomFormat: function() {
			CustomerFormat.registerCustomFormat();
		}
	});

	return Controller;

});
sap.ui.define([
    './BaseController',
    'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
    'admin/model/formatter'
], (BaseController, JSONModel, Device, formatter) => {
    "use strict";

	
    const constants = {
        currentRoute: "RouteHome"
    }

    return BaseController.extend("sap.ui.demo.toolpageapp.controller.Home", {
		formatter: formatter,

		onInit: function () {
			var oViewModel = new JSONModel({
				isPhone : Device.system.phone
			});
			this.setModel(oViewModel, "view");
			Device.media.attachHandler(function (oDevice) {
				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
			}.bind(this));

			this.getOwnerComponent().getRouter().getRoute(constants.currentRoute).attachPatternMatched(this._onRouteMatched, this);	
		},

		_onRouteMatched: function (oEvent) {
            this.getModel('ui').setProperty('/selectedKey', constants.currentRoute);
        },
	});
});
sap.ui.define([
    "sap/ui/core/UIComponent",
    "admin/model/models",
    "sap/ui/core/routing/History",
], (UIComponent, models, History) => {
    "use strict";

    return UIComponent.extend("admin.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },

        myNavBack: function () {
			var oHistory = History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteHome", {}, true);
			}
		},

    

    });
});
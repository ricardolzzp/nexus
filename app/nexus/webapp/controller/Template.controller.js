sap.ui.define([
    "./BaseController",
    'sap/ui/Device',
    "sap/ui/model/json/JSONModel"
], (BaseController, Device, JSONModel) => {
    "use strict";

    return BaseController.extend("nexus.controller.Template", {
        onInit() {
            var oModel = new JSONModel({ selectedKey: ""  });
            this.getView().setModel(oModel, "ui");

            // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            if (Device.resize.width <= 1024) {
                this.onSideNavButtonPress();
            }

            Device.media.attachHandler(this._handleWindowResize, this);
        },

        onSegmentedButtonSelectionChange: function(event) {
			var router = this.getRouter()
			var currentHash = router.getHashChanger().getHash();

			if ( router.getRouteInfoByHash(currentHash).name == event.getParameter("item").getKey() ) {
				return;	
			}

			this.navTo(event.getParameter("item").getKey());
		},

        onSideNavButtonPress: function() {
            var oToolPage = this.byId("toolPage");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        _handleWindowResize: function (oDevice) {
            if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
                this.onSideNavButtonPress();
                this._bExpanded = (oDevice.name === "Desktop");
            }
        },

    });
});
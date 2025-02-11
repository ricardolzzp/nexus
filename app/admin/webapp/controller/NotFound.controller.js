sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment",], function (BaseController, JSONModel, Fragment) {
    "use strict";

        
    return BaseController.extend("admin.controller.NotFound", { 
        onInit() {
		    this.getOwnerComponent().getRouter().getRoute('RouteNotFound').attachPatternMatched(this._onRouteMatched, this);	
        },

        _onRouteMatched: function (oEvent) {

        },
    })
    
})
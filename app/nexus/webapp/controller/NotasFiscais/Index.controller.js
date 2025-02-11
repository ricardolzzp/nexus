sap.ui.define(["../BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment",], function (BaseController, JSONModel, Fragment) {
    "use strict";

    const constants = {
        currentRoute: "RouteNotasFiscais",
        detailRoute: "RouteNotasFiscaisDetail"
    }
        
    return BaseController.extend("admin.controller.NotasFiscais.Index", { 
        onInit() {
            this.getOwnerComponent().getRouter().getRoute(constants.currentRoute).attachPatternMatched(this._onRouteMatched, this);	
        },

        _onItemPress: function (oEvent) {
        },

        _onRouteMatched: function (oEvent) {
            this.getModel('ui').setProperty('/selectedKey', constants.currentRoute);
        },
       
    })
    
})
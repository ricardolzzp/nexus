sap.ui.define(["../BaseController", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment",], function (BaseController, JSONModel, Fragment) {
    "use strict";

    const constants = {
        currentRoute: "RouteProdutos",
        createRoute: "RouteProdutosCreate",
        detailRoute: "RouteProdutosDetail"
    }
        
    return BaseController.extend("admin.controller.Produtos.Index", { 
        onInit() {
		    this.getOwnerComponent().getRouter().getRoute(constants.currentRoute).attachPatternMatched(this._onRouteMatched, this);	
        },

        _onItemPress: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext().getPath();           
            var sId = this.getView().getModel().getProperty(sPath);
            this.getOwnerComponent().getRouter().navTo(constants.detailRoute, {id: sId.ID});
        },

        _onRouteMatched: function (oEvent) {
            this.getModel('ui').setProperty('/selectedKey', constants.currentRoute);
        },

        _onCreatePress: function(oEvent) {
            this.getOwnerComponent().getRouter().navTo(constants.createRoute);
        },
    })
    
})
sap.ui.define([
    "../BaseController",
    "sap/ui/model/json/JSONModel",
    "admin/model/FormClientes",
    "admin/helpers/BuildFormHelper",
    "admin/helpers/ModelHelper",
    "sap/ui/core/Messaging",
], function (BaseController, JSONModel, FormProduto, BuildFormHelper, ModelHelper, Messaging) {

    var FormModel;

    const constants = {
        parentRoute: "RouteClientes",
        currentRoute: "RouteClientesCreate",
        previousRoute: "RouteClientes",
        entity: "/Tenants",
        form: "AdminObjectPageLayoutClientes"
    }

    return BaseController.extend("nebula.controller.Clientes.Create", { 
        onInit() {
            this.getOwnerComponent().getRouter().getRoute(constants.currentRoute).attachPatternMatched(this._onRouteMatched, this);	
        },

        _onRouteMatched: function (oEvent) {
            Messaging.removeAllMessages();

            this.getModel('ui').setProperty('/selectedKey', constants.parentRoute);
            this.getView().setModel(Messaging.getMessageModel(), 'message');
        
            FormModel = FormProduto.formCreateModel(this)
            var oForm = this.byId(constants.form);
            BuildFormHelper.build(oForm, FormModel)
        },

        getMessagePopover() {
			return this.loadFragment({
				name: "admin.view.fragment.MessagePopover"
			});
		},

        onPressBackButton: function (oEvent) {
            Messaging.removeAllMessages();
            this.getOwnerComponent().myNavBack();
        },

        async onMessagePopoverPress(oEvent) {
			const oSourceControl = oEvent.getSource();
			const oMessagePopover = await this.getMessagePopover();
			oMessagePopover.openBy(oSourceControl);
		},

        onSavePressed: async function(oEvent) {
            let data = {}
            let oForm = this.byId(constants.form);
            var oModel = this.getView().getModel();

            Messaging.removeAllMessages();
            
            data = BuildFormHelper.data(oForm);
            this.getView().setModel(new JSONModel(data), 'modelData');
            await ModelHelper.create(oModel, constants.entity, data, Messaging);

            if (Messaging.getMessageModel().getData().length == 0) {
                this.getRouter().navTo(constants.parentRoute, {}, true);
            }
   
        },

    })
    
})
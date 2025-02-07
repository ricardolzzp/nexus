sap.ui.define(["../BaseController",
     "sap/ui/model/json/JSONModel",
     "sap/ui/core/Messaging",
      "sap/ui/model/Filter", 
      "sap/ui/model/FilterOperator",
      "admin/helpers/ModelHelper",
      "admin/model/formatter",
      "admin/model/FormUser",
      "admin/helpers/BuildFormHelper",
    ], function (BaseController, JSONModel, Messaging, Filter, FilterOperator, ModelHelper, formatter, FormUser, BuildFormHelper) {
    "use strict";
    
    var FormModel,
        data;

    const constants = {
        parentRoute: "RouteUsers",
        currentRoute: "RouteUsersDetail",
        createRoute: "RouteUsersCreate",
        detailRoute: "RouteUsersDetail",
        form: "AdminObjectPageLayoutUersDetail",
        entity: "/Users"
    }
        
    return BaseController.extend("admin.controller.Users.Detail", { 
        formatter: formatter,

        onInit() {
		    this.getOwnerComponent().getRouter().getRoute(constants.currentRoute).attachPatternMatched(this._onRouteMatched, this);	
        },

        _onRouteMatched: async function (oEvent) {
            var aFilter = []

            Messaging.removeAllMessages();

            this.getModel('ui').setProperty('/selectedKey', constants.parentRoute);
            this.getView().setModel(Messaging.getMessageModel(), 'message');
            
			var sId = oEvent.getParameter("arguments").id;
			aFilter.push( new Filter('ID', FilterOperator.EQ, sId) )
			await ModelHelper.get(this, constants.entity, aFilter)
         
            this.data = this.getView().getModel("modelData").getData()
            const result = Object.entries(this.data).map(([key, value]) => ({ key, value }));
            

            FormModel = FormUser.formCreateModel(this)

            var oForm = this.byId(constants.form);
            BuildFormHelper.build(oForm, FormModel, result)
            BuildFormHelper.toggle(oForm, false)
        },

        onHandleEditPress: function() {
			this._toggleButtonsAndView(true);
		},

        onHandleSavePressed: async function(oEvent) {
			this._toggleButtonsAndView(!true);

            let data = {}
            let oForm = this.byId(constants.form);
            var oModel = this.getView().getModel();

            Messaging.removeAllMessages();
            
            data = BuildFormHelper.data(oForm);
            this.getView().setModel(new JSONModel(data), 'modelData');
            var oData = this.getView().getModel('modelData').getData()
         
            await ModelHelper.update(oModel, `${constants.entity}(${this.data.ID})`, oData, Messaging )

            if (Messaging.getMessageModel().getData().length == 0) {
                // this.getRouter().navTo("RouteUsers", {}, true);
            }
		},

        getMessagePopover() {
			return this.loadFragment({
				name: "admin.view.fragment.MessagePopover"
			});
		},

        async onMessagePopoverPress(oEvent) {
			const oSourceControl = oEvent.getSource();
			const oMessagePopover = await this.getMessagePopover();
			oMessagePopover.openBy(oSourceControl);
		},

        _toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();
            var oForm = this.byId(constants.form);
			oView.byId("AdminEditButtonUserDetail").setVisible(!bEdit);
            oView.byId("AdminSaveButtonUserDetail").setVisible(bEdit);
            oView.byId("AdminDeleteButtonUserDetail").setVisible(bEdit);
            BuildFormHelper.toggle(oForm, bEdit)
		},

        

    })
    
})
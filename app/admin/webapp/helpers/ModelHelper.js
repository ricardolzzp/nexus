sap.ui.define([
    "sap/m/MessageToast",
    'sap/ui/model/json/JSONModel', 
], function (MessageToast, JSONModel) {
    "use strict";

    return {
        get: function (oController, entity, aFilter, name = 'modelData') {
            return new Promise((resolve, reject) => {
                oController.getView().getModel().read(entity, {
                    filters: aFilter,
                    success: function(oData) {
                        oController.getView().setModel( new JSONModel(oData.results[0]), name)
                        resolve(oData);
                    }.bind(this),
                    error: function(err) {
                       
                    }
                })
            });
        },

        getOdata:  function (oController, entity, aFilter, name = 'modelData') {
            return new Promise((resolve, reject) => {
                oController.getView().getModel().read(entity, {
                    filters: aFilter,
                    success: function(oData) {
                        resolve(oData);
                    }.bind(this),
                    error: function(err) {
                       
                    }
                })
            });
        },

        update: function(oModel, entity, oData, Messaging) {
            return new Promise((resolve, reject) => {
                oModel.update(entity, oData, {
                    success: function (data) {
                        resolve(true);
                    },
                    error: function (oError) {
                        // MessageToast.show('Ocorreu um Erro');
                        Messaging.removeAllMessages();

                        const messages = JSON.parse(oError.responseText);
                        const errorDetails = messages.error.innererror.errordetails;
    
                        errorDetails.forEach((error) => {
                            let oMessage;
                            if (error.target == '/#TRANSIENT#') {
                                oMessage = new sap.ui.core.message.Message({
                                    message: `${error.message.value}`,
                                    type: sap.ui.core.MessageType.Error,
                                    target: '',
                                    processor: oModel
                                });
                            } else {
                                oMessage = new sap.ui.core.message.Message({
                                    message: `${error.target}: ${error.message}`,
                                    type: sap.ui.core.MessageType.Error,
                                    target: error.target,
                                    processor: oModel
                                });
                            }
    
                            Messaging.addMessages(oMessage);
                            
                        });
    
                        resolve(false); // Retorna false em caso de erro
                    }
                });
            });
        },

        create: function (oModel, entity, oData, Messaging) { 
            return new Promise((resolve, reject) => {
                oModel.create(entity, oData, {
                    success: function (data) {
                        // MessageToast.show('Recurso Salvo');
                        resolve(true); // Retorna true em caso de sucesso
                    },
                    error: function (oError) {
                        // MessageToast.show('Ocorreu um Erro');
                        Messaging.removeAllMessages();
    
                        const messages = JSON.parse(oError.responseText);
                        const errorDetails = messages.error.innererror.errordetails;
    
                        errorDetails.forEach((error) => {
                            let oMessage;
                            if (error.target == '/#TRANSIENT#') {
                                oMessage = new sap.ui.core.message.Message({
                                    message: `${error.message.value}`,
                                    type: sap.ui.core.MessageType.Error,
                                    target: '',
                                    processor: oModel
                                });
                            } else {
                                oMessage = new sap.ui.core.message.Message({
                                    message: `${error.target}: ${error.message}`,
                                    type: sap.ui.core.MessageType.Error,
                                    target: error.target,
                                    processor: oModel
                                });
                            }
    
                            Messaging.addMessages(oMessage);
                        });
    
                        resolve(false); // Retorna false em caso de erro
                    }
                });
            });
        }
    }
})
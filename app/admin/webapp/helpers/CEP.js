sap.ui.define([
    "sap/m/MessageToast",
    'sap/ui/model/json/JSONModel', 
], function (MessageToast, JSONModel) {
    "use strict";

    return {
        get: function (oEvent) {

           let cep = oEvent.getParameter("value").replace(/\D/g, ""); // Remove caracteres não numéricos

            if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                   
                    if (!data.erro) {
                        sap.m.MessageToast.show(`Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                     
                    
                    } else {
                        sap.m.MessageToast.show("CEP não encontrado.");
                    }
                })
                .catch((e) => console.log(e));
            }
        },

    }
})
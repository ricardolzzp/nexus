sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {
        formCreateModel: function (controller = '') {
            var form = [
                {
                    title: "Dados do Usuário",
                    subSections: [
                        {
                            title: "Dados do Usuário",
                            formTitle: "",
                            fields: [
                                { label: "Nome", id: "name", type: "Input", required: true, enable: true },
                                { label: "E-mail", id: "email", type: "Input", required: true, enable: true },
                                { label: "Telefone", id: "telefone", type: "Mask", mask: "(99) 9 9999-9999", required: true, enable: true },
                                { label: "Senha Inicial", id: "password", type: "Input", required: true, enable: true },
                                { label: "Ativo?", id: "status", type: "Checkbox", enable: true },
                            ]
                        },
                    ]
                },
                {
                    title: "",
                    subSections: []
                }
            ];
            return form;
        }

    };
});

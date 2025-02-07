sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {
        formCreateModel: function (controller = '') {
            var form = [
                {
                    title: "Dados do Produto",
                    subSections: [
                        {
                            title: "Dados do Produto",
                            formTitle: "",
                            fields: [
                                { label: "Nome", id: "name", type: "Input", required: true, enable: true },
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

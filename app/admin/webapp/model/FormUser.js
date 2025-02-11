sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel, CEP) {
    "use strict";

    return {
        formCreateModel: function (controller = '') {
            var form = [
                {
                    title: "Dados Profissionais",
                    subSections: [
                        {
                            title: "Dados Profissionais",
                            formTitle: "",
                            fields: [
                                { label: "Cargo*", placeholder: "Selecione uma opção...", id: 'cargo', type: "Combo", items: [{key: "Consultor", text: "Consultor"},{key: "Líder", text: "Líder"}], required: false, enable: true },
                                { label: "Departamento*", placeholder: "Selecione uma opção...", id: 'cargo', type: "Combo", items: [{key: "TI", text: "TI"},{key: "Consultoria", text: "Consultoria"}], required: false, enable: true },
                                { label: "Ativo?", id: 'isActive', type: "Checkbox", default: true, enable: true }
                            ]
                        },
                    ]
                },
                {
                    title: "Endereço",
                    subSections: [
                        {
                            title: "Endereço",
                            formTitle: "",
                            fields: [
                                { 
                                    label: "CEP*", 
                                    id: "cep", 
                                    type: "Mask", 
                                    mask: "99999-999", 
                                    required: false, 
                                    enable: true
                                },                                
                                { label: "Logradouro*", placeholder: "Logradouro*", id: 'logradouro', type: "Input", required: false, enable: false },
                                { label: "Número*", placeholder: "Número*", id: 'numero', type: "Input", required: false, enable: true },
                                { label: "Complemento*", placeholder: "Complemento*", id: 'complemento', type: "Input", required: false, enable: false },
                                { label: "Bairro*", placeholder: "Bairro*",  id: 'bairro', type: "Input", required: false, enable: false },
                                { label: "Cidade*", label: "Cidade*",  id: 'cidade', type: "Input", required: false, enable: false },
                                { label: "Estado*", placeholder: "Estado*",  id: 'estado', type: "Input", required: false, enable: false }
                            ]
                        },
                    ]
                },
                {
                    title: "Dados do Usuário",
                    subSections: [
                        {
                            title: "Dados do Usuário",
                            formTitle: "",
                            fields: [
                                { label: "Nome*", id: "name", type: "Input", required: true, enable: true },
                                { label: "E-mail*", id: "email", type: "Input", required: true, enable: true },
                                { label: "Telefone*", id: "telefone", type: "Mask", mask: "(99) 9 9999-9999", required: true, enable: true },
                            ]
                        },
                    ]
                },
            ];
            return form;
        },

        formEditModel: function (controller = '') {
            var form = [
                {
                    title: "Dados Profissionais",
                    subSections: [
                        {
                            title: "Dados Profissionais",
                            formTitle: "",
                            fields: [
                                { label: "Cargo", id: 'cargo', type: "Combo", items: [{key: "Consultor", value: "Consultor"}], required: false, enable: true },
                                { label: "Departamento", id: 'departamento', type: "Input", required: false, enable: true },
                                { label: "Ativo?", id: 'isActive', type: "Checkbox", default: true, enable: true }
                            ]
                        },
                    ]
                },
                {
                    title: "Endereço",
                    subSections: [
                        {
                            title: "Endereço",
                            formTitle: "",
                            fields: [
                                { label: "Logradouro", id: 'logradouro', type: "Input", required: false, enable: true },
                                { label: "Número", id: 'numero', type: "Input", required: false, enable: true },
                                { label: "Complemento", id: 'complemento', type: "Input", required: false, enable: true },
                                { label: "Bairro", id: 'bairro', type: "Input", required: false, enable: true },
                                { label: "Cidade", id: 'cidade', type: "Input", required: false, enable: true },
                                { label: "Estado", id: 'estado', type: "Select", options: ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"], required: false, enable: true },
                                { label: "CEP", id: 'cep', type: "Mask", mask: "99999-999", required: false, enable: true }
                            ]
                        },
                    ]
                },
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
                            ]
                        },
                    ]
                },
            ];
            return form;
        }

    };
});

sap.ui.define([
    "sap/uxap/ObjectPageSection",
    "sap/uxap/ObjectPageSubSection",
    "sap/m/Label",
    "sap/m/Input",
    "sap/uxap/ObjectPageLazyLoader",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/ComboBox",
    "sap/m/CheckBox",
    "sap/m/MaskInput",
    "sap/ui/core/Item",
    "sap/m/MessageToast",
    "admin/helpers/CEP"
], function (ObjectPageSection, ObjectPageSubSection, Label, Input, ObjectPageLazyLoader, SimpleForm, ComboBox, CheckBox, MaskInput, Item, MessageToast, CEP) {
    "use strict";

    return {
        /**
         * Ativa ou desativa os inputs do formulário.
         */
        toggle: function (oObjectPageLayout, enable) {
            oObjectPageLayout.getSections().forEach(sec =>
                sec.getSubSections().forEach(sub =>
                    sub.getBlocks().forEach(blk =>
                        blk.getContent().forEach(cont => {
                            if (["input", "box"].some(id => cont.getId().includes(id))) {
                                cont.setEnabled(enable);
                            }
                        })
                    )
                )
            );
        },

        /**
         * Constrói dinamicamente o ObjectPageLayout com os dados fornecidos.
         */
        build: function (oObjectPageLayout, formData = [], arrValue = []) {
            this._resetObjectPage(oObjectPageLayout);
            
            formData.forEach(sectionData => {
                let oSection = new ObjectPageSection({ title: sectionData.title });

                sectionData.subSections.forEach(subSectionData => {
                    let oSubSection = new ObjectPageSubSection({ title: subSectionData.title });
                    let oLazyLoader = new ObjectPageLazyLoader();
                    let oSimpleForm = new SimpleForm({
                        title: subSectionData.formTitle,
                        columnsL: 2,
                        columnsM: 2,
                        editable: true,
                        layout: "ResponsiveGridLayout"
                    });

                    subSectionData.fields.forEach(field => {
                        let value = arrValue.find(item => item.key === field.id)?.value || "";
                
                        oSimpleForm.addContent(new Label({ text: field.label }));
                        oSimpleForm.addContent(this._createInputField(field, value));
                    });

                    oLazyLoader.addContent(oSimpleForm);
                    oSubSection.addBlock(oLazyLoader);
                    oSection.addSubSection(oSubSection);
                });

                oObjectPageLayout.insertSection(oSection);
            });

            return oObjectPageLayout;
        },

        /**
         * Retorna os dados preenchidos no formulário.
         */
        data: function (oForm) {
            let data = {};

            oForm.getSections().forEach(oSection =>
                oSection.getSubSections().forEach(oSubSection =>
                    oSubSection.getBlocks().forEach(oContent => {
                        let fieldData = oContent.getContent().reduce((acc, item, index, arr) => {
                            if (item instanceof Label && arr[index + 1] instanceof Input) {
                                let inputField = arr[index + 1];
                                let fieldName = inputField.getName();
                                let fieldValue = inputField.getValue();
                                if (fieldValue !== "") acc[fieldName] = fieldValue;
                            }
                            return acc;
                        }, {});
                        Object.assign(data, fieldData);
                    })
                )
            );

            return data;
        },

        /**
         * Reseta o conteúdo do ObjectPageLayout antes de reconstruí-lo.
         */
        _resetObjectPage: function (oObjectPageLayout) {
            oObjectPageLayout.getSections().forEach(sec => {
                oObjectPageLayout.removeSection(sec);
                sec.getSubSections().forEach(sub =>
                    sub.getBlocks().forEach(blk =>
                    {
                        if (typeof blk.getContent === "function") {
                            blk?.getContent().forEach(cont => {
                                if (cont instanceof Input) cont.setValue("");
                            })
                        }
                    }
                        
                    )
                );
            });
        },

        /**
         * Cria um campo de entrada com base no tipo especificado.
         */
        _createInputField: function (field, value, ObjectPageLayout) {
            let config = { name: field.id, value: value || "", placeholder: field.placeholder || field.label, enabled: field.enable };

            switch (field.type) {
                case "Input":
                case "Text":
                case "Email":
                    return new Input({ ...config, type: field.type === "Input" ? "Text" : field.type });

                case "Combo":

                    return new sap.m.ComboBox({
                        placeholder: field.placeholder,
                        name: field.id,
                        items: field.items.map(function (item) {
                            return new sap.ui.core.Item({
                                key: item.key,
                                text: item.text,
                            });
                        })
                    });

                case "Checkbox":
                    return new CheckBox({ ...config, text: "", selected: value || false });

                case "Mask":
                    let maskConfig = {
                        ...config,
                        mask: field.mask || "9",
                        placeholderSymbol: field.placeholderSymbol || "_"
                    };
        
                    // Se for o campo CEP, associa a função de callback
                    if (field.id === "cep") {
                        maskConfig.liveChange = CEP.get;
                    }
        
                    return new MaskInput(maskConfig);

                default:
                    MessageToast.show(`Tipo de campo desconhecido: ${field.type}`);
                    return new Input(config);
            }
        }
    };
});

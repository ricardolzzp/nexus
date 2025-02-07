sap.ui.define([
    "sap/uxap/ObjectPageSection",
    "sap/uxap/ObjectPageSubSection",
    "sap/m/Label",
    "sap/m/Input",
    "sap/uxap/ObjectPageLazyLoader",
    "sap/ui/layout/form/SimpleForm"
], function (ObjectPageSection, ObjectPageSubSection, Label, Input, ObjectPageLazyLoader, SimpleForm) {
        "use strict";

    return {
        toggle: function(oObjectPageLayout, enable) {
            oObjectPageLayout.getSections().forEach(function (sec) {
                sec.getSubSections().forEach(function (sub) {
                    sub.getBlocks().forEach(function (blk) {
                        blk.getContent().forEach(function (cont) {
                            if (cont.getId().includes("input") || cont.getId().includes("box")) {
                                cont.setEnabled(enable)
                            }
                        })
                    })
                })
            })
        },

        build: function (oObjectPageLayout, formData = [], arrValue = []) {

            oObjectPageLayout.getSections().forEach(function (sec) {
                sec.removeSection()
                sec.getSubSections().forEach(function (sub) {
                    sub.getBlocks().forEach(function (blk) {
                        blk.getContent().forEach(function (cont) {
                            if (cont.getId().includes("input")) {
                                cont.setValue('')
                            }
                        })
                    })
                })
            })
            
            formData.forEach(function (sectionData) {
                var oSection = new ObjectPageSection({
                    title: sectionData.title
                });

                sectionData.subSections.forEach(function (subSectionData) {
                    var oSubSection = new ObjectPageSubSection({
                        title: subSectionData.title
                    });

                    var oLazyLoader = new ObjectPageLazyLoader();
                    var oSimpleForm = new SimpleForm({
                        title: subSectionData.formTitle,
                        columnsL: 2,
                        columnsM: 2,
                        editable: true,
                        layout: "ResponsiveGridLayout"
                    });

                    subSectionData.fields.forEach(function (field) {
                        var oInput,
                            value = '';

                        const matchedValue = arrValue.find(item => item.key === field.id);
                        
                        if (matchedValue) {
                            value = matchedValue.value || '';
                        }

                        oSimpleForm.addContent(new Label({ text: field.label }));
                        
                        if (field.type == 'Input' || field.type == 'Text' || field.type == 'Email') {
                            oInput = new Input({
                                type: field.type === "Input" ? "Text" : field.type,
                                placeholder: field.placeholder || field.label,
                                name: field.id,
                                value: value,
                            });
                        } else if(field.type == 'Combo') {
                            oInput = new sap.m.ComboBox({
                                placeholder: field.placeholder,
                                name: field.id,
                                change: field.onChange,
                                items: field.items.map(function (item) {
                                    return new sap.ui.core.Item({
                                        key: item.key,
                                        text: item.text,
                                    });
                                })
                            });
                        } else if (field.type == 'Checkbox') {
                            oInput = new sap.m.CheckBox({
                                text: field.label || '',
                                selected: value || true,
                                name: field.id
                            });
                        } else if( field.type == "Mask") {
                            oInput = new sap.m.MaskInput({
                                mask: field.mask || "9",
                                placeholder: field.placeholder || field.label || '',
                                placeholderSymbol: field.placeholderSymbol || "_", 
                                name: field.id,
                                value: value,
                            });
                        }

                        oSimpleForm.addContent(oInput);
                    });

                    oLazyLoader.addContent(oSimpleForm);
                    oSubSection.addBlock(oLazyLoader);
                    oSection.addSubSection(oSubSection);
                })
    
                oObjectPageLayout.insertSection(oSection);
            })
            

            return oObjectPageLayout
        },

        data: function(oForm) {
            var data = {};

            oForm.getSections().forEach(function (oSection) { 
                oSection.getSubSections().forEach(function (oSubSection) { 
                    oSubSection.getBlocks().forEach(function (oContent) {
                        var fieldData = {};
                        var oFormContent = oContent.getContent();
                        for (var i = 0; i < oFormContent.length; i++) {
                            if (oFormContent[i] instanceof sap.m.Label) {
                                if (oFormContent[i + 1] instanceof sap.m.Input || oFormContent[i + 1] instanceof sap.m.MaskInput) {
                                    if (oFormContent[i + 1].getValue() != '')
                                        fieldData[oFormContent[i + 1].getProperty('name')] = oFormContent[i + 1].getValue();
                                }
                            }
                        }

                        Object.assign(data, fieldData);
                    })
                })
            })

            return data;
        }
    }
})
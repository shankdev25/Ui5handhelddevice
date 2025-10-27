sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrderItems", {
        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrder");
        },

        onEditItem: function(oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("items");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/items");
            var iIndex = oContext.getPath().split("/").pop();
            var oData = Object.assign({}, aItems[iIndex]);

            var oDialog = new sap.m.Dialog({
                title: "Edit Item",
                content: [
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("materialDescription") }),
                    new sap.m.Input({ value: oData.materialDescription, liveChange: function(e){ oData.materialDescription = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("itemLocator") }),
                    new sap.m.Input({ value: oData.itemLocator, liveChange: function(e){ oData.itemLocator = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("uom") }),
                    new sap.m.Input({ value: oData.uom, liveChange: function(e){ oData.uom = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("quantityInStock") }),
                    new sap.m.Input({ value: oData.quantityInStock, liveChange: function(e){ oData.quantityInStock = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("issuingStorageLocation") }),
                    new sap.m.Input({ value: oData.LGORT, liveChange: function(e){ oData.LGORT = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("internalOrder") }),
                    new sap.m.Input({ value: oData.AUFNR, liveChange: function(e){ oData.AUFNR = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("costCenter") }),
                    new sap.m.Input({ value: oData.KOSTL, liveChange: function(e){ oData.KOSTL = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("material") }),
                    new sap.m.Input({ value: oData.material, liveChange: function(e){ oData.material = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("issueQuantity") }),
                    new sap.m.Input({ value: oData.issueQuantity, liveChange: function(e){ oData.issueQuantity = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("remark") }),
                    new sap.m.Input({ value: oData.remark, liveChange: function(e){ oData.remark = e.getParameter("value"); }, style: "margin-bottom: 16px;", width: "60%" })
                ],
                beginButton: new sap.m.Button({
                    text: "Save",
                    press: function() {
                        aItems[iIndex] = oData;
                        oModel.setProperty("/items", aItems);
                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function() { oDialog.close(); }
                }),
                afterClose: function() { oDialog.destroy(); }
            });
            oDialog.open();
        },

        onDeleteItem: function(oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("items");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/items");
            var iIndex = oContext.getPath().split("/").pop();
            aItems.splice(iIndex, 1);
            oModel.setProperty("/items", aItems);
        }
            ,

            onContinue: function() {
            }
    });
});

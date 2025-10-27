sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrder", {
        // Models are now initialized in Component.js

        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onInit: function() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                LGORT: "",
                AUFNR: "",
                KOSTL: "",
                MATNR: "",
                PICKING_QTY: "",
                BKTXT: "",
                MAKTX: "",
                LGPBE: "",
                MEINS: "",
                LABST: ""
            }), "view");
        },

        onClearFields: function() {
            var oModel = this.getView().getModel("view");
            var oData = oModel.getData();
            oModel.setData({
                LGORT: oData.LGORT,
                AUFNR: oData.AUFNR,
                KOSTL: oData.KOSTL,
                MATNR: "",
                PICKING_QTY: "",
                BKTXT: "",
                MAKTX: "",
                LGPBE: "",
                MEINS: "",
                LABST: ""
            });
        },

        onAdd: function() {
            var oViewModel = this.getView().getModel("view");
            var oItemsModel = this.getView().getModel("items");
            var oData = Object.assign({}, oViewModel.getData());
            var aItems = oItemsModel.getProperty("/items");
            aItems.push(oData);
            oItemsModel.setProperty("/items", aItems);
            // Show success message
            MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("itemAddedSuccess"));
            // Clear form after add
            this.onClearFields();
        },

        onContinue: function() {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrderItems");
        },
    });
});
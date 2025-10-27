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
        
            onInternalOrderValueHelp: function(oEvent) {
                var aInternalOrders = [
                    { key: "100001", text: "Internal Order 100001" },
                    { key: "100002", text: "Internal Order 100002" },
                    { key: "100003", text: "Internal Order 100003" }
                ];
                var oInput = oEvent.getSource();
                var oDialog = new sap.m.SelectDialog({
                    title: "Select Internal Order",
                    items: aInternalOrders.map(function(item) {
                        return new sap.m.StandardListItem({
                            title: item.text,
                            description: item.key
                        });
                    }),
                    confirm: function(oConfirmEvent) {
                        var oSelected = oConfirmEvent.getParameter("selectedItem");
                        if (oSelected) {
                            oInput.setValue(oSelected.getDescription());
                            var oModel = oInput.getBindingContext("view").getModel();
                            oModel.setProperty("/AUFNR", oSelected.getDescription());
                        }
                    },
                    search: function(oSearchEvent) {
                        var sValue = oSearchEvent.getParameter("value");
                        var aFiltered = aInternalOrders.filter(function(item) {
                            return item.text.toLowerCase().includes(sValue.toLowerCase()) || item.key.includes(sValue);
                        });
                        oDialog.removeAllItems();
                        aFiltered.forEach(function(item) {
                            oDialog.addItem(new sap.m.StandardListItem({
                                title: item.text,
                                description: item.key
                            }));
                        });
                    }
                });
                oDialog.open();
            },

            onCostCenterValueHelp: function(oEvent) {
                var aCostCenters = [
                    { key: "C100", text: "Cost Center C100" },
                    { key: "C200", text: "Cost Center C200" },
                    { key: "C300", text: "Cost Center C300" }
                ];
                var oInput = oEvent.getSource();
                var oDialog = new sap.m.SelectDialog({
                    title: "Select Cost Center",
                    items: aCostCenters.map(function(item) {
                        return new sap.m.StandardListItem({
                            title: item.text,
                            description: item.key
                        });
                    }),
                    confirm: function(oConfirmEvent) {
                        var oSelected = oConfirmEvent.getParameter("selectedItem");
                        if (oSelected) {
                            oInput.setValue(oSelected.getDescription());
                            var oModel = oInput.getBindingContext("view").getModel();
                            oModel.setProperty("/KOSTL", oSelected.getDescription());
                        }
                    },
                    search: function(oSearchEvent) {
                        var sValue = oSearchEvent.getParameter("value");
                        var aFiltered = aCostCenters.filter(function(item) {
                            return item.text.toLowerCase().includes(sValue.toLowerCase()) || item.key.includes(sValue);
                        });
                        oDialog.removeAllItems();
                        aFiltered.forEach(function(item) {
                            oDialog.addItem(new sap.m.StandardListItem({
                                title: item.text,
                                description: item.key
                            }));
                        });
                    }
                });
                oDialog.open();
            }
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrder", {
        // Models are now initialized in Component.js

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onInit: function () {
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

            var oPayload = {
                "DATA": {
                    "WERKS": "",
                    "LGORT": "",
                    "AUFNR": "",
                    "KOSTL": "",
                    "MATNR": "",
                    "MEINS": "",
                    "LGPBE": "",
                    "LABST": 0,
                    "MAKTX": "",
                    "BKTXT": "",
                    "SPRAS": sap.ui.getCore().getConfiguration().getLanguage() || "E",
                    "PICKING_QTY": 0
                }
            };

            var that = this;
            var baseUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri;
            var url = "ISSUE_ORD_INIT";
            $.ajax({
                url: baseUrl + url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPayload),
                success: function (oData) {
                    var oIssueOrdInitModel = new sap.ui.model.json.JSONModel(oData);
                    that.getView().setModel(oIssueOrdInitModel, "issueOrdInitModel");
                },
                error: function (xhr, status, error) {
                    sap.m.MessageToast.show("Failed to fetch F4 help data");
                }
            });
        },

        onClearFields: function () {
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

        onAdd: function () {
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

        onContinue: function () {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrderItems");
        },

        onInternalOrderValueHelp: function (oEvent) {
            var oModel = this.getView().getModel("issueOrdInitModel");
            var aInternalOrders = oModel && oModel.getProperty("/LIST/AUFNR") ? oModel.getProperty("/LIST/AUFNR") : [];
            var oInput = oEvent.getSource();
            var oDialog = new sap.m.SelectDialog({
                title: "Select Internal Order",
                items: aInternalOrders.map(function (item) {
                    return new sap.m.StandardListItem({
                        title: item.AUFNR_CODE || item.AUFNR,
                        description: item.AUFNR_DESC || ""
                    });
                }),
                confirm: function (oConfirmEvent) {
                    var oSelected = oConfirmEvent.getParameter("selectedItem");
                    if (oSelected) {
                        oInput.setValue(oSelected.getTitle());
                        var oViewModel = oInput.getBindingContext("view").getModel();
                        oViewModel.setProperty("/AUFNR", oSelected.getTitle());
                    }
                },
                search: function (oSearchEvent) {
                    var sValue = oSearchEvent.getParameter("value");
                    var aFiltered = aInternalOrders.filter(function (item) {
                        var code = item.AUFNR_CODE || item.AUFNR;
                        var desc = item.AUFNR_DESC || "";
                        return (desc && desc.toLowerCase().includes(sValue.toLowerCase())) || (code && code.includes(sValue));
                    });
                    oDialog.removeAllItems();
                    aFiltered.forEach(function (item) {
                        oDialog.addItem(new sap.m.StandardListItem({
                            title: item.AUFNR_CODE || item.AUFNR,
                            description: item.AUFNR_DESC || ""
                        }));
                    });
                }
            });
            oDialog.open();
        },

        onCostCenterValueHelp: function (oEvent) {
            var oModel = this.getView().getModel("issueOrdInitModel");
            var aCostCenters = oModel && oModel.getProperty("/LIST/KOSTL") ? oModel.getProperty("/LIST/KOSTL") : [];
            var oInput = oEvent.getSource();
            var oDialog = new sap.m.SelectDialog({
                title: "Select Cost Center",
                items: aCostCenters.map(function (item) {
                    return new sap.m.StandardListItem({
                        title: item.KOSTL_CODE || item.KOSTL,
                        description: item.KOSTL_DESC || ""
                    });
                }),
                confirm: function (oConfirmEvent) {
                    var oSelected = oConfirmEvent.getParameter("selectedItem");
                    if (oSelected) {
                        oInput.setValue(oSelected.getTitle());
                        var oViewModel = oInput.getBindingContext("view").getModel();
                        oViewModel.setProperty("/KOSTL", oSelected.getTitle());
                    }
                },
                search: function (oSearchEvent) {
                    var sValue = oSearchEvent.getParameter("value");
                    var aFiltered = aCostCenters.filter(function (item) {
                        var code = item.KOSTL_CODE || item.KOSTL;
                        var desc = item.KOSTL_DESC || "";
                        return (desc && desc.toLowerCase().includes(sValue.toLowerCase())) || (code && code.includes(sValue));
                    });
                    oDialog.removeAllItems();
                    aFiltered.forEach(function (item) {
                        oDialog.addItem(new sap.m.StandardListItem({
                            title: item.KOSTL_CODE || item.KOSTL,
                            description: item.KOSTL_DESC || ""
                        }));
                    });
                }
            });
            oDialog.open();
        }
    });
});
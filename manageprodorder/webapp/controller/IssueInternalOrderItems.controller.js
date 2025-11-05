sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/layout/form/SimpleForm"
], function (Controller, MessageBox, SimpleForm) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrderItems", {
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrder");
        },

        onEditItem: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("items");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/items");
            var iIndex = oContext.getPath().split("/").pop();
            var oData = Object.assign({}, aItems[iIndex]);

            // Use SimpleForm for better alignment
            var oSimpleForm = new SimpleForm({
                editable: true,
                layout: "ResponsiveGridLayout",
                content: [
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("internalOrderLabel") }),
                    new sap.m.Input({ value: oData.AUFNR, liveChange: function (e) { oData.AUFNR = e.getParameter("value"); } }),
                    // Add Cost Center (KOSTL) below AUFNR
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("costCenterLabel") }),
                    new sap.m.Input({ value: oData.KOSTL, liveChange: function (e) { oData.KOSTL = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("storageLocationLabel") }),
                    new sap.m.Input({ value: oData.LGORT, liveChange: function (e) { oData.LGORT = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("materialNumberLabel") }),
                    new sap.m.Input({ value: oData.MATNR, liveChange: function (e) { oData.MATNR = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("materialDescription") }),
                    new sap.m.Input({ value: oData.MAKTX, liveChange: function (e) { oData.MAKTX = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("baseUoMLabel") }),
                    new sap.m.Input({ value: oData.MEINS, liveChange: function (e) { oData.MEINS = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("stockLabel") }),
                    new sap.m.Input({ value: oData.LABST, liveChange: function (e) { oData.LABST = e.getParameter("value"); } }),
                    new sap.m.Label({ text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("pickingQtyLabel") }),
                    new sap.m.Input({ value: oData.PICKING_QTY, liveChange: function (e) { oData.PICKING_QTY = e.getParameter("value"); } })
                ]
            });

            var oDialog = new sap.m.Dialog({
                title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("editItemTitle"),
                content: [oSimpleForm],
                beginButton: new sap.m.Button({
                    text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("saveLabel"),
                    press: function () {
                        aItems[iIndex] = oData;
                        oModel.setProperty("/items", aItems);
                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("cancelLabel"),
                    press: function () { oDialog.close(); }
                }),
                afterClose: function () { oDialog.destroy(); }
            });
            oDialog.open();
        },

        onDeleteItem: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("items");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/items");
            var iIndex = oContext.getPath().split("/").pop();
            aItems.splice(iIndex, 1);
            oModel.setProperty("/items", aItems);
        },

        /**
         * Sort handler for table columns
         */
        onSort: function(oEvent) {
            var sPath = oEvent.getParameter("column").getSortProperty();
            var bDescending = oEvent.getParameter("sortOrder") === "Descending";
            var oTable = this.byId("itemsTable");
            var oBinding = oTable.getBinding("items");
            var oSorter = new sap.ui.model.Sorter(sPath, bDescending);
            oBinding.sort(oSorter);
        },

        onContinue: function () {
            var oViewModel = this.getOwnerComponent().getModel("view");
            var oItemsModel = this.getView().getModel("items");
            var oGlobalWerksModel = this.getOwnerComponent().getModel("globalWerks");
            var oData = oViewModel ? oViewModel.getData() : {};
            // Use WERKS from global model if available
            if (oGlobalWerksModel && oGlobalWerksModel.getProperty("/WERKS")) {
                oData.WERKS = oGlobalWerksModel.getProperty("/WERKS");
            }
            var oPayload = {
                DATA: oData,
                ITEM: oItemsModel ? oItemsModel.getProperty("/items") : [],
                DOC: {
                    MBLNR: "",
                    MJAHR: ""
                },
                MSG: {
                    MSGTX: "",
                    MSGTY: ""
                }
            };

            var baseUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri;
            var url = "ISSUE_ORD_2_SAVE";
            var that = this;
            $.ajax({
                url: baseUrl + url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPayload),
                success: function (oData) {
                    if (oData && oData.MSG && oData.MSG.MSGTY === "E") {
                        MessageBox.error(oData.MSG.MSGTX );
                    } else {
                            // Navigate to DocumentCreated view and pass document data
                            that.getOwnerComponent().getRouter().navTo("InternalOrderCreated", {
                                MBLNR: oData.DOC.MBLNR,
                                MJAHR: oData.DOC.MJAHR
                            });
                    }
                },
                error: function (xhr, status, error) {
                    MessageBox.error("Failed to save issue order");
                }
            });
        }
    });
});

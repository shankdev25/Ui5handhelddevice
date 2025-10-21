sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueItems", {
        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrderContinue");
        },



        onSave: function () {
            // Retrieve selected issue items model
            var oIssueItemsModel = this.getView().getModel("issueItems");
            var aItems = (oIssueItemsModel && oIssueItemsModel.getProperty("/items")) || [];
            var header = this.getView().getModel("inputFields");
            let aHeader = {
                LGPBE: header.Location,
                LABST: header.Stock,
                MATNR: header.Material,
                MAKTX: header.MaterialDescription,
                MEINS: header.UOM
            };

            var oValidDataModel = this.getOwnerComponent().getModel("validData");
            var validData = oValidDataModel ? oValidDataModel.getData() : {};

            let finalPayload = {
                HEAD: aHeader,
                ITEM: aItems,
                DATA: validData,
                DOC: {
                    MBLNR: "",
                    MJAHR: ""
                },
                "MSG": {
                    MSGTX: "",
                    MSGTY: ""
                }

            }

            // Simulate successful save operation and prepare data for confirmation screen  
            var baseUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri;
            var url = "ISSUE_PR_3_SAVE";
            var that = this;
            $.ajax({
                url: baseUrl + url,
                method: "POST",
                contentType: "application/json",
                data: finalPayload,
                success: function (oResponse) {
                    if (oResponse.MSG.MSGTY === "S") {

                        // Map issue items into the shape expected by DocumentCreated view: { Material, SerialNumber }
                        var aCreated = [
                            { DocumentNumber: oResponse.DOC.MBLNR }
                        ];

                        // Create / overwrite 'created' model at component level for DocumentCreated view
                        var oCreatedModel = new JSONModel({ items: aCreated });
                        that.getOwnerComponent().setModel(oCreatedModel, "created");

                        // Navigate to confirmation screen
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("DocumentCreated");

                    } else {
                        MessageBox.error(oResponse.MSG.MSGTX);
                    }
                },
                error: function (oError) {
                    MessageBox.error("Error occurred while saving issue items.");
                }
            });



        }
    });
});
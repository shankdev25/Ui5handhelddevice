sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueItems", {
        onNavBack: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrderContinue");
        },

        

        onSave: function() {
            // Retrieve selected issue items model
            var oIssueItemsModel = this.getView().getModel("issueItems");
            var aItems = (oIssueItemsModel && oIssueItemsModel.getProperty("/items")) || [];

            // Map issue items into the shape expected by DocumentCreated view: { Material, SerialNumber }
            var aCreated = [
                    { Material: "MAT-001", SerialNumber: "SN-1001" },
                    { Material: "MAT-002", SerialNumber: "SN-1002" },
                    { Material: "MAT-003", SerialNumber: "SN-1003" }
                ];

            // Create / overwrite 'created' model at component level for DocumentCreated view
            var oCreatedModel = new JSONModel({ items: aCreated });
            this.getOwnerComponent().setModel(oCreatedModel, "created");

            // Navigate to confirmation screen
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("DocumentCreated");
        }
    });
});
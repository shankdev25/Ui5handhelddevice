sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.ProductionOrderContinue", {
        onNavBack: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrder");
        },
        onDisplayIssueItems: function() {
            var oTable = this.byId("continueTable");
            var aContexts = oTable.getSelectedContexts();
            var aSelected = aContexts.map(function(c){ return c.getObject(); });
            if (!aSelected.length) { sap.m.MessageToast.show("No items selected"); return; }
            var oComponent = this.getOwnerComponent();
            if (!oComponent.getModel("issueItems")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel({ items: aSelected }), "issueItems");
            } else {
                oComponent.getModel("issueItems").setData({ items: aSelected });
            }
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("IssueItems");
        },
        onClearSelection: function() {
            var oTable = this.byId("continueTable");
            oTable.removeSelections(true);
            sap.m.MessageToast.show("Selection cleared");
        }
    });
});
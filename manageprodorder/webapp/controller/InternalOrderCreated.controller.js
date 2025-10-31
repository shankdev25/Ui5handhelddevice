sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.InternalOrderCreated", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("InternalOrderCreated").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sText = "מספר מסמך: " + oArgs.MBLNR + " שנה: " + oArgs.MJAHR;
            this.byId("docInfo").setText(sText);
        },
        onSign: function () {
            // Implement digital signature navigation here
        },
        onNavHome: function () {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrder");
        }
    });
});
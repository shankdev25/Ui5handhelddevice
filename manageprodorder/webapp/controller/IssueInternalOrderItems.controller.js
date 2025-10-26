sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrderItems", {
        onNavBack: function() {
            this.getOwnerComponent().getRouter().navTo("IssueInternalOrder");
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.IssueInternalOrder", {
        // Blank controller for Issue Internal Order

        onClearFields: function() {
            var oView = this.getView();
            oView.byId("issuingStorageLocationInput").setValue("");
            oView.byId("internalOrderInput").setValue("");
            oView.byId("costCenterInput").setValue("");
            oView.byId("itemInput").setValue("");
            oView.byId("issueQuantityInput").setValue("");
            oView.byId("noteInput").setValue("");
        }
    });
});
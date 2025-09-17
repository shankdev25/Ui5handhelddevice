sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.DocumentCreated", {
        onNavBack: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // Navigate back to start page (View1) for a fresh flow
            oRouter.navTo("RouteView1");
        }
    });
});
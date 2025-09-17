sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.View1", {
        onInit() {
        },

        onProductionOrderPress: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrder");
        }
    });
});
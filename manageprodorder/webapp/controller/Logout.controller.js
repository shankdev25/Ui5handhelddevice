sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(Controller) {
  "use strict";

  return Controller.extend("com.merkavim.ewm.manageprodorder.controller.Logout", {
    onInit: function() {
      // nothing special
    },

    onNavHome: function() {
      try {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Replace history so back won't return to protected pages
        oRouter.navTo("RouteView1", {}, true);
      } catch (e) {
        try { sap.ui.core.routing.HashChanger.getInstance().setHash(""); } catch (e2) {}
      }
    }
  });
});

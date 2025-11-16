sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("com.merkavim.ewm.manageprodorder.controller.Logout", {
    onInit: function() {
      // Perform client-side logout immediately when this view is entered
      try {
        this._logoutClientSide();
      } catch (e) {
        // Non-blocking
      }
    },

    onNavHome: function() {
      try {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // Replace history so back won't return to protected pages
        oRouter.navTo("RouteView1", {}, true);
      } catch (e) {
        try { sap.ui.core.routing.HashChanger.getInstance().setHash(""); } catch (e2) {}
      }
    },

    /**
     * Best-effort client-side logout:
     * - Clears local/session storage used by the app
     * - Resets the component-level user and working models
     * - Attempts to clear Basic Auth cache (not guaranteed by browsers)
     */
    _logoutClientSide: function() {
      var oComponent = this.getOwnerComponent();

      // 1) Clear any app-specific persisted data
      try {
        if (window.localStorage) {
          window.localStorage.removeItem("appUserProfile");
        }
      } catch (e1) {}
      try {
        if (window.sessionStorage) {
          window.sessionStorage.clear();
        }
      } catch (e2) {}

      // 2) Reset in-memory models to a logged-out/empty state
      try {
        var oUserModel = oComponent.getModel("user");
        if (oUserModel) {
          oUserModel.setData({ name: "", email: "", loggedIn: false });
          oUserModel.updateBindings(true);
        }

        var mResetModels = ["pickItems", "inputFields", "selection", "form", "items", "view", "validData"]; 
        mResetModels.forEach(function(sName){
          var oModel = oComponent.getModel(sName);
          if (!oModel) { return; }
          switch (sName) {
            case "pickItems":
            case "items":
              oModel.setData({ items: [] });
              break;
            case "inputFields":
              oModel.setData({ Location: "", Stock: "", Material: "", MaterialDescription: "", UOM: "" });
              break;
            case "selection":
              oModel.setData({ Material: "", ProductionOrder: "", Operation: "", ReservationStorageLocation: "", LogisticsGroup: "", Remark: "" });
              break;
            case "form":
              oModel.setData({ issuingStorageLocation: "", internalOrder: "", costCenter: "", material: "", issueQuantity: "", remark: "" });
              break;
            case "view":
              oModel.setData({ WERKS: "", LGORT: "", AUFNR: "", KOSTL: "", MATNR: "", MEINS: "", LGPBE: "", LABST: 0, MAKTX: "", BKTXT: "", SPRAS: sap.ui.getCore().getConfiguration().getLanguage() || "E", PICKING_QTY: 0 });
              break;
            default:
              try { oModel.setData({}); } catch(_) {}
          }
          try { oModel.updateBindings(true); } catch(_) {}
        });
      } catch (e3) {}

      // 3) Attempt to clear Basic Auth cache (browser-dependent and not guaranteed)
      this._tryClearBasicAuth();

      // 4) Notify the user
      try {
        MessageToast.show(this._getI18nText("logoutHeading") || "You have been signed out.");
      } catch (_) {}
    },

    _getI18nText: function(sKey){
      try {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
      } catch (e) { return ""; }
    },

    /**
     * Tries known approaches to clear HTTP Basic Auth credentials:
     * - IE/Edge Legacy: document.execCommand('ClearAuthenticationCache')
     * - XHR with bogus creds against the protected realm
     * None of these are guaranteed across modern browsers. As a fallback, ask the
     * user to close all tabs for this site or use a private window.
     */
    _tryClearBasicAuth: function(){
      // a) IE/Edge Legacy
      try {
        if (document && typeof document.execCommand === "function") {
          document.execCommand("ClearAuthenticationCache");
        }
      } catch (e) {}

      // b) Make a request with wrong credentials to the same realm
      try {
        var sBaseUri = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri || "/";
        // Use jQuery ajax with explicit username/password to override cached creds
        if (window.jQuery && jQuery.ajax) {
          jQuery.ajax({
            url: sBaseUri + "__logout_probe__" + Date.now(),
            method: "GET",
            username: "logout",
            password: "logout",
            timeout: 3000
          }).always(function(){ /* ignore result */ });
        } else if (window.fetch) {
          // fetch cannot set username/password directly; send a request likely to 401
          fetch(sBaseUri + "__logout_probe__" + Date.now(), { credentials: "include", cache: "no-store" }).catch(function(){});
        }
      } catch (e2) {}
    }
  });
});

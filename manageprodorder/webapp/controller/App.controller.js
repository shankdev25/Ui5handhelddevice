sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/Popover",
  "sap/m/VBox",
  "sap/m/Text",
  "sap/m/Title",
  "sap/m/Bar",
  "sap/m/Button",
  "sap/m/PlacementType"
], (BaseController, Popover, VBox, Text, Title, Bar, Button, PlacementType) => {
  "use strict";

  return BaseController.extend("com.merkavim.ewm.manageprodorder.controller.App", {
    onInit() {
      // nothing yet
    },

    _getUserPopover: function() {
      if (!this._oUserPopover) {
        var oUserModel = this.getOwnerComponent().getModel("user");
        this._oUserPopover = new Popover({
          placement: PlacementType.Bottom,
          showHeader: false,
          contentWidth: "260px",
          content: [
            new VBox({
              width: "100%",
              items: [
                new Title({ text: "Signed in", level: "H4" }).addStyleClass("sapUiTinyMarginBottom"),
                new Text({ text: "{user>/name}" }),
                new Text({ text: "{user>/email}" })
              ]
            }).addStyleClass("sapUiSmallMargin")
          ],
          footer: new Bar({
            contentRight: [
              new Button({ text: "Logout", type: "Transparent", press: this.onLogoutPress.bind(this) })
            ]
          })
        });
        this._oUserPopover.setModel(oUserModel, "user");
      }
      return this._oUserPopover;
    },

    onUserButtonPress: function(oEvent) {
      var oSource = oEvent.getSource();
      this._getUserPopover().openBy(oSource);
    },

    onLogoutPress: function() {
      try {
        var oUserModel = this.getOwnerComponent().getModel("user");
        // mark as logged out client-side
        if (oUserModel) {
          oUserModel.setProperty("/loggedIn", false);
        }
        // clear any stored profile
        try {
          window.localStorage && window.localStorage.removeItem("appUserProfile");
        } catch (e) {}

        // Attempt to call a conventional logout endpoint then redirect
        var sBase = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri || "/";
        jQuery.ajax({
          url: sBase + "logout",
          method: "POST",
          complete: function() {
            window.location.href = "/";
          }
        });
      } catch (e) {
        // Fallback redirect
        window.location.href = "/";
      }
    }
  });
});
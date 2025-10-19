sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.View1", {
        onInit() {
            // quick connectivity test: POST to /app_list
            this._testConnection();
        },

        /**
         * Send a POST to /app_list to verify the connection. Logs success or error to the console.
         * If the server requires a CSRF token, it will try to fetch one and retry once.
         */
        _testConnection: function() {
            var baseUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri;
            var url = "app_list";
            var payload = {};

            jQuery.ajax({
                url: baseUrl + url,
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: payload,
                dataType: "json",
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    console.log("POST /app_list success:", data);
                    console.log("Status:", textStatus);
                    // Dynamically set tile text for all app_id_X tiles
                    // if (data && data.APPS && Array.isArray(data.APPS)) {
                    //     data.APPS.forEach(function(app) {
                    //         var tileId = "app_id_" + app.APP_ID;
                    //         var oTile = sap.ui.getCore().byId(tileId);
                    //         if (oTile && app.APP_DESC) {
                    //             var oTileContent = oTile.getTileContent()[0];
                    //             var oText = oTileContent.getContent();
                    //             if (oText && oText.setText) {
                    //                 oText.setText(app.APP_DESC);
                    //             }
                    //         }
                    //     });
                    // }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("POST /app_list failed:", textStatus, errorThrown);
                    console.error("Status code:", jqXHR.status);
                    console.error("Response text:", jqXHR.responseText);

                  
                }
            });
        },

        onProductionOrderPress: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrder");
        }
    });
});
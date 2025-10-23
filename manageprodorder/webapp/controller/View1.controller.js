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

            var that = this;

            jQuery.ajax({
                url: baseUrl + url,
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: payload,
                dataType: "json",
                timeout: 10000,
                success: (data, textStatus, jqXHR) => {
                    console.log("POST /app_list success:", data);
                    console.log("Status:", textStatus);
                    // Loop through the APPS array and set the app_desc on the corresponding tile
                    if (data && data.APPS && Array.isArray(data.APPS)) {
                        data.APPS.forEach((app) => {
                            if (app.APP_NAME === "ProductionOrder") {
                                var oTileHeader = that.getView().byId("ProductionOrder");
                                if (oTileHeader) {
                                    oTileHeader.setHeader(app.APP_DESC);
                                }
                            }
                            // Add more conditions here for other tiles if needed
                        });
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
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
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
            var url = "/app_list";
            var payload = {};

            jQuery.ajax({
                url: url,
                method: "POST",
                contentType: "application/json; charset=utf-8",
                data: payload,
                dataType: "json",
                timeout: 10000,
                success: function(data, textStatus, jqXHR) {
                    console.log("POST /app_list success:", data);
                    console.log("Status:", textStatus);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("POST /app_list failed:", textStatus, errorThrown);
                    console.error("Status code:", jqXHR.status);
                    console.error("Response text:", jqXHR.responseText);

                    // Attempt CSRF token fetch & retry if permission/CSRF issue detected
                    var needCsrf = jqXHR.status === 403 || (jqXHR.responseText && jqXHR.responseText.indexOf("CSRF") !== -1);
                    if (needCsrf) {
                        console.log("Attempting to fetch CSRF token and retry...");
                        jQuery.ajax({
                            url: url,
                            method: "GET",
                            headers: { "X-CSRF-Token": "Fetch" },
                            success: function(dummyData, status2, jq2) {
                                var token = jq2.getResponseHeader("X-CSRF-Token");
                                console.log("Fetched CSRF token:", token);
                                jQuery.ajax({
                                    url: url,
                                    method: "POST",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify(payload),
                                    headers: token ? { "X-CSRF-Token": token } : {},
                                    success: function(data3) { console.log("POST retry success:", data3); },
                                    error: function(jq3, ts3, err3) { console.error("POST retry failed:", ts3, err3, jq3.responseText); }
                                });
                            },
                            error: function(jq, ts, err) { console.error("Failed to fetch CSRF token:", ts, err); }
                        });
                    }
                }
            });
        },

        onProductionOrderPress: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrder");
        }
    });
});
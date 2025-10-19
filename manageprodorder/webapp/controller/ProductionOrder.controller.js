
       
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox" 
], function(Controller, MessageBox) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.ProductionOrder", {
        onInit: function() {
            var oMockData = {
                items: [
                    {
                        Material: "MAT-001",
                        ProductionOrder: "PO-1001",
                        Operation: "Op-01",
                        ReservationStorageLocation: "RS-01",
                        IssuesingStorageLocation: "IS-01",
                        LogisticsGroup: "LG-01",
                        Remark: "First order"
                    },
                    {
                        Material: "MAT-002",
                        ProductionOrder: "PO-1002",
                        Operation: "Op-02",
                        ReservationStorageLocation: "RS-02",
                        IssuesingStorageLocation: "IS-02",
                        LogisticsGroup: "LG-02",
                        Remark: "Second order"
                    }
                ]
            };
            var oModel = new sap.ui.model.json.JSONModel(oMockData);
            this.getView().setModel(oModel, "mock");
            // view state model for inline create fields
            var oViewModel = new sap.ui.model.json.JSONModel({
                newEntry: {
                    Material: "",
                    ProductionOrder: "",
                    Operation: "",
                    ReservationStorageLocation: "",
                    LogisticsGroup: "",
                    Remark: ""
                }
            });
            this.getView().setModel(oViewModel, "view");
        },

        onNavBack: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1", {}, true);
        },

        onContinue: function() {
            var oViewModel = this.getView().getModel("view");
            var oSelectionData = Object.assign({}, oViewModel.getProperty("/newEntry"));
            var that = this;
            // Prepare payload for backend
            var oPayload = {
                DATA: {
                    MATNR: oSelectionData.Material || "",
                    MEINS: "",
                    MAKTX: "",
                    AUFNR: oSelectionData.ProductionOrder || "",
                    VORNR_F: oSelectionData.Operation || "",
                    VORNR_T: "",
                    LGORT_F: oSelectionData.ReservationStorageLocation || "",
                    LGORT_T: "",
                    LOGGR: oSelectionData.LogisticsGroup || "",
                    BKTXT: oSelectionData.Remark || ""
                }
            };
            // Call backend endpoint
            var baseUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.mainService.uri;
            var url = "ISSUE_PR_1_CHECK";
            $.ajax({
                url: baseUrl + url,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oPayload),
                success: function(oResponse) {
                    if (oResponse.MSGTY === "S") {
                        // --- mock data logic preserved, only runs on success ---
                        var oComponent = that.getOwnerComponent();
                        var aPicking = [
                            {
                                selected: false,
                                Item: "1001",
                                ItemDescription: "Widget A",
                                Date: "2025-09-21",
                                Location: "LOC-01",
                                Inventory: "INV-001",
                                QtyInReservation: 10,
                                QtyToPick: 10
                            },
                            {
                                selected: false,
                                Item: "1002",
                                ItemDescription: "Widget B",
                                Date: "2025-09-21",
                                Location: "LOC-02",
                                Inventory: "INV-002",
                                QtyInReservation: 5,
                                QtyToPick: 5
                            },
                            {
                                selected: false,
                                Item: "1003",
                                ItemDescription: "Widget C",
                                Date: "2025-09-21",
                                Location: "LOC-03",
                                Inventory: "INV-003",
                                QtyInReservation: 8,
                                QtyToPick: 8
                            }
                        ];
                        var oPickModel = oComponent.getModel("pickItems");
                        if (oPickModel) {
                            oPickModel.setData({ items: aPicking });
                        } else {
                            oComponent.setModel(new sap.ui.model.json.JSONModel({ items: aPicking }), "pickItems");
                        }
                        var oSelectionModel = oComponent.getModel("selection");
                        if (oSelectionModel) {
                            oSelectionModel.setData(oSelectionData);
                        } else {
                            oComponent.setModel(new sap.ui.model.json.JSONModel(oSelectionData), "selection");
                        }
                        try {
                            console.log("[ProductionOrder] pickItems on component:", oComponent.getModel("pickItems") && oComponent.getModel("pickItems").getData());
                            console.log("[ProductionOrder] selection on component:", oComponent.getModel("selection") && oComponent.getModel("selection").getData());
                        } catch (e) {}
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        oRouter.navTo("ProductionOrderContinue");
                    } else {
                        MessageBox.error(oResponse.MSG || "Unknown error");
                    }
                },
                error: function(xhr, status, error) {
                    MessageBox.error("Backend call failed: " + (xhr.responseText || status));
                }
            });
        },

        onInlineAdd: function() {
            var oViewModel = this.getView().getModel("view");
            var oMockModel = this.getView().getModel("mock");
            var oEntry = Object.assign({}, oViewModel.getProperty("/newEntry"));
            if (!oEntry.Material && !oEntry.ProductionOrder) {
                return; // basic guard: require at least one key field
            }
            var aItems = oMockModel.getProperty("/items");
            aItems.push(oEntry);
            oMockModel.setProperty("/items", aItems);
            // clear after add
            oViewModel.setProperty("/newEntry", {Material:"",ProductionOrder:"",Operation:"",ReservationStorageLocation:"",LogisticsGroup:"",Remark:""});
        },

        onInlineClear: function() {
            var oViewModel = this.getView().getModel("view");
            oViewModel.setProperty("/newEntry", {Material:"",ProductionOrder:"",Operation:"",ReservationStorageLocation:"",LogisticsGroup:"",Remark:""});
        }
        
    });
});
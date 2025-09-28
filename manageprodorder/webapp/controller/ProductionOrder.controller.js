
       
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
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
            var oComponent = this.getOwnerComponent();
                // mock picking list for ProductionOrderContinue
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
                // Component initializes pickItems and selection models — just update their data
                var oPickModel = oComponent.getModel("pickItems");
                if (oPickModel) {
                    oPickModel.setData({ items: aPicking });
                } else {
                    // defensive fallback: create if unexpectedly missing
                    oComponent.setModel(new sap.ui.model.json.JSONModel({ items: aPicking }), "pickItems");
                }

                var oSelectionModel = oComponent.getModel("selection");
                if (oSelectionModel) {
                    oSelectionModel.setData(oSelectionData);
                } else {
                    oComponent.setModel(new sap.ui.model.json.JSONModel(oSelectionData), "selection");
                }
                // diagnostic log to ensure component models contain the updated data
                try {
                    console.log("[ProductionOrder] pickItems on component:", oComponent.getModel("pickItems") && oComponent.getModel("pickItems").getData());
                    console.log("[ProductionOrder] selection on component:", oComponent.getModel("selection") && oComponent.getModel("selection").getData());
                } catch (e) {}
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrderContinue");
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
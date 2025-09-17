
       
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
            // mock inventory list
            var aInventory = [
                { Location:"LOC-01", Stock: 120, Material:"MAT-001", MaterialDescription:"Widget A", UOM:"PC", ProductionOrder:"PO-1001" },
                { Location:"LOC-02", Stock: 45, Material:"MAT-001", MaterialDescription:"Widget A", UOM:"PC", ProductionOrder:"PO-1001" },
                { Location:"LOC-03", Stock: 10, Material:"MAT-002", MaterialDescription:"Widget B", UOM:"PC", ProductionOrder:"PO-1002" },
                { Location:"LOC-01", Stock: 77, Material:"MAT-002", MaterialDescription:"Widget B", UOM:"PC", ProductionOrder:"PO-1002" },
                { Location:"LOC-05", Stock: 200, Material:"MAT-003", MaterialDescription:"Widget C", UOM:"PC", ProductionOrder:"PO-1003" }
            ];
            // filter based on entered fields if provided
            var aFiltered = aInventory.filter(function(it){
                var bMatch = true;
                if (oSelectionData.Material) { bMatch = bMatch && it.Material === oSelectionData.Material; }
                if (oSelectionData.ProductionOrder) { bMatch = bMatch && it.ProductionOrder === oSelectionData.ProductionOrder; }
                return bMatch;
            });
            if (!oComponent.getModel("continue")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel({ items: aFiltered }), "continue");
            } else {
                oComponent.getModel("continue").setData({ items: aFiltered });
            }
            if (!oComponent.getModel("selection")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel(oSelectionData), "selection");
            } else {
                oComponent.getModel("selection").setData(oSelectionData);
            }
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
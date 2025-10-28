sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/merkavim/ewm/manageprodorder/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.merkavim.ewm.manageprodorder.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // initialize application-level models so views have them available immediately
            var oEmptyPickModel = new sap.ui.model.json.JSONModel({ items: [] });
            this.setModel(oEmptyPickModel, "pickItems");

            var oInputFieldsModel = new sap.ui.model.json.JSONModel({
                Location: "LOC-DEV-01",
                Stock: "100",
                Material: "MAT-DEV-001",
                MaterialDescription: "Sample widget (dev)",
                UOM: "EA"
            });
            this.setModel(oInputFieldsModel, "inputFields");

            var oSelectionModel = new sap.ui.model.json.JSONModel({
                Material: "MAT-001",
                ProductionOrder: "PO-1001",
                Operation: "Op-01",
                ReservationStorageLocation: "RS-01",
                LogisticsGroup: "LG-01",
                Remark: "Dev selection sample"
            });
            this.setModel(oSelectionModel, "selection");

            // Add form and items models for IssueInternalOrder
            var oFormModel = new sap.ui.model.json.JSONModel({
                issuingStorageLocation: "",
                internalOrder: "",
                costCenter: "",
                material: "",
                issueQuantity: "",
                remark: ""
            });
            oFormModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.setModel(oFormModel, "form");

            var oItemsModel = new sap.ui.model.json.JSONModel({ items: [] });
            this.setModel(oItemsModel, "items");

            // Add a global view model with initial structure
            var oViewModel = new sap.ui.model.json.JSONModel({
                WERKS: "",
                LGORT: "",
                AUFNR: "",
                KOSTL: "",
                MATNR: "",
                MEINS: "",
                LGPBE: "",
                LABST: 0,
                MAKTX: "",
                BKTXT: "",
                SPRAS: sap.ui.getCore().getConfiguration().getLanguage() || "E",
                PICKING_QTY: 0
            });
            oViewModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.setModel(oViewModel, "view");

            // diagnostic log to verify component-level models are present at startup
            try {
                console.log("[Component] initialized models:", {
                    pickItems: this.getModel("pickItems") && this.getModel("pickItems").getData(),
                    inputFields: this.getModel("inputFields") && this.getModel("inputFields").getData(),
                    selection: this.getModel("selection") && this.getModel("selection").getData()
                });
            } catch (e) { /* ignore in environments without console */ }

                // Diagnostic log for form model
                try {
                    console.log("[Component] form model instance:", this.getModel("form"));
                    console.log("[Component] form model binding mode:", this.getModel("form").getDefaultBindingMode());
                    console.log("[Component] form model initial data:", this.getModel("form").getData());
                } catch (e) { /* ignore in environments without console */ }

            // enable routing
            this.getRouter().initialize();
        }
    });
});
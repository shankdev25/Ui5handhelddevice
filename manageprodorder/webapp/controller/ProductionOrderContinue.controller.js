sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";
    return Controller.extend("com.merkavim.ewm.manageprodorder.controller.ProductionOrderContinue", {
        onInit: function() {

            // `inputFields` model is initialized at the component level; rely on that model here

            // Ensure pickItems model is available when the view is displayed
            var oComponent = this.getOwnerComponent();
            try {
                var oRouter = oComponent.getRouter();
                if (oRouter && oRouter.getRoute("ProductionOrderContinue")) {
                    // keep reference
                    var that = this;
                    oRouter.getRoute("ProductionOrderContinue").attachPatternMatched(function() {
                        that._ensurePickItemsModel();
                    });
                } else {
                    // fallback immediate attempt
                    this._ensurePickItemsModel();
                }
            } catch (e) {
                // router may not be available in some contexts; try to ensure model anyway
                this._ensurePickItemsModel();
            }
        },

        _ensurePickItemsModel: function() {
            var oView = this.getView();
            var oComponent = this.getOwnerComponent();
            var oPickModel = oComponent.getModel("pickItems");
            console.log("[ProductionOrderContinue] component pickItems model:", oPickModel && oPickModel.getData ? oPickModel.getData() : oPickModel);
            if (oPickModel) {
                if (!oView.getModel("pickItems")) {
                    oView.setModel(oPickModel, "pickItems");
                    console.log("[ProductionOrderContinue] pickItems model set on view");
                }
                var oTable = this.byId("pickTable");
                if (oTable) {
                    var oTableModel = oTable.getModel("pickItems");
                    console.log("[ProductionOrderContinue] pickTable model before set:", oTableModel && oTableModel.getData ? oTableModel.getData() : oTableModel);
                    if (!oTableModel) {
                        oTable.setModel(oPickModel, "pickItems");
                        console.log("[ProductionOrderContinue] pickItems model set on pickTable");
                        var oBinding = oTable.getBinding("items");
                        if (oBinding) {
                            oBinding.refresh();
                            console.log("[ProductionOrderContinue] pickTable items binding refreshed");
                        }
                    }
                    // Additional diagnostics: check rendered items vs binding contexts
                    try {
                        var aRenderedItems = oTable.getItems && oTable.getItems();
                        console.log("[ProductionOrderContinue] pickTable.getItems() -> length:", aRenderedItems && aRenderedItems.length);
                        var oItemsBinding = oTable.getBinding("items");
                        if (oItemsBinding) {
                            var iContextsCount = 0;
                            if (oItemsBinding && oItemsBinding.getContexts) {
                                try { iContextsCount = oItemsBinding.getContexts(0, 100).length; } catch (e) { iContextsCount = 0; }
                            } else if (oItemsBinding && oItemsBinding.getLength) {
                                try { iContextsCount = oItemsBinding.getLength(); } catch (e) { iContextsCount = 0; }
                            }
                            // fallback: also check the underlying model data directly
                            var iModelItemsCount = 0;
                            try {
                                var aModelItems = oPickModel && oPickModel.getProperty && oPickModel.getProperty('/items');
                                iModelItemsCount = Array.isArray(aModelItems) ? aModelItems.length : 0;
                            } catch (e) { iModelItemsCount = 0; }
                            console.log("[ProductionOrderContinue] items binding contexts/length:", iContextsCount, "model items:", iModelItemsCount);

                            if ((aRenderedItems ? aRenderedItems.length : 0) === 0 && (iContextsCount > 0 || iModelItemsCount > 0)) {
                                console.log("[ProductionOrderContinue] Binding has contexts or model items but no rendered items — attempting retries and forcing rebind if needed");
                                try { oPickModel.refresh && oPickModel.refresh(true); } catch (e) {}
                                try { oItemsBinding.refresh && oItemsBinding.refresh(); } catch (e) {}
                                try { oTable.invalidate && oTable.invalidate(); oTable.rerender && oTable.rerender(); } catch (e) {}

                                // small retry loop: try a few times (synchronously scheduling via setTimeout) to give UI5 time to process bindings
                                var iAttempts = 0;
                                var fnRetry = function() {
                                    iAttempts++;
                                    var aNowRendered = oTable.getItems && oTable.getItems();
                                    if (aNowRendered && aNowRendered.length > 0) {
                                        console.log("[ProductionOrderContinue] Items rendered after retry, attempts:", iAttempts);
                                        return;
                                    }
                                    if (iAttempts <= 3) {
                                        // try a light rebind: unbind and rebind with the existing template (or rely on fallback later)
                                        try { oTable.unbindItems(); } catch (e) {}
                                        try { oTable.bindItems({ path: "pickItems>/items", template: oTemplate || null }); } catch (e) {}
                                        setTimeout(fnRetry, 100);
                                        return;
                                    }
                                    // if still nothing after retries, continue to heavier fallback (clone/programmatic) below
                                    console.log("[ProductionOrderContinue] retries exhausted — proceeding to rebind fallbacks");
                                };
                                setTimeout(fnRetry, 100);
                                // fallback: unbind and rebind items using the XML template defined in the view
                                try {
                                    var oTemplate = this.byId("pickTableRowTemplate");
                                    if (oTemplate) {
                                        console.log("[ProductionOrderContinue] rebinding pickTable using template pickTableRowTemplate (clone)");
                                        oTable.unbindItems();
                                        var bBound = false;
                                        try {
                                            var oClonedTemplate = oTemplate.clone();
                                            oTable.bindItems({ path: "pickItems>/items", template: oClonedTemplate });
                                            bBound = true;
                                        } catch (e) {
                                            // fallback to original template if clone fails
                                            console.warn("[ProductionOrderContinue] cloning template failed, falling back to original template", e);
                                            try {
                                                oTable.bindItems({ path: "pickItems>/items", template: oTemplate });
                                                bBound = true;
                                            } catch (e2) {
                                                console.warn("[ProductionOrderContinue] binding with original template failed:", e2);
                                            }
                                        }

                                        // If template binding didn't work, try a programmatic ColumnListItem template as final fallback
                                        if (!bBound) {
                                            try {
                                                var ColumnListItem = sap.m.ColumnListItem;
                                                if (!ColumnListItem) { console.warn("[ProductionOrderContinue] sap.m.ColumnListItem not available"); }
                                                var oProgTemplate = new ColumnListItem({
                                                    cells: [
                                                        new sap.m.CheckBox({ selected: "{pickItems>selected}" }),
                                                        new sap.m.Text({ text: "{pickItems>VORNR}" }),
                                                        new sap.m.Text({ text: "{pickItems>MATNR}" }),
                                                        new sap.m.Text({ text: "{pickItems>MAKTX}" }),
                                                        new sap.m.Text({ text: "{pickItems>CY_SEQNR}" }),
                                                        new sap.m.Text({ text: "{pickItems>MODEL}" }),
                                                        new sap.m.Text({ text: "{pickItems>MODEL_DESC}" }),
                                                        new sap.m.Text({ text: "{pickItems>MEINS}" }),
                                                        new sap.m.Text({ text: "{pickItems>RESERVED_QTY}" }),
                                                        new sap.m.Text({ text: "{pickItems>PICKING_QTY}" }),
                                                        new sap.m.Text({ text: "{pickItems>CHARG}" }),
                                                        new sap.m.Text({ text: "{pickItems>SERNR}" }),
                                                        new sap.m.Text({ text: "{pickItems>AUFNR}" }),
                                                        new sap.m.Text({ text: "{pickItems>AFPOS}" }),
                                                        new sap.m.Text({ text: "{pickItems>RSNUM}" }),
                                                        new sap.m.Text({ text: "{pickItems>RSPOS}" }),
                                                        new sap.m.Text({ text: "{pickItems>RSART}" }),
                                                        new sap.m.Text({ text: "{pickItems>LGPBE}" }),
                                                        new sap.m.Text({ text: "{pickItems>LABST}" }),
                                                        new sap.m.Text({ text: "{pickItems>WERKS}" }),
                                                        new sap.m.Text({ text: "{pickItems>BDTER}" })
                                                    ]
                                                });
                                                oTable.unbindItems();
                                                oTable.bindItems({ path: "pickItems>/items", template: oProgTemplate });
                                                console.log("[ProductionOrderContinue] programmatic rebind attempted (template fallback)");
                                            } catch (e3) {
                                                console.warn("[ProductionOrderContinue] programmatic rebind failed (template fallback):", e3);
                                            }
                                        }
                                    } else {
                                        console.warn("[ProductionOrderContinue] pickTableRowTemplate not found — attempting programmatic rebind");
                                        // Try programmatic template since XML template is not present
                                        try {
                                            var ColumnListItem2 = sap.m.ColumnListItem;
                                            if (!ColumnListItem2) { console.warn("[ProductionOrderContinue] sap.m.ColumnListItem not available"); }
                                            var oProgTemplate2 = new ColumnListItem2({
                                                cells: [
                                                    new sap.m.CheckBox({ selected: "{pickItems>selected}" }),
                                                    new sap.m.Text({ text: "{pickItems>VORNR}" }),
                                                    new sap.m.Text({ text: "{pickItems>MATNR}" }),
                                                    new sap.m.Text({ text: "{pickItems>MAKTX}" }),
                                                    new sap.m.Text({ text: "{pickItems>CY_SEQNR}" }),
                                                    new sap.m.Text({ text: "{pickItems>MODEL}" }),
                                                    new sap.m.Text({ text: "{pickItems>MODEL_DESC}" }),
                                                    new sap.m.Text({ text: "{pickItems>MEINS}" }),
                                                    new sap.m.Text({ text: "{pickItems>RESERVED_QTY}" }),
                                                    new sap.m.Text({ text: "{pickItems>PICKING_QTY}" }),
                                                    new sap.m.Text({ text: "{pickItems>CHARG}" }),
                                                    new sap.m.Text({ text: "{pickItems>SERNR}" }),
                                                    new sap.m.Text({ text: "{pickItems>AUFNR}" }),
                                                    new sap.m.Text({ text: "{pickItems>AFPOS}" }),
                                                    new sap.m.Text({ text: "{pickItems>RSNUM}" }),
                                                    new sap.m.Text({ text: "{pickItems>RSPOS}" }),
                                                    new sap.m.Text({ text: "{pickItems>RSART}" }),
                                                    new sap.m.Text({ text: "{pickItems>LGPBE}" }),
                                                    new sap.m.Text({ text: "{pickItems>LABST}" }),
                                                    new sap.m.Text({ text: "{pickItems>WERKS}" }),
                                                    new sap.m.Text({ text: "{pickItems>BDTER}" })
                                                ]
                                            });
                                            oTable.unbindItems();
                                            oTable.bindItems({ path: "pickItems>/items", template: oProgTemplate2 });
                                            console.log("[ProductionOrderContinue] programmatic rebind attempted (no xml template)");
                                        } catch (e4) {
                                            console.warn("[ProductionOrderContinue] programmatic rebind failed (no xml template):", e4);
                                        }
                                    }
                                } catch (e) {
                                    console.warn("[ProductionOrderContinue] rebind fallback failed:", e);
                                }
                            }
                        }
                    } catch (e) {
                        console.warn("[ProductionOrderContinue] diagnostics failed:", e);
                    }
                } else {
                    console.warn("[ProductionOrderContinue] pickTable not found by id");
                }
            } else {
                console.warn("[ProductionOrderContinue] No pickItems model found on component");
            }
        },
        onNavBack: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ProductionOrder");
        },

        /**
         * Header checkbox handler: toggle selected flag for all pick items
         */
        onSelectAll: function(oEvent) {
            var bSelected = !!oEvent.getParameter("selected");
            var oComponent = this.getOwnerComponent();
            var oPickModel = oComponent.getModel("pickItems");
            if (!oPickModel) { return; }
            try {
                var aItems = oPickModel.getProperty("/items") || [];
                aItems = aItems.map(function(it){ it.selected = bSelected; return it; });
                oPickModel.setProperty("/items", aItems);
                // also update header checkbox state explicitly (defensive)
                var oHeaderCB = this.byId("selectAllCheckBox");
                if (oHeaderCB) { oHeaderCB.setSelected(bSelected); }
            } catch (e) { console.warn("onSelectAll error", e); }
        },

        /**
         * Row checkbox handler: update model and header checkbox state
         */
        onSelectRow: function(oEvent) {
            var oSource = oEvent.getSource();
            var bSelected = !!oEvent.getParameter("selected");
            var oContext = oSource.getBindingContext("pickItems");
            if (!oContext) { return; }
            var sPath = oContext.getPath(); // /items/0
            var oComponent = this.getOwnerComponent();
            var oPickModel = oComponent.getModel("pickItems");
            if (!oPickModel) { return; }
            try {
                oPickModel.setProperty(sPath + "/selected", bSelected);
                // update header checkbox: selected only if all rows selected
                var aItems = oPickModel.getProperty("/items") || [];
                var bAll = aItems.length > 0 && aItems.every(function(it){ return !!it.selected; });
                var oHeaderCB = this.byId("selectAllCheckBox");
                if (oHeaderCB) { oHeaderCB.setSelected(bAll); }
            } catch (e) { console.warn("onSelectRow error", e); }
        },

        /**
         * Navigate to IssueItems but only with rows marked (selected === true)
         */
        onDisplayIssueItems: function() {
            var oComponent = this.getOwnerComponent();
            var oPickModel = oComponent.getModel("pickItems");
            var aItems = (oPickModel && oPickModel.getProperty && oPickModel.getProperty('/items')) || [];
            var aSelected = aItems.filter(function(it){ return !!it.selected; });
            if (!aSelected.length) { sap.m.MessageToast.show("No items selected"); return; }
            if (!oComponent.getModel("issueItems")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel({ items: aSelected }), "issueItems");
            } else {
                oComponent.getModel("issueItems").setData({ items: aSelected });
            }
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("IssueItems");
        },

        /**
         * Clear selections (clears selected flag on model and unchecks header checkbox)
         */
        onClearSelection: function() {
            var oComponent = this.getOwnerComponent();
            var oPickModel = oComponent.getModel("pickItems");
            if (oPickModel) {
                try {
                    var aItems = oPickModel.getProperty('/items') || [];
                    aItems = aItems.map(function(it){ it.selected = false; return it; });
                    oPickModel.setProperty('/items', aItems);
                } catch (e) { console.warn("onClearSelection model update failed", e); }
            }
            var oHeaderCB = this.byId("selectAllCheckBox");
            if (oHeaderCB) { oHeaderCB.setSelected(false); }
            sap.m.MessageToast.show("Selection cleared");
        },

        /**
         * Sort handler for table columns
         */
        onSort: function(oEvent) {
            var sPath = oEvent.getParameter("column").getSortProperty();
            var bDescending = oEvent.getParameter("sortOrder") === "Descending";
            var oTable = this.byId("pickTable");
            var oBinding = oTable.getBinding("items");
            var oSorter = new sap.ui.model.Sorter(sPath, bDescending);
            oBinding.sort(oSorter);
        }
    });
});

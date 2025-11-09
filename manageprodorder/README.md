## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Tue Sep 16 2025 14:55:47 GMT+0530 (India Standard Time)|
|**App Generator**<br>SAP Fiori Application Generator|
|**App Generator Version**<br>1.18.7|
|**Generation Platform**<br>Visual Studio Code|
|**Template Used**<br>Basic|
|**Service Type**<br>None|
|**Service URL**<br>N/A|
|**Module Name**<br>manageprodorder|
|**Application Title**<br>Manage Production Order|
|**Namespace**<br>com.merkavim.ewm|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.120.25|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

## manageprodorder

An SAP Fiori application.

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  To launch the generated application, run the following from the generated application root folder:

```
    npm start
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)


## Responsive behavior: tables vs mobile cards

This app adapts table-based views for phones by rendering data as mobile-friendly cards while keeping full tables for tablets/desktop.

Key pieces:

- Global device model: set in `Component.js` using `models.createDeviceModel()`.
    - `webapp/model/models.js` exposes shortcut flags on the device model: `device>/isPhone`, `device>/isTablet`, `device>/isDesktop`.
- Base controller: `webapp/controller/BaseController.js` centralizes responsive helpers:
    - `isPhone()` – returns `true` on phones using `sap/ui/Device`.
    - `toggleMobileDesktop({ mobile, desktop })` – shows/hides a pair of controls (e.g., mobile card container vs table) based on device.
- Views use simple visibility bindings to the device model:
    - Cards container: `visible="{= ${device>/isPhone} }"`
    - Table container: `visible="{= ${device>/isPhone} !== true }"`

Updated views with mobile cards:

- `webapp/view/ProductionOrderContinue.view.xml` (already responsive)
- `webapp/view/IssueItems.view.xml`
- `webapp/view/IssueInternalOrderItems.view.xml`
- `webapp/view/DocumentCreated.view.xml`

Controllers updated to use `BaseController` and ensure initial toggle and respond to media changes:

- `webapp/controller/ProductionOrderContinue.controller.js`
- `webapp/controller/IssueItems.controller.js`
- `webapp/controller/IssueInternalOrderItems.controller.js`

Notes:

- If your project sets `flexEnabled` in the manifest, controls inside fragments/lists should have unique `id`s.
- Prefer binding-based visibility for simplicity; the controller helper is used to guarantee initial state and react to device size changes during runtime.

### Extending the pattern to new views

1) Add a mobile cards block next to your table in the XML view:

```
<VBox id="myMobileCards" visible="{= ${device>/isPhone} }">
    <List items="{myModel>/items}">
        <items>
            <CustomListItem id="myCardItem">
                <VBox id="myCardVBox">
                    <Text id="myCardField1" text="{myModel>Field1}"/>
                    <Text id="myCardField2" text="{myModel>Field2}"/>
                </VBox>
            </CustomListItem>
        </items>
    </List>
    </VBox>

<!-- Wrap your table so it can be hidden on phones -->
<VBox id="myTableContainer" visible="{= ${device>/isPhone} !== true }">
    <Table id="myTable" items="{myModel>/items}"> ... </Table>
</VBox>
```

2) In the controller, extend `BaseController` and toggle once on init (optional but recommended):

```
this.toggleMobileDesktop({ mobile: "myMobileCards", desktop: "myTableContainer" });
```

3) If your view must react to live resizes (rotation), attach a handler:

```
var that = this;
sap.ui.Device.media.attachHandler(function(){
    that.toggleMobileDesktop({ mobile: "myMobileCards", desktop: "myTableContainer" });
});
```

That’s it—cards on phones, tables elsewhere, with a single global source of truth for device info.



sap.ui.define([], function() {
    "use strict";
    return {
        /**
         * Converts yyyy-mm-dd to dd/mm/yyyy
         * @param {string} sDate - Date string in yyyy-mm-dd format
         * @returns {string} Date string in dd/mm/yyyy format
         */
        bdterToDDMMYYYY: function(sDate) {
            if (!sDate) return "";
            var parts = sDate.split("-");
            if (parts.length !== 3) return sDate;
            return parts[2] + "/" + parts[1] + "/" + parts[0];
        }
    };
});

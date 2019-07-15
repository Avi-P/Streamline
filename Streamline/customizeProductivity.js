
/**
 * Waits for the window to load completely
 */
window.onload = function() {

    (function () {

        'use strict';

    })();

    const prod = document.getElementById("prod");         // the button labeled "Productive Websites"
    const unprod = document.getElementById("unprod");     // the button labeled "Unproductive Websites"

    /*
     * Displays the list of productive websites when the corresponding button is clicked
     */
    prod.onclick = function () {

        displayList("prod");

    };

    /*
     * Displays the list of unproductive websites when the corresponding button is clicked
     */
    unprod.onclick = function () {

        displayList("unprod");

    };

    const saveProd = document.getElementById("saveProd");     // the button labeled "Save" under the productive text field
    const saveUnprod = document.getElementById("saveUnprod"); // the button labeled "Save" under the unproductive text field

    /*
     * Saves the entered websites to the list of productive websites as well as straight to chrome.storage
     */
    saveProd.onclick = function () {

        saveToList("prod");

    };

    /*
     * Saves the entered websites to the list of unproductive websites as well as straight to chrome.storage
     */
    saveUnprod.onclick = function () {

        saveToList("unprod");

    };

    const deleteProd = document.getElementById("deleteProd");
    const deleteUnprod = document.getElementById("deleteUnprod");

    /**
     * Deletes productive websites from the list and resets them
     */
    deleteProd.onclick = function () {

        deleteFromList("prod");

    };

    /**
     * Deletes unproductive websites from the list and resets them
     */
    deleteUnprod.onclick = function () {

        deleteFromList("unprod");

    };

    const clearAll = document.getElementById("clear");

    /**
     * Clears chrome.storage
     */
    clearAll.onclick = function () {

        clear("Storage cleared");

    };

};


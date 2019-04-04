var oldTime = "";    // will be used for getting time stamps
var newTime = "";

var prevDomain;
var domain = "";

const prodInitializer = {   // initializes the data to be stored for each productive domain name

    timeSpent: 0,
    type: "productive"

};

const unprodInitializer = { // initializes the data to be stored for each unproductive domain name

    timeLimit: 900,
    timeSpent: 0,
    type: "unproductive"

};

const storage = chrome.storage.local;   // local storage using Chrome's Storage API


/**
 * Returns the domain name given a url
 *
 * @param url - url to retrieve the domain name from
 * @returns {string} - the domain name
 */
function getDomain(url) {

    let hostname, domain;       // initializes the hostname and domain name variables

    if (url.indexOf("//") > -1) {   // separates http(s):// from the domain name
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    if (hostname.indexOf("www") > -1) { // separates the domain name from the rest of the url
        domain = hostname.split(".")[1];
    } else {
        domain = hostname.split(".")[0];
    }

    return domain;

}

/**
 * Creates a notification in Chrome
 *
 * @param domain - the domain of the website opened
 */
function createNotif(domain) {

    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Website Opened",
        message: domain
    };

    chrome.notifications.create("notif", notifOptions);

}

/**
 * Gets the time elapsed
 *
 * @param domain
 */
function timeElapsed(domain) {

    if (domain !== "") {
        if (oldTime !== "") {

            newTime = Date.now();

            let timeElapsed = newTime - oldTime;

            console.log(domain + ": " + timeElapsed);

            updateTimeSpent(domain, timeElapsed);

            oldTime = newTime;
            newTime = "";

        } else {

            oldTime = Date.now();

        }
    }

}

/**
 * Function to update the time spent on a domain.
 * NOTE: Not even close to finished. Need to figure out how to access the object fields in the async chain.
 *
 * @param domain - the domain
 * @param timeElapsed - the amount of time elapsed
 */
function updateTimeSpent(domain, timeElapsed) {

    storage.get([domain], function (result) {

        if (result) {

            result.timeSpent = result.timeSpent + timeElapsed;

            storage.set({domain: {type: "productive", timeSpent: timeElapsed}}, function () {

                storage.get([domain], function (r) {

                    console.log(domain, r);

                })

            })

        }

    })

}

/**
 * Displays an array for debugging purposes
 *
 * @param array - array to display
 * @returns {string} - the array in displayable format
 */
function displayArray(array) {

    var disp = "";

    for (var i = 0; i < array.length - 1; i++) {
        disp += array[i][0] + "\n";
    }

    disp += array[array.length - 1][0];

    return disp;
}

/**
 * Waits for the window to load completely
 */
window.onload = function() {

    (function () {
        'use strict';

        /*if (!('indexedDB' in window)) {
            alert('This browser doesn\'t support IndexedDB');
            return;
        }*/

    })();

    var prod = document.getElementById("prod");         // the button labeled "Productive Websites"
    var unprod = document.getElementById("unprod");     // the button labeled "Unproductive Websites"

    /*
     * Displays the list of productive websites when the corresponding button is clicked
     */
    prod.onclick = function () {

        storage.get({["productiveList"]: []}, function (result) {   /* gets the productive list and sets a default value in case
                                                                       the key does not have an associated value */
            alert(result.productiveList)

        });

    };

    /*
     * Displays the list of unproductive websites when the corresponding button is clicked
     */
    unprod.onclick = function () {

        storage.get({["unproductiveList"]: []}, function (result) { /* gets the unproductive list and sets a default value in case
                                                                       the key does not have an associated value */
            alert(result.unproductiveList)

        });

    };

    var saveProd = document.getElementById("saveProd");     // the button labeled "Save" under the productive text field
    var saveUnprod = document.getElementById("saveUnprod"); // the button labeled "Save" under the unproductive text field

    /*
     * Saves the entered websites to the list of productive websites as well as straight to chrome.storage
     */
    saveProd.onclick = function () {

        let productive = document.getElementById("productiveWebsites").value.split(",");    // get all websites

        let productives = [];   // initialize an array
        let productives2 = [];

        for (var i = 0; i < productive.length; i++) {       // populate both arrays

            productives.push(getDomain(productive[i]));
            productives2.push(getDomain(productive[i]));

        }

        storage.get({["productiveList"]: []}, function (result) {   // open the productive website list and sets default value if necessary

            var productiveList = result.productiveList;             // array to store the new domain names

            for (i = 0; i < productive.length; i++) {

                productiveList.push(productives.pop());             // adds the new domain names

            }

            storage.set({["productiveList"]: productiveList}, function () { // updates the list of productive websites

                storage.get("productiveList", function (result) {           // gets the list of productive websites for debugging purposes

                    alert(result.productiveList)

                });

            });

        });

        for (i = 0; i < productives2.length; i++) {                         // adds each new domain name to storage

            storage.set({[productives2[i]] : prodInitializer}, function () {

                storage.get( productives2[i] , function (result) {

                    console.log(productives2[i],result)

                });

            });

        }

        document.getElementById("productiveWebsites").value = "";   // resets the text field for productive websites

    };

    /*
     * Saves the entered websites to the list of unproductive websites as well as straight to chrome.storage
     */
    saveUnprod.onclick = function () {

        var unproductive = document.getElementById("unproductiveWebsites").value.split(",");    // get all websites

        var unproductives = [];             // initialize array
        var unproductives2 = [];

        for (var i = 0; i < unproductive.length; i++) {     // populate both arrays

            unproductives.push(getDomain(unproductive[i]));
            unproductives2.push(getDomain(unproductive[i]))

        }

        storage.get({["unproductiveList"]: []}, function (result) { // open the unproductive website list and sets default value if necessary

            var unproductiveList = result.unproductiveList;         // array to store the new domain names

            for (i = 0; i < unproductive.length; i++) {

                unproductiveList.push(unproductives.pop());       // adds the new domain names

            }

            storage.set({["unproductiveList"]: unproductiveList}, function () { // updates the list of unproductive websites

                storage.get("unproductiveList", function (result) {             // gets the list of unproductive websites for debugging purposes

                    alert(result.unproductiveList)

                });
            });

        });

        for (i = 0; i < unproductives2.length; i++) {                           // adds each new domain name to storage

            storage.set({[unproductives2[i]] : unprodInitializer}, function () {

                storage.get( unproductives2[i] , function (result) {

                    console.log(unproductives2[i],result)

                });

            });

        }

        document.getElementById("unproductiveWebsites").value = "";     // resets the text field for unproductive websites

    };

    var deleteProd = document.getElementById("deleteProd");
    var deleteUnprod = document.getElementById("deleteUnprod");

    /**
     * Have not done anything useful here yet, only useful for clearing storage in order to debug
     */
    deleteProd.onclick = function () {

        var productive = document.getElementById("unproductiveWebsites").value.split(",");

        var productives = [];

        for (var i = 0; i < productive.length; i++) {
            productives.push(getDomain(productive[i]));
        }

        storage.clear(function () {

            console.log("Storage cleared");

        });

        document.getElementById("productiveWebsites").value = "";

        oldTime = new Date();

    };

    /**
     * Nothing useful here either because it will be only used for debugging for now
     */
    deleteUnprod.onclick = function () {

        var unproductive = document.getElementById("unproductiveWebsites").value.split(",");

        var unproductives = [];

        for (var i = 0; i < unproductive.length; i++) {
            unproductives.push(getDomain(unproductive[i]));
        }

        chrome.storage.local.get( "woof" , function (result) {

            let int = result[1];
            alert(typeof int)
            int = int + 1;

            let array = [
                "productive",
                int
            ];

            chrome.storage.local.set({["woof"] : array}, function () {

                chrome.storage.local.get( "woof" , function(result) {

                    console.log(result[1]);

                })

            });

        });

        document.getElementById("unproductiveWebsites").value = "";

    };

};

/**
 * When new tab is opened, the domain is displayed in notifications
 */
chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tab) {              // displays the domain of this website

        var url = tab[0].url;

        prevDomain = domain;

        domain = getDomain(url);

        createNotif(domain);

        timeElapsed(prevDomain);

    });

});

/**
 * When the website changes, the new website is displayed
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    var url = tab.url;

    prevDomain = domain;

    console.log(prevDomain);            // debugging purposes...displays the previous domain name

    domain = getDomain(url);

    createNotif(domain);

    timeElapsed(prevDomain);


});



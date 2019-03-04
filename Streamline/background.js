var oldTime;
var newTime;

var idb = window.indexedDB;

function getDomain(url) {

    var hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    var domain;

    if (hostname.indexOf("www") > -1) {
        domain = hostname.split(".")[1];
    } else {
        domain = hostname.split(".")[0];
    }

    return domain;

}

function createNotif(domain) {

    var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Website Opened",
        message: domain
    };

    chrome.notifications.create('notif', notifOptions);

}

function displayArray(array) {

    var disp = "";

    for (var i = 0; i < array.length - 1; i++) {
        disp += array[i][0] + "\n";
    }

    disp += array[array.length - 1][0];

    return disp;
}

window.onload = function() {

    (function() {
        'use strict';

        //check for support
        if (!('indexedDB' in window)) {
            alert('This browser doesn\'t support IndexedDB');
            return;
        }

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB error: " + event.target.errCode)
        };

        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains("domainNames")) {
                var objectStore = db.createObjectStore("domainNames", {keyPath: "domainName"});
                objectStore.createIndex("type", "type", { unique: false });
                objectStore.createIndex("timeSpent", "timeSpent", { unique: false });
                objectStore.createIndex("timeLimit", "timeLimit", { unique: false });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            db.onversionchange = function(event) {
                console.log('The version of this database has changed');
            };

        };

    })();

    //localStorage.setItem("productiveList", JSON.stringify(document.getElementById("prodWebsites").value));
    //localStorage.setItem("unproductiveList", JSON.stringify(document.getElementById("unprodWebsites").value));

    var prod = document.getElementById("prod");

    prod.onclick = function () {

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainNames', 'readonly');
            var store = tx.objectStore('domainNames');
            var index = store.index("type");
            index.get("productive").onsuccess = function(event) {
                alert(event.target.result.domainName)
            };
            return tx.complete;

        };

        //var prodList = JSON.parse(localStorage.getItem("productiveList"));

        //alert(prodList);

        // by passing an object you can define default values e.g.: []
        //chrome.storage.local.get(["productiveList"], function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
          //  var productiveList = result.productiveList;
            //productiveList.push({["productiveList"]: productiveList, HasBeenUploadedYet: false});
            // set the new array value to the same key
            //chrome.storage.local.set({["productiveList"]: productiveList}, function () {
                // you can use strings instead of objects
                // if you don't  want to define default values
              //  chrome.storage.local.get('productiveList', function (result) {
                    //alert(result.productiveList)
                //});
            //});
        //});

        //chrome.storage.local.get(["productiveList"], callback);

        //var productiveList = [];
        //function callback(result) {
        //    productiveList = result.productiveList;
        //}

        //alert("Productive List:\n" + displayArray(prodList));
        //alert("Productive List:\n" + productiveList.join("\n"));
    };

    var unprod = document.getElementById("unprod");
    unprod.onclick = function () {

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainName', 'readonly');
            var store = tx.objectStore('domainName');
            var index = store.index("type");
            index.get("unproductive").onsuccess = function (event) {
                alert(event.target.result.domainName)
            };
            return tx.complete;
        };
    };

    var saveProd = document.getElementById("saveProd");
    var saveUnprod = document.getElementById("saveUnprod");

    saveProd.onclick = function () {

        //var productiveList = [];

        var productive = document.getElementById("productiveWebsites").value.split(",");

        var productives = {};

        for (var i = 0; i < productive.length; i++) {
            productives.push(getDomain(productive[i]));
        }

        i = 0;

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainName', 'readonly');
            var store = tx.objectStore('domainName');
            for (; i < productives.length; i++) {
                var item = {
                    domainName: productives[i],
                    type: 'productive',
                    timeSpent: 0,
                    timeLimit: 0
                };
                store.add(item);
            }
            return tx.complete;
        };

        //var dbPromise = idb.open('domains', 1, function(upgradeDb) {
        //});

        //var p = JSON.parse(localStorage.getItem("productiveList"));

        //var productiveList = p.split(",");

        //localStorage.setItem("productiveList", JSON.stringify(productiveList));

        //document.getElementById("prodWebsites").value = productiveList.join();

        //document.getElementById("productiveWebsites").value = "";

        //chrome.storage.local.get(["productiveList"], function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            //var productiveList = result.productiveList;
            //var productives = document.getElementById("productiveWebsites").value.split(",");

            //alert(productives.join());

            //productiveList.push({["productiveList"]: productiveList});

            //for (var i = 0; i < productives.length; i++) {
                //productiveList.push({["productiveList"]: productives[i], HasBeenUploadedYet: false});
                //alert(productives[i].toString());
              //  productiveList.push({["productiveList"]: productives[i]});
            //}
            // set the new array value to the same key
            //chrome.storage.local.set({["productiveList"]: productiveList}, function () {
                // you can use strings instead of objects
                // if you don't  want to define default values

              //  chrome.storage.local.get(["productiveList"], function(result) {
                  //  alert(result.productiveList.join("\n"));
                //});

           // })
        //});

        //chrome.storage.local.get("productiveList", callback);

        //function callback(result) {
        //    productiveList = result.productiveList;
        //}

        //var productives = document.getElementById("productiveWebsites").value.split(",");

        //for (var i = 0; i < productives.length; i++) {
        //    productiveList.push([getDomain(productives[i]), 0, 0]);
        //}

        //chrome.storage.local.set({["productiveList"]: productiveList}, function ()  {
        //    chrome.storage.local.get(["productiveList"], function (result) {
        //        alert(result.productiveList.join());
         //   })
        //});

    };

    saveUnprod.onclick = function () {

        var unproductive = document.getElementById("productiveWebsites").value.split(",");

        var unproductives = {};

        for (var i = 0; i < unproductive.length; i++) {
            unproductives.push(getDomain(productive[i]));
        }

        i = 0;

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainName', 'readonly');
            var store = tx.objectStore('domainName');
            for (; i < unproductives.length; i++) {
                var item = {
                    domainName: unproductives[i],
                    type: 'unproductive',
                    timeSpent: 0,
                    timeLimit: 0
                };
                store.add(item);
            }
            return tx.complete;
        };

        document.getElementById("unproductiveWebsites").value = "";

    };
    
    var deleteProd = document.getElementById("deleteProd");
    var deleteUnprod = document.getElementById("deleteUnprod");
    
    deleteProd.onclick = function () {

        var productive = document.getElementById("unproductiveWebsites").value.split(",");

        var productives = {};

        for (var i = 0; i < productive.length; i++) {
            productives.push(getDomain(productive[i]));
        }

        i = 0;

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainName', 'readonly');
            var store = tx.objectStore('domainName');
            for (; i < productives.length; i++) {
                store.delete(productives[i]);
            }
            return tx.complete;
        };

        document.getElementById("productiveWebsites").value = "";

    };



    deleteUnprod.onclick = function () {
        //Delete the unproductive websites
        var unproductive = document.getElementById("unproductiveWebsites").value.split(",");

        var unproductives = {};

        for (var i = 0; i < unproductive.length; i++) {
            unproductives.push(getDomain(unproductive[i]));
        }

        i = 0;

        var request = idb.open('domains', 1);
        request.onerror = function (event) {
            alert("DB could not open!")
        };
        request.onsuccess = function (event) {
            var db = event.target.result;
            var tx = db.transaction('domainName', 'readonly');
            var store = tx.objectStore('domainName');
            for (; i < unproductives.length; i++) {
                store.delete(unproductives[i]);
            }
            return tx.complete;
        };

        document.getElementById("unproductiveWebsites").value = "";

    }


};

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tab) {
        //var URL = tab[0].url;
        //var array = URL.split(".");
        var url = tab[0].url;

        var domain = getDomain(url);

        createNotif(domain);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = tab.url;

    var domain = getDomain(url);

    createNotif(domain);
});



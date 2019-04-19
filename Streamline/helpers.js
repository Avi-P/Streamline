var oldTime;    // will be used for getting time stamps
var newTime;

var prevDomain;
var domain;

const initializer = 0;   // initializes the time to be stored for each domain name

const timeLimit = 9000;     // time limit for unproductive websites

const storage = chrome.storage.local;   // local storage using Chrome's Storage API

const tabs = chrome.tabs;


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

    let notifOptions = {
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

    domain = domain.toString();

    storage.get({["unproductiveList"]: []}, function (result) {

        if (result.unproductiveList.includes(domain)) {

            storage.get(domain, function (result) {

                if (result !== {}) {

                    storage.set({
                        [domain]: (result[domain] + timeElapsed)
                    }, function () {

                        storage.get(domain, function (r) {

                            console.log(domain, r[domain], r[domain] > timeLimit);
                        });

                    })

                } else {

                    console.log(console.error("Nothing updated..."))

                }

            })

        } else {

            storage.get({["productiveList"]: []}, function (result) {

                if (result.productiveList.indexOf(domain.toString()) >= 0) {

                    storage.get(domain, function (result) {

                        if (result !== {}) {

                            storage.set({
                                [domain]: (result[domain] + timeElapsed)
                            }, function () {

                                storage.get(domain, function (r) {

                                    console.log(domain, r);
                                })

                            })

                        } else {
                            console.log(console.error("Nothing updated..."))
                        }

                    })

                } else {
                    console.log(console.error("Domain not in the productive list"))
                }

            });
        }

    });

}

/**
 * Removes an element from a given list
 *
 * @param list - the list from which the element will be remove
 * @param element - the element to remove
 * @returns a list without the element
 */
function removeElement(list, element) {

    let ind = list.indexOf(element.toString());             // index of the element

    if (ind !== -1) {                                       // checks if element does not exist

        list.splice(ind, 1);                                // removes the element from the list given its index

    }

    return list                                             // returns the updated list

}


/**
 * Displays an array for debugging purposes
 *
 * @param array - array to display
 * @returns {string} - the array in displayable format
 */
function displayArray(array) {

    let disp = "";

    for (let i = 0; i < array.length; i++) {

        disp += array[i][0] + ", " + array[i][1] + " milliseconds" + "\n";

    }

    return disp;
}


/**
 * Displays the unproductive or productive domains
 *
 * @param type - whether the list if productive or unproductive
 */
function displayList(type) {

    let name;

    if (type === "prod") {

        name = "productiveList";

    } else {

        name = "unproductiveList";

    }

    storage.get({[name]: []}, function (result) {   /* gets the productive list and sets a default value in case
                                                                       the key does not have an associated value */
        alert(result[name.toString()]);

    });

}

function saveToList(type) {

    let list, textField;

    if (type === "prod") {

        list = "productiveList";
        textField = "productiveWebsites";

    } else {

        list = "unproductiveList";
        textField = "unproductiveWebsites";

    }

    let urls = document.getElementById(textField.toString()).value.split(",");    // get all websites

    let domains = [];   // initialize an array

    let dom, theList;

    storage.get({[list]: []}, function (result) {   // open the productive website list and sets default value if necessary

        theList = result[list.toString()];             // array to store the new domain names

        for (let i = 0; i < urls.length; i++) {       // populate both arrays

            dom = getDomain(urls[i]);

            if (theList.indexOf(dom) === -1 && domains.indexOf(dom) === -1) {

                domains.push(dom);

            }

        }

        for (let i = 0; i < domains.length; i++) {

            theList.push(domains[i]);             // adds the new domain names

            storage.set({[domains[i]] : initializer}, function () {

                storage.get(domains[i] , function (result) {

                    console.log(domains[i], result)

                });

            });

        }

        storage.set({[list]: theList});

    });

    document.getElementById(textField.toString()).value = "";   // resets the text field for productive websites

}

function deleteFromList(type) {

    let list, textField;

    if (type === "prod") {

        list = "productiveList";
        textField = "productiveWebsites";

    } else {

        list = "unproductiveList";
        textField = "unproductiveWebsites";

    }

    let urls = document.getElementById(textField.toString()).value.split(",");    // get all websites

    let domains = [];

    let dom, theList;

    for (let i = 0; i < urls.length; i++) {

        dom = getDomain(urls[i]);

        domains.push(dom);

    }

    let domain;

    storage.get({[list]: []}, function (result) {

        while (domains.length !== 0) {

            domain = domains.pop();

            while (result[list.toString()].indexOf(domain) !== -1) {

                theList = removeElement(result[list.toString()], domain.toString());

            }

            storage.set({[list]: theList});

            storage.remove([domain.toString()]);

        }

    });

    document.getElementById(textField).value = "";

}
function clear(type) {

    storage.clear(function () {

        console.log("Storage cleared");

    });

    oldTime = Date.now();

}
var oldTime;    // will be used for getting time stamps
var newTime;

var prevDomain;     // both domain values will be used to update time spent
var domain;

const initializer = 0;   // initializes the time to be stored for each domain name

const timeLimit = 9000;     // time limit for unproductive websites

const storage = chrome.storage.local;   // local storage using Chrome's Storage API

const tabs = chrome.tabs;   // chrome tabs


/**
 * Returns the domain name given a url
 *
 * @param url - url to retrieve the domain name from
 * @returns {string} - the domain name
 */
function getDomain(url) {

    let hostname, domain;                       // initializes the hostname and domain name variables

    if (url.indexOf("//") > -1) {               // separates http(s):// from the domain name
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    if (hostname.indexOf("www") > -1) {         // separates the domain name from the rest of the url
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
 * @param domain - the domain to upate the time spent on
 */
function timeElapsed(domain) {

    if (domain !== "") {                                // makes sure domain is not an empty string

        if (oldTime !== "") {                           // makes sure an old time exists

            newTime = Date.now();                       // sets the new time

            let timeElapsed = newTime - oldTime;        // time elapsed

            console.log(domain + ": " + timeElapsed);

            updateTimeSpent(domain, timeElapsed);       // updates the time spent

            oldTime = newTime;                          // sets the old time

            newTime = "";                               // resets the new time

        } else {

            oldTime = Date.now();                       // initializes the old time

        }
    }

}

/**
 * Function to update the time spent on a domain.
 *
 * @param domain - the domain
 * @param timeElapsed - the amount of time elapsed
 */
function updateTimeSpent(domain, timeElapsed) {

    domain = domain.toString();                         // allows chrome storage to access the domain

    storage.get({["unproductiveList"]: []}, function (result) { // get the unproductive list

        if (result.unproductiveList.includes(domain)) {         // check if the domain already exists in the list

            storage.get(domain, function (result) {             // get the stored domain from chrome storage

                if (result !== {}) {                            // makes sure the result is not the default value

                    storage.set({                               // rests the time spent on the domain
                        [domain]: (result[domain] + timeElapsed)
                    }, function () {

                        storage.get(domain, function (r) {

                            console.log(domain, r[domain], r[domain] > timeLimit);  // debugging
                        });

                    })

                } else {

                    console.log(console.error("Nothing updated..."))        // nothing has been updated...

                }

            })

        } else {

            storage.get({["productiveList"]: []}, function (result) {       // get the list of productive domains

                if (result.productiveList.indexOf(domain.toString()) >= 0) {    // checks if the domain exists

                    storage.get(domain, function (result) {                     // gets the time spent in the domain

                        if (result !== {}) {                                    // checks if the result is the default value

                            storage.set({                                       // resets the time spent on the domain
                                [domain]: (result[domain] + timeElapsed)
                            }, function () {

                                storage.get(domain, function (r) {

                                    console.log(domain, r);
                                })

                            })

                        } else {
                            console.log(console.error("Nothing updated..."))        // nothing has been updated...
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
 * @param list - the list from which the element will be removed
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

    let disp = "";                                          // the array to display

    if (array[0].indexOf("No ") !== -1) {                   // checks if the message that no website has been added was passed

        return array + "\n";                                // return the message

    }

    for (let i = 0; i < array.length; i++) {

        disp += array[i][0] + ": " + array[i][1] + " milliseconds" + "\n";      // add the time spent in each domain

    }

    return disp;                                            // return the domains with the time spent
}


/**
 * Displays the unproductive or productive domains
 *
 * @param type - whether the list if productive or unproductive
 */
function displayList(type) {

    let name;                                               // displays the list of productive websites

    if (type === "prod") {                                  // checks if productive list needs to be displayed

        name = "productiveList";                            // sets name

    } else {

        name = "unproductiveList";                          // sets name

    }

    storage.get({[name]: []}, function (result) {   /* gets the productive list and sets a default value in case
                                                                       the key does not have an associated value */
        alert(result[name.toString()]);                     // displays the list

    });

}

/**
 * Saves a domain to the given list
 *
 * @param type - productive or unproductive list
 */
function saveToList(type) {

    let list, textField;                            // list and the text field where the urls are entered

    if (type === "prod") {                          // checks if user wants to add to the productive list

        list = "productiveList";                    // sets list
        textField = "productiveWebsites";           // sets the textField

    } else {

        list = "unproductiveList";                  //sets list
        textField = "unproductiveWebsites";         // sets the textField

    }

    let urls = document.getElementById(textField.toString()).value.split(",");    // get all websites

    let domains = [];                               // initialize an array to store the domain names

    let dom, theList;

    storage.get({[list]: []}, function (result) {   // open the productive website list and sets default value if necessary

        theList = result[list.toString()];             // array to store the new domain names

        for (let i = 0; i < urls.length; i++) {       // populate both arrays

            dom = getDomain(urls[i]);                   // gets the domains

            if (theList.indexOf(dom) === -1 && domains.indexOf(dom) === -1) {   // makes sure the domain name has not already been saved

                domains.push(dom);                          // add the current domain

            }

        }

        for (let i = 0; i < domains.length; i++) {

            theList.push(domains[i]);             // adds the new domain names

            storage.set({[domains[i]] : initializer}, function () { // sets the domains

                storage.get(domains[i] , function (result) {

                    console.log(domains[i], result)

                });

            });

        }

        storage.set({[list]: theList});             // sets the new list

    });

    document.getElementById(textField.toString()).value = "";   // resets the text field

}

/**
 * Deletes domains from the lists
 *
 * @param type - productive or unproductive
 */
function deleteFromList(type) {

    let list, textField;                                 // list and the text field where the urls are entered

    if (type === "prod") {                              // checks if user wants to delete from the productive list

        list = "productiveList";                        //sets list
        textField = "productiveWebsites";               // sets textField

    } else {

        list = "unproductiveList";                      // sets list
        textField = "unproductiveWebsites";             // sets textField

    }

    let urls = document.getElementById(textField.toString()).value.split(",");    // get all websites

    let domains = [];

    let dom, theList, domain;

    for (let i = 0; i < urls.length; i++) {

        dom = getDomain(urls[i]);                       // gets the domain of each url

        domains.push(dom);                              // creates a list of domains

    }

    storage.get({[list]: []}, function (result) {       // gets the list given the type

        while (domains.length !== 0) {                  // checks if the domain list is empty

            domain = domains.pop();                     // gets the domain

            while (result[list.toString()].indexOf(domain) !== -1) {    // deletes all duplicates

                theList = removeElement(result[list.toString()], domain.toString());    // remove the element

            }

            storage.set({[list]: theList});                     // reset the list value

            storage.remove([domain.toString()]);                // remove the domain from chrome storage

        }

    });

    document.getElementById(textField).value = "";              // clear the text field

}

/**
 * Clears chrome storage
 */
function clear(message) {

    storage.clear(function () {                                 // clear storage

        console.log(message);
        alert(message);

    });

    oldTime = Date.now();                                       // reset the old time

}
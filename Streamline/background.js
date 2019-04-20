
/**
 * When new tab is opened, the domain is displayed in notifications
 */
tabs.onActivated.addListener(({tabId, windowId}) => {
    tabs.query({
        active: true,
        currentWindow: true
    }, function(tab) {              // displays the domain of this website

        let url = tab[0].url;       // url

        prevDomain = domain;        // previous domain

        domain = getDomain(url);    // get the current domain

        createNotif(domain);        // create a chrome notification

        timeElapsed(prevDomain);    // get the time elapsed and update the value

    });

});

/**
 * When the website changes, the new website is displayed
 */
tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    let url = tab.url;              // url

    prevDomain = domain;            // previous domain

    domain = getDomain(url);        // get the current domain

    createNotif(domain);            // create a chrome notification

    timeElapsed(prevDomain);        // get the time elapsed and update the value

});



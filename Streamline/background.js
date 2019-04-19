
/**
 * When new tab is opened, the domain is displayed in notifications
 */
tabs.onActivated.addListener(({tabId, windowId}) => {
    tabs.query({
        active: true,
        currentWindow: true
    }, function(tab) {              // displays the domain of this website

        let url = tab[0].url;

        prevDomain = domain;

        domain = getDomain(url);

        createNotif(domain);

        timeElapsed(prevDomain);

    });

});

/**
 * When the website changes, the new website is displayed
 */
tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    let url = tab.url;

    prevDomain = domain;

    domain = getDomain(url);

    createNotif(domain);

    timeElapsed(prevDomain);


});



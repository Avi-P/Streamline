var oldTime;
var newTime;

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function(tab) {
        //var URL = tab[0].url;
        //var array = URL.split(".");

        var url = tab[0].url;
        
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

        var notifOptions = {
                type: "basic",
                iconUrl: "icon48.png",
                title: "Website Opened",
                message: domain
        };
        
        chrome.notifications.create('notif', notifOptions);
    });
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = tab.url;
        
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

    var notifOptions = {
            type: "basic",
            iconUrl: "icon48.png",
            title: "Website Changed",
            message: domain
    };
        
    
    chrome.notifications.create('notif', notifOptions);
})
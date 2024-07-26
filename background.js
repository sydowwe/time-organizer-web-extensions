let activeTabId = null;
let tabFocusTimes = {};
let tabFocusStart = null;
let lastRemovedTableId = -1;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const previousTabId = activeTabId;
    activeTabId = activeInfo.tabId;
    const now = new Date().getTime();
    if (previousTabId !== null && tabFocusStart !== null) {
        const focusDuration = now - tabFocusStart;
        if (!tabFocusTimes[previousTabId]) {
            tabFocusTimes[previousTabId] = 0;
        }
        tabFocusTimes[previousTabId] += focusDuration / 1000;
    }
    tabFocusStart = now;
    if (lastRemovedTableId !== -1) {
        //delete tabFocusTimes[lastRemovedTableId];
        lastRemovedTableId = -1;
    }
    console.log(tabFocusTimes);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId in tabFocusTimes) {
        lastRemovedTableId = tabId;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabFocusTimes") {
        sendResponse(tabFocusTimes);
    }
});

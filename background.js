// chrome.cookies.onChanged.addListener(function(info) {
//   console.log("onChanged info: " + JSON.stringify(info));
// });

const googleCookies = [
  { domain: ".google.com", isRemoved: true, name: "SID" },
  { domain: ".google.com", isRemoved: true, name: "HSID" },
  { domain: ".google.com", isRemoved: true, name: "SSID" },
  { domain: ".google.com", isRemoved: true, name: "APISID" },
  { domain: ".google.com", isRemoved: true, name: "SAPISID" },
  { domain: ".google.com", isRemoved: true, name: "SIDCC" },
  { domain: ".google.com", isRemoved: false, name: "1P_JAR" },
  { domain: ".google.com", isRemoved: false, name: "NID" }
];

function clearCookie() {
  chrome.cookies.getAll({
    url: 'https://google.com'
  }, function(cookies) {
    if (!cookies.forEach) {
      //console.log('!cookies');
      return;
    }
    cookies.forEach(function(item) {
      //console.log('item: ', item);
      googleCookies.forEach(function(itemGoogle) {
        if (itemGoogle.domain === item.domain && itemGoogle.name === item.name && itemGoogle.isRemoved) {
          //console.log('remove: ', item);
          chrome.cookies.remove({
            url: 'https://accounts.google.com',
            name: item.name
          });
        }
      });
    });
  });
}

chrome.browserAction.onClicked.addListener(function() {
//     chrome.browserAction.setIcon({
//       'path': 'img/on.png'
//     });
//     setTimeout(function(){
//       chrome.browserAction.setIcon({
//         'path': 'img/off.png'
//       })
//     },1000);
//    clearCookie();

  chrome.storage.sync.get(['isUnloginGoogle'], function(items) {
    //console.log('Settings retrieved', items);
    chrome.storage.sync.set({ 'isUnloginGoogle': !items.isUnloginGoogle }, function() {
      //console.log('Settings saved');
      checkIsUnlogin();
    });
  });
});

function checkIsUnlogin() {
  // Read it using the storage API
  chrome.storage.sync.get(['isUnloginGoogle'], function(items) {
    //console.log('Settings retrieved', items);
    if (items.isUnloginGoogle) {
      chrome.browserAction.setIcon({
        'path': 'img/on.png'
      });
    } else {
      chrome.browserAction.setIcon({
        'path': 'img/off.png'
      });
    }
  });
}

chrome.windows.onCreated.addListener(function(windowId) {
  checkIsUnlogin();
  setInterval(function() {
    checkIsUnlogin();
  },1000);
});

chrome.windows.onRemoved.addListener(function(windowId) {
  // Read it using the storage API
  chrome.storage.sync.get(['isUnloginGoogle'], function(items) {
    if (items.isUnloginGoogle) {
      clearCookie();
    }
  });
});
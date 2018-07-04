// chrome.cookies.onChanged.addListener(function(info) {
//   console.log("onChanged info: " + JSON.stringify(info));
// });

function clearCookie() {
  chrome.cookies.getAll({
    url: 'https://google.com'
  }, function(cookies) {
    if (!cookies.forEach) {
      return;
    }
    cookies.forEach(function(item) {
      // console.log('item: ', item);
      chrome.cookies.remove({
        url: 'https://accounts.google.com',
        name: item.name
      });
    });
  });
}

chrome.browserAction.onClicked.addListener(function() {
//     chrome.browserAction.setIcon({
//       'path': 'img/bug_green.png'
//     });
//     setTimeout(function(){
//       chrome.browserAction.setIcon({
//         'path': 'img/bug_black.png'
//       })
//     },1000);
//    clearCookie();
  chrome.storage.sync.get(['isUnloginGoogle'], function(items) {
    console.log('Settings retrieved', items);
    chrome.storage.sync.set({ 'isUnloginGoogle': !items.isUnloginGoogle }, function() {
      console.log('Settings saved');
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
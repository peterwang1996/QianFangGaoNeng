var portHub = new Map();

function forwardMessage(message, port) {
    var portList = portHub.get(port.name);
    for (var i = 0; i < portList.length; i++) {
        if (portList[i] !== port) {
            portList[i].postMessage(message);
        }
    }
}

function handleDisconnect(port) {
    var arr = portHub.get(port.name);
    arr = arr.filter(function(p){return p !== port});
    if (arr.length > 0) {
        portHub.set(port.name, arr);
    } else {
        portHub.delete(port.name);
    }
}

chrome.extension.onConnect.addListener(function(port) {
    var name = port.name;
    if (portHub.has(name)) {
        portHub.get(name).push(port);
    } else {
        portHub.set(name, [port]);
    }
    port.onMessage.addListener(forwardMessage);
    port.onDisconnect.addListener(handleDisconnect);
});
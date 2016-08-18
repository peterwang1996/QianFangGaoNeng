var innerPlayer = document.getElementById('bofqi_embed');
var cid = document.body.innerHTML.match(/cid=\d*/)[0].slice(4)

port = chrome.runtime.connect({
    name: cid + '_danmuku'
});
console.log(port);

chrome.runtime.onConnect.addListener(function(port) {
    console.log(port.name + '- iframe');
    port.onMessage.addListener(function(msg) {
        console.log(msg);
    });
});

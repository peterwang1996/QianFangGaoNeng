chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'requireDanmuku' && request.type === 'xml') {
        var danmukuXml = null;
        console.log('hehe');
        try {
            var danmukuXml = $.ajax({
                url: request.src,
                processData: false,
                cache: false,
                async: false,
                dataType: 'xml'
            }).responseXML;
            console.log(danmukuXml);
            sendResponse({
                status: 'OK',
                danmukuXml: danmukuXml
            });
        } catch (e) {
            sendResponse({
                status: 'error',
                info: (e + '')
            });
            return;
        }
    }
});
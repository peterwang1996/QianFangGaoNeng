var optionIsOpen = document.getElementById('option-is-open');
chrome.storage.sync.get(null, function(result) {
    console.log(result);
    try {
        optionIsOpen.checked = result.isOpen;
    } catch (error) {
        chrome.storage.sync.set({
            'isOpen': ture
        });
    }
});

optionIsOpen.addEventListener('click', function() {
    var value = optionIsOpen.checked;
    chrome.storage.sync.set({
        'isOpen': value
    }, function(item) {
        console.log(item);
    });
});
chrome.runtime.sendMessage('Hello', function(response){
    document.write(response);
});
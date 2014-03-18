chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message == 'download'){
		var urls = get_images();
		sendResponse(urls);
	}
});

function get_images(){
	var img = document.getElementsByTagName('img');
	var urls = [];
	for(var i=0,imgLen=img.length; i<imgLen; i++){
		if(img[i].src){
			urls.push(img[i].src);
		}
	}
	return urls;
}
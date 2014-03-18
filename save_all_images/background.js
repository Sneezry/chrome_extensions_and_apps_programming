chrome.contextMenus.create({
    'type':'normal',
    'title':'保存所有图片',
    'onclick':saveall
});

function saveall(info, tab){
	chrome.tabs.sendMessage(tab.id, 'download', function(urls){
		for(var i=0,urlsLen=urls.length; i<urlsLen; i++){
			chrome.downloads.download({
				'url': urls[i],
				'conflictAction': 'uniquify',
				'saveAs': false
			});
		}
	});
}
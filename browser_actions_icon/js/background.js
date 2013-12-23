function chgIcon(index){
	if(!index){
		index = 0;
	}
	else{
		index = index%20;
	}
	chrome.browserAction.setIcon({path: {'19': 'images/icon19_'+index+'.png'}});
	chrome.browserAction.setIcon({path: {'38': 'images/icon38_'+index+'.png'}});
	setTimeout(function(){chgIcon(index+1)},50);
}

chgIcon();
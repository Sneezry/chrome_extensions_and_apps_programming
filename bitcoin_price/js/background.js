function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

function updateAmount(amount, exchange){
    amount = Number(amount);
    if(isNaN(amount) || !amount){
        exchange([{
            'content': '฿1 = $'+price,
            'description': '฿1 = $'+price
        },{
            'content': '$1 = ฿'+(1/price).toFixed(6),
            'description': '$1 = ฿'+(1/price).toFixed(6)
        }]);
    }
    else{
        exchange([{
            'content': '฿'+amount+' = $'+(amount*price).toFixed(2),
            'description': '฿'+amount+' = $'+(amount*price).toFixed(2)
        },{
            'content': '$'+amount+' = ฿'+(amount/price).toFixed(6),
            'description': '$'+amount+' = ฿'+(amount/price).toFixed(6)
        }]);
    }
}

function gotoBlockchain(text, disposition){
    window.open('https://blockchain.info/charts/market-price?timespan=30days&showDataPoints=false&daysAverageString=1&show_header=true&scale=0&address=');
}

var url = 'https://blockchain.info/charts/market-price?showDataPoints=false&timespan=30days&show_header=true&daysAverageString=1&scale=0&format=json&address=';
var price;

httpRequest(url, function(r){
    price = JSON.parse(r);
    price = price.values;
    price = price[price.length-1];
    price = price.y;
});

chrome.omnibox.setDefaultSuggestion({'description':'Find current Bitcoin price.'});

chrome.omnibox.onInputChanged.addListener(updateAmount);

chrome.omnibox.onInputEntered.addListener(gotoBlockchain);
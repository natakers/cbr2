var currentIndex = 0;
var timeId;
var baseCurrency;
var listOfCurrencies;
var apiAnswer;
var baseCurrency;
var fontColor;
var bgColor;
var now = new Date;
var flag;
var today;

today = now.getDate() + "." + (now.getMonth() + 1) + "."  + now.getFullYear();
if (now.getDate()< 10) {
	today = '0'+today;
}
document.getElementById('date').innerHTML = today;

document.addEventListener("DOMContentLoaded", function () {
	widgetHelpers.startMessagingClient(true);
});


function updateParams(data) {
	console.log(data);
	if (fontColor !== data.fontColor) { 	
		fontColor = data.fontColor;
		console.log(fontColor);
		document.getElementById("app").style.color = fontColor;
	}
	if (bgColor !== data.bgColor) { 	
		bgColor = data.bgColor;
		console.log(bgColor);
		document.getElementById("app").style.backgroundColor =bgColor;
	}
	if (timeId !== data.interval) {  	
		timeId = data.interval*1000;
		console.log(timeId);
	}
	if (baseCurrency !== data.baseCurrency){  	
		baseCurrency = data.baseCurrency;
		console.log(baseCurrency);
	}
	if (listOfCurrencies !== data.listOfCurrencies){
		listOfCurrencies = data.listOfCurrencies
		console.log(listOfCurrencies);  
	}

	else return;
	console.error(arguments);
	console.log(listOfCurrencies[0]);
	console.error(listOfCurrencies);
	var arrOfList =[];
	arrOfList = document.getElementsByClassName('nameValute');
	if (arrOfList.length < listOfCurrencies.length) {
		for (var i = 0; i <= listOfCurrencies.length-arrOfList.length; i++) {
			var str = '\
				<div class="nameValute"  class="colunm"></div>\
				<div class="priceValute" class="colunm"></div>\
				';
			var div = document.createElement('div');
			div.className = 'row valute';
			div.innerHTML = str;
			document.getElementById("app").append(div);
		}
	}
	if (arrOfList.length > listOfCurrencies.length) {
		for (var i = 0; i <= arrOfList.length-listOfCurrencies.length; i++) {
			var arrValute = document.getElementsByClassName('valute');
			console.log(arrValute);
			arrValute[i].remove();
		}
	}
	for (var i = 1; i < listOfCurrencies.length; i++) {
		arrValute = document.getElementsByClassName('valute');
		console.log(arrValute);
		arrValute[i].style.display = 'none';
	}

	var promise1 =  new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		var url = 'https://www.cbr-xml-daily.ru/daily_json.js';
		xhr.open('GET', url, true);
		xhr.onload = function() {
			if (xhr.status === 200) {
				console.log(JSON.parse(xhr.responseText));
				resolve(JSON.parse(xhr.responseText));
			} else {
			resolve(null)
			}
		};
		xhr.send();
	});
	promise1.then(function(value) {
		apiAnswer = value;
	});
	if (flag) { 
		return;
	}    
	flag = setTimeout(function run() {
		sendGet(promise1);
		setTimeout(run, timeId);
	}, timeId);
}

function sendGet(promise1){ 
	var arrValute = [];
	var arrValue = [];
	arrValute = document.getElementsByClassName('nameValute');
	arrValue = document.getElementsByClassName('priceValute');
	console.log(arrValute);
	for (var i = 0; i <arrValue.length; i++) {
		console.log(arrValute[i]);
		for (key in apiAnswer.Valute) {
			if (apiAnswer.Valute.hasOwnProperty(key)) {
				if (key == listOfCurrencies[currentIndex]){
					console.log(baseCurrency);
					var valChar = apiAnswer.Valute[key].CharCode;
					var valValue = apiAnswer.Valute[key].Value.toFixed(2);
					var valRev = 1/valValue;
					var valPrevious = apiAnswer.Valute[key].Previous;
					var valPreviousRev = 1/valPrevious;
					console.log(valChar);
				}
				if (key === baseCurrency){
					console.log('not RUB');
					var baseChar = apiAnswer.Valute[key].CharCode;
					var baseRev = 1/(apiAnswer.Valute[key].Value);
					var basePreviosRev = 1/(apiAnswer.Valute[key].Previous);
					arrValute[i].innerHTML = valChar;
					arrValue[i].innerHTML = (valRev/baseRev).toFixed(2);
					var current1 = valRev/baseRev;
					var previous1 = valPreviousRev/basePreviosRev;
					arrValue[i].innerHTML  += trend(current1, previous1);
				}
				if (baseCurrency === "RUB") {
						console.log('RUB');
					arrValute[i].innerHTML = valChar;
					arrValue[i].innerHTML = valValue;
					arrValue[i].innerHTML  += trend(valValue, valPrevious);
				}
			}
		}
		console.log(listOfCurrencies);
	arrayChange();
	console.log(listOfCurrencies);
	}
	addIndex(currentIndex);
	widgetHelpers.sendWidgetIsReady();
}

function addIndex() {
	currentIndex++;
	if (currentIndex > listOfCurrencies.length-1) {
		currentIndex = 0;  
	}
}

function trend(current, previous) {
	if (current > previous) return ' ▲';
	if (current < previous) return ' ▼';
	return '';
}

function updateViewport(data) {
	for (var i = 1; i < listOfCurrencies.length; i++) {
		arrValute = document.getElementsByClassName('valute');
		console.log(arrValute);
		arrValute[i].style.display = 'none';
	}

	var width = 200;
	var htmlWidth = document.documentElement.clientWidth;
	var htmlFontSize = 16;
	var k = htmlFontSize/width;
	var baseFontSize = htmlWidth*k;
	console.log(baseFontSize.toFixed(0));
	document.querySelector("html").style.fontSize = baseFontSize.toFixed(0) + "px";
	if (baseFontSize > 24) {
		arrValute = document.getElementsByClassName('valute');
		console.log(arrValute);
		arrValute[1].style.display = 'flex';
	}
	if (baseFontSize > 30) {
		arrValute = document.getElementsByClassName('valute');
		console.log(arrValute);
		arrValute[2].style.display = 'flex';	
	}	
	if (baseFontSize > 34) {
		arrValute = document.getElementsByClassName('valute');
		console.log(arrValute);
		arrValute[3].style.display = 'flex';	
	}	
}	

function arrayChange() {
	console.log(listOfCurrencies);
	var firstItem =	listOfCurrencies[0];
		for (var i = 0; i <listOfCurrencies.length - 1; i ++) {
			listOfCurrencies[i] = listOfCurrencies[i + 1];
		}
	listOfCurrencies[listOfCurrencies.length - 1] = firstItem;
	console.log("listOfCurrencies" + listOfCurrencies);
}
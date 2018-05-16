													// SHORT HAND

function I(id){	return document.getElementById(id); }
function T(tagName){ return document.getElementsByTagName(tagName); }
function C(className){ return document.getElementsByClassName(className); }
function N(Name){ return document.getElementsByName(Name); }
function Q(Name){ return document.querySelector(Name); }
function A(Name){ return document.querySelectorAll(Name); }



													// CLEAN DOM
// Remove Unwanted Comment/Text Nodes 
function cleanDOM(node){
	'use strict';

	for (let i = 0; i < node.childNodes.length; i++) {
		let child = node.childNodes[i];
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			i--;
		}
		else if (child.nodeType === 1) { cleanDOM(child); }
	}
}



														// AJAX
// Create Ajax Request
function createAjax(){
	'use strict';

	let newRequest = null;
	try {
		newRequest = new XMLHttpRequest();
	}catch (tryMS) {
		try {//for IE
			newRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (otherMS) {
			try {//for other IE
				newRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}catch (failed) {
				console.log("Unable to create Ajax request");
				return newRequest;
			}
		}
	}
	return newRequest;
}

// Create and Send Ajax requests in one function using an associative array
function sendAjax(options){
	'use strict';

	// set default argument values
	let defArgs = {
		method : 'GET',
		url : '',
		callback : '',
		data : '',
		async : true
	};
	for(let i in defArgs){
		if (typeof options[i] == 'undefined') {  options[i] = defArgs[i]; }
	}
	// check passed arguments
	if (options.url === '' || (options['method'].toLowerCase() === "post" && options.url.indexOf('?') > -1) || options.callback === ''){
		// log errors
		let errMsg = 'Invalid argument(s): ';
		if (options.url === '') {errMsg += "'url' not set, ";}
		if(options['method'].toLowerCase() === "post" && options.url.indexOf('?') > -1){errMsg += "invalid 'url' value, ";}
		if (options.callback === '') {errMsg += "'callback' not set.";}
		console.log(errMsg);
	}
	// send request
	else if (options['method'].toLowerCase() === 'get') { 
		// get request
		request = createAjax();
		if (request == null) { return; }
		request.onreadystatechange = options.callback;
		request.open("GET", options.url, options.async);
		request.send(null);
	}
	else if (options['method'].toLowerCase() === "post") { 
		// post request*/
		request = createAjax();
		if (request == null) { return; }
		request.onreadystatechange = options.callback;
		request.open("POST", options.url, options.async);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(options['data']);
	}
	else{
		/* 'method' can take only 1 of 2 values; 'get' or 'post'. The values are case insensitive. If 'method' is not set, it will take a default 'get' value.*/
		console.log("Invalid 'method' value. use 'method':'get' or 'method':'post'");
	}
}

/*Alternatively,
Create and Send Ajax requests in one function using optional arguments.*/
function ajaxRequest(method, url, callback, data=null, async=true){
	
	// check passed arguments
	if (typeof url == 'undefined' || typeof callback == 'undefined' || url === '' || (method.toLowerCase() === "post" && url.indexOf('?') > -1)){
		// log errors
		let errMsg = 'Invalid argument(s): ';
		if (typeof url == 'undefined' || url === '') {errMsg += "'url' not set, ";}
		if(method.toLowerCase() === "post" && url.indexOf('?') > -1){errMsg += "invalid 'url' value, ";}
		if (typeof callback == 'undefined') {errMsg += "'callback' not set.";}
		console.log(errMsg);
	}
	// send request
	else if (method.toLowerCase() === "get") {
		// get request
		request = createAjax();
		if (request == null) {	return;	}
		request.onreadystatechange = callback;
		request.open("GET", url, async);
		request.send(null);
	}
	else if(method.toLowerCase() === "post"){ 
		// post request
		request = createAjax();
		if (request == null) {	return;	}
		request.onreadystatechange = callback;
		request.open("POST", url, async);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.send(data);
	}
	else{
		// 'method' can take only 1 of 2 values; 'get' or 'post'. The values are case insensitive.
		console.log("Invalid 'method' value. use 'get' or 'post'");
	}
}




														// COOKIES
function writeCookie(name, value, days) {
	'use strict';

	let expires = "";
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	'use strict';

	let searchName = name + "=";
	let cookies = document.cookie.split(';');
	for(let i=0; i < cookies.length; i++) {
		let c = cookies[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(searchName) == 0)	return c.substring(searchName.length, c.length);
	}
	return null;
}

function eraseCookie(name) { writeCookie(name, "", -1);	}
export default function Utils() {
	
    if (!this || !(this instanceof Utils)) return new Utils();

	let statusP = I('statusP');
	
	function noData(message = 'No data found!'){
		I('noDataHolder').style.display = 'block';
		I('noDataHolder').textContent = message;
	}
	
	function success(message='Success!'){
		statusP.style.display = 'none';
		statusP.textContent = message;
		statusP.style.backgroundColor = 'lightgreen';
		setTimeout(()=>{ statusP.style.display = 'block'; }, 50);
	}
	
	function warn(message='Failed!'){
		statusP.style.display = 'none';
		statusP.textContent = message;
		statusP.style.backgroundColor = 'tomato';
		setTimeout(()=>{ statusP.style.display = 'block'; }, 50);
	}
	
	function failure(message='Error!'){
		statusP.style.display = 'none';
		statusP.textContent = message;
		statusP.style.backgroundColor = 'crimson';
		setTimeout(()=>{ statusP.style.display = 'block'; }, 50);
	}
	
	function inform(message){	
		statusP.style.display = 'none';
		statusP.textContent = message;
		statusP.style.backgroundColor = '#3a5b78';
		setTimeout(()=>{ statusP.style.display = 'block'; }, 50);
	}

	return {
		inform,
		failure,
		warn,
		success,
		noData
	};
}

export function I(id){	return document.getElementById(id); }
export function T(tagName){ return document.getElementsByTagName(tagName); }
export function C(className){ return document.getElementsByClassName(className); }
export function N(Name){ return document.getElementsByName(Name); }
export function Q(Name){ return document.querySelector(Name); }
export function A(Name){ return document.querySelectorAll(Name); }

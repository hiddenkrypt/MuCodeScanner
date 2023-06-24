


window.onload = MuCParser;

async function MuCParser(){
	const response = await fetch('https://raw.githubusercontent.com/hiddenkrypt/MuCodeScanner/master/MuCFormat.json');
	const codeFormat = await response.json();
	let utils = new MuCUtils( codeFormat );
		
		
	console.log("loaded");
	console.log(codeFormat);
	let input = document.getElementById("codeInput");
	
	input.addEventListener("input", parseCode);
	if(input.value){ parseCode()}
	function parseCode(){
		utils.reset();
		code = input.value.split(" ");
		if(code[0] != "MuC"){
			console.log("malformed code");
			return;
		}
		console.log(code);
		code.forEach((e,a,i)=>{
			//MuC N---! [f] S.H A(b---! r---!) Os We Cc-- I--- OF--- Ppsi Ff T+++ Xg(g) Jpa Dv R--- C--- S---! MF---
	
			if(e.substr(0,1 == "N")){
				parseNumbers(e.substr(1));
			}
		});
	}
	function getFormat(by){
		return codeFormat.find(e=>{
			e.tag = by+tag;
		});
	}
	function parseNumbers(tagString){	
		let numbersOut = document.getElementById("numberContainer");
		let numberFormat = getFormat("N");
		numbersOut
	}
}
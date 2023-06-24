


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
	//MuC N---! [f] S.H A(b---! r---!) Os We Cc-- I--- OF--- Ppsi Ff T+++ Xg(g) Jpa Dv R--- C--- S---! MF---
		code = input.value.split(" ");
		if(code[0] != "MuC"){
			console.log("malformed code");
			return;
		}
		console.log(code);
		code.forEach((e,a,i)=>{
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
//ffmpeg -i 'ghost vengeance.mp4' -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm

//ffmpeg -i output.webm -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libvpx-vp9 -crf 30 half_the_frame_size.webm
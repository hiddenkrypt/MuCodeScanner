


window.onload = MuCParser;

async function MuCParser(){
	const response = await fetch('https://raw.githubusercontent.com/FlaringK/MuC-Generator/master/MuC.json');
	const code = await response.json();
		
		
	console.log("loaded");
	console.log(code);
	let input = document.getElementById("codeInput");
	
	input.addEventListener("input", parseCode);
	function parseCode(){
		console.log("parse");
	}
}

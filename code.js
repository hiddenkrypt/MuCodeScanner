
window.onload = MuCParser;

function MuCParser(){
	console.log("loaded");
	let input = document.getElementById("codeInput");
	
	input.addEventListener("input", parseCode);
	function parseCode(){
		console.log("parse");
	}
}

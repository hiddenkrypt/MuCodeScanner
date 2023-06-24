


window.onload = MuCParser;

async function MuCParser() {
	const response = await fetch('https://raw.githubusercontent.com/hiddenkrypt/MuCodeScanner/master/MuCFormat.json');
	const codeFormat = await response.json();
	let Utils = new MuCUtils( codeFormat );
		
		
	console.log("loaded");
	let input = document.getElementById("codeInput");
	
	input.addEventListener( "input", parseCode );
	if( input.value ){ 
		parseCode() 
	}
	function parseCode() {
		Utils.reset();
		code = input.value.split(" ");
		if( code[0] != "MuC" ) {
			Utils.error("malformed or missing MuC Header");
			return
		}
		code.forEach( (e,a,i) => {
			//MuC N---! [f] S.H A(b---! r---!) Os We Cc-- I--- OF--- Ppsi Ff T+++ Xg(g) Jpa Dv R--- C--- S---! MF---
			if( e.substr(0,1) == "N" ) {
				parseNumbers( e.substr(1) );
			} else if( e.substr(0,1) == "[") {
				parseGenders( e.replace(/[\[\]]/g, "") );
			} else if( e.substr(0,2) == "S.") {
				parseSpecies( e.substr(2) );
			}
		});
	}
	function getFormat(by) {
		return codeFormat.find(e=>e.format == by);
	}
	
	
	
	function parseNumbers(tagString) {	
		let numberFormat = getFormat("N");
		let cleanString = tagString.replace(/[#^]/g,'').replace(/".*"/g,'');
		let number = numberFormat.options.find(e=>e.tag == cleanString);
		if( !number ){
			Utils.error("Malformed Number Field");
			return;
			
		}
		let content = document.getElementById( "Ncontent" );
		content.innerHTML = number.desc;
		if( tagString.includes( "#" ) ) {
			content.innerHTML += "<br>("
			content.innerHTML += numberFormat.mods.find(e=>e.tag == "#").desc;
			content.innerHTML += ")";
		}
		if( tagString.includes( "^" ) ) {
			content.innerHTML += "<br>(";
			content.innerHTML += numberFormat.mods.find(e=>e.tag == "^").desc;
			content.innerHTML += ")";
		}
		if( tagString.includes( '"' ) ) {
			content.innerHTML += "<br>(";
			content.innerHTML += tagString.match(/".*"/)[0].replace(/"/g,"");
			content.innerHTML += ")";
		}
	}
	
	
	
	function parseGenders( tagString ) {
		let content = document.getElementById("[content");
		let genderFormat = getFormat("[");
		function getGender(gender){
			return Utils.getOption( genderFormat, gender );
		}
		let firstGenderTag = tagString.split(";")[0];
		let firstGender = getGender(firstGenderTag);
		
		content.innerHTML = "This system idenfies their body as " + firstGender;
		if(!tagString.split(";")[1]){
			return;
		}
		let remainingGenderTags = tagString.split(";")[1].split("/");
		content.innerHTML += "<br>Some members of this system are " + remainingGenderTags.map(getGender).join(", ");
		//Pick up tomorrow from here
	}

	
	
	function parseSpecies( tagString ) {
		let content = document.getElementById("S.content");
		let speciesFormat = getFormat("S.");
		function getSpecies( speciesTag ) {
			console.log("looking for:"+speciesTag);
			if( speciesTag.includes( "+" ) ) {	
				return Utils.getMod( speciesFormat, "+" ) + getSpecies( speciesTag.replace(/\+/g, "")  );
			}
			if( speciesTag.includes( "*" ) ) {	
				return "A " +  Utils.getMod( speciesFormat, "*" ) + getSpecies( speciesTag.replace(/\*/g, "") );
			}
			if( speciesTag.includes( "&" ) ) {	
				if( speciesTag.split("&").length == 2){
					return "A half " + speciesTag.split("&").map(getSpecies).join(", half ");
				}
				return "A cross between: " + speciesTag.split("&").map(getSpecies).join(", ");
			}
			if( speciesTag.includes( "?" ) ) {}
			if( speciesTag.includes( "^" ) ) {}
			if( speciesTag.includes( "~" ) ) {
				return "A Shapeshifter with " + speciesTag.split("~").map(getSpecies).join(", ") + " forms.";
			}		
			return Utils.getOption( speciesFormat, speciesTag );
		}
		let allSpecies = tagString.split("/").map(getSpecies);
		console.log( allSpecies );
	}
}



window.onload = MuCParser;

async function MuCParser() {
	const response = await fetch('https://raw.githubusercontent.com/hiddenkrypt/MuCodeScanner/master/MuCFormat.json', {cache: "no-store"});
	const codeFormat = await response.json();
	let Utils = new MuCUtils( codeFormat );
		
		
	let input = document.getElementById("codeInput");
	
	input.addEventListener( "input", parseCode );
	if( input.value ){ 
		parseCode() 
	}
	function parseCode() {
		Utils.reset();
		
		
		let code = input.value.split("\"").map ((e,i)=>{
			if( i%2 != 0 ) {
				return '"'+e.replace(/ /g,"\t")+'"';
			}
			return e;
		}).join("").split(" ");
		
		if( code[0] != "MuC" ) {
			Utils.error("malformed or missing MuC Header");
			return
		}
		for(let i=0; i< code.length; i++){
			let e = code[i];
			//MuC N---! [f] S.H A(b---! r---!) Os We Cc-- I--- OF--- Ppsi Ff T+++ Xg(g) Jpa Dv R--- C--- S---! MF---
			if( e.substr(0,1) == "N" ) {
				parseNumbers( e.substr(1) );
			} else if( e.substr(0,1) == "[") {
				parseGenders( e.replace(/[\[\]]/g, "") );
			} else if( e.substr(0,2) == "S.") {
				parseSpecies( e.substr(2) );
			} else if( e.substr(0,1) == "A") {
				parseAge( (e+"|"+code[i+1]).substr(1).replace(/[\(\)]/g, "") );
				i++;
			} else if( e.substr(0,1) == "O" && e.substr(0,2) != "OF") {
				parseOrigins( e.substr(1) );
			} else if( e.substr(0,1) == "W" ) {
				parseWorlds( e.substr(1) );
			} else {
				//Utils.error("Unknown or unimplemented tag: "+e); 
			}
		}
	}
	
	
	
	function parseNumbers(tagString) {	
		let format = Utils.getFormat("N");
		let cleanString = tagString.replace(/[#^]/g,'').replace(/".*"/g,'');
		let number = format.options.find(e=>e.tag == cleanString);
		if( !number ){
			Utils.error("Malformed Number Field");
			return;
			
		}
		let content = document.getElementById( "Ncontent" );
		content.innerHTML = number.desc;
		if( tagString.includes( "#" ) ) {
			content.innerHTML += "<br>("
			content.innerHTML += format.mods.find(e=>e.tag == "#").desc;
			content.innerHTML += ")";
		}
		if( tagString.includes( "^" ) ) {
			content.innerHTML += "<br>(";
			content.innerHTML += format.mods.find(e=>e.tag == "^").desc;
			content.innerHTML += ")";
		}
		if( tagString.includes( '"' ) ) {
			content.innerHTML += "<br>(";
			content.innerHTML += tagString.match(/".*"/)[0].replace(/"/g,"");
			content.innerHTML += ")";
		}
		
		
		document.getElementById("Ncontainer").style.display = "block";
	}
	
	function parseGenders( tagString ) {
		let content = document.getElementById("[content");
		let format = Utils.getFormat("[");
		function getGender(gender){
			return Utils.getOption( format, gender );
		}
		let firstGenderTag = tagString.split(";")[0];
		let firstGender = getGender( firstGenderTag );
		
		content.innerHTML = "This system idenfies their body as " + firstGender + "<hr>";
		if(!tagString.split(";")[1]){
			return;
		}
		let remainingGenderTags = tagString.split(";")[1].split("/");
		content.innerHTML += "Members of this system include:<ul><li>" + remainingGenderTags.map(getGender).join("<li>") + "</ul>";
		
		document.getElementById("[container").style.display = "block";
	}

	
	
	function parseSpecies( tagString ) {
		let content = document.getElementById("S.content");
		let format = Utils.getFormat("S.");
		function getSpecies( speciesTag ) {
			if( speciesTag.includes( "+" ) ) {	
				return Utils.getMod( format, "+" ) + getSpecies( speciesTag.replace(/\+/g, "")  );
			}
			if( speciesTag.includes( "*" ) ) {	
				return "A " +  Utils.getMod( format, "*" ) + getSpecies( speciesTag.replace(/\*/g, "") );
			}
			if( speciesTag.includes( "&" ) ) {	
				if( speciesTag.split("&").length == 2){
					return "A half " + speciesTag.split("&").map(getSpecies).join(", half ");
				}
				return "A cross between: " + speciesTag.split("&").map(getSpecies).join(", ");
			}
			if( speciesTag.includes( "?" ) ) {
				if( speciesTag == "?" ) {
					return "Unknown";
				}
				return getSpecies( speciesTag.replace(/\?/g, "") ) +  Utils.getMod( format, "?" );
			}
			if( speciesTag.includes( "^" ) ) {
				return getSpecies( speciesTag.replace(/\^/g, "") ) +  Utils.getMod( format, "^" );
			}
			if( speciesTag.includes( "~" ) ) {
				return "A Shapeshifter with " + speciesTag.split("~").map(getSpecies).join(", ") + " forms";
			}		
			return Utils.getOption( format, speciesTag );
		}
		let allSpecies = tagString.split("/").map(getSpecies);
		content.innerHTML = "This system's members include:<ul><li>"+ allSpecies.join("<li>") + "</ul>";
		
		
		document.getElementById("S.container").style.display = "block";
	}
	
	
	
	function parseAge( ageString ){
		let content = document.getElementById("Acontent");
		let format = Utils.getFormat("A");
		let bodyTag = ageString.split("|")[0].substr(1);
		content.innerHTML = "The body of this sytem is this old: '" + Utils.getOption( format, bodyTag ) + "'<hr>";
		
		let systemRangeTags = ageString.substr(ageString.indexOf("|r")+2).split("/");
		if(systemRangeTags.length != 0 ){
			if(systemRangeTags.length == 2){
				content.innerHTML += "<br><br>System members range in age from '" + Utils.getOption( format, systemRangeTags[0] ) + "' to '" +  Utils.getOption( format, systemRangeTags[1] ) + "'";
			} else {
				content.innerHTML += "<br>This system's members include the ages of " + systemRangeTags.map(e=> "'" + Utils.getOption( format, e ) + "'" ).join();
			}
		}
		
		document.getElementById("Acontainer").style.display = "block";
	}
	
	function parseOrigins( originString ){
		let content = document.getElementById("Ocontent");
		let format = Utils.getFormat("O");
		let origins = originString.split("/").map(e=> Utils.getOption( format, e ));
		content.innerHTML = "The origins of this systems members include:<ul><li>"+ origins.join("<li>") + "</ul>";
		document.getElementById("Ocontainer").style.display = "block";
	}
	
	
	function parseWorlds( worldString ){
		let content = document.getElementById("Wcontent");
		let format = Utils.getFormat("W");
		let worlds = worldString.split("/").map(parseWorldTag);
		
		function parseWorldTag( tag ){
			if (!tag || tag == ""){
				return "";
			}
			let quotes = (tag.match(/"/g) || []).length;
			if(quotes > 2 || quotes == 1){
				Utils.error("broken or excessive quotes in world: "+tag);
				return "<<parsing error>>";
			}	else if(quotes == 2){
				let splits = tag.split("\"")
				return parseWorldTag(splits[0]) + splits[1] + parseWorldTag(splits[2]);
			}
			
			return tag.split("").map(e=>{
				if( Utils.existsOption( format, e )){
					return Utils.getOption( format, e );
				} else if(  Utils.existsMod( format, e )){
					return Utils.getMod( format, e );
				}
				return "";
			}).join(" ");
			
			
		}		
		content.innerHTML = "This system's worlds include:<ul><li>"+ worlds.join("<li>") + "</ul>";
		
		document.getElementById("Wcontainer").style.display = "block";
	}
	
	
}
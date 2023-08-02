

//MuC N- [f] S.H+/Hf+/Uz&Uv/Sa/Sg+/Sh/Rg A(b+ r---!/++) Os/c Wm+ Cc- OF- Pspi!/pre Fxb/s/pc^/a T+ Jm Dg R(--/+) C+++ S--
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

		//find token comments (pairs of quotes) and replace inner spaces with tabs
		let code = input.value.split("\"").map((e,i)=>{
			if( i%2 != 0 ) {
				return '"'+e.replace(/ /g,"\t")+'"';
			}
			return e;
		}).join("");

		//Find the age tab and replace the space in it's groups
		let decode = code.match(/^(?<first>.*)(?<ages>A\(.*?\))(?<last>.*)$/);
		code = decode.groups.first + decode.groups.ages.replace(/ /g,"\t") + decode.groups.last;

		//now we can split on spaces, since we've dealt with the non-delineating space chars
		code = code.split(" ");
		if( code[0] != "MuC" ) {
			Utils.error("This does not appear to be a MuC Code");
			return
		}
		var parseTags = [
			{match:/^N/, parser:parseNumbers},
			{match:/^\[/, parser:parseGenders},
			{match:/^S\./, parser:parseSpecies},
			{match:/^A\(/, parser:parseAge},
			{match:/^O[^F]/, parser:parseOrigins},
			{match:/^W/, parser:parseWorlds},
			{match:/^Cc/, parser:parseCoconsciousness},
			{match:/^I/, parser:parseIntegration}
			//{match:/^OF/, parser:parseOutnessFactor, cleanup: e=> e.substr(2)},
			//{match:/^/, parser:}
		];
		code.forEach( segment=>{
			if(segment == "MuC"){ return; }
			let tagHandler = parseTags.find(e=>e.match.test(segment))
			if( tagHandler ){
				tagHandler.parser(segment);
			}
		});
	}

	function parseNumbers(tagString) {
		let content = document.getElementById( "Ncontent" );
		let format = Utils.getFormat("N");
		let cleanString = tagString.substr(1).replace(/[#^]/g,'').replace(/".*"/g,'');
		content.innerHTML = Utils.getOption(format, cleanString);
		if( tagString.includes( "#" ) ) {
			content.innerHTML += "<br>" + Utils.getMod(format, "#");
		}
		if( tagString.includes( "^" ) ) {
			content.innerHTML += "<br>" + Utils.getMod(format, "^");
		}
		if( tagString.includes( '"' ) ) {
			content.innerHTML += "<br>(" + tagString.match(/".*"/)[0].replace(/"/g,"");
			content.innerHTML += ")";
		}
		document.getElementById("Ncontainer").style.display = "block";
	}

	function parseGenders( tagString ) {
		let content = document.getElementById("[content");
		let format = Utils.getFormat("[");
		let cleanString = tagString.replace(/[\[\]]/g, "")
		function getGender(gender){
			return Utils.getOption( format, gender );
		}
		let firstGenderTag = cleanString.split(";")[0];
		let firstGender = getGender( firstGenderTag );
		content.innerHTML = "This system idenfies their body as " + firstGender + "<hr>";
		if(!cleanString.split(";")[1]){
			return;
		}
		let remainingGenderTags = cleanString.split(";")[1].split("/");
		content.innerHTML += "Members of this system are:<ul><li>" + remainingGenderTags.map(getGender).join("<li>") + "</ul>";

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
		let allSpecies = tagString.substr(2).split("/").map(getSpecies);
		content.innerHTML = "<ul><li>"+ allSpecies.join("<li>") + "</ul>";
		document.getElementById("S.container").style.display = "block";
	}

	function parseAge( tagString ){
		let content = document.getElementById("Acontent");
		let format = Utils.getFormat("A");
		let ageString = tagString.substr(1).replace(/[\(\)]/g, "");
		let bodyTag = ageString.split("\t")[0].substr(1);
		content.innerHTML = "The body of this sytem is this old: '" + Utils.getOption( format, bodyTag ) + "'<hr>";
		let systemRangeTags = ageString.substr(ageString.indexOf("\tr")+2).split("/");
		if(systemRangeTags.length != 0 ){
			if(systemRangeTags.length == 2){
				content.innerHTML += "<br><br>System members range in age from '" + Utils.getOption( format, systemRangeTags[0] ) + "' to '" +  Utils.getOption( format, systemRangeTags[1] ) + "'";
			} else {
				content.innerHTML += "<br>This system's members include the ages of " + systemRangeTags.map(e=> "'" + Utils.getOption( format, e ) + "'" ).join();
			}
		}
		document.getElementById("Acontainer").style.display = "block";
	}

	function parseOrigins( tagString ){
		let content = document.getElementById("Ocontent");
		let format = Utils.getFormat("O");
		let originString = tagString.substr(1)
		let origins = originString.split("/").map(e=> Utils.getOption( format, e ));
		content.innerHTML = "<ul><li>"+ origins.join("<li>") + "</ul>";
		document.getElementById("Ocontainer").style.display = "block";
	}


	function parseWorlds( tagString ){
		let content = document.getElementById("Wcontent");
		let format = Utils.getFormat("W");
		let worlds = tagString.substr(1).split("/").map(parseWorldTag);
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
				return parseWorldTag(splits[0]) + `(${splits[1]})` + parseWorldTag(splits[2]);
			}
			return tag.split("").map(e=>{
				if( Utils.existsOption( format, e )){
					return Utils.getOption( format, e );
				} else if(  Utils.existsMod( format, e )){
					return Utils.getMod( format, e );
				}
				Utils.error("Unknown world: "+tag);
				return "";
			}).join(" ");
		}
		content.innerHTML = "<ul><li>"+ worlds.join("<li>") + "</ul>";
		document.getElementById("Wcontainer").style.display = "block";
	}
	function parseCoconsciousness( tagString ){
		let content = document.getElementById("Cccontent");
		content.innerHTML = Utils.getOption(Utils.getFormat("Cc"), tagString.substr(2));
		document.getElementById("Cccontainer").style.display = "block";
	}



	function parseIntegration(tagString) {
		let content = document.getElementById( "Icontent" );
		let format = Utils.getFormat("I");
		let cleanString = tagString.substr(1).replace(/[#^]/g,'').replace(/".*"/g,'');
		content.innerHTML = Utils.getOption(format, cleanString);
		if( tagString.includes( "#" ) ) {
			content.innerHTML += "<br>" + Utils.getMod(format, "#");
		}
		if( tagString.includes( "^" ) ) {
			content.innerHTML += "<br>" + Utils.getMod(format, "^");
		}
		if( tagString.includes( '"' ) ) {
			content.innerHTML += "<br>(" + tagString.match(/".*"/)[0].replace(/"/g,"");
			content.innerHTML += ")";
		}
		document.getElementById("Icontainer").style.display = "block";
	}



}

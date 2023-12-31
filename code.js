

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
		let code = input.value.trim().split("\"").map((e,i)=>{
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
			{formatTag:"N", match:/^N/, parser:parseNumbers},
			{formatTag:"[", match:/^\[/, parser:parseGenders},
			{formatTag:"S.", match:/^S\./, parser:parseSpecies},
			{formatTag:"A", match:/^A\(/, parser:parseAge},
			{formatTag:"O", match:/^O[^F]/, parser:parseOrigins},
			{formatTag:"W", match:/^W/, parser:parseWorlds},
			{formatTag:"Cc", match:/^Cc/, parser:parseCoconsciousness},
			{formatTag:"I", match:/^I/, parser:parseIntegration},
			{formatTag:"OF", match:/^OF/, parser:parseOutnessFactor},
			{formatTag:"P", match:/^P/, parser:()=>{}},
			{formatTag:"F", match:/^F/, parser:()=>{}},
			{formatTag:"T", match:/^T/, parser:()=>{}},
			{formatTag:"X", match:/^X/, parser:()=>{}},
			{formatTag:"J", match:/^J/, parser:()=>{}},
			{formatTag:"D", match:/^D/, parser:basicParser},
			{formatTag:"R", match:/^R/, parser:basicParser},
			{formatTag:"C", match:/^C/, parser:basicParser},
			{formatTag:"So", match:/^So/, parser:basicParser},
			{formatTag:"MF", match:/^MF/, parser:basicParser}
		];
		code.forEach( segment=>{
			if(segment == "MuC"){ return; }
			let tagHandler = parseTags.find(e=>e.match.test(segment))
			if( tagHandler ){
				let content = document.getElementById(tagHandler.formatTag+"content");
				let format = Utils.getFormat(tagHandler.formatTag);
				let container = document.getElementById(tagHandler.formatTag+"container");
				tagHandler.parser(segment, content, format);
				container.style.display = "block";
			}
		});
	}


	function basicParser( tagString, content, format ){
		//console.log(tagString);
		content.innerHTML = Utils.getOption( format, tagString.substr(format.format.length));
	}


	function parseNumbers( tagString, content, format ) {
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

	}

	function parseGenders( tagString, content, format ) {
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


	}

	function parseSpecies( tagString, content, format ) {
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

	}

	function parseAge( tagString, content, format ){
		let ageString = tagString.substr(1).replace(/[\(\)]/g, "");
		let bodyTag = ageString.split("\t")[0].substr(1);
		content.innerHTML = "The body of this sytem is this old: '" + Utils.getOption( format, bodyTag ) + "'<hr>";
		let systemRangeTags = ageString.substr(ageString.indexOf("\tr")+2).split("/");
		if(systemRangeTags.length != 0 ){
			if(systemRangeTags.length == 2){
				content.innerHTML += "System members range in age from '" + Utils.getOption( format, systemRangeTags[0] ) + "' to '" +  Utils.getOption( format, systemRangeTags[1] ) + "'";
			} else {
				content.innerHTML += "This system's members include the ages of " + systemRangeTags.map(e=> "'" + Utils.getOption( format, e ) + "'" ).join();
			}
		}

	}

	function parseOrigins( tagString, content, format ){
		let originString = tagString.substr(1)
		let origins = originString.split("/").map(e=> Utils.getOption( format, e ));
		content.innerHTML = "<ul><li>"+ origins.join("<li>") + "</ul>";

	}

	function parseWorlds( tagString, content, format ){
		content = document.getElementById("Wcontent");
		format = Utils.getFormat("W");
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

	}

	function parseCoconsciousness( tagString, content, format ){
		content.innerHTML = Utils.getOption( format, tagString.substr(2));
	}

	function parseIntegration( tagString, content, format ) {
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

	}

	function parseOutnessFactor( tagString, content, format ){
		content.innerHTML = Utils.getOption(format, tagString.substr(2));

	}

}

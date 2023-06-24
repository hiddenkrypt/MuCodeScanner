function MuCUtils( codeFormat ){	
	
	this.getOption = function getOption( format, tag ){
		if(tag.match(/^".*"$/)) {
			return tag.replace(/"/g,"");
		}
		if(tag.match(/".*"/)) {
		return this.getOption( format, tag.replace(/".*"/g, "")) + " (" + tag.match(/".*"/g).join(",").replace(/"/g, "") + ")";
		}
		let found = format.options.find(e=>e.tag == tag);
		if( !found ){
			this.error("Unknown Option: " + tag);
			return undefined;
		}
		return found.desc
	}
	
	this.getMod = function getMod( format, tag ){
		let found = format.mods.find(e=>e.tag == tag);
		if( !found ){
			utils.error("Unknown Mod: " + tag);
		}
		return found.desc
	}
	
	this.error = function( message ){
		let errorOutput = document.getElementById("parsingline");
		errorOutput.classList.add("error");
		errorOutput.innerHTML += "<br>"+message;
	};
	
	this.reset = function(){
		let output = document.getElementById("outputContainer")
		output.innerHTML = "";
		
		let errorOutput = document.getElementById("parsingline");
		if(errorOutput.classList.contains("error")){
			errorOutput.classList.remove("error");	
			errorOutput.innerText = "";			
		}
		
		function createOutput(category){
			let out = document.createElement("div");
			out.className = "output";
			out.id = category.format+"container";
			//out.style.display = "none";
			let title = document.createElement("h3");
			title.id = category.format+"title";
			title.innerText = category.name;
			let hintblock = document.createElement("div");
			hintblock.id = category.format+"hintblock";
			hintblock.className= "hintblock";
			hintblock.innerText = "?";
			let tooltip = document.createElement("span");
			tooltip.className= "tooltip";
			tooltip.innerText = category.desc;
			
			let content = document.createElement("div");
			content.id = category.format+"content";
			content.innerText = "--";
			
			hintblock.appendChild(tooltip);
			title.appendChild(hintblock);
			out.appendChild(title);
			out.appendChild(content);
			output.appendChild(out);
		}
		codeFormat.forEach(createOutput);
	};
}
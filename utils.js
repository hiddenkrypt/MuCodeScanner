function MuCUtils( codeFormat ){
	this.reset = function(){
		let output = document.getElementById("outputContainer")
		output.innerHTML = "";
		function createOutput(category){
			let out = document.createElement("div");
			out.className = "output";
			out.id = category.format+"Container";
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
	}
}
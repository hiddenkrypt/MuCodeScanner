function MuCUtils(){
	this.reset = function(){
		let output = document.getElementById("outputContainer")
		output.innerHTML = "";
		function createOutput(type){
			let out = document.createElement("div");
			out.className = "output";
			out.id = type+"Container";
			output.appendChild(out);
		}
		let categories = ["number", "gender", "species", "age", "origins", "coconsciousness", "integration", "outness", "diet", "rp", "computers", "social", "friends", "worlds", "job", "sexuality", "availability", "religion", "paranormal"];
		categories.forEach(createOutput);
	}
}
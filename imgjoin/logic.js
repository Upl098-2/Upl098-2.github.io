
window.onload = function() {
	let grid = document.getElementsByClassName("grid-1x2")[0];
	let width = 100;
	
	for(let element of document.getElementsByClassName("changeable")) {
		
		element.addEventListener("click", event => {
			
			getFile()
				.then(toBase64)
				.then(url=>element.src=url)
				.catch(console.error);
			
		});
	}
	
	document.body.addEventListener('gesturechange', function(e) {
		grid.style.width = `${width * e.scale}%`;
	}, false);
	
	document.body.addEventListener('gestureend', function(e) {
		grid.style.width = `${width*=e.scale}%`;
	}, false);
	
	window.addEventListener("keydown", event => {
		if(event.key === '+') { grid.style.width = `${width+=10}%`; }
		else if(event.key === '-') { grid.style.width = `${width-=10}%`; }
		else if(event.key === ' ') {
			html2canvas(grid)
				.then(canvas=>window.open(canvas.toDataURL(),"_blank"));
		}
	}, true);
};

function getFile() {
	let dialog = document.createElement("input");
	dialog.setAttribute("type","file");
	dialog.setAttribute("accept","image/*");
	
	dialog.click();
	//dialog.dispatchEvent(event);
	
	return new Promise((resolve, reject) => {
		dialog.addEventListener("change", () => resolve(dialog.files[0]));
		dialog.addEventListener("error", reject);
	});
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

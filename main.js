
var readyFn = () => {
	var templateEle = document.getElementById("templates");
	var stageEle = document.getElementById("stage");

	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	brushRadius = Math.min(windowHeight, windowWidth) / 7;

	var colors = ['#956d4a', '#503722'];
	var colorIndex = 0;

	// create canvas
	var makeSwipeCanvas = (color) => {
		var canvasEle = document.createElement('canvas');
		var canvasContext = canvasEle.getContext("2d");
	
		canvasEle.width = windowWidth;
		canvasEle.height = windowHeight;
	
		canvasEle.classList.add(color == colors[0] ? "first" : "second");
	
		var fillCanvas = () => {
			console.log(`fill :${color}`);
			canvasContext.beginPath();
			canvasContext.rect(0, 0, windowWidth, windowHeight);
			canvasContext.fillStyle = color;
			canvasContext.fill();
		}

		var isClearEnough = () => {
			var alphaCount = canvasContext
				.getImageData(0, 0, windowWidth, windowHeight)
				.data
				.filter((v, i) => (i % 4 == 0) && v == 0)
				.length;
			
			var percentageClear = alphaCount / (windowWidth * windowHeight);

			console.log(percentageClear);
			return percentageClear > 0.8;
		}
	
		canvasEle.onPan({
			"onMove": (e) => {
				canvasContext.beginPath();
				canvasContext.arc(e['x'], e['y'], brushRadius, 0, 2*Math.PI, true);
				canvasContext.fillStyle = '#000';
				canvasContext.globalCompositeOperation = "destination-out";
				canvasContext.fill();
				return true;
			},
			"onEnd": (e) => {
				console.log(`drop`);
				// on cleared
				if (isClearEnough()) {
					var canvasEles = Array.from(stageEle.getElementsByTagName('canvas'));

					canvasEles.forEach((ele) => {
						ele.classList.remove("finished");
					});

					canvasEle.classList.add("finished");
				}
			},
		});

		canvasEle.addEventListener("webkitAnimationEnd", () => {
			console.log('animationend');

			stageEle.removeChild(canvasEle);
			stageEle.appendChild(makeSwipeCanvas(colors[colorIndex++ % colors.length]));
		});

		fillCanvas();
		canvasEle.fillCanvas = fillCanvas;

		return canvasEle;
	};

	var firstCanvas = makeSwipeCanvas(colors[0]);
	var secondCanvas = makeSwipeCanvas(colors[1]);

	stageEle.appendChild(firstCanvas);
	stageEle.appendChild(secondCanvas);
};

if (document.readyState != 'loading'){
	readyFn();
} else {
	document.addEventListener('DOMContentLoaded', readyFn);
}


var jagCanvas;
function createJagCanvas() {
    jagCanvas = document.createElement("canvas");
    jagCanvas.width = 21;
    jagCanvas.height = 15;
}

function createJagPattern(clr) {
    var jagCtx = jagCanvas.getContext("2d");
    jagCtx.fillStyle = "hsl(" + hue + ", 100%, 12%)";
    jagCtx.fillRect(0, 0, 21, 15);
    jagCtx.strokeStyle = clr;
    //jagCtx.lineJoin = "miter";
    jagCtx.moveTo(0,0);
    jagCtx.lineTo(11,14);
    jagCtx.lineTo(20,1);
    jagCtx.stroke();
    return jagCtx.createPattern(jagCanvas, "repeat");
}

// in level init .. 
// createJagCanvas();

// in render update ..
// ctx.fillStyle = createJagPattern(clr);
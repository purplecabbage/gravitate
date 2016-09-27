// restart nag

(function(window) {

	var cup;
	var width, height;
    var ctx;
    var gmManager =  null;
    var score = 0;
    var hue;
    var imageData;

    window.Level1 = {
        init:function(canvas,_gmManager) {

            gmManager = _gmManager;

            var self = this;
            ctx = canvas.getContext('2d');

            // gmManager.toggleGameplay();

			cup = new Image();
            cup.addEventListener("load",function(){
            
            });
            cup.src = "img/cup.png";

        },
        update:function(elapsed,canvas) {

        },
        renderPrompt:function(elapsed,canvas) {
            
            ctx.shadowBlur = 8;
            imageData = ctx.getImageData(0, 0, width, height);
            prompt = true;
            var doReset = function(){
                canvas.removeEventListener("mouseup",doReset);
                canvas.removeEventListener("touchend",doReset);
                gameState = "resetting";
                prompt = false;
            }
            canvas.addEventListener("mouseup",doReset);
            canvas.addEventListener("touchend",doReset);

            ctx.putImageData(imageData, 0, 0);
            ctx.fillRect(40,100,width - 80,height - 300); 

            ctx.textAlign = "center";
            ctx.testBaseline = "bottom"
            //ctx.fontWeight = "900";
            ctx.font = "50px 'Arial Black'"; // ?

            ctx.fillText("Game Over", width / 2, 180, width - 120);

            ctx.fillStyle = "hsl(" + hue + ", 100%, 20%)";

            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillRect(80,220,width - 160,80); 
            ctx.font = "24px Arial";
            
            ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            ctx.fillText("score", width / 2, 250, width - 120);

            ctx.shadowBlur = 16;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.font = "36px Arial";
            ctx.fillText(score, width / 2, 290, width - 120);

            // draw 

            ctx.drawImage(cup,76, 256);

        },


    };

})(window);
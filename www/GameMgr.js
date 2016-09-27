

(function(window,document) {
    
    var reqAnimFrame = window.requestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.msRequestAnimationFrame;

    window.gameMgr = {
        gameRunning: false,
        boundGameStep: null,
        frameCount:0,
        frameRate:0,
        tElapsed:0,
        gameCanvas:null,
        init: function() {
            this.gameCanvas = canvas;
            this.boundGameStep = this.gameStep.bind(this);
            this.currentLevel.init(this.gameCanvas,this);
        },
        toggleGameplay: function() {
            this.gameRunning = !this.gameRunning;
            if (this.gameRunning) {
                this.lastTime = 0;
                reqAnimFrame(this.boundGameStep, canvas);
            }
        },
        pixelate:function(ctx,width,height,duration,callback) {
            var imageData = ctx.getImageData(0, 0, width, height);
            var data = imageData.data;

            

            ctx.putImageData(imageData, 0, 0);
        },
        gameStep: function(timeStamp) {
            
            if (this.lastTime) {
                var elapsed = timeStamp - this.lastTime;
                this.tElapsed += elapsed;
                if(this.tElapsed > 1000)
                {
                    this.frameRate = Math.round((this.frameRate + this.frameCount) / 2);
                    this.frameCount = -1;
                    this.tElapsed = 0;
                    //console.log("this.frameRate = " + this.frameRate);
                }
                this.currentLevel.update(elapsed,canvas);
                if(this.currentLevel.getState() == this.currentLevel.doneState) {
                    this.gameRunning = false;
                    // TODO: display a menu
                    window.gameMgr.currentLevel.resetLevel();
                }           
                this.frameCount++;
            }

            if (this.gameRunning) {
                reqAnimFrame(this.boundGameStep, canvas);
            }

            frameRate.innerText = "FPS: " + this.frameRate;

            this.lastTime = timeStamp;
        }
    };

    document.addEventListener("DOMContentLoaded", function() {
        gameMgr.currentLevel = Level1;
        gameMgr.init(canvas);
    });


})(window,document);

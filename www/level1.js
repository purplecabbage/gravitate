



(function(window) {

    var width, height;
    var ctx;
    var ship; // image
    var splat; // image
    var shipCoords;
    var gmManager =  null;
    var score = 0;
    var hue;

    //var prompt;

    var explosionStart;
    //var imageData;

    var shipVelX;
    var maxVelX = 4;
    var shipSpeed; // pixels per second?
    var hueSeed;
    var wallHeight = 16; // pixels

    var isCrashing = false;
    var isRubbing = false;

    var position = 0;
    var lineStride = 200;
    var gapSize = 80;

    var xplodes;
    var gameState;
    var shipMaxX;

    var debugOut;

    var walls = [0.4,0.6,0.1,0.5,0.3,0.1,0,0.4,0.3,0,0.5,0,0.6,1,0.7];

    var controls = {
        left:false,
        right:false
    };

    var controlsVisible = true;


    window.onresize = function(){
        width = parseInt(window.innerWidth);
        height = parseInt(window.innerHeight);
        lineStride = Math.floor(width / 1.8);
        console.log("new lineStride = " + lineStride);
        gapSize = Math.round(width / 3.5);
    }

    document.ontouchstart = function(e) {
        e.preventDefault();
    }



    function degToRad(deg) {
        return deg * Math.PI / 180;
    }

    function hitTest(a,b) {
        return !(a.y > b.y + ship.height ||
               b.y > a.y + ship.height ||
               a.x > b.x + ship.width  ||
               b.x > a.x + ship.width );
    }

    window.Level1 = {
        init:function(canvas,_gmManager) {

            gmManager = _gmManager;

            var self = this;

            ctx = canvas.getContext('2d');

            this.wallOsc = new Osc(2000);

            window.onresize();

            ship = new Image();
            ship.addEventListener("load",function(){
                console.log("ship loaded ");
                // TODO: init has to async fire an event to let the world know when it has loaded everything
                gmManager.toggleGameplay();
            });
            ship.src = "img/ship.png";

            // cup = new Image();
            // cup.addEventListener("load",function(){
            // });
            // cup.src = "img/cup.png";

            leftArrow.addEventListener("touchstart",function(){
                self.steerLeft();
            });
            leftArrow.addEventListener("touchend",function(){
                controls.left = false;
            });

            rightArrow.addEventListener("touchstart",function(){
                self.steerRight();
            });
            rightArrow.addEventListener("touchend",function(){
                controls.right = false;
            });

            // todo, add the right one
            // todo, countdown when going from paused->playing 3, 2, 1 ...
            pauseBtn.addEventListener("touchend",function(){
                gmManager.toggleGameplay();
            });
            pauseBtn.addEventListener("mouseup",function(){
                gmManager.toggleGameplay();
            });


            document.addEventListener("keydown",function(e) {
                switch(e.keyCode) {
                    case 32 : // space
                        break;
                    case 37 : // left arrow
                        self.steerLeft();
                        break;
                    case 39 : // right arrow
                        self.steerRight();
                        break;
                }
                e.preventDefault();
            });

            document.addEventListener("keyup",function(e) {
                switch(e.keyCode) {
                    case 37 : // left arrow
                        controls.left = false;
                        break;
                    case 39 : // right arrow
                        controls.right = false;
                        break;
                }
            });
            this.resetLevel();


            // var hammertime = new Hammer(canvas);  
            // hammertime.get('pan').set({direction:Hammer.DIRECTION_HORIZONTAL});
            // hammertime.on('pan',function(ev){
            //     switch(ev.direction) {
            //         case Hammer.DIRECTION_LEFT :
            //             self.steerLeft();
            //             //controls.left = false;
            //             break;
            //         case Hammer.DIRECTION_RIGHT :
            //             self.steerRight();
            //             //controls.right = false;
            //             break; 
            //     }
            // });

        },
        doneState:"done", // setting to done will make gamemgr stop updating
        getState:function(){
            return gameState;
        },
        steerLeft:function(){
            controls.left = true;
            controls.right = false;
        },
        steerRight:function(){
            controls.right = true;
            controls.left = false;
        },
        resetLevel:function() {
            console.log("resetLevel");
            isCrashing = false;
            gameState = "ready";
            shipCoords = {x:200,y:400};
            shipVelX = 0;
            position = 0
            hueSeed = Math.floor(Math.random() * 256);
            xplodes = null;
            shipSpeed = 0.35;
            controls.left = false;
            controls.right = false;
            leftArrow.style.opacity = 1;
            rightArrow.style.opacity = 1;
            pauseBtn.style.opacity = 1;
        },
        clearScreen:function(){
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = "hsl(" + hue + ", 80%, 20%)";
            ctx.fillRect(0, 0, width, height);
        },
        // renderPrompt:function(elapsed,canvas) {
        //     if(!prompt){
        //         ctx.shadowBlur = 8;
        //         imageData = ctx.getImageData(0, 0, width, height);
        //         prompt = true;
        //         var doReset = function(){
        //             canvas.removeEventListener("mouseup",doReset);
        //             canvas.removeEventListener("touchend",doReset);
        //             gameState = "resetting";
        //             prompt = false;
        //         }
        //         canvas.addEventListener("mouseup",doReset);
        //         canvas.addEventListener("touchend",doReset);

        //         ctx.putImageData(imageData, 0, 0);
        //         ctx.fillRect(40,100,width - 80,height - 300); 

        //         ctx.textAlign = "center";
        //         ctx.testBaseline = "bottom"
        //         //ctx.fontWeight = "900";
        //         ctx.font = "50px 'Arial Black'"; // ?

        //         ctx.fillText("Game Over", width / 2, 180, width - 120);

        //         ctx.fillStyle = "hsl(" + hue + ", 100%, 20%)";

        //         ctx.shadowBlur = 0;
        //         ctx.shadowOffsetX = 0;
        //         ctx.shadowOffsetY = 0;


        //         ctx.fillRect(80,220,width - 160,80); 
        //         ctx.font = "24px Arial";
                
        //         ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
        //         ctx.fillText("score", width / 2, 250, width - 120);

                
        //         ctx.shadowBlur = 16;
        //         ctx.shadowOffsetX = 1;
        //         ctx.shadowOffsetY = 1;

        //         ctx.font = "36px Arial";
        //         ctx.fillText(score, width / 2, 290, width - 120);

        //         // draw 

        //         ctx.drawImage(cup,76, 256);
        //     }

        // },
        renderCrashState:function(elapsed,canvas) {
            if(!xplodes) {
                xplodes = [];
                for(var n = 0; n < 128; n++) {
                    xplodes.push({x:shipCoords.x,
                                  y:shipCoords.y,
                                  vx:Math.random() * 1.5 - 0.75 + shipVelX / 20,
                                  vy:Math.random() * 1.5 - 0.75 - shipSpeed});
                }
                pauseBtn.style.opacity = 0;
            }

            shipSpeed *= 0.99;

            this.updatePhysics(elapsed,canvas);
            this.clearScreen();
            this.renderWalls(elapsed,canvas);

            ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            ctx.beginPath();
            //Fill the canvas with circles
            for(var j = 0; j < xplodes.length; j++){
                var c = xplodes[j];
                ctx.fillRect(c.x,c.y,5,5); 
                c.x += c.vx * elapsed;
                c.y += (c.vy - shipSpeed) * elapsed;  
           
            }            
            ctx.closePath();


            if(explosionStart - (+ new Date()) < -3000) {
                gameState = 'prompt';
            }
        },
        updatePhysics:function(elapsed,canvas){
            shipMaxX = width - ship.width / 4;
            position += shipSpeed * elapsed;

            hue = (hueSeed + (( position % 60000 ) / 60000 ) * 360 ) % 360;

            var dX = elapsed * shipSpeed * 0.7;
            if(controls.left) {
                shipVelX -= dX;
            }
            else if(controls.right) {
                shipVelX += dX;
            }

            shipVelX *= 0.05 * elapsed;
            shipVelX = Math.max( shipVelX, -maxVelX );
            shipVelX = Math.min( shipVelX, maxVelX );
            shipCoords.x += shipVelX;

            if(shipCoords.x < ship.width / 2) {
                shipCoords.x = ship.width / 2;
            }
            else if(shipCoords.x > shipMaxX + 4) {
                shipCoords.x = shipMaxX + 4;
            }

            this.wallOsc.update(elapsed);
        },
        drawMovingWall:function(y,gapLeft) {
            var left = gapLeft + Math.round( ( 0.5 + (this.wallOsc.value / 2)) * (gapSize - 20));
            this.drawWall(y,gapLeft);
            ctx.moveTo(left+20,y+wallHeight);
            ctx.lineTo(left+20,y);
            ctx.lineTo(left,y);
            ctx.lineTo(left,y+wallHeight);
            ctx.lineTo(left+5,y+wallHeight + 8);
            ctx.lineTo(left+10,y+wallHeight);
            ctx.lineTo(left+15,y+wallHeight + 8);
            ctx.lineTo(left+20,y+wallHeight);
        },
        drawWall:function(y,gapLeft) {
            ctx.rect(-1,y,gapLeft,wallHeight);
            ctx.rect(gapLeft + gapSize,y,width - gapLeft + gapSize,wallHeight);
        },
        drawJaggedLine:function(x,y,length) {
            ctx.moveTo(x,y);
            var isOn = false;
            for(var dx = x; dx < x + length; dx += 5) {
                ctx.lineTo(dx+5, isOn ? y + 8 : y);
                isOn = !isOn;
            }
        },
        drawPoisonWall:function(y,gapLeft){

            var leftOffset = Math.ceil(gapLeft / 10) * 10 - 5;

            ctx.moveTo(0,y);
            ctx.lineTo(gapLeft,y);
            ctx.lineTo(gapLeft,y+wallHeight);
            this.drawJaggedLine(gapLeft - leftOffset,y+wallHeight,leftOffset);

            ctx.moveTo(width,y);
            var leftPos = gapLeft + gapSize;
            ctx.lineTo(leftPos,y);
            ctx.lineTo(leftPos,y + wallHeight);
            this.drawJaggedLine(leftPos,y+wallHeight,width - leftPos);

        },
        renderScore:function() {
            
            ctx.fillText(score,20,60);
            ctx.strokeText(score,20,60);
            ctx.stroke();
        },
        lastScore:0,
        renderWalls:function(elapsed,canvas) {

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
            //ctx.strokeRect(0, 0, 2, height);
            //ctx.strokeRect(width-2, 0, 1, height);

            // start from just off screen at the top
            var roady = (Math.round(position) % lineStride) - lineStride;
            var wallIndex = Math.floor(position / lineStride);

            if(this.lastWallIndex != wallIndex) {
                console.log(this.lastWallIndex +":"+wallIndex);
            }

            debugOut = "position:" + Math.round(position) + " roady:" + roady + " wallIndex:" + wallIndex;
            this.lastWallIndex = wallIndex;
            score = Math.max(wallIndex - 3,0);
            wallIndex =  wallIndex % walls.length

            ctx.font = 'bold 48px sans-serif';
            ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 16;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            ctx.beginPath();
            
            for(; roady < height; roady += lineStride ) {
                                    
                this.lastScore = score;

                if(wallIndex < 0) {
                    if(position < 1000) {
                        wallIndex--;
                        continue; // we want a gap before the first walls.
                    }
                    wallIndex += walls.length;
                }
                // else if(wallIndex >= walls.length) {
                //     wallIndex = wallIndex % walls.length;
                // }

                var wall = walls[wallIndex];
                var gapLeft = wall * (width - gapSize);
                var isPoisonWall = false;//(wallIndex % 5 == 0);
                var isMovingWall = false;//!isPoisonWall && wallIndex % 7 == 6;

                ctx.fillText(wallIndex,10,roady);

                if(isPoisonWall) {
                    this.drawPoisonWall(roady,gapLeft);
                }
                else if(isMovingWall) {
                    this.drawMovingWall(roady,gapLeft);
                }
                else {
                    this.drawWall(roady,gapLeft);
                }

                // quick hit test in the same loop
                //if we are colliding, stop testing ...
                if( !isRubbing && roady + wallHeight > shipCoords.y && 
                   roady < shipCoords.y + ship.height / 2) {
                    if(shipCoords.x < wall * (width - gapSize) ||
                        shipCoords.x > wall * (width - gapSize) + gapSize) {
                        shipCoords.y = roady + wallHeight;
                        isRubbing = true; // 
                        if(isPoisonWall || shipCoords.y > height - ship.height / 2) {
                            isCrashing = true;
                        }
                    }
                    else if(isMovingWall){
                        if (shipCoords.x > gapLeft + Math.round( ( 0.5 + (this.wallOsc.value / 2)) * (gapSize - 20)) &&
                            shipCoords.x < gapLeft + Math.round( ( 0.5 + (this.wallOsc.value / 2)) * (gapSize - 20)) + 20) {
                            isCrashing = true;
                        }
                    }
                }

                wallIndex--;
                
            } 
            ctx.stroke();
        },
        lastWallIndex:0,
        renderPlayingState:function(elapsed,canvas) {
            
            
            isCrashing = false;
            isRubbing = false;
            this.clearScreen();

            this.updatePhysics(elapsed,canvas);

            this.renderWalls(elapsed,canvas);
            this.renderScore();
            this.renderDebug();

            if(controlsVisible && score > 10) {
                controlsVisible = false;
                leftArrow.style.opacity = 0;
                rightArrow.style.opacity = 0;
            }
            
            if(isCrashing) {
                explosionStart = + new Date();
                gameState = "crashing";

                leftArrow.style.opacity = 0;
                rightArrow.style.opacity = 0;
            }
            else {

                // draw ship
                if(!isRubbing) {
                    shipCoords.y *= 0.995;
                    if(shipCoords.y < 300) {
                        shipCoords.y = 300;
                    }
                }
                ctx.save();
                ctx.translate(shipCoords.x,shipCoords.y);
                ctx.rotate(degToRad(shipVelX * 2));
                ctx.drawImage(ship,-ship.width / 2, 0,ship.width / 2,ship.height / 2);
                ctx.restore();
            }

        },
        renderDebug:function(){
            ctx.font = 'normal 18px sans-serif';
            ctx.fillText(debugOut,10,600);
            ctx.stroke();
        },
        update:function(elapsed,canvas) {
            
            // update physics, position of all objects
            if(gameState == "crashing") {
                this.renderCrashState(elapsed,canvas);
            }
            else if(gameState == "ready") {
                this.renderPlayingState(elapsed,canvas);
            }
            // else if(gameState == 'prompt') {
            //     this.renderPrompt(elapsed,canvas);
            // }
            // else {
            //     this.resetLevel();
            // }

        }
    }

})(window);

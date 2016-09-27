 


var Flasher = function(freq,bStartOff,initialValue){
	this.freq = freq;
	this.on = !bStartOff;
	if(initialValue) {
		this.accum = initialValue;
	}
}

Flasher.prototype = {
	freq:1000, // msecs before switching states
	accum:0,
	on:false,
	update:function(elapsed) {
		this.accum += elapsed;
		if(this.accum > this.freq) {
			this.on = !this.on;
			this.accum = 0; 
		}
	}	
};

var Osc = function(freq) {
	this.freq = freq;
}

Osc.prototype = {
	waveType:"sine",
	freq:1000,
	accum:0,
	value:0,
	update:function(elapsed){
		this.accum += elapsed;
		// sine
		this.value = Math.sin(this.accum / this.freq * Math.PI * 2 );
		if(this.accum > this.freq) {
			this.accum -= this.freq;
		}
	}
}
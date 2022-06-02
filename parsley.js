var D = document;
D.title = "TPOLM 9015";

PI = Math.PI;
si = Math.sin;
M = Math.max;
N = Math.min;
Q = Math.sqrt;

var b = D.body;
var Ms = b.style;
Ms.margin='0px';
var blackcolor = Ms.background = "#000";
Ms.overflow = 'hidden';
b.innerHTML = '';
var c = D.createElement('canvas');
b.appendChild(c);
c.style.background = "#fff";

//
// hash canvas context functions larger then 6 characters
// based on a hack documented by cb and p01
// referenced in closure_ctxhash.js
//

var ctx = c.getContext('2d');
for(k in ctx)ctx[k[0]+[k[6]]]=ctx[k];


var w = ctx.width = c.width = window.innerWidth;
var h = ctx.height = c.height = window.innerHeight;


rand = function(n){
	return 0|(Math.random()*n);
};


var pattern = note = 0;

var noise = [];

var startTime = (new Date()).getTime();

//
// request animation frame, from random place on the internet
//

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = M(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



//
// ahx replayer, slightly adapted from ahx.js of Cruisin' / Abyss
// hacked for size, some effects werent being used by the song so they were commented
//
// patched in 2015 to only use AudioContext() instead of deprecated functions in Firefox and webkit 
//

function AHXMaster() {
	/*if(typeof(webkitAudioContext) != 'undefined')
		return new AHXMasterWebKit();
	else if(typeof(new Audio().mozSetup) != 'undefined')
		return new AHXMasterMoz();
	*/
	if(typeof(AudioContext) != 'undefined')
		return new AHXMasterAudioContext();
	else
		return new AHXMasterNull();
}

AHXSong = function() {};

AHXSong.prototype = {
	Name: '',
	Restart: 0,
	PositionNr: 0,
	TrackLength: 0,
	TrackNr: 0,
	InstrumentNr: 0,
	SubsongNr: 0,
	Revision: 0,
	SpeedMultiplier: 0,
	Positions: [],
	Tracks: [],
	Instruments: [],
	Subsongs: [],

	LoadSong: function(url, completionHandler) {
		var Song = this;
		var binString = new dataType();
		binString.data = url;
		Song.InitSong(binString);
		completionHandler();
	},
	
	InitSong: function(stream) { // stream = dataType()
		stream.pos = 3;
		this.Revision = stream.readByte();
		//var streamreadByte = stream.readByteAt;
		//this replace lowers closure but increases png :S
		var SBPtr = 14;
		
		// Header ////////////////////////////////////////////
		// Songname
		var NamePtr = stream.readShort();
		this.Name = stream.readStringAt(NamePtr);
		NamePtr += this.Name.length + 1;
		this.SpeedMultiplier = ((stream.readByteAt(6)>>5)&3)+1;
		
		this.PositionNr = ((stream.readByteAt(6)&0xf)<<8) | stream.readByteAt(7);
		this.Restart = (stream.readByteAt(8)<<8) | stream.readByteAt(9);
		this.TrackLength = stream.readByteAt(10);
		this.TrackNr = stream.readByteAt(11);
		this.InstrumentNr = stream.readByteAt(12);
		this.SubsongNr = stream.readByteAt(13);
		
		// Subsongs //////////////////////////////////////////
		for(var i = 0; i < this.SubsongNr; i++) {
			this.Subsongs.push((stream.readByteAt(SBPtr+0)<<8)|stream.readByteAt(SBPtr+1));
			SBPtr += 2;
		}
		
		// Position List /////////////////////////////////////
		for(var i = 0; i < this.PositionNr; i++) {
			var Pos = AHXPosition();
			for(var j = 0; j < 4; j++) {
				Pos.Track.push(stream.readByteAt(SBPtr++));
				var Transpose = stream.readByteAt(SBPtr++);
				if(Transpose & 0x80) Transpose = (Transpose & 0x7f) - 0x80; // signed char
				Pos.Transpose.push(Transpose);
			}
			this.Positions.push(Pos);
		}

		// Tracks ////////////////////////////////////////////
		var MaxTrack = this.TrackNr;
		//Song.Tracks = new AHXStep*[MaxTrack+1];
		for(var i = 0; i < MaxTrack+1; i++) {
			var Track = [];
			if((stream.readByteAt(6)&0x80)==0x80 && i==0) { // empty track
				for(var j = 0; j < this.TrackLength; j++)
					Track.push(AHXStep());
			} else {
				for(var j = 0; j < this.TrackLength; j++) {
					var Step = AHXStep();
					Step.Note = (stream.readByteAt(SBPtr)>>2)&0x3f;
					Step.Instrument = ((stream.readByteAt(SBPtr)&0x3)<<4) | (stream.readByteAt(SBPtr+1)>>4);
					Step.FX = stream.readByteAt(SBPtr+1)&0xf;
					Step.FXParam = stream.readByteAt(SBPtr+2);
					Track.push(Step);
					SBPtr += 3;
				}
			}
			this.Tracks.push(Track);
		}

		// Instruments ///////////////////////////////////////
		//Song.Instruments = new AHXInstrument[Song.InstrumentNr+1];
		this.Instruments.push(AHXInstrument()); // empty instrument 0
		for(var i = 1; i < this.InstrumentNr+1; i++) {
			var Instrument = AHXInstrument();
			Instrument.Name = stream.readStringAt(NamePtr);
			NamePtr += Instrument.Name.length + 1;
			Instrument.Volume = stream.readByteAt(SBPtr+0);
			Instrument.FilterSpeed = ((stream.readByteAt(SBPtr+1)>>3)&0x1f) | ((stream.readByteAt(SBPtr+12)>>2)&0x20);
			Instrument.WaveLength = stream.readByteAt(SBPtr+1)&0x7;
			Instrument.Envelope.aFrames = stream.readByteAt(SBPtr+2);
			Instrument.Envelope.aVolume = stream.readByteAt(SBPtr+3);
			Instrument.Envelope.dFrames = stream.readByteAt(SBPtr+4); //4
			Instrument.Envelope.dVolume = stream.readByteAt(SBPtr+5);
			Instrument.Envelope.sFrames = stream.readByteAt(SBPtr+6);
			Instrument.Envelope.rFrames = stream.readByteAt(SBPtr+7); //7
			Instrument.Envelope.rVolume = stream.readByteAt(SBPtr+8);
			Instrument.FilterLowerLimit = stream.readByteAt(SBPtr+12)&0x7f;
			Instrument.VibratoDelay = stream.readByteAt(SBPtr+13); //13
			Instrument.HardCutReleaseFrames = (stream.readByteAt(SBPtr+14)>>4)&7;
			Instrument.HardCutRelease = stream.readByteAt(SBPtr+14)&0x80?1:0;
			Instrument.VibratoDepth = stream.readByteAt(SBPtr+14)&0xf; //14
			Instrument.VibratoSpeed = stream.readByteAt(SBPtr+15);
			Instrument.SquareLowerLimit = stream.readByteAt(SBPtr+16);
			Instrument.SquareUpperLimit = stream.readByteAt(SBPtr+17); //17
			Instrument.SquareSpeed = stream.readByteAt(SBPtr+18);
			Instrument.FilterUpperLimit = stream.readByteAt(SBPtr+19)&0x3f; //19
			Instrument.PList.Speed = stream.readByteAt(SBPtr+20);
			Instrument.PList.Length= stream.readByteAt(SBPtr+21);
			SBPtr += 22;
			//Instrument.PList.Entries=new AHXPListEntry[Instrument.PList.Length);
			for(var j = 0; j < Instrument.PList.Length; j++) {
				var Entry = AHXPlistEntry();
				Entry.FX[0] = (stream.readByteAt(SBPtr+0)>>2)&7;
				Entry.FX[1] = (stream.readByteAt(SBPtr+0)>>5)&7;
				Entry.Waveform = ((stream.readByteAt(SBPtr+0)<<1)&6) | (stream.readByteAt(SBPtr+1)>>7);
				Entry.Fixed = (stream.readByteAt(SBPtr+1)>>6)&1;
				Entry.Note = stream.readByteAt(SBPtr+1)&0x3f;
				Entry.FXParam[0] = stream.readByteAt(SBPtr+2);
				Entry.FXParam[1] = stream.readByteAt(SBPtr+3);
				Instrument.PList.Entries.push(Entry);
				SBPtr += 4;
			}
			this.Instruments.push(Instrument);
		}
	}
}

function AHXPosition() {
	return {
		Track: [],
		Transpose: []
	}
}

function AHXStep() {
	return {
		Note: 0,
		Instrument: 0,
		FX: 0,
		FXParam: 0
	}
}

function AHXPlistEntry() {
	return {
		Note: 0,
		Fixed: 0,
		Waveform: 0,
		FX: [0, 0],
		FXParam: [0, 0]
	}
}

function AHXPList() {
	return {
		Speed: 0,
		Length: 0,
		Entries: []
	}
}

function AHXEnvelope() {
	return {
		aFrames: 0, aVolume: 0,
		dFrames: 0, dVolume: 0,
		sFrames: 0,
		rFrames: 0, rVolume: 0
	}
}

function AHXInstrument() {
	return {
		Name: '',
		Volume: 0,
		WaveLength: 0,
		Envelope: AHXEnvelope(),
		FilterLowerLimit: 0, FilterUpperLimit: 0, FilterSpeed: 0,
		SquareLowerLimit: 0, SquareUpperLimit: 0, SquareSpeed: 0,
		VibratoDelay: 0, VibratoDepth: 0, VibratoSpeed: 0,
		HardCutRelease: 0, HardCutReleaseFrames: 0,
		PList: AHXPList()
	}
}


function AHXVoice() {
	return {
		// Read those variables for mixing!
		VoiceVolume: 0, VoicePeriod: 0,
		VoiceBuffer: [], //char VoiceBuffer[0x281]; // for oversampling optimization!

		Track: 0, Transpose: 0,
		NextTrack: 0, NextTranspose: 0,
		ADSRVolume: 0, // fixed point 8:8
		ADSR: AHXEnvelope(), // frames/delta fixed 8:8
		Instrument: null, // current instrument
		InstrPeriod: 0, TrackPeriod: 0, VibratoPeriod: 0,
		NoteMaxVolume: 0, PerfSubVolume: 0, TrackMasterVolume: 0x40,
		NewWaveform: 0, Waveform: 0, PlantSquare: 0, PlantPeriod: 0, IgnoreSquare: 0,
		TrackOn: 1, FixedNote: 0,
		VolumeSlideUp: 0, VolumeSlideDown: 0,
		HardCut: 0, HardCutRelease: 0, HardCutReleaseF: 0,
		PeriodSlideSpeed: 0, PeriodSlidePeriod: 0, PeriodSlideLimit: 0, PeriodSlideOn: 0, PeriodSlideWithLimit: 0,
		PeriodPerfSlideSpeed: 0, PeriodPerfSlidePeriod: 0, PeriodPerfSlideOn: 0,
		VibratoDelay: 0, VibratoCurrent: 0, VibratoDepth: 0, VibratoSpeed: 0,
		SquareOn: 0, SquareInit: 0, SquareWait: 0, SquareLowerLimit: 0, SquareUpperLimit: 0, SquarePos: 0, SquareSign: 0, SquareSlidingIn: 0, SquareReverse: 0,
		FilterOn: 0, FilterInit: 0, FilterWait: 0, FilterLowerLimit: 0, FilterUpperLimit: 0, FilterPos: 0, FilterSign: 0, FilterSpeed: 0, FilterSlidingIn: 0, IgnoreFilter: 0,
		PerfCurrent: 0, PerfSpeed: 0, PerfWait: 0,
		WaveLength: 0,
		PerfList: null,
		NoteDelayWait: 0, NoteDelayOn: 0, NoteCutWait: 0, NoteCutOn: 0,
		AudioSource: [],
		//char* AudioSource,
		AudioPeriod: 0, AudioVolume: 0,
		//SquareTempBuffer: new Array(0x80), //char SquareTempBuffer[0x80]: 0,
		
		CalcADSR: function() {
			var tA = this.ADSR;
			var tiE = this.Instrument.Envelope;
			tA.aFrames = tiE.aFrames;
			tA.aVolume = tiE.aVolume*256/tA.aFrames;
			tA.dFrames = tiE.dFrames;
			tA.dVolume = (tiE.dVolume-tiE.aVolume)*256/tA.dFrames;
			tA.sFrames = tiE.sFrames;
			tA.rFrames = tiE.rFrames;
			tA.rVolume = (tiE.rVolume-tiE.dVolume)*256/tA.rFrames;
		}
	}
}

function AHXWaves() {
	this.GenerateTriangle = function(Len) {
		var Buffer = [];
		var d2 = Len;
		var d5 = d2 >> 2;
		var d1 = 128/d5;
		var d4 = -(d2 >> 1);
		var eax = 0;
		for(var ecx = 0; ecx < d5; ecx++) {
			Buffer.push(eax);
			eax += d1;
		}
		Buffer.push(0x7f);
		if(d5 != 1) {
			eax = 128;
			for(var ecx = 0; ecx < d5-1; ecx++) {
				eax -= d1;
				Buffer.push(eax);
			}
		}
		var esi = Buffer.length + d4;
		for(var ecx = 0; ecx < d5*2; ecx++) {
			var neu = Buffer[esi++]
			if(neu == 0x7f) 
				neu = -0x80;
			else 
				neu = -neu;
			Buffer.push(neu);
		}
		return Buffer;
	}
	this.GenerateSquare = function() {
		var Buffer = [];
		for(var ebx = 1; ebx <= 0x20; ebx++) {
			for(var ecx = 0; ecx < (0x40-ebx)*2; ecx++) Buffer.push(-0x80);
			for(var ecx = 0; ecx <       ebx *2; ecx++) Buffer.push(0x7f);
		}
		return Buffer;
	}
	this.GenerateSawtooth = function(Len) {
		var Buffer = [];
		var ebx = 0|(256/(Len-1)), eax = -128;
		for(var ecx = 0; ecx < Len; ecx++) {
			Buffer.push(eax);
			eax += ebx;
		}
		return Buffer;
	}

/*	
	this.GenerateWhiteNoise = function(Len) {
//
// bartMan says this is the original code, but i suck at opcode porting
// so based on analysing the noise table i hacked an estimated function instead
// but left this code commented here for reference
//
//	void AHXWaves::GenerateWhiteNoise(char* Buffer, int Len)
//	{
//	  __asm {
//		  mov edi, Buffer
//		  mov ecx, Len
//		  mov eax, 0x41595321 // AYS!
//	loop0:    test eax, 0x100
//		  je lower
//		  cmp ax, 0
//		  jl mi
//		  mov byte ptr [edi], 0x7f
//		  jmp weida
//	mi:        mov byte ptr [edi], 0x80
//		  jmp weida
//	lower:    mov byte ptr [edi], al
//	weida:    inc edi
//		  ror eax, 5
//		  xor al, 10011010b
//		  mov bx, ax
//		  rol eax, 2
//		  add bx, ax
//		  xor ax, bx
//		  ror eax, 3
//		  dec ecx
//		  jnz loop0
//	  }
//	}
	
		var noise = [];
		var size = Len;
		var eax = 0x41595321;
		var al = bx = ax = 0;
		
		for(var edi = size-1; edi>0; edi--)
		{
			if (eax == 0x100) {
				noise[edi] = al;
			} else {
				if (ax < 0) {
					noise[edi] = 0x80;
				 } else {
					noise[edi] = 0x7f;
				 }
			}		
			eax = eax >>> 5; //this should be ror eax, 5...
			al ^= (2+8+16+128);
			bx = ax;
			var shift = 2 & 31;
			if(shift) {
			  var maskLeft = 1 << (32 - shift);
			  var thisShiftLeft = eax & ~maskLeft;
			  var shiftedLeft = (thisShiftLeft) << shift;
			  var rightStuff = eax >>> (32 - shift);
			  eax = shiftedLeft | rightStuff;
			}  
			bx += ax;
			ax ^= bx;
			eax = eax >>> 3; //this should be ror eax, 3...
		}
		return noise;
	}*/
	
	//
	// estimated function hack, not accurate to original
	//
	this.GenerateWhiteNoise = function(Len) {
		//var noise = [];
		var size = Len;
		
		for(var i = 0; i<Len; i++)
		{
			noise[i] = rand(255);
			if (rand(10) < 6) noise[i] = 0x80 - rand(2);
		}
		return noise;
	}
	this.Filter = function(input, fre, lowOrHigh) { // 0 = low, 1 = high
		var high, mid = .0, low = .0;
		var output = [];
		for(var i = 0; i < input.length; i++) {
			high = input[i] - mid - low; high = N(127.0, M(-128.0, high));
			mid += high*fre;  mid = N(127.0, M(-128.0, mid));
			low += mid*fre;  low = N(127.0, M(-128.0, low));
		}
		for(var i = 0; i < input.length; i++) {
			high = input[i] - mid - low; high = N(127.0, M(-128.0, high));
			mid += high*fre;  mid = N(127.0, M(-128.0, mid));
			low += mid*fre;  low = N(127.0, M(-128.0, low));
			if(lowOrHigh)
				output.push(0|(high));
			else
				output.push(0|(low));
		}
		return output;
	}
	
	this.GenerateFilterWaveforms = function() {
		var src = this.FilterSets[31];
		var tfs = this.Filter;
		var freq = 8;
		var temp = 0;
		while(temp < 31) {
			var dstLow = {};
			dstLow.Sawtooth = [];
			dstLow.Triangle = [];
			var dstHigh = {};
			dstHigh.Sawtooth = [];
			dstHigh.Triangle = [];
			var fre = freq * 1.25 / 100.0;
			for (var i=0; i<=5; i++) {
				dstLow.Sawtooth[i] = tfs(src.Sawtooth[i], fre, 0);
				dstLow.Triangle[i] = tfs(src.Triangle[i], fre, 0);
				dstHigh.Sawtooth[i] = tfs(src.Sawtooth[i], fre, 1);
				dstHigh.Triangle[i] = tfs(src.Triangle[i], fre, 1);
			}
			dstLow.Squares = [];
			dstHigh.Squares = [];
			// squares alle einzeln filtern
			for(var i = 0; i < 0x20; i++) {
				dstLow.Squares = dstLow.Squares.concat(this.Filter(src.Squares.slice(i*0x80, (i+1)*0x80), fre, 0));
				dstHigh.Squares = dstHigh.Squares.concat(this.Filter(src.Squares.slice(i*0x80, (i+1)*0x80), fre, 1));
			}
			dstLow.WhiteNoiseBig = this.Filter(src.WhiteNoiseBig, fre, 0);
			dstHigh.WhiteNoiseBig = this.Filter(src.WhiteNoiseBig, fre, 1);
			
			this.FilterSets[temp] = dstLow;
			this.FilterSets[temp+32] = dstHigh;
			
			temp++;
			freq += 3;
		}
	}

	this.FilterSets = new Array(31+1+31);
	this.FilterSets[31] = {};
	this.FilterSets[31].Sawtooth = [];
	this.FilterSets[31].Sawtooth[0] = this.GenerateSawtooth(0x04);
	this.FilterSets[31].Sawtooth[1] = this.GenerateSawtooth(0x08);
	this.FilterSets[31].Sawtooth[2] = this.GenerateSawtooth(0x10);
	this.FilterSets[31].Sawtooth[3] = this.GenerateSawtooth(0x20);
	this.FilterSets[31].Sawtooth[4] = this.GenerateSawtooth(0x40);
	this.FilterSets[31].Sawtooth[5] = this.GenerateSawtooth(0x80);
	this.FilterSets[31].Triangle = [];
	this.FilterSets[31].Triangle[0] = this.GenerateTriangle(0x04);
	this.FilterSets[31].Triangle[1] = this.GenerateTriangle(0x08);
	this.FilterSets[31].Triangle[2] = this.GenerateTriangle(0x10);
	this.FilterSets[31].Triangle[3] = this.GenerateTriangle(0x20);
	this.FilterSets[31].Triangle[4] = this.GenerateTriangle(0x40);
	this.FilterSets[31].Triangle[5] = this.GenerateTriangle(0x80);
	this.FilterSets[31].Squares = this.GenerateSquare();
	this.FilterSets[31].WhiteNoiseBig = this.GenerateWhiteNoise(0x280*3);
	this.GenerateFilterWaveforms();

	return this;
}


function AHXPlayer(waves) {
	return {
		StepWaitFrames: 0, GetNewPosition: 0, SongEndReached: 0, TimingValue: 0,
		PatternBreak: 0,
		MainVolume: 0,
		Playing: 0, Tempo: 0,
		PosNr: 0, PosJump: 0,
		NoteNr: 0, PosJumpNote: 0,
		WaveformTab: [], //char* WaveformTab[4];
		Waves: waves || new AHXWaves(),
		Voices: [],
		WNRandom: 0,
		Song: AHXSong(),
		PlayingTime: 0,

		//
		// hacked the functions calling VibratoTable to calculate the mirrored values instead of using the lookup
		//
		VibratoTable: [
			0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,
			253,250,244,235,224,212,197,180,161,141,120,97,74,49,24
//			,0,-24,-49,-74,-97,-120,-141,-161,-180,-197,-212,-224,-235,-244,-250,-253,-255,
//			-253,-250,-244,-235,-224,-212,-197,-180,-161,-141,-120,-97,-74,-49,-24
		],

		PeriodTable: [
			0x0000, 0x0D60, 0x0CA0, 0x0BE8, 0x0B40, 0x0A98, 0x0A00, 0x0970,
			0x08E8, 0x0868, 0x07F0, 0x0780, 0x0714, 0x06B0, 0x0650, 0x05F4,
			0x05A0, 0x054C, 0x0500, 0x04B8, 0x0474, 0x0434, 0x03F8, 0x03C0,
			0x038A, 0x0358, 0x0328, 0x02FA, 0x02D0, 0x02A6, 0x0280, 0x025C,
			0x023A, 0x021A, 0x01FC, 0x01E0, 0x01C5, 0x01AC, 0x0194, 0x017D,
			0x0168, 0x0153, 0x0140, 0x012E, 0x011D, 0x010D, 0x00FE, 0x00F0,
			0x00E2, 0x00D6, 0x00CA, 0x00BE, 0x00B4, 0x00AA, 0x00A0, 0x0097,
			0x008F, 0x0087, 0x007F, 0x0078, 0x0071
		],

		InitSong: function(song) { // song: AHXSong()
			this.Song = song;
		},
		
		InitSubsong: function(Nr) {
			if(Nr > this.Song.SubsongNr) return 0;
		
			if(Nr == 0) this.PosNr = 0;
			       else this.PosNr = Song.Subsongs[Nr-1];
		
			this.PosJump = 0;
			this.PatternBreak = 0;
			this.MainVolume = 0x40;
			this.Playing = 1;
			this.NoteNr = this.PosJumpNote = 0;
			this.Tempo = 6;
			this.StepWaitFrames = 0;
			this.GetNewPosition = 1;
			this.SongEndReached = 0;
			this.TimingValue = this.PlayingTime = 0;

			this.Voices = [ AHXVoice(), AHXVoice(), AHXVoice(), AHXVoice() ];		
		
			return 1;
		},
		
		PlayIRQ: function() {
			if(this.StepWaitFrames <= 0) {
				if(this.GetNewPosition) {
					var NextPos = (this.PosNr+1==this.Song.PositionNr)?0:(this.PosNr+1);
					for(var i = 0; i < 4; i++) {
						this.Voices[i].Track = this.Song.Positions[this.PosNr].Track[i];
						this.Voices[i].Transpose = this.Song.Positions[this.PosNr].Transpose[i];
						this.Voices[i].NextTrack = this.Song.Positions[NextPos].Track[i];
						this.Voices[i].NextTranspose = this.Song.Positions[NextPos].Transpose[i];
					}
					//console.log("pattern:" + NextPos);
					pattern = NextPos;
					this.GetNewPosition = 0;
				}
				for(var i = 0; i < 4; i++) this.ProcessStep(i);
				this.StepWaitFrames = this.Tempo;
			}
			//DoFrameStuff
			for(var i = 0; i < 4; i++) this.ProcessFrame(i);
			this.PlayingTime++;
			if(this.Tempo > 0 && --this.StepWaitFrames <= 0) {
				if(!this.PatternBreak) {
					this.NoteNr++;
					if(this.NoteNr >= this.Song.TrackLength) {
						this.PosJump = this.PosNr+1;
						this.PosJumpNote = 0;
						this.PatternBreak = 1;
					}
				}
				if(this.PatternBreak) {
					this.PatternBreak = 0;
					this.NoteNr = this.PosJumpNote;
					this.PosJumpNote = 0;
					this.PosNr = this.PosJump;
					this.PosJump = 0;
					if(this.PosNr == this.Song.PositionNr) {
						this.SongEndReached = 1;
						this.PosNr = this.Song.Restart;
					}
					this.GetNewPosition = 1;
				}
			}
			//RemainPosition
			for(var a = 0; a < 4; a++) this.SetAudio(a);
		},

		NextPosition: function() {
			this.PosNr++;
			if(this.PosNr == this.Song.PositionNr) this.PosNr = 0;
			this.StepWaitFrames = 0;
			this.GetNewPosition = 1;
		},
		
		PrevPosition: function() {
			this.PosNr--;
			if(this.PosNr < 0) this.PosNr = 0;
			this.StepWaitFrames = 0;
			this.GetNewPosition = 1;
		},
		
		JumpPosition: function(pos) {
			this.PosNr = pos;
			this.StepWaitFrames = 0;
			this.GetNewPosition = 1;
		},

		ProcessStep: function(v) {
			var tV = this.Voices[v];
			if(!tV.TrackOn) return;
			//console.log("note: " + this.NoteNr);
			note = this.NoteNr;
			tV.VolumeSlideUp = tV.VolumeSlideDown = 0;
		
			var Note = this.Song.Tracks[this.Song.Positions[this.PosNr].Track[v]][this.NoteNr].Note;
			var Instrument = this.Song.Tracks[this.Song.Positions[this.PosNr].Track[v]][this.NoteNr].Instrument;
			var FX = this.Song.Tracks[this.Song.Positions[this.PosNr].Track[v]][this.NoteNr].FX;
			var FXParam = this.Song.Tracks[this.Song.Positions[this.PosNr].Track[v]][this.NoteNr].FXParam;
		
			switch(FX) {
				case 0x0: // Position Jump HI
					if((FXParam & 0xf) > 0 && (FXParam & 0xf) <= 9)
						this.PosJump = FXParam & 0xf;
					break;
/*				case 0x5: // Volume Slide + Tone Portamento
				case 0xa: // Volume Slide
					tV.VolumeSlideDown = FXParam & 0x0f;
					tV.VolumeSlideUp   = FXParam >> 4;
					break;*/
				case 0xb: // Position Jump
					this.PosJump = this.PosJump*100 + (FXParam & 0x0f) + (FXParam >> 4)*10;
					this.PatternBreak = 1;
					break;
/*				case 0xd: // Patternbreak
					this.PosJump = this.PosNr + 1;
					this.PosJumpNote = (FXParam & 0x0f) + (FXParam >> 4)*10;
					if(this.PosJumpNote > this.Song.TrackLength) this.PosJumpNote = 0;
					this.PatternBreak = 1;
					break;
				case 0xe: // Enhanced commands
					switch(FXParam >> 4) {
						case 0xc: // Note Cut
							if((FXParam & 0x0f) < this.Tempo) {
								tV.NoteCutWait = FXParam & 0x0f;
								if(tV.NoteCutWait) {
									tV.NoteCutOn = 1;
									tV.HardCutRelease = 0;
								}
							}
							break;
						case 0xd: // Note Delay
							if(tV.NoteDelayOn) {
								tV.NoteDelayOn = 0;
							} else {
								if((FXParam & 0x0f) < this.Tempo) {
									tV.NoteDelayWait = FXParam & 0x0f;
									if(tV.NoteDelayWait) {
										tV.NoteDelayOn = 1;
										return;
									}
								}
							}
							break;
					}
					break;*/
				case 0xf: // Speed
					this.Tempo = FXParam;
					break;
			}
			if(Instrument) {
				tV.PerfSubVolume = 0x40;
				tV.PeriodSlideSpeed = tV.PeriodSlidePeriod = tV.PeriodSlideLimit = 0;
				tV.ADSRVolume = 0;
				tV.Instrument = this.Song.Instruments[Instrument];
				tV.CalcADSR();
				//InitOnInstrument
				tV.WaveLength = tV.Instrument.WaveLength;
				tV.NoteMaxVolume = tV.Instrument.Volume;
				//InitVibrato
				tV.VibratoCurrent = 0;
				tV.VibratoDelay = tV.Instrument.VibratoDelay;
				tV.VibratoDepth = tV.Instrument.VibratoDepth;
				tV.VibratoSpeed = tV.Instrument.VibratoSpeed;
				tV.VibratoPeriod = 0;
				//InitHardCut
				tV.HardCutRelease = tV.Instrument.HardCutRelease;
				tV.HardCut = tV.Instrument.HardCutReleaseFrames;
				//InitSquare
				tV.IgnoreSquare = tV.SquareSlidingIn = 0;
				tV.SquareWait = tV.SquareOn = 0;
				var SquareLower = tV.Instrument.SquareLowerLimit >> (5-tV.WaveLength);
				var SquareUpper = tV.Instrument.SquareUpperLimit >> (5-tV.WaveLength);
				if(SquareUpper < SquareLower) { var t = SquareUpper; SquareUpper = SquareLower; SquareLower = t; }
				tV.SquareUpperLimit = SquareUpper;
				tV.SquareLowerLimit = SquareLower;
				//InitFilter
				tV.IgnoreFilter = tV.FilterWait = tV.FilterOn = 0;
				tV.FilterSlidingIn = 0;
				var d6 = tV.Instrument.FilterSpeed;
				var d3 = tV.Instrument.FilterLowerLimit;
				var d4 = tV.Instrument.FilterUpperLimit;
				if(d3 & 0x80) d6 |= 0x20;
				if(d4 & 0x80) d6 |= 0x40;
				tV.FilterSpeed = d6;
				d3 &= ~0x80;
				d4 &= ~0x80;
				if(d3 > d4) { var t = d3; d3 = d4; d4 = t; }
				tV.FilterUpperLimit = d4;
				tV.FilterLowerLimit = d3;
				tV.FilterPos = 32;
				//Init PerfList
				tV.PerfWait  = tV.PerfCurrent = 0;
				tV.PerfSpeed = tV.Instrument.PList.Speed;
				tV.PerfList  = tV.Instrument.PList;
			}
			//NoInstrument
			tV.PeriodSlideOn = 0;
		
/*			switch(FX) {
				case 0x4: // Override filter
					break;
				case 0x9: // Set Squarewave-Offset
					tV.SquarePos = FXParam >> (5 - tV.WaveLength);
					tV.PlantSquare = 1;
					tV.IgnoreSquare = 1;
					break;
				case 0x5: // Tone Portamento + Volume Slide
				case 0x3: // Tone Portamento (Period Slide Up/Down w/ Limit)
					if(FXParam != 0) tV.PeriodSlideSpeed = FXParam;
					if(Note) {
						var Neue = this.PeriodTable[Note];
						var Alte = this.PeriodTable[tV.TrackPeriod];
						Alte -= Neue;
						Neue = Alte + tV.PeriodSlidePeriod;
						if(Neue) tV.PeriodSlideLimit = -Alte;
					}
					tV.PeriodSlideOn = 1;
					tV.PeriodSlideWithLimit = 1;
					Note = 0;
			}*/
		
			// Note anschlagen
			if(Note) {
				tV.TrackPeriod = Note;
				tV.PlantPeriod = 1;
			}

			switch(FX) {
/*				case 0x1: // Portamento up (Period slide down)
					tV.PeriodSlideSpeed = -FXParam;
					tV.PeriodSlideOn = 1;
					tV.PeriodSlideWithLimit = 0;
					break;
				case 0x2: // Portamento down (Period slide up)
					tV.PeriodSlideSpeed = FXParam;
					tV.PeriodSlideOn = 1;
					tV.PeriodSlideWithLimit = 0;
					break;*/
				case 0xc: // Volume
					if(FXParam <= 0x40) 
						tV.NoteMaxVolume = FXParam;
					else {
						FXParam -= 0x50;
						if(FXParam <= 0x40)
							for(var i = 0; i < 4; i++) this.Voices[i].TrackMasterVolume = FXParam;
						else {
							FXParam -= 0xa0 - 0x50;
							if(FXParam <= 0x40)
								tV.TrackMasterVolume = FXParam;
						}
					}
					break;
/*				case 0xe: // Enhanced commands
					switch(FXParam >> 4) {
						case 0x1: // Fineslide up (Period fineslide down)
							tV.PeriodSlidePeriod = -(FXParam & 0x0f);
							tV.PlantPeriod = 1;
							break;
						case 0x2: // Fineslide down (Period fineslide up)
							tV.PeriodSlidePeriod = FXParam & 0x0f;
							tV.PlantPeriod = 1;
							break;
						case 0x4: // Vibrato control
							tV.VibratoDepth = FXParam & 0x0f;
							break;
						case 0xa: // Finevolume up
							tV.NoteMaxVolume += FXParam & 0x0f;
							if(tV.NoteMaxVolume > 0x40) tV.NoteMaxVolume = 0x40;
							break;
						case 0xb: // Finevolume down
							tV.NoteMaxVolume -= FXParam & 0x0f;
							if(tV.NoteMaxVolume < 0) tV.NoteMaxVolume = 0;
							break;
					}
					break;*/
			}
		}, // ProcessStep
		
		ProcessFrame: function(v) {
			var tV = this.Voices[v];

			if(!tV.TrackOn) return;
		
			if(tV.NoteDelayOn) {
				if(tV.NoteDelayWait <= 0) 
					this.ProcessStep(v);
				else 
					tV.NoteDelayWait--;
			}
			if(tV.HardCut) {
				var NextInstrument;
				if(this.NoteNr+1 < this.Song.TrackLength) 
					NextInstrument = this.Song.Tracks[tV.Track][this.NoteNr+1].Instrument;
				else 
					NextInstrument = this.Song.Tracks[tV.NextTrack][0].Instrument;
				if(NextInstrument) {
					var d1 = this.Tempo - tV.HardCut;
					if(d1 < 0) d1 = 0;
					if(!tV.NoteCutOn) {
						tV.NoteCutOn = 1;
						tV.NoteCutWait = d1;
						tV.HardCutReleaseF = -(d1 - this.Tempo);
					} else 
						tV.HardCut = 0;
				}
			}
			if(tV.NoteCutOn) {
				if(tV.NoteCutWait <= 0) {
					tV.NoteCutOn = 0;
					if(tV.HardCutRelease) {
						tV.ADSR.rVolume = -(tV.ADSRVolume - (tV.Instrument.Envelope.rVolume << 8))/tV.HardCutReleaseF;
						tV.ADSR.rFrames = tV.HardCutReleaseF;
						tV.ADSR.aFrames = tV.ADSR.dFrames = tV.ADSR.sFrames = 0;
					} else 
						tV.NoteMaxVolume = 0;
				} else 
					tV.NoteCutWait--;
			}
			//adsrEnvelope
			if(tV.ADSR.aFrames) {
				tV.ADSRVolume += tV.ADSR.aVolume; // Delta
				if(--tV.ADSR.aFrames <= 0) tV.ADSRVolume = tV.Instrument.Envelope.aVolume << 8;
			} else if(tV.ADSR.dFrames) {
				tV.ADSRVolume += tV.ADSR.dVolume; // Delta
				if(--tV.ADSR.dFrames <= 0) tV.ADSRVolume = tV.Instrument.Envelope.dVolume << 8;
			} else if(tV.ADSR.sFrames) {
				tV.ADSR.sFrames--;
			} else if(tV.ADSR.rFrames) {
				tV.ADSRVolume += tV.ADSR.rVolume; // Delta
				if(--tV.ADSR.rFrames <= 0) tV.ADSRVolume = tV.Instrument.Envelope.rVolume << 8;
			}
			//VolumeSlide
			tV.NoteMaxVolume = tV.NoteMaxVolume + tV.VolumeSlideUp - tV.VolumeSlideDown;
			if(tV.NoteMaxVolume < 0) tV.NoteMaxVolume = 0;
			if(tV.NoteMaxVolume > 0x40) tV.NoteMaxVolume = 0x40;
			//Portamento
			if(tV.PeriodSlideOn) {
				if(tV.PeriodSlideWithLimit) {
					var d0 = tV.PeriodSlidePeriod - tV.PeriodSlideLimit;
					var d2 = tV.PeriodSlideSpeed;
					if(d0 > 0) d2 = -d2;
					if(d0) {
						var d3 = (d0 + d2) ^ d0;
						if(d3 >= 0) d0 = tV.PeriodSlidePeriod + d2;
						       else d0 = tV.PeriodSlideLimit;
						tV.PeriodSlidePeriod = d0;
						tV.PlantPeriod = 1;
					}
				} else {
					tV.PeriodSlidePeriod += tV.PeriodSlideSpeed;
					tV.PlantPeriod = 1;
				}
			}
			//Vibrato
			if(tV.VibratoDepth) {
				if(tV.VibratoDelay <= 0) {
					//tV.VibratoPeriod = (this.VibratoTable[tV.VibratoCurrent] * tV.VibratoDepth) >> 7;
					var vc = tV.VibratoCurrent;
					var vt;
					if (tV.VibratoCurrent > 31) vt = -this.VibratoTable[32-tV.VibratoCurrent];
						else vt = this.VibratoTable[tV.VibratoCurrent];
				
					tV.VibratoPeriod = (vt * tV.VibratoDepth) >> 7;
					tV.PlantPeriod = 1;
					tV.VibratoCurrent = (vc + tV.VibratoSpeed) & 0x3f;
				} else tV.VibratoDelay--;
			}
			//PList
			if(tV.Instrument && tV.PerfCurrent < tV.Instrument.PList.Length) {
				if(--tV.PerfWait <= 0) {
					var Cur = tV.PerfCurrent++;
					tV.PerfWait = tV.PerfSpeed;
					if(tV.PerfList.Entries[Cur].Waveform) {
						tV.Waveform = tV.PerfList.Entries[Cur].Waveform-1;
						tV.NewWaveform = 1;
						tV.PeriodPerfSlideSpeed = tV.PeriodPerfSlidePeriod = 0;
					}
					//Holdwave
					tV.PeriodPerfSlideOn = 0;
					for(var i = 0; i < 2; i++) this.PListCommandParse(v, tV.PerfList.Entries[Cur].FX[i], tV.PerfList.Entries[Cur].FXParam[i]);
					//GetNote
					if(tV.PerfList.Entries[Cur].Note) {
						tV.InstrPeriod = tV.PerfList.Entries[Cur].Note;
						tV.PlantPeriod = 1;
						tV.FixedNote = tV.PerfList.Entries[Cur].Fixed;
					}
				}
			} else {
				if(tV.PerfWait) tV.PerfWait--;
				                  else tV.PeriodPerfSlideSpeed = 0;
			}
			//PerfPortamento
			if(tV.PeriodPerfSlideOn) {
				tV.PeriodPerfSlidePeriod -= tV.PeriodPerfSlideSpeed;
				if(tV.PeriodPerfSlidePeriod) tV.PlantPeriod = 1;
			}
			if(tV.Waveform == 3-1 && tV.SquareOn) {
				if(--tV.SquareWait <= 0) {
					var d1 = tV.SquareLowerLimit;
					var	d2 = tV.SquareUpperLimit;
					var d3 = tV.SquarePos;
					if(tV.SquareInit) {
						tV.SquareInit = 0;
						if(d3 <= d1) { 
							tV.SquareSlidingIn = 1;
							tV.SquareSign = 1;
						} else if(d3 >= d2) {
							tV.SquareSlidingIn = 1;
							tV.SquareSign = -1;
						}
				}
					//NoSquareInit
					if(d1 == d3 || d2 == d3) {
						if(tV.SquareSlidingIn) {
							tV.SquareSlidingIn = 0;
						} else {
							tV.SquareSign = -tV.SquareSign;
						}
					}
					d3 += tV.SquareSign;
					tV.SquarePos = d3;
					tV.PlantSquare = 1;
					tV.SquareWait = tV.Instrument.SquareSpeed;
				}
			}
			if(tV.FilterOn && --tV.FilterWait <= 0) {
				var d1 = tV.FilterLowerLimit;
				var d2 = tV.FilterUpperLimit;
				var d3 = tV.FilterPos;
				if(tV.FilterInit) {
					tV.FilterInit = 0;
					if(d3 <= d1) {
						tV.FilterSlidingIn = 1;
						tV.FilterSign = 1;
					} else if(d3 >= d2) {
						tV.FilterSlidingIn = 1;
						tV.FilterSign = -1;
					}
				}
				//NoFilterInit
				var FMax = (tV.FilterSpeed < 3)?(5-tV.FilterSpeed):1;
				for(var i = 0; i < FMax; i++) {
					if(d1 == d3 || d2 == d3) {
						if(tV.FilterSlidingIn) {
							tV.FilterSlidingIn = 0;
						} else {
							tV.FilterSign = -tV.FilterSign;
						}
					}
					d3 += tV.FilterSign;
				}
				tV.FilterPos = d3;
				tV.NewWaveform = 1;
				tV.FilterWait = tV.FilterSpeed - 3;
				if(tV.FilterWait < 1) tV.FilterWait = 1;
			}
			if(tV.Waveform == 3-1 || tV.PlantSquare) {
				//CalcSquare
				var SquarePtr = this.Waves.FilterSets[tV.FilterPos-1].Squares;
				var SquareOfs = 0;
				var X = tV.SquarePos << (5 - tV.WaveLength);
				if(X > 0x20) {
					X = 0x40 - X;
					tV.SquareReverse = 1;
				}
				//OkDownSquare
				if(X--) SquareOfs = X*0x80; // <- WTF!?
				var Delta = 32 >> tV.WaveLength;
				//WaveformTab[3-1] = tV.SquareTempBuffer;
				var AudioLen = (1 << tV.WaveLength)*4;
				tV.AudioSource = new Array(AudioLen);
				for(var i = 0; i < AudioLen; i++) {
					tV.AudioSource[i] = SquarePtr[SquareOfs];
					SquareOfs += Delta;
				}
				tV.NewWaveform = 1;
				tV.Waveform = 3-1;
				tV.PlantSquare = 0;
			}
			if(tV.Waveform == 4-1) // white noise
				tV.NewWaveform = 1;
		
			if(tV.NewWaveform) {
				if(tV.Waveform != 3-1) { // don't process square
					var FilterSet = 31;
					FilterSet = tV.FilterPos-1;
					
					if(tV.Waveform == 4-1) { // white noise
						var WNStart = (this.WNRandom & (2*0x280-1)) & ~1;
						tV.AudioSource = this.Waves.FilterSets[FilterSet].WhiteNoiseBig.slice(WNStart, WNStart + 0x280);
						//AddRandomMoving
						//GoOnRandom
						this.WNRandom += 2239384;
						this.WNRandom = ((((this.WNRandom >> 8) | (this.WNRandom << 24)) + 782323) ^ 75) - 6735;
					} else if(tV.Waveform == 1-1) { // triangle
						tV.AudioSource = this.Waves.FilterSets[FilterSet].Triangle[tV.WaveLength].slice(); 
					} else if(tV.Waveform == 2-1) { // sawtooth
						tV.AudioSource = this.Waves.FilterSets[FilterSet].Sawtooth[tV.WaveLength].slice();
					}
				}
			}
			//StillHoldWaveform
			//AudioInitPeriod
			tV.AudioPeriod = tV.InstrPeriod;
			if(!tV.FixedNote) tV.AudioPeriod += tV.Transpose + tV.TrackPeriod-1;
			if(tV.AudioPeriod > 5*12) tV.AudioPeriod = 5*12;
			if(tV.AudioPeriod < 0)    tV.AudioPeriod = 0;
			tV.AudioPeriod = this.PeriodTable[tV.AudioPeriod];
			if(!tV.FixedNote) tV.AudioPeriod += tV.PeriodSlidePeriod;
			tV.AudioPeriod += tV.PeriodPerfSlidePeriod + tV.VibratoPeriod;
			if(tV.AudioPeriod > 0x0d60) tV.AudioPeriod = 0x0d60;
			if(tV.AudioPeriod < 0x0071) tV.AudioPeriod = 0x0071;
			//AudioInitVolume
			tV.AudioVolume = ((((((((tV.ADSRVolume >> 8) * tV.NoteMaxVolume) >> 6) * tV.PerfSubVolume) >> 6) * tV.TrackMasterVolume) >> 6) * this.MainVolume) >> 6;
		}, // ProcessFrame

		SetAudio : function(v) {
			var tV = this.Voices[v];

			if(!tV.TrackOn) {
				tV.VoiceVolume = 0;
				return;
			}
		
			tV.VoiceVolume = tV.AudioVolume;
			if(tV.PlantPeriod) {
				tV.PlantPeriod = 0;
				tV.VoicePeriod = tV.AudioPeriod;
			}
			if(tV.NewWaveform) {
				if(tV.Waveform == 4-1) { // for white noise, copy whole 0x280 samples
					tV.VoiceBuffer = tV.AudioSource.slice();
				} else {
					var WaveLoops = (1 << (5-tV.WaveLength))*5;
					var LoopLen = 4*(1 << tV.WaveLength);
					if(!tV.AudioSource.length) {
						tV.VoiceBuffer = new Array(WaveLoops * LoopLen);
						for(var i = 0; i < WaveLoops * LoopLen; i++) {
							tV.VoiceBuffer = 0;
						}
					} else {
						tV.VoiceBuffer = [];
						for(var i = 0; i < WaveLoops; i++) {
							tV.VoiceBuffer = tV.VoiceBuffer.concat(tV.AudioSource.slice(0, LoopLen));
						}
					}
				}
				//tV.VoiceBuffer[0x280] = tV.VoiceBuffer[0];
			}
		}, // SetAudio
		
		PListCommandParse: function(v, FX, FXParam) {
			var tV = this.Voices[v];

			switch(FX) {
				case 0: 
					if(this.Song.Revision > 0 && FXParam != 0) {
						if(tV.IgnoreFilter) {
							tV.FilterPos = tV.IgnoreFilter;
							tV.IgnoreFilter = 0;
						} else tV.FilterPos = FXParam;
						tV.NewWaveform = 1;
					}
					break;
/*				case 1:
					tV.PeriodPerfSlideSpeed = FXParam;
					tV.PeriodPerfSlideOn = 1;
					break;*/
				case 2:
					tV.PeriodPerfSlideSpeed = -FXParam;
					tV.PeriodPerfSlideOn = 1;
					break;
				case 3: // Init Square Modulation
					if(!tV.IgnoreSquare) {
						tV.SquarePos = FXParam >> (5-tV.WaveLength);
					} else tV.IgnoreSquare = 0;
					break;
				case 4: // Start/Stop Modulation
					if(this.Song.Revision == 0 || FXParam == 0) {
						tV.SquareInit = (tV.SquareOn ^= 1);
						tV.SquareSign = 1;
					} else {
						if(FXParam & 0x0f) {
							tV.SquareInit = (tV.SquareOn ^= 1);
							tV.SquareSign = 1;
							if((FXParam & 0x0f) == 0x0f) tV.SquareSign = -1;
						}
						if(FXParam & 0xf0) {
							tV.FilterInit = (tV.FilterOn ^= 1);
							tV.FilterSign = 1;
							if((FXParam & 0xf0) == 0xf0) tV.FilterSign = -1;
						}
					}
					break;
				case 5: // Jump to Step [xx]
					tV.PerfCurrent = FXParam;
					break;
				case 6: // Set Volume
					if(FXParam > 0x40) {
						if((FXParam -= 0x50) >= 0) {
							if(FXParam <= 0x40) tV.PerfSubVolume = FXParam;
							else 
								if((FXParam -= 0xa0-0x50) >= 0) 
									if(FXParam <= 0x40) tV.TrackMasterVolume = FXParam;
						}
					} else tV.NoteMaxVolume = FXParam;
					break;
				case 7: // set speed
					tV.PerfSpeed = tV.PerfWait = FXParam;
					break;
			}
		}, // PListCommandParse
		
		VoiceOnOff: function(Voice, OnOff) {
			if(Voice < 0 || Voice > 3) return;
			this.Voices[Voice].TrackOn = OnOff;
		} // VoiceOnOff
	}
}


function AHXOutput(player) {
	return {
		Player: player || AHXPlayer(),

		Init: function(Frequency, Bits) {
			this.Frequency = Frequency;
			this.Bits = Bits;
			this.BufferSize = 0|(Frequency/50);
			this.MixingBuffer = new Array(this.BufferSize);
		},
		
		pos: [0, 0, 0, 0],
		MixChunk: function(NrSamples, mb) {
			var dummy = 0;
			for(var v = 0; v < 4; v++) {
				if(this.Player.Voices[v].VoiceVolume == 0) continue;
				var freq = 3579545.25 / this.Player.Voices[v].VoicePeriod; // #define Period2Freq(period) (3579545.25f / (period))
				var delta = 0|(freq * (1 << 16) / this.Frequency);
				var samples_to_mix = NrSamples;
				var mixpos = 0;
				while(samples_to_mix) {
					if(this.pos[v] >= (0x280 << 16)) this.pos[v] -= 0x280 << 16;
					var thiscount = N(samples_to_mix, 0|(((0x280 << 16)-this.pos[v]-1) / delta) + 1);
					samples_to_mix -= thiscount;
					//int* VolTab = &VolumeTable[Player->Voices[v].VoiceVolume][128];
					//INNER LOOP
/*					if(Oversampling) {
						for(int i = 0; i < thiscount; i++) {
							int offset = pos[v] >> 16;
							int sample1 = VolTab[Player->Voices[v].VoiceBuffer[offset]];
							int sample2 = VolTab[Player->Voices[v].VoiceBuffer[offset+1]];
							int frac1 = pos[v] & ((1 << 16) - 1);
							int frac2 = (1 << 16) - frac1;
							(*mb)[mixpos++] += ((sample1 * frac2) + (sample2 * frac1)) >> 16;
							pos[v] += delta;
						}
					} else*/ {
						for(var i = 0; i < thiscount; i++) {
							this.MixingBuffer[mb + mixpos++] += this.Player.Voices[v].VoiceBuffer[this.pos[v] >> 16] * this.Player.Voices[v].VoiceVolume >> 6;
							this.pos[v] += delta;
						}
					}
				} // while
			} // v = 0-3
			mb += NrSamples;
			return mb;
		}, // MixChunk

		MixBuffer: function() { // Output: 1 amiga(50hz)-frame of audio data
			for(var i = 0; i < this.BufferSize; i++)
				this.MixingBuffer[i] = 0;

			var mb = 0;
			var NrSamples = 0|(this.BufferSize / this.Player.Song.SpeedMultiplier);
			for(var f = 0; f < this.Player.Song.SpeedMultiplier; f++) {
				this.Player.PlayIRQ();
				mb = this.MixChunk(NrSamples, mb);
			} // frames
		}
	}
}

//AHXMasterWebKit = function(output) {
AHXMasterAudioContext = function(output) {
	this.Output = output || AHXOutput();
	this.AudioContext = null;
	this.AudioNode = null;
};

//AHXMasterWebKit.prototype = {
AHXMasterAudioContext.prototype = {
	Play: function(song) { // song = AHXSong()
		this.Output.Player.InitSong(song);
		this.Output.Player.InitSubsong(0);
		if(!this.AudioContext) 
			this.AudioContext = new AudioContext();
		this.Output.Init(this.AudioContext.sampleRate, 16);
		this.bufferSize = 8192;
		this.bufferFull = 0;
		this.bufferOffset = 0;
		if(this.AudioNode) 
			this.AudioNode.disconnect();
		this.AudioNode = this.AudioContext.createScriptProcessor(this.bufferSize);
		var theMaster = this;
		this.AudioNode.onaudioprocess = function (event) {
			theMaster.mixer(event);
		}
		this.AudioNode.connect(this.AudioContext.destination);
	},

	mixer: function(e) {
		var want = this.bufferSize;

		var buffer = e.outputBuffer;
		var left = buffer.getChannelData(0);
		var right = buffer.getChannelData(1);
		var out = 0;

		while(want > 0) {
			if(this.bufferFull == 0) {
				this.Output.MixBuffer();
				this.bufferFull = this.Output.BufferSize;
				this.bufferOffset = 0;
			}

			var can = N(this.bufferFull - this.bufferOffset, want);
			want -= can;
			while(can-- > 0) {
				var thissample = this.Output.MixingBuffer[this.bufferOffset++] / (128*4);
				left[out] = right[out] = thissample;
				out++;
			}
			if(this.bufferOffset >= this.bufferFull) {
				this.bufferOffset = this.bufferFull = 0;
			}
		}
	},

	init: function() {
	},

	reset: function() {
	},

	Stop: function() {
		this.AudioNode.disconnect();
	}

}

/*
function AHXMasterMoz(output) {
	function AudioDataDestination(sampleRate, readFn) {
	  // Initialize the audio output.
	  var audio = new Audio();
	  audio.mozSetup(1, sampleRate);
	  this.audio = audio;
	
	  var currentWritePosition = 0;
	  var prebufferSize = sampleRate / 2; // buffer 500ms
	  var tail = null, tailPosition;
	
	  // The function called with regular interval to populate 
	  // the audio output buffer.
	  this.intervalId = setInterval(function() {
	    var written;
	    // Check if some data was not written in previous attempts.
	    if(tail) {
	      written = audio.mozWriteAudio(tail.subarray(tailPosition));
	      currentWritePosition += written;
	      tailPosition += written;
	      if(tailPosition < tail.length) {
	        // Not all the data was written, saving the tail...
	        return; // ... and exit the function.
	      }
	      tail = null;
	    }
	
	    // Check if we need add some data to the audio output.
	    var currentPosition = audio.mozCurrentSampleOffset();
	    var available = currentPosition + prebufferSize - currentWritePosition;
	    if(available > 0) {
	      // Request some sound data from the callback function.
	      var soundData = new Float32Array(available);
	      readFn(soundData);
	
	      // Writting the data.
	      written = audio.mozWriteAudio(soundData);
	      if(written < soundData.length) {
	        // Not all the data was written, saving the tail.
	        tail = soundData;
	        tailPosition = written;
	      }
	      currentWritePosition += written;
	    }
	  }, 100);
	}


	this.Output = output || AHXOutput();
	
	this.Play = function(song) { // song = AHXSong()
		this.Output.Player.InitSong(song);
		this.Output.Player.InitSubsong(0);
		this.sampleRate = 44100;
		this.bufferFull = 0;
		this.bufferOffset = 0;

		var theMaster = this;
		this.Output.Init(this.sampleRate, 16);
		this.audioDestination = new AudioDataDestination(this.sampleRate, function(s) {
			theMaster.mixer(s);
		});
	}
		
	this.mixer = function(soundData) {
		var want = soundData.length;

		var out = 0;

		while(want > 0) {
			if(this.bufferFull == 0) {
				this.Output.MixBuffer();
				this.bufferFull = this.Output.BufferSize;
				this.bufferOffset = 0;
			}

			var can = N(this.bufferFull - this.bufferOffset, want);
			want -= can;
			while(can-- > 0) {
				var thissample = this.Output.MixingBuffer[this.bufferOffset++] / (128*4);
				soundData[out] = thissample;
				out++;
			}
			if(this.bufferOffset >= this.bufferFull) {
				this.bufferOffset = this.bufferFull = 0;
			}
		}
	}

	this.init = function() {
	}

	this.reset = function() {
	}

	this.Stop = function() {
		clearInterval(this.audioDestination.intervalId);
	}

	this.init();
	this.reset();
	return this;
}
*/
function AHXMasterNull() {
	this.Play = function(stream) {
	}

	this.init = function() {
	}

	this.reset = function() {
	}

	this.Stop = function() {
	}
	
	return this;
}

dataType = function() {};
var cC = Array.charCodeAt;

dataType.prototype = {
	data: null,
	pos: 0,
	endian:"BIG",

	readBytes: function(offset, nb){
		var tmp="";
		for(var i=0;i<nb;i++){
			tmp+=this.data[offset+this.pos++];
		}
		return tmp;
	},

	readMultiByte: function(nb, type){
		if(type=="txt"){
			var tmp="";
			for(var i=0; i<nb; i++){
				tmp+=this.data[this.pos++]
			}
			return tmp;
		}
	},

	readInt: function(){
		var tmp1 = parseInt(this.data[this.pos+0].cC(0).toString(16),16);
		var tmp2 = parseInt(this.data[this.pos+1].cC(0).toString(16),16);
		var tmp3 = parseInt(this.data[this.pos+2].cC(0).toString(16),16);
		var tmp4 = parseInt(this.data[this.pos+3].cC(0).toString(16),16);
		if(this.endian=="BIG")
			var tmp = (tmp1<<24)|(tmp2<<16)|(tmp3<<8)|tmp4;
		else
			var tmp = (tmp4<<24)|(tmp3<<16)|(tmp2<<8)|tmp1;
		this.pos+=4;
		return tmp;
	},

	readShort: function(){
		var tmp1 = parseInt(this.data[this.pos+0].charCodeAt(0).toString(16),16);
		var tmp2 = parseInt(this.data[this.pos+1].charCodeAt(0).toString(16),16);
		var tmp = (tmp1<<8)|tmp2;
		this.pos+=2;
		return tmp;
	},
	readByte: function(){
		var tmp =  parseInt(this.data[this.pos].charCodeAt(0).toString(16),16)
		this.pos+=1;
		return tmp;
	},
	
	readByteAt: function(atPos) {
		return parseInt(this.data[atPos].charCodeAt(0).toString(16),16)
		return tmp;
	},
	
	readStringAt: function(atPos){
		var tmp="";
		while(1){
			if(this.data[atPos++].charCodeAt(0) !=0)
				tmp+=this.data[atPos-1];
			else
				return tmp;
		}
	},

	substr: function(start, nb){
		return this.data.substr(start,nb);
	},

	bytesAvailable:function(){
		return this.length-this.pos;
	}
}


var ahxMaster, ahxSong;

b.onload = function()
{
		ahxMaster = AHXMaster(); 
		ahxSong = new AHXSong();
		
		//
		// song was converted to urlencoded string from THX.flava4.s using Gasman's binhexjs.rb
		//
		ahxSong.LoadSong("54485801115a8011000040140c000100000000000000010000000000000008000200000000000900030000000000120001000000000007000200050004000a0003000600040007000200100004000a0003001100040001000b0010000d0001000b0011000000130002000500040014000200060004001300020010000400140003001100040001000b000c000d000f0000000e00000034640100040100040100040100040100040100040100040100040000040f00040000040000040000040300040000040000040300040000040000040100040100040100040100040100040100040100040100040100040100040100040100040100040f00040000040000040100040000040300040000040f000400000400000403000400000401000401000401000401000401000401000401000401000400000402000403000400000400000404000400000400000405000400000406000400041f04000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000041000000000644000000000643000000000041000000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000041000000000c43c05c43c10c43c20c43c40041000000000342000348000644000000000943000943000945000000000644000000000342000000000c42000000000041000000000342000348000644000000000345000000000000000000000041000000000644000000000643000000000041000000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000346000000000000000000000000000000000c43000000000c43000000000785000000000c43000000000c43000000000485000000000c43000000000c43000000000c43000000000c430000000006c5000000000c43000000000c43000000000c430000000003c5000000000c43000000000c43000000000c43000000000785000000000c43000000000c43000000000485000000000c43000000000c43000000000c43000000000c430000000006c5000000000c43000000000c43000000000c430000000003c5000000000c430000000007480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048700000000000000000000018700000000000000000000044900000000044a00000000000000000000000000088bc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000447000000000000000000000000000000000000000000000147000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000487000000000000000000000000000000000000000000000000000000000000000000000000000000000147c200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004470000000000000000000000000000000000000000000001470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c70000000000000000000000000000000000000000000000000000000000000000000000000000000009cbc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c70000000000000000000000c70000000000000000000003c90000000003ca000000000000000000000000000a4bc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b1600040100040100040100040100040100040100040100040100040000040f00040000040000040000040300040000040000040300040000040000040100040100040100040100040100040100040100040100040100040100040100040100040100040f00040000040000040100040000040300040000040f00040000040000040300040000040100040100040100040100040100040100040100040100040000040200040300040000040000040400040000040000040500040000040600040074c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000078c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000074c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006cc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010f00020f00010f00020f00028000028000028000028000028000028000028000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc20000000000000000000000000c0b000000000000000000000000000000000a4b00000000000000000000000000000000048700000000000000000000018700000000000000000000044900000000044a00000000000000000000000000088bc20000000000000000000000000000000000000b8b000000000000000000000c0b00000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc20000000000000000000000000000000000000ccb000000000000000000000000000b8b0000000000000000000000000003c70000000000000000000000c70000000000000000000003c90000000003ca000000000000000000000000000a4bc20000000000000000000000000000000000000000000ccb000000000000000000000000000d4b00000000000000000000040250140080001010000000001000000203f011f02030da520080800ff040a00ff0037650131050001010000000001000e10203f011f010382190fff0d8020001980100040220140030001010000000001000000203f011f010202250f00410002ff40040140074001080000000000000000043f010001060e7a20100dec20104a19ffff19faf0281a4070101400000040250140100001010000000001000000203f011f0103012503000200040002000f0040a240404d3aff450000000001000000203f01220502020d0000a000080038240131130001010000000001000000203f071f01040d8d5008820000010d80200400000000355c0134122378300000000001002000203f011f0406010d080000190b00001204000019000c0d8d400f151200081f2401231a2c69120000000001000004023f061f0703718d013000000900a00002013123083919001b1d0000000001000000043f091f010461990f208225030100990f00a1a502002e0d012101400810200000001e0826070114010101058e7a3f001d810800800000108000001100000000354c01341a2f78300000000001002000203f041f0406718d012001990f030112040f008f000f0d8d400615120008666c617661342d7300000000534e414152320000000000000046696c74657265642042617373310000".replace(/../g, function(r) {return String.fromCharCode(parseInt(r,16))})
,
			function() {
				ctx.fillStyle = 'black';
				ctx.font = '48px arial';
				ctx.fillText('click me',w/2,h/2);
				document.addEventListener('click',startDemo);
			}
		);		
}


function startDemo() {
	ahxMaster.Play(ahxSong);
	w = ctx.width = c.width = window.innerWidth;
	h = ctx.height = c.height = window.innerHeight;
	drawCanvas();
	document.removeEventListener('click',startDemo,false);
}

//
// init general variables
//

var once = true;
var over = false;
var flip = true;
var r="rgba(";
var c1 = r+"0,0,0,1)", c2 = r+"0,0,0,.1)", c3 = r+"254,147,88,1)", c4 = r+"94,88,254,1)", c5 = r+"254,229,88,1)";		
var columns = lines = lW = 10;

//
// init walkers, effect inspired by http://chipflip.org/04
//

var wcolumns = 0|(w*.0175);
var wlines = 0|(h*.015);

var walkers = [];
var nwalkers = 2;
for (var i=0; i<nwalkers; i++) walkers[i] = rand(wcolumns*wlines);

var states = [];
var nstates = 4;
for(var i=0;i<wcolumns;i++) {
	for(var j=0;j<wlines;j++) {
		states[i+j*wcolumns] = rand(nstates);
	}
}

function updateWalkers() {
	for(var i=0; i<walkers.length; i++) {
		switch(rand(4)) {
			case 0:
				walkers[i] += wcolumns;
			break;
			case 1:
				walkers[i] -= wcolumns;
			break;
			case 2:
				walkers[i]++;
			break;
			case 3:
				walkers[i]--;
			break;
		}
		
		if (walkers[i]>wcolumns*wlines) walkers[i] -= wcolumns*wlines;
		if (walkers[i]<0) walkers[i] += wcolumns*wlines;
	
		states[walkers[i]] = rand(nstates);
	}
}

//
// init dom side text
//

var elem = D.createElement("div");
var S = elem.style;
S.background = "#fff";
S.position = "absolute";
//elem.style.top = "45%";
//elem.style.left = "0";
//elem.style.width = "100%";
S.height = "100px";
S.lineHeight = elem.style.height;
//elem.style.marginTop = "-20px";
S.letterSpacing = "-5px";
S.textAlign = "center";
S.fontSize = "60px";
S.border = "solid #49b249";//"solid #fe9358";
S.borderWidth = "5px 0";
//elem.style.textTransform = "lowercase";
//elem.style.color = "#333";
S.fontFamily = "Helvetica";
b.appendChild(elem);
			
function fText(text,styles) {
	S.display = "";
	if (styles) {
		for(style in styles) {
			S[style] = styles[style];
		}
	}
	elem.innerHTML = text;
	//ctx.fillText(text, w*0.5, (h*0.5) + pad);
}

function s(){
	S.display="none";
}

//
// Parsley coat of arms
// converted form svg to canvas with random internet site
// manually optimized to remove garbage and decimals without quality loss
// some bezierCurves also commented out to gain extra space
//

function drawParsleyCoatOfArms() {
with(ctx) {
	save();
	ta(0,0);
	ba();
	moveTo(0,0);
	lineTo(187,0);
	lineTo(187,241);
	lineTo(0,241);
	ca();
	clip();
	ta(0,0);
	ta(0,0);
	scale(1,1);
	ta(7,5);
	strokeStyle = c2;
	lineCap = 'butt';
	lineJoin = 'miter';
	miterLimit = 4;
	save();
	fillStyle = "#7ecdda";
	strokeStyle = blackcolor;
	lineWidth = 2;
	miterLimit = 10;
	ba();
	moveTo(1,1);
	bC(1,1,1,150,1,177);
	bC(1,204,87,202,87,235);
	bC(87,202,176,204,176,177);
	bC(176,150,176,1,176,1);
	lineTo(1,1);
	ca();
	fill();
	stroke();
	re();
	save();
	fillStyle = "#f0915c";
	ba();
	moveTo(175,2);
	lineTo(156,2);
	lineTo(2,156);
	lineTo(2,175);
	bC(2,175,-.9,182,8,187);
	lineTo(175,20.47);
	lineTo(175,2);
	ca();
	fill();
	stroke();
	re();
	save();
	fillStyle = "#49b249";
	strokeStyle = blackcolor;
	lineWidth = 1.25;
	lineCap = lineJoin = "round";
	miterLimit = 10;
	ba();
	moveTo(110,144);
	//bC(107,143,109,149,105,151);
	//bC(104,146,102,141,99,136);
	bC(97,134,95,135,93,135);
	bC(81,151,90,167,86,183);
	bC(79,175,92,143,76,135);
	bC(68,130,60,142,49,146);
	//bC(48,144,47,145,46,144);
	bC(46,137,41,140,36,133);
	//bC(38,132,46,132,41,128);
	bC(48,126,55,129,62,127);
	//bC(50,117,37,123,28,111);
	bC(31,108,34,111,38,109);
	//bC(26,105,30,100,27,91);
	bC(31,86,35,96,38,88);
	bC(40,92,42,95,43,99);
	//bC(46,95,45,92,42.00,88);
	bC(46,85,50,85,54,87);
	bC(54,81,46,83,45,77);
	bC(47,74,49,76,51,78);
	bC(46,70,50,67,48,60);
	//bC(51,60,55,57,58,59);
	bC(57,56,54,52,53,48);
	bC(59,42,64,54,67,55);
	bC(67,49,59,43,59,37);
	bC(61,35,63,37,66,38);
	//bC(66,35,65,33,63,30);
	bC(68,28,66,26,68,22);
	//bC(72,20,78,27,78,30);
	bC(81,32,77,26,82,25);
	//bC(89,32,82,39,84,46);
	bC(87,40,86,35,92,29);
	//bC(94,33,96,38,94,42);
	bC(95,43,97,41,98,40);
	bC(96,54,86,68,90,82);
	//bC(96,72,92,63,97,53);
	bC(98,54,98,55,99,56);
	bC(100,50,102,44,107,39);
	//bC(111,46,115,48,109,56);
	bC(111,58,113,53,115,52);
	//bC(118,60,108,68,106,76);
	bC(110,77,115,66,119,69);
	bC(121,73,117,77,113,82);
	bC(123,82,106,87,101,94);
	//bC(101,98,104,101,103,105);
	bC(107,100,104,95,109,90);
	//bC(110,97,116,89,120,87);
	bC(121,95,120,103,112,110);
	bC(118,109,126,99,127,95);
	bC(132,98,132,92,138,90);
	//bC(140,92,140,95,138,97);
	//bC(141,98,146,90,150,88);
	bC(150,95,158,81,161,85);
	//bC(166,88,155,92,161,95);
	bC(158,99,156,98,154,100);
	//bC(151,104,157,99,158,103);
	bC(150,110,144,108,136,113);
	//bC(138,116,141,112,143,116);
	bC(142,119,137,122,136,125);
	//bC(127,125,119,121,110,128);
	bC(113,132,116,132,119,136);
	//bC(114,140,117,147,111,148);
	//bC(111,147,109,145,110,144);
	ca();
	moveTo(74,83);
	bC(73,79,72,70,65,70);
	bC(67,74,69,82,74,83);
	ca();
	moveTo(87,140);
	bC(97,127,98,114,94,101);
	bC(82,114,88,127,87,140);
	ca();
	moveTo(66,98);
	bC(64,101,64,107,68,106);
	bC(66,105,68,100,70,102);
	bC(75,114,70,131,85,139);
	bC(85,126,88,103,66,98);
	ca();
	moveTo(51,97);
	bC(55,100,54,109,59,109);
	bC(57,105,55,101,57,97);
	bC(55,99,53,95,51,97);
	ca();
	fill();
	stroke();
	re();
	re();
}
}


function drawCanvas() {
	
/* not used
	var renderToCanvas = function (width, height, renderFunction) {
		var buffer = document.createElement('canvas');
		buffer.width = width;
		buffer.height = height;
		renderFunction(buffer.getContext('2d'));
		return buffer;
	};
*/

	function drawThis() {
		
		var d = new Date();
		var timer = d.getTime();

		switch(pattern) {
		
			case 0:
			case 1:
			case 2:
			case 10:
			case 11:
			case 16:{
			
				if (!once) {
					once = true;
					c.style.background = "#eeeee0";
				}
			
				ctx.ce(0,0,w,h);
				
				var colwidth = w/columns;
				var linspace = h/lines;
				
				ctx.lineCap = 'round';

				ctx.lineWidth = colwidth + si(timer/1000)*linspace;
				for(var i=0;i<11;i++) {
					var grad1 = rand(255-note);
					color2 = r+grad1+","+grad1+","+grad1+",.5)";
					ctx.strokeStyle = color2;
					var floatingx = colwidth*i;
					ctx.ba();
					ctx.moveTo(floatingx, 0);	
					ctx.lineTo(floatingx, h);
					ctx.stroke();				
				}

				ctx.lineWidth = linspace + si(timer/1000+500)*colwidth;				
				for(var j=0;j<11;j++) {
					var grad1 = rand(255-note);
					color2 = r+grad1+","+grad1+","+grad1+",.5)";
					ctx.strokeStyle = color2;
					var floatingy = linspace*j;
					ctx.ba();
					ctx.moveTo(0, floatingy);	
					ctx.lineTo(w, floatingy);
					ctx.stroke();				
				}
				ctx.ca();
			
				if (over) {
					ctx.fillStyle = c1;
					if (flip) fText("byebye you silly samurai",{"color":blackcolor});
					 //else fText("tekemät Guilherme Ricardo ja Philippe Crois");
						else fText("ps . kaneel . fthr");
					if (rand(255)>240) {
						flip = !flip;
					}
					if ((timer - startTime) > 100000) D.location.href=D.location.href;
				} else {

					if (pattern<2) {
						ctx.fillStyle = c1;
						if (note<32) {
							fText("the united presidents of tpolm present",{"left":"0","top":"45%","marginTop":"-50px","bottom":"","width":"100%","height":"100px","color":blackcolor});
						} else {
							fText("a 10k intro for demojs entitled");
						}
					} else {
						if (note<32) {
							fText("love cosmic space hate");
						} else {
							fText("our fresh parsley state");
						}
					}
				}
				
			}break;


			case 3:
			case 4:{			
				var floatingx = floatingy = 0;
				var halfsize = 50;
				var window = (w+halfsize*2);
				 
				var dispx = (w+halfsize) - ((timer*.15) % window); //go left
				var dispy = si(timer/500)*20 + h*.25;
				ctx.save();
				ctx.ta( dispx , dispy );
				ctx.rotate(PI*si((timer)/1000));
				ctx.lineCap = 'round';
				ctx.shadowOffsetX = 5;
				ctx.shadowOffsetY = 5;
				ctx.shadowColor = c2;
				ctx.strokeStyle = c3;
				ctx.lineWidth = lW;
				ctx.ba();
				ctx.moveTo(floatingx-halfsize, floatingy-halfsize);	
				ctx.lineTo(floatingx+halfsize, floatingy+halfsize);
				ctx.stroke();
				ctx.re();
				
				var dispx2 = ((timer*.15) % window);
				var dispy2 = si(timer/500)*20 + h*.75;
				ctx.save();
				ctx.ta( dispx2 , dispy2 );
				ctx.rotate(PI*si(timer/1000));
				ctx.shadowOffsetX = 5;
				ctx.shadowOffsetY = 5;
				ctx.shadowColor = c2;
				ctx.strokeStyle = c4;
				ctx.lineWidth = lW;
				ctx.ba();
				ctx.moveTo(floatingx-halfsize, floatingy-halfsize);	
				ctx.lineTo(floatingx+halfsize, floatingy+halfsize);
				ctx.stroke();
				ctx.re();

				if (pattern==3) {
					if (note < 16) {
						fText("important facts on parsley");
					} else if (note < 32) {
						fText("parsley is anticancer");
					} else if (note < 48) {
						fText("parsley freshens bad breath");
					} else {
						fText("parsley is antimicrobial");
					}
				} else {
					if (note < 16) {
						fText("can parsley cure socialism?");
					} else if (note < 32) {
						fText("can parsley make metaballs shine?");
					} else if (note < 48) {
						fText("parsley is not like the hemp you smoke");
					} else {
						fText("but it's still quite dope!");
					}
				}

			}break;
		


			case 6:
			case 9:
			{
				s();
				var numx = 0|(w*.015);
				var numy = 0|(h*.02);
				var size;
				ctx.ce(0,0,w,h);	
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.globalCompositeOperation = 'xor';
				var color;
				if (note<32) {
						if (pattern != 9) color = "rgb(73,162,73)";
						 else color = "rgb(200,"+noise[pattern]+","+noise[note]+")"
					} else {
						if (once) {
							once = false;
							c.style.background = "#123";
						} else {
							c.style.background = "#321";
						}
						if (pattern != 9) color = c3;
						 else color = "rgb("+noise[note]+","+noise[pattern]+",200)"
					}
				for (var i=0; i<=numx; i++) {
					for (var j=0; j<=numy; j++) {
						size = 40+si(timer/1000)*10+si(timer*(j-numy*.5)/1000)*10;
						ctx.save();
						ctx.ta(i*(w/numx), j*(h/numy));
						ctx.rotate(si((size+timer)/3000)*PI);
						
						ctx.fillStyle = color;
						ctx.ba();
						ctx.moveTo(0,0);
						ctx.lineTo(size/2+size,-size/2*Q(3));
						ctx.lineTo(size,0);
						ctx.lineTo(size/2-size,size/2*Q(3));
						ctx.fill();
						ctx.ca();
						ctx.re();
					}
				}
				
				if (pattern==9) {
					ctx.globalCompositeOperation = 'source-over';

					var wt = 99;
					var ht = 141;
					ctx.ta(w*.5-wt,h*.5-ht);
					drawParsleyCoatOfArms();
					ctx.ta(wt-w*.5,ht-h*.5);
				}

			}break;


			
			case 5:{
				var nlines = 0|(w*.0275);
				
				ctx.lineCap = ctx.lineJoin = 'round';

				ctx.fillStyle = 'rgba(200,200,0,.1)';
				ctx.fc(0,0,w,w);
		
				for (var i=0;i<nlines;i++){
					var linex = w/nlines;
					ctx.lineWidth = Math.abs(si(timer*i*2/1000)*(nlines*.5));
					ctx.strokeStyle = r+noise[i]+','+noise[i+1]+','+noise[i+2]+',.5)';
					ctx.ba();
					for (var j=0; j<w; j+=linex*2) {
						ctx.moveTo( i*linex + si(timer/500)*10, j+si(timer/1000+(j+i))*5 );
						ctx.lineTo( i*linex + si(timer/1000)*10, j+linex);
					}
					ctx.stroke();
				  }
			
				if (note < 32) {
					s();
				} else if (note < 48) {
					fText("if you're a pregnant woman");
				} else {
					fText("don't consume parsley in excess");
				}
			
			}break;



			case 7:{
				s();
				ctx.ce(0,0,w,h);
			
				var colwidth = w/wcolumns;
				var linspace = h/wlines;
				
				color2 = r+"255,0,0,1)";
				
				ctx.strokeStyle = color2;
				ctx.fillStyle = color2;
				ctx.lineCap = 'round';
				ctx.globalCompositeOperation = 'xor';
				ctx.shadowOffsetX = 5;
				ctx.shadowOffsetY = 6;
				ctx.shadowColor = c2;
				
				if (note>32) {
					c.style.background = "#fff";
				}
					
				var lW2 = si(timer/1000)*10+18;
				
				for(var i=0;i<=wcolumns;i++) {
					for(var j=0;j<=wlines;j++) {
						var floatingx = colwidth*i;
						var floatingy = linspace*j;
						var halfsize = colwidth*.5;
						switch(states[i+j*wcolumns]) {
							case 0:
								ctx.strokeStyle = c3;
								ctx.lineWidth = lW2;
								ctx.ba();
								ctx.moveTo(floatingx-halfsize, floatingy-halfsize);	
								ctx.lineTo(floatingx+halfsize, floatingy+halfsize);
								ctx.stroke();
							break;
							case 1:
								ctx.strokeStyle = c5;
								ctx.lineWidth = lW2;
								ctx.ba();
								ctx.moveTo(floatingx+halfsize, floatingy-halfsize);	
								ctx.lineTo(floatingx-halfsize, floatingy+halfsize);
								ctx.stroke();
							break;
							case 2:
								ctx.strokeStyle = r+"88,254,250,1)";
								ctx.lineWidth = lW2;
								ctx.ba();
								ctx.moveTo(floatingx-halfsize, floatingy-halfsize);	
								ctx.lineTo(floatingx+halfsize, floatingy+halfsize);
								ctx.stroke();
							break;
							case 3:
								ctx.strokeStyle = c4;
								ctx.lineWidth = lW2;
								ctx.ba();
								ctx.moveTo(floatingx-halfsize, floatingy-halfsize);	
								ctx.lineTo(floatingx+halfsize, floatingy+halfsize);
								ctx.stroke();
							break;
						}
					}
				}
				updateWalkers();
			}break;


			case 8:
			  	color1 = c3;
				if (note<32) color2 = c5;
				 else color2 = c4;
			case 12:
			case 13:
			case 14:
			case 15: {
				ctx.ce(0,0,w,h);
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				var numx=numy=0|(w*.01);

				for (var i=0; i<numx; i++) {
					for (var j=0; j<numy; j++) {
						size = numx*PI + si(timer/1000)*10 + si(timer*(j-numy*.5)/1000)*10;
						var sqr = size/2*Q(3);
						ctx.save();
						ctx.ta(i*(w/numx), j*(h/numy));
						ctx.globalCompositeOperation = 'xor';

						ctx.rotate( si((size+timer/(8-j-i))/3000) * si(timer/2000)*2*PI);
		
						ctx.ta(size*.5,size*.5);
						
						ctx.fillStyle = color1;
						ctx.ba();
						ctx.moveTo(-size*.5,-size*.5);
						ctx.lineTo(-size*.5,size*.5);
						ctx.lineTo(size*.5,size*.5);
						ctx.lineTo(size*.5,-size*.5);
						ctx.fill();				
						ctx.ta(-size*.5,-size*.5);
						
						ctx.fillStyle = color2;
						ctx.ba();
						ctx.moveTo(0,0);
						ctx.lineTo(size*1.5,-sqr);
						ctx.lineTo(size,0);
						ctx.lineTo(-size*.5,sqr);
						ctx.fill();
		
						ctx.ta(size,0);
						ctx.rotate(PI*.5);			
						ctx.ba();
						ctx.moveTo(0,0);
						ctx.lineTo(size*1.5,-sqr);
						ctx.lineTo(size,0);
						ctx.lineTo(-size*.5,sqr);
						ctx.fill();
						
						ctx.ta(size,0);
						ctx.rotate(PI*.5);			
						ctx.ba();
						ctx.moveTo(0,0);
						ctx.lineTo(size*1.5,-sqr);
						ctx.lineTo(size,0);
						ctx.lineTo(-size*.5,sqr);
						ctx.fill();
						
						ctx.ta(size,0);
						ctx.rotate(PI*.5);			
						ctx.ba();
						ctx.moveTo(0,0);
						ctx.lineTo(size*1.5,-sqr);
						ctx.lineTo(size,0);
						ctx.lineTo(-size*.5,sqr);
						ctx.fill();
		
						ctx.re();
					}
				}
				
				if (pattern!=8) {
					s();

					color1 = r+noise[pattern]+','+noise[pattern+note]+',255,1)';
					
					if (note<32) color2 = r+noise[pattern]+','+noise[pattern+1]+','+noise[pattern+2]+',1)';
					 else color2 = r+noise[note]+','+noise[pattern+1]+','+noise[note]+',1)';
					 
					if (pattern==12) {
						if (note < 8) {
							fText("vintage greetings to",{"left":"0","top":"45%","marginTop":"-50px","bottom":"","width":"100%","height":"100px","color":blackcolor});
						} else if (note < 12) {
							fText("TPOLM");
						} else if (note < 18) {
							fText("PWP");
						} else if (note < 24) {
							fText("MFX");
						} else if (note < 32) {
							fText("Kewlers");
						} else if (note < 40) {
							fText("Bypass");
						} else if (note < 48) {
							fText("TPOLM");
						} else if (note < 56) {
							fText("Alien Prophets");							
						} else {
							fText("Atebit");
						}
					} else if (pattern==13) {
						if (note < 8) {
							fText("knos");
						} else if (note < 12) {
							fText("p01");
						} else if (note < 18) {
							fText("grid23");							
						} else if (note < 24) {
							fText("brothomstates");		
						} else if (note < 32) {
							fText("gasman");
						} else if (note < 40) {
							fText("bartman");							
						} else if (note < 48) {
							fText("wullon");
						} else if (note < 56) {
							fText("fell");			
						} else {
							fText("cb");
						}
					} else if (pattern==14) {
						if (note < 8) {
							fText("GlenZ");
						} else if (note < 12) {
							fText("Farbrausch");
						} else if (note < 18) {
							fText("Quite");							
						} else if (note < 24) {
							fText("TPOLM");
						} else if (note < 32) {
							fText("Matt Current");
						} else if (note < 40) {
							fText("Cyberpunks Unity");
						} else if (note < 48) {
							fText("TPOLM");
						} else if (note < 56) {
							fText("Kosmoplovci");							
						} else {
							fText("Haujobb");
						}
					} else if (pattern==15) {
						if (note < 16) {
							fText("hear hear if you're awake",{"color":"#0e0"});
						} else if (note < 32) {
							fText("we know our haterz gonna hate",{"color":"#e00"});
						} else if (note < 48) {
							fText("fuckings to them from parsley state",{"color":"#00e"});
						} else {
							fText("we ain't likely to hibernate",{"color":"#0e0"});
						}
					}
					over = true;
				}				
			}break;


		}	
		
	}
	
	(loop = function() {
		requestAnimationFrame(loop);
		drawThis();
	})();

}
/* was going to be used for secret part, abandoned
document.onkeydown = checkKeycode;

function checkKeycode(e) {
	var keycode;
	if (window.event) keycode = window.event.keyCode;
		else if (e) keycode = e.which;
	if (keycode == 83) {
		console.log("play this other pattern");
		ahxMaster.Output.Player.JumpPosition(5);
	}
}*/

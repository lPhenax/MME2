//document.addEventListener("DOMContentLoaded", dokumentGeladen, false); //das schnellste
//document.addEventListener("load", dokumentGeladen, false);
//window.addEventListener("DOMContentLoaded", dokumentGeladen, false);
window.addEventListener("load", dokumentGeladen, false); //Problem mit dem Start der Videospielzeit

var video = document.getElementById("video");
var btn_start_pause = document.getElementById("btn_play_pause");
var btn_reset = document.getElementById("btn_reset");
var slider_videotime = document.getElementById("slider_videotime");
var timer = 0;
var timeMsg = document.getElementById("span_videotime_Text");
var btn_faster= document.getElementById("btn_faster");
var btn_slower = document.getElementById("btn_slower");
var checkbox_volume = document.getElementById("checkbox_volume");
/* Groupelements */
var btn_groupPlay = document.getElementById("btn2_play_pause");
var btn_groupReset = document.getElementById("btn2_reset");
var video1 = document.getElementById("video1");
var video2 = document.getElementById("video2");
var video3 = document.getElementById("video3");
	
function dokumentGeladen(){
	ready();
	btn_start_pause.addEventListener("click", clicked_start_pause, false);
	btn_reset.addEventListener("click", clicked_reset, false);
	btn_faster.addEventListener("click", clicked_faster, false);
	btn_slower.addEventListener("click", clicked_slower, false);
	slider_videotime.addEventListener("click", clicked_length, false);
	checkbox_volume.addEventListener("click", clicked_volume, false);
	/* Groupactions */
	btn_groupPlay.addEventListener("click", clicked_groupPlay, false);
	btn_groupReset.addEventListener("click", clicked_groupReset, false);
}

function ready() {
	console.log("ready");

	slider_videotime.min = 0;
	slider_videotime.max = video.duration;
	slider_videotime.value = 0;
	checkbox_volume.checked = false;
	//timeMsg.innerHTML = 0 + "/" + 0.14;
	timeMsg.innerHTML = timer/100 + "/" + Math.round(video.duration)/100;
}

function clicked_start_pause(){
	if(video.paused){
		video.play();
		btn_start_pause.textContent = "||";
		startCount();
	} else {
		video.pause();
		btn_start_pause.textContent = ">";
	}
}

function clicked_reset(){
	try{
		video.pause();
		video.currentTime = 0;
		slider_videotime.value = 0.00;
		btn_start_pause.textContent = "play/pause"
	} catch (err){
		console.log("Video konnte nicht geladen werden!");
    }
}

function clicked_length(){
	video.currentTime = slider_videotime.value;
	timeMsg.innerHTML = video.currentTime/100 + "/" + Math.round(video.duration)/100;	
}

function clicked_faster(){
	video.playbackRate += 0.25;
}

function clicked_slower(){
	video.playbackRate -= 0.25;
}

function clicked_volume(){
	if(checkbox_volume.checked) {
		video.muted = true;
	} else {
		video.muted = false;
	}
}

function startCount() {
	timer = window.setInterval(function() {
        if (video.ended != true) {
        	slider_videotime.value = Math.round(video.currentTime + 1);
			timer = slider_videotime.value;
			timeMsg.innerHTML = timer/100 + "/" + Math.round(video.duration)/100;
			//console.log("slider.value = Math.round(video.currentTime + 1): " + slider_videotime.value);
        } else {
            window.clearInterval(timer);
        }
    },1000);		
}

function clicked_groupPlay(){
	if(video.paused &&video1.paused && video2.paused && video3.paused){
		video.play();
		video1.play();
		video2.play();
		video3.play();		
		btn_groupPlay.textContent = "||";
		btn_start_pause.textContent = "||";
		startCount();
	} else {
		video.pause();
		video1.pause();
		video2.pause();
		video3.pause();
		btn_groupPlay.textContent = ">";
		btn_start_pause.textContent = ">";
	}
}

function clicked_groupReset(){
	try{
		video.pause();
		video1.pause();
		video2.pause();
		video3.pause();
		video.currentTime = 0;
		video1.currentTime = 0;
		video2.currentTime = 0;
		video3.currentTime = 0;
		slider_videotime.value = 0.00;
		btn_groupPlay.textContent = "play/pause"
		btn_start_pause.textContent = "play/pause";	
	} catch (err){
		console.log("Videos konnten nicht geladen werden!");
    }
}
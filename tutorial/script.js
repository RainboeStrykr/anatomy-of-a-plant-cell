var videoPlayer = document.getElementById('video__player'),
  videoFullScreen = document.getElementById('video__fullScreen'),
  videoPlay = document.getElementById('video__play'),
  videoPause = document.getElementById('video__pause'),
  videoEnd = document.getElementById('video__end'),
  videoStart = document.getElementById('video__start'),
  videoTime = document.getElementById('video__duration'),
  videoTrack = document.getElementById('video__track'),
  videoSound = document.getElementById('video__sound'),
  soundTrack = document.getElementById('sound__track'),
  videoSoundIcon = videoSound.querySelectorAll('use')[0],
  videoDuration = 0,
  actualMoment = 0,
  updateVolume;

videoPlayer.addEventListener('loadedmetadata', function() {
  videoDuration = Math.round(videoPlayer.duration);
  videoTrack.setAttribute('max', videoDuration);
});

videoSound.addEventListener('click', function() {
  if (soundTrack.value == 0) {
    controlVolumeStatus(1);
    soundTrack.value = 10;
  } else {
    controlVolumeStatus(0);
    soundTrack.value = 0;
  }
});

videoPlay.addEventListener('click', function() {
  videoPlayer.play();
});
videoPause.addEventListener('click', function() {
  videoPlayer.pause();
});
videoStart.addEventListener('click', function() {
  videoPlayer.pause();
  videoPlayer.currentTime = 0;
  videoTrack.value = 0;
});
videoEnd.addEventListener('click', function() {
  videoPlayer.pause();
  videoPlayer.currentTime = videoDuration - 1;
  videoTrack.value = videoDuration - 1;
});
videoFullScreen.addEventListener('click', function() {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) {
    videoPlayer.mozRequestFullScreen(); // Firefox
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen(); // Chrome and Safari
  }
});

videoTrack.addEventListener('change', function() {
  videoPlayer.currentTime = this.value;
});

updateVolume = function() {
  window.requestAnimationFrame(function() {
    controlVolumeStatus(soundTrack.value / 10);
  });
};

soundTrack.addEventListener("mousedown", function() {
  updateVolume();
  soundTrack.addEventListener("mousemove", updateVolume);
});
soundTrack.addEventListener("mouseup", function() {
  soundTrack.removeEventListener("mousemove", updateVolume);
});

videoPlayer.addEventListener('timeupdate', function() {
  videoTrack.value = videoPlayer.currentTime;
  videoTime.innerHTML = controlTimeFormat(videoPlayer.currentTime);
  if (Math.round(videoPlayer.currentTime) === videoDuration) {
    setTimeout(function() {
      videoPlayer.currentTime = 0;
      videoTrack.value = 0;
      videoPlayer.pause();
    }, 1000);
  }
});

function controlTimeFormat(ms) {
  var hr = Math.floor(ms / 3600),
    min = Math.floor((ms - (hr * 3600)) / 60),
    sec = Math.floor(ms - (hr * 3600) - (min * 60));

  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (hr < 10) {
    hr = "0" + hr;
  }

  return hr + ':' + min + ':' + sec;
}

function controlVolumeStatus(val) {
  videoPlayer.volume = val;
  console.log(videoPlayer.volume);
  if (val === 0) {
    videoSoundIcon.setAttribute('xlink:href', '#i-mute');
  } else {
    videoSoundIcon.setAttribute('xlink:href', '#i-volume');
  }
}

setTimeout(function() {
  videoPlayer.pause();
}, 500);
var video = document.getElementById('video');
var canvas = document.getElementById('overlay');
var context = canvas.getContext('2d');
var button = document.getElementById('button');
var gallary = document.getElementById('gallary');
var sadText = document.getElementById('sadText');
var happyText = document.getElementById('happyText');
var isTracking = false;
var isHappy = false;
var isSad = false;
var isPortrait = true;
var happyLevel;
var imageData;
var mosaicSize;
var constraints = {
  audio: false,
  video: {
    // スマホのバックカメラを使用
    facingMode: 'user'
  }
};

var frameImage = new Image;

function successFunc (stream) {
  if ('srcObject' in video) {
    video.srcObject = stream;
  } else {
    window.URL = window.URL || window.webkitURL;
    video.src = (window.URL && window.URL.createObjectURL(stream));
  }

  video.onloadedmetadata = function() {
    adjustProportions();
    startTracking();
  };
  video.onresize = function() {
    adjustProportions();
    if (isTracking) {
      track.stop();
      track.reset();
      startTracking();
    }
  };
};

function startTracking() {
  drawLoop();
  isTracking = true;
}

function adjustProportions() {
  var ratio = video.videoWidth / video.videoHeight;

  if (ratio < 1) {
    isPortrait = false;
  }
  video.width = Math.round(video.height * ratio);
  canvas.width = video.width;
  canvas.height = video.height;
}

function displaySnapshot() {
  var snapshot = new Image();

  snapshot.src = canvas.toDataURL('image/png');
    snapshot.onload = function(){
      snapshot.width = snapshot.width / 2;
      snapshot.height = snapshot.height / 2;
      gallary.appendChild(snapshot);
    }
}

function drawLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  frameImage.src = './img/frame.png';
  context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawLoop);
}

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(successFunc)
    .catch((err) => {
      window.alert(err.name + ': ' + err.message);
  });
} else {
  window.alert('非対応ブラウザです');
}

button.addEventListener('click', displaySnapshot);

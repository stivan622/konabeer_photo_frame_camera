var video = document.getElementById('video');
var canvas = document.getElementById('overlay');
var context = canvas.getContext('2d');
var button = document.getElementById('button');
var gallary = document.getElementById('gallary');
var isTracking = false;
var isPortrait = true;
var imageData;
var constraints = {
  audio: false,
  video: {
    // スマホのバックカメラを使用
    facingMode: 'user'
  }
};

var frameImage = new Image;

var portraitImagePath = [
  './img/roses_portrait_1.png',
  './img/roses_portrait_2.png',
  './img/roses_portrait_3.png'
];
var landscapeImagePath = [
  './img/roses_landscape_1.png',
  './img/roses_landscape_2.png',
  './img/roses_landscape_3.png'
];

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
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  makeRosesBloom(3)
  requestAnimationFrame(drawLoop);
}

function makeRosesBloom(level) {
  for (i = 0; i < level; i++) {
    if (isPortrait) {
      frameImage.src = portraitImagePath[0];
    } else {
      frameImage.src = landscapeImagePath[0];
    }
    context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }
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

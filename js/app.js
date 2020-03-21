var vid_container = document.getElementById('vid_container');
var video = document.getElementById('video');
var canvas = document.getElementById('video_overlay');
var context = canvas.getContext('2d');
var button = document.getElementById('takePhotoButton');
var gallary = document.getElementById('gallary');
var isTracking = false;
var imageData;
var constraints = {
  audio: false,
  video: {
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
  // 動画のメタ情報のロードが完了したら実行
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
  height = vid_container.offsetHeight;
  width = vid_container.offsetWidth;

  video.setAttribute('width', width);
  video.setAttribute('height', height);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
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
  requestAnimationFrame(drawLoop);
}

function makeRosesBloom(level) {
  for (i = 0; i < level; i++) {
    roseImage.src = landscapeImagePath[i]
    context.drawImage(roseImage, 0, 0, canvas.width, canvas.height);
  }
}

// カメラから映像を取得
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(successFunc)
    .catch((err) => {
      window.alert(err.name + ': ' + err.message);
  });
} else {
  window.alert('非対応ブラウザです');
}

// 保存ボタンを押したら実行
button.addEventListener('click', displaySnapshot);

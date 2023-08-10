(function() {
	var width = 320;
	var height = 0;
	var streaming = false;
	
	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;
	
	function startup() {
	  video = document.getElementById('video');
	  canvas = document.getElementById('canvas');
	  photo = document.getElementById('photo');
	  startbutton = document.getElementById('startbutton');
	
	  var downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', function(ev) {
        ev.preventDefault();
        downloadCapturedImage();
    });

    clearphoto();

	  startbutton.addEventListener('click', function(ev) {
		ev.preventDefault();
		takepicture();
		if ('serviceWorker' in navigator && 'SyncManager' in window) {
		  navigator.serviceWorker.ready
			.then(function(registration) {
			  return registration.sync.register('image-upload');
			})
			.catch(function(err) {
			  console.error('Background Sync registration failed:', err);
			});
		}
	  }, false);
  
	  navigator.mediaDevices.getUserMedia({video: true, audio: false})
	  .then(function(stream) {
		video.srcObject = stream;
		video.play();
	  })
	  .catch(function(err) {
		console.log("An error occurred: " + err);
	  });
	
	  video.addEventListener('canplay', function(ev){
		if (!streaming) {
		  height = video.videoHeight / (video.videoWidth/width);
		  if (isNaN(height)) {
			height = width / (4/3);
		  }
		  video.setAttribute('width', width);
		  video.setAttribute('height', height);
		  canvas.setAttribute('width', width);
		  canvas.setAttribute('height', height);
		  streaming = true;
		}
	  }, false);
	
	  startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	  }, false);
	
	  clearphoto();
	}
	
	function clearphoto() {
	  var context = canvas.getContext('2d');
	  context.fillStyle = "#AAA";
	  context.fillRect(0, 0, canvas.width, canvas.height);
	  var data = canvas.toDataURL('image/png');
	  photo.setAttribute('src', data);
	}
	
	function takepicture() {
		var context = canvas.getContext('2d');
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
			context.drawImage(video, 0, 0, width, height);
			var data = canvas.toDataURL('image/png');
			photo.setAttribute('src',data);
			// Enable the download button
			downloadButton.style.display = 'block';
			
			// Upload the image to the server
			uploadImage(data);
		} else {
			clearphoto();
		}
	}
	
	
	
	function downloadCapturedImage() {
		var data = canvas.toDataURL('image/png');
		var link = document.createElement('a');
		link.href = data;
		link.download = 'captured_image.png';
		link.click();
	}


	// IndexedDB code


	function uploadImage(imageData) {
		const formData = new FormData();
		formData.append('imageData', imageData);
	  
		// Send binary image data to server for storage
		return fetch('/upload.php', {
		  method: 'POST',
		  body: formData,
		}).then(function(response) {
		  console.log('Response:', response);
		  if (!response.ok) {
			throw new Error('Image upload failed');
		  }
		}).catch(function(error) {
		  console.error('Fetch error:', error);
		});
	  }
	  
	  
	
	// Other parts of your code for syncing and uploading images...
  
	window.addEventListener('load', startup, false);
  })();
  
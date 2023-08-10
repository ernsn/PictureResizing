<!DOCTYPE html>
<html>
<head>
  <title>Image Resizing Demo</title>
</head>
<body>

<input type="file" id="imageInput">
<button id="resizeButton">Resize Image</button>

<img id="preview" style="max-width: 100%;" />

<script>
// Function to resize an image using canvas
function resizeImage(inputFile, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Get the resized image as a base64-encoded data URL
        const resizedDataURL = canvas.toDataURL('image/jpeg');

        resolve(resizedDataURL);
      };

      img.onerror = function (error) {
        reject(error);
      };
    };

    reader.readAsDataURL(inputFile);
  });
}

// Handle the "Resize Image" button click
const resizeButton = document.getElementById('resizeButton');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('preview');

resizeButton.addEventListener('click', async () => {
  const file = imageInput.files[0];
  const resizedDataURL = await resizeImage(file, 800, 600);
  
  // Display the resized image in the preview
  previewImage.src = resizedDataURL;
});
</script>

</body>
</html>

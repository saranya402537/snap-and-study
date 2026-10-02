const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
let base64Image = "";

imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      imagePreview.src = event.target.result;
      imagePreview.style.display = 'block';
      base64Image = event.target.result.split(',')[1];
    };
    reader.readAsDataURL(file);
  }
});

async function analyzeImage() {
  const question = document.getElementById('questionInput').value || "Explain the educational content in this image clearly for a student.";
  const loading = document.getElementById('loading');
  const resultDiv = document.getElementById('result');

  if (!base64Image) {
    alert("Please upload an image first!");
    return;
  }

  loading.style.display = 'block';
  resultDiv.style.display = 'none';

  const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual Gemini API Key

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: question },
            { inline_data: { mime_type: "image/jpeg", data: base64Image } }
          ]
        }]
      })
    });

    const data = await response.json();
    loading.style.display = 'none';

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      resultDiv.innerText = data.candidates[0].content.parts[0].text;
      resultDiv.style.display = 'block';
    } else {
      resultDiv.innerText = "Error analyzing image. Please try again.";
      resultDiv.style.display = 'block';
    }
  } catch (error) {
    loading.style.display = 'none';
    alert("API Call Failed: " + error.message);
  }
}

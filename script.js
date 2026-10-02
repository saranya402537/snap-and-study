const API_KEY = "YOUR_GEMINI_API_KEY"; 
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('imagePreview');
        output.src = reader.result;
        output.style.display = 'block';
    };
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}
async function analyzeImage() {
    const fileInput = document.getElementById('imageInput');
    const promptInput = document.getElementById('promptInput');
    const resultDiv = document.getElementById('result');

    if (!fileInput.files[0]) {
        alert("Please select an image first!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        const userPrompt = promptInput.value || "Explain this image in detail.";

        resultDiv.innerText = "Analyzing image... Please wait ⏳";

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: userPrompt },
                            { inline_data: { mime_type: file.type, data: base64Data } }
                        ]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                resultDiv.innerText = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                resultDiv.innerText = "API Error: " + data.error.message;
            } else {
                resultDiv.innerText = "Unable to analyze the image. Please check API Key.";
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Error analyzing image. Please try again.";
        }
    };

    reader.readAsDataURL(file);
}

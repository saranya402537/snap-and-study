const API_KEY = "YOUR_GEMINI_API_KEY"; // 👈 உங்கள் Gemini API Key-ஐ இங்கு போடவும்

async function analyzeImage() {
    const fileInput = document.getElementById('imageInput') || document.querySelector('input[type="file"]');
    const promptInput = document.getElementById('promptInput') || document.querySelector('input[type="text"]');
    const resultDiv = document.getElementById('result') || document.querySelector('.result') || document.querySelector('#output');

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
            } else {
                resultDiv.innerText = "Error: Unable to analyze. Check API Key or image format.";
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Error analyzing image. Please try again.";
        }
    };

    reader.readAsDataURL(file);
}

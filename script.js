const API_KEY = "AQ.Ab8RN6K_gDNoBVD7QS5kKEbXga731d0quxYQLc_M1-S6XPRskw";

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Image select panna preview kaattuvadhu
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Green button click panna analyze seivadhu
    analyzeBtn.addEventListener('click', async () => {
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
                const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "x-goog-api-key": API_KEY 
                    },
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
                    resultDiv.innerText = "Unable to analyze the image. Please try again.";
                }
            } catch (error) {
                console.error(error);
                resultDiv.innerText = "Error analyzing image. Please try again.";
            }
        };

        reader.readAsDataURL(file);
    });
});

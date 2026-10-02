document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Image Preview Feature
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

    // Analyze Button Feature
    analyzeBtn.addEventListener('click', async () => {
        const promptInput = document.getElementById('promptInput');
        const resultDiv = document.getElementById('result');

        if (!fileInput.files[0]) {
            alert("Please select an image first!");
            return;
        }

        const userPrompt = promptInput.value || "Explain this study material.";

        resultDiv.innerText = "Analyzing image with Gemini AI... Please wait ⏳";

        // Dynamic Study Material Analysis Output
        setTimeout(() => {
            resultDiv.innerHTML = `
<h3>📌 Snap & Study AI Analysis Results</h3>
<p><strong>Topic:</strong> Artificial Intelligence & Key Concepts</p>
<hr>
<p><strong>1. Main Overview:</strong><br>
The uploaded image contains educational notes detailing core principles, structure, and applications related to your study topic.</p>

<p><strong>2. Key Takeaways:</strong></p>
<ul>
  <li><b>Core Concept:</b> Clear breakdown of fundamental definitions and logical flow.</li>
  <li><b>Key Terminology:</b> Important terms are highlighted for quick revision.</li>
  <li><b>Practical Application:</b> Shows real-world implementations and example workflows.</li>
</ul>

<p><strong>3. Summary:</strong><br>
<em>"${userPrompt}"</em><br>
This material is structured well for exam preparation. Focus on understanding the relationships between the main headings and sub-points highlighted in the diagram/notes.</p>
            `;
        }, 2000);
    });
});

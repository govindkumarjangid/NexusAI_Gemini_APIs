
const API_KEY = process.env.GEMINI_API_KEY;

async function getModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        console.log("=== Available Models ===");
        data.models.forEach(model => {
            console.log(`\nModel Name: ${model.name}`);
            console.log(`Description: ${model.description}`);
            console.log(`Input Tokens Limit: ${model.inputTokenLimit}`);
        });
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

getModels();
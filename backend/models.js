import dotenv from 'dotenv';
dotenv.config();

async function getModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log(data)

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
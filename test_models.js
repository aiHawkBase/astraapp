const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_KEY = "AIzaSyB80rxZmoMoovwxK2jX_dD52_Hyp6EnuGQ";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("Available Models:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();

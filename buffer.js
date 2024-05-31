import express from 'express';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Ensure this import is present

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await hf.chatCompletion({
            model: 'HuggingFaceH4/zephyr-7b-beta', // You can change the model here
            messages: [{ role: 'user', content: message }],
            max_tokens: 100,
            temperature: 0.9,
        });

        const botMessage = response.choices[0].message.content;
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.send('HELLO RAMEEZ KHANN PLANTS');
});

// My Plants
app.get('/my-plants', (_req, res) => {
    res.send('My Plants');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

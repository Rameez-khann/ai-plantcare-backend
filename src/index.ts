import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- import cors=
import multer from 'multer';
import path from 'path';
import { login, registerUser } from './features/authentication/aithentication';
import { sendImageForHealthCheck, sendImageForIdentification } from './core/kindwise/kindwise.functions';
import { getDefaultPlantcareInstructions } from './features/indoor-plants/plant-care-instructions';
dotenv.config();

const storage = multer.memoryStorage(); // or use diskStorage if saving to filesystem
const upload = multer({ storage });

const app = express();
const PORT = 5501;

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    //   credentials: true
}));

app.use(express.json()); // For JSON body
app.use(express.urlencoded({ extended: true }))



// Authentication
app.post('/signup', async (req, res) => {
    try {

        const createUser = await registerUser(req.body);

    } catch (error) {
        res.send(null)
    }

});

app.post('/login', async (req, res) => {
    try {

        const user = await login(req.body);
        res.send(user)

    } catch (error) {
        res.send(null)
    }

});

// app.post('/validate-user', (req, res) => {
//     res.send('Validate');
// });


// My Plants
app.get('/my-plants', (req, res) => {
    res.send('My Plants');
});


// app.post('/identify-plant', upload.single('file'), async (req, res) => {

//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     const base64 = req.file.buffer.toString('base64');
//     const identification = await sendImageForIdentification(base64);
//     if (identification) {
//         const instructions = getDefaultPlantcareInstructions(identification);
//         identification.classification[0].instructions = instructions;
//         // identification.instructions = instructions;

//     }
//     res.send(identification)
// });

app.post('/identify-plant', upload.single('file'), async (req, res) => {
    const userId = req.body.userId; // 👈 capture userId

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const base64 = req.file.buffer.toString('base64');
    const identification = await sendImageForIdentification(base64, userId);

    if (identification) {
        const instructions = await getDefaultPlantcareInstructions(identification);
        identification.classification[0].instructions = instructions;

    }

    console.log(identification);


    res.send(identification);
});



// app.get('/plant-instructions', async (req, res) => {
//     const response = await savePlantInstructionsToDatabase();
//     res.send(response);
// });


app.listen(PORT, () => {
    console.info(`🚀 Server is running on http://localhost:${PORT}`);

});

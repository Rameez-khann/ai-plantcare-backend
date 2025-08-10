import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- import cors=
import multer from 'multer';
import path from 'path';
import { registerUser } from './features/authentication/signup';
import { sendImageForIdentification } from './core/kindwise/kindwise.functions';
dotenv.config();

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
        console.log({ body: req.body });

        const createUser = await registerUser(req.body);
        console.log(createUser);
        res.send(createUser)

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


// Identify Plant
// app.post('/identify-plant', async (req, res) => {
//     try {
//         res.send({
//             instructions: "In progress"
//         })

//     } catch (error) {
//         res.send(null)
//     }

// });


// app.get('/', (req, res) => {
//     res.send('HELLO RAMEEZ KHANN PLANTS');
// });

// Upload plant for recognition


// Set up Multer storage (in memory or to disk)
const storage = multer.memoryStorage(); // or use diskStorage if saving to filesystem
const upload = multer({ storage });


// app.post('/identify-plant', upload.single('file'), (req, res) => {

//     try {
//         if (!req.file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         // Convert buffer to base64
//         const base64 = req.file.buffer.toString('base64');

//         // Optional: include MIME type to form a full data URI
//         // const base64WithMime = `data:${req.file.mimetype};base64,${base64}`;

//         res.json({ base64 });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error processing file.');
//     }
// });

app.post('/identify-plant', upload.single('file'), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const base64 = req.file.buffer.toString('base64');
    const identification = await sendImageForIdentification(base64);
    console.log(identification);

    res.send(identification)
    // res.json({ base64 });
});




app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);

});

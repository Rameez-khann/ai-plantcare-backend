import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- import cors=
import { registerUser } from './features/authentication/signup';
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


// app.get('/', (req, res) => {
//     res.send('HELLO RAMEEZ KHANN PLANTS');
// });



app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);

});

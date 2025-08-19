import { Application, PORT } from "./application";
import { convertToBase64, saveFileToStorage } from "./core/files/files";
import { storageConfig } from "./core/files/storage";
import { sendImageForHealthCheck, sendImageForIdentification } from "./core/kindwise/kindwise.functions";
import { PlantHealthResult, PlantIdentificationResult } from "./core/kindwise/kindwise.interface";
import { login, registerUser } from "./features/authentication/aithentication";
import { UserResponse } from "./features/authentication/users.interface";
import { getDefaultPlantcareInstructions } from "./features/indoor-plants/plant-care-instructions";
import path from "path";
const app = Application;



// Signup
app.post('/signup', async (req, res) => {
    try {

        const createUser: UserResponse = await registerUser(req.body);
        res.send(createUser)
    } catch (error) {
        res.send(null)
    }

});

//  Login
app.post('/login', async (req, res) => {
    try {

        const user = await login(req.body);
        res.send(user)

    } catch (error) {
        res.send(null)
    }

});



//  identify Plant
app.post('/identify-plant', storageConfig.single('file'), async (req, res) => {
    const userId = req.body.userId; // 👈 capture userId
    const plantId = req.body.plantId || null;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }



    // Convert image to base64 as required by Kindwise
    const filePath = path.resolve(req.file.path);
    const base64 = convertToBase64(filePath);
    // const imageURL = await saveFileToStorage(req.file);
    console.log({ buffer: req.file.buffer });

    // Plant Identification from Kindwise
    const identification: PlantIdentificationResult | null = await sendImageForIdentification({ image: base64, userId, plantId, imageURL: base64 });

    if (identification) {
        //   Get the instructions for the plant specified
        const instructions = await getDefaultPlantcareInstructions(identification);

        identification.classification[0].instructions = instructions;

    }
    res.send(identification);
});


//  Health Check
app.post('/plant-health', storageConfig.single('file'), async (req, res) => {
    const userId = req.body.userId; // 👈 capture userId
    const plantId = req.body.plantId || null;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }



    const filePath = path.resolve(req.file.path);
    const base64 = convertToBase64(filePath);

    // Plant Identification from Kindwise
    const healthCheck: PlantHealthResult | null = await sendImageForHealthCheck({ image: base64, userId, plantId, imageURL: base64 })


    res.send(healthCheck);
});


app.listen(PORT, () => {
    console.info(`🚀 Server is running on http://localhost:${PORT}`);

});

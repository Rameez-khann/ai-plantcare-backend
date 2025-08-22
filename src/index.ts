import { generateUniqueId } from "victor-dev-toolbox";
import { Application, PORT } from "./application";
import { convertToBase64, saveFileToStorage } from "./core/files/files";
import { storageConfig } from "./core/files/storage";
import { plantIdentification, sendImageForHealthCheck, sendImageForIdentification } from "./core/kindwise/kindwise.functions";
import { PlantHealthResult, PlantIdentificationResult } from "./core/kindwise/kindwise.interface";
import { login, registerUser } from "./features/authentication/aithentication";
import { UserResponse } from "./features/authentication/users.interface";
import { getDefaultPlantcareInstructions } from "./features/indoor-plants/plant-care-instructions";
import path from "path";
import { savePlantIdentification } from "./features/indoor-plants/plant-health";
import { getUserPlants } from "./features/indoor-plants/user-plants";
import { log } from "console";
const app = Application;
import express from "express";
import { PlantAnalysis } from "./core/tensorflow/plant-analysis";



app.use(
    "/assets",
    express.static(path.join(process.cwd(), "assets"))
);


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
    const plantId: string | null = req.body.plantId || null;
    const file: Express.Multer.File | null = req.file || null;
    // // Check if image     was uploaded
    if (!file) {
        return res.status(400).send('No image uploaded.');
    }



    // // Convert image to base64 as required by Kindwise
    // const filePath = path.resolve(req.file.path);
    // const base64 = convertToBase64(filePath);

    // // Plant Identification from Kindwise
    // const identification: PlantIdentificationResult | null = await sendImageForIdentification({ image: base64, userId, plantId });

    // if (identification) {
    //     const imageURL = await saveFileToStorage(req.file);
    //     //   Get the instructions for the plant specified
    //     identification.imageUrl = imageURL;

    // const instructions = await getDefaultPlantcareInstructions(identification);

    //     identification.classification.instructions = instructions;
    //     const saveIdentification = await savePlantIdentification(identification);

    // }

    // res.send(identification);
    const identification = await plantIdentification({ plantId, userId, file });
    res.send(identification);
});


//  Health Check
app.post('/plant-health', storageConfig.single('file'), async (req, res) => {
    const userId = req.body.userId; // 👈 capture userId
    const plantId = req.body.plantId;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }

    if (!plantId) {
        return res.status(400).send('Plant Id not found');
    }



    const filePath = path.resolve(req.file.path);
    const base64 = convertToBase64(filePath);

    // Plant Identification from Kindwise
    const healthCheck: PlantHealthResult | null = await sendImageForHealthCheck({ image: base64, userId, plantId, imageURL: base64 })


    res.send(healthCheck);
});


app.get('/plant-health/:id', async (req, res) => {
    try {
        const { id } = req.params; // get the dynamic id
        const
        const result = await getPlantH(id); // pass id if needed
        res.json(result); // send response back
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Plant Records not found" });
    }
});


app.get('/dashboard/user-plants/:id', async (req, res) => {
    try {
        const { id } = req.params; // get the dynamic id
        const result = await getUserPlants(id); // pass id if needed
        res.json(result); // send response back
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Plant Records not found" });
    }
});


app.listen(PORT, () => {
    console.info(`🚀 Server is running on http://localhost:${PORT}`);

});

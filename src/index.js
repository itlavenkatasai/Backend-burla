import express from 'express';
import { dbConnectedToMongoDB } from './db/index.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { checkAndVerify } from './middleware/authentication.js';
import {
    registerUser,
    loginUser,
    createEmployeeHandler,
    listEmployeesHandler,
    getEmployeeByIdHandler,
    updateEmployeeByIdHandler,
    deleteEmployeeByIdHandler
} from './handlers/index.js';

const app = express();

dbConnectedToMongoDB();
dotenv.config();
app.use(cors());
const corsOptions = {
    origin: true, // Change this to the origin you want to allow
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    "Access-Control-Allow-Origin": "*"
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/register', registerUser);
app.post('/login', loginUser);

app.use(checkAndVerify);

app.post('/employee', createEmployeeHandler);
app.get('/employees', listEmployeesHandler);
app.get('/employee/:id',getEmployeeByIdHandler);
app.patch('/employee/:id',updateEmployeeByIdHandler);
app.delete('/employee/:id',deleteEmployeeByIdHandler);



app.listen(3000, () => {
    console.log("Port is Running 3000");
});
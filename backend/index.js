// index.js  (ANS-compliant Cloud Run entry point)
import express from 'express';
import cors from 'cors';
import { registerHandler } from './src/routes/register.js';

const app = express();
app.use(cors()).use(express.json());

// ANS v0.1.0 endpoints
app.post('/register', registerHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`ANS backend ready on :${port}`));

import express from 'express';
import 'dotenv/config'
import authRoutes from './routes/auth';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parses URL-encoded form data
app.use(cors());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

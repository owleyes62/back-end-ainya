import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js'; 

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/hello", (req: Request, res: Response) => {
  return res.json({ message: "Hello Vercel 🚀" });
});

app.use("/api", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
});

export default app;
import express, {Require, Request} from 'express';
import cors from 'cors';

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/api/hello", (req: Require, res: Request) => {
  return res.json({ message: "Hello Vercel 🚀" });
});

app.listen(port, () => {
    console.log('Server is running in http://localhost:3000');
});
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import { swaggerSpec } from './swagger/index.js';

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/hello", (req: Request, res: Response) => {
  return res.json({ message: "Hello Vercel 🚀" });
});

// CSS e JS do Swagger UI servidos via CDN para funcionar no Vercel serverless
// (express.static do swagger-ui-express não enxerga node_modules no deploy).
const swaggerUiOptions = {
    customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    customJs: [
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js",
    ],
};

app.use(
    "/api/docs",
    swaggerUi.serveFiles(swaggerSpec, swaggerUiOptions),
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);
app.get("/api/docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.use("/api", routes);

const port = process.env.PORT || 3000;

// Na Vercel o app é importado como handler serverless — listen não deve rodar.
// Localmente (npm run start / dev) a env VERCEL não existe, então sobe normal.
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running in http://localhost:${port}`);
    });
}

export default app;
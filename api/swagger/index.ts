// Spec OpenAPI 3.0 do DonkeyCode Back-end.
// Compõe schemas (./schemas.ts) e paths (./paths/*.ts).
// Cada domínio fica em seu próprio arquivo para facilitar manutenção.

import { schemas } from "./schemas.js";

import { healthPaths } from "./paths/health.js";
import { authPaths } from "./paths/auth.js";
import { userPaths } from "./paths/users.js";
import { institutionPaths } from "./paths/institutions.js";
import { alunoPaths } from "./paths/alunos.js";
import { userCanteiroPaths } from "./paths/usercanteiros.js";
import { canteiroPaths } from "./paths/canteiros.js";
import { plantaForrageiraPaths } from "./paths/plantas-forrageiras.js";
import { listaPaths } from "./paths/listas-formularios.js";
import { formularioPaths } from "./paths/formularios.js";
import { checklistPaths } from "./paths/checklist.js";
import { measurementPaths } from "./paths/measurements.js";
import { photoPaths } from "./paths/photos.js";
import { plantTemplatePaths } from "./paths/plant-templates.js";
import { relatorioPaths } from "./paths/relatorios.js";
import { turmaPaths } from "./paths/turmas.js";
import { alunoTurmaPaths } from "./paths/aluno-turma.js";
import { academicPeriodPaths } from "./paths/academic-periods.js";

const port = process.env.PORT || 3000;

export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "DonkeyCode Back-end",
        version: "0.1.0",
        description:
            "API do projeto DonkeyCode. Use este Swagger para testar os endpoints.",
    },
    servers: [
        { url: `http://localhost:${port}/api`, description: "local" },
    ],
    tags: [
        { name: "Health" },
        { name: "Auth" },
        { name: "Users" },
        { name: "Institutions" },
        { name: "Alunos" },
        { name: "UserCanteiro" },
        { name: "Canteiros" },
        { name: "PlantasForrageiras" },
        { name: "ListasFormularios" },
        { name: "Formularios" },
        { name: "Checklist" },
        { name: "Measurements" },
        { name: "Photos" },
        { name: "PlantTemplates" },
        { name: "Relatorios" },
        { name: "Turmas" },
        { name: "AlunoTurma" },
        { name: "AcademicPeriods" },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas,
    },
    // Por padrão todos os endpoints exigem Bearer accessToken.
    // Endpoints públicos sobrescrevem com `security: []` no próprio path.
    security: [{ bearerAuth: [] }],
    paths: {
        ...healthPaths,
        ...authPaths,
        ...userPaths,
        ...institutionPaths,
        ...alunoPaths,
        ...userCanteiroPaths,
        ...canteiroPaths,
        ...plantaForrageiraPaths,
        ...listaPaths,
        ...formularioPaths,
        ...checklistPaths,
        ...measurementPaths,
        ...photoPaths,
        ...plantTemplatePaths,
        ...relatorioPaths,
        ...turmaPaths,
        ...alunoTurmaPaths,
        ...academicPeriodPaths,
    },
};

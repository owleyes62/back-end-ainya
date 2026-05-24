// Spec OpenAPI 3.0 do DonkeyCode Back-end.
// Mantenha aqui as rotas/contratos para teste rápido via Swagger UI.

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
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", example: "aluno" },
                    institution_id: { type: "string", nullable: true },
                },
            },
            UserCreate: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string", example: "aluno" },
                    institutionId: { type: "string" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                },
            },
            TokensResponse: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                },
            },
            RefreshRequest: {
                type: "object",
                required: ["refreshToken"],
                properties: { refreshToken: { type: "string" } },
            },
            Institution: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                },
            },
            UserCanteiroRequest: {
                type: "object",
                required: ["user_id", "canteiro_id"],
                properties: {
                    user_id: { type: "string" },
                    canteiro_id: { type: "string" },
                },
            },
            CanteiroCreate: {
                type: "object",
                required: ["plant_id", "name"],
                properties: {
                    plant_id: { type: "string" },
                    name: { type: "string" },
                    user_id: {
                        type: "string",
                        description: "Opcional: cria vínculo em UserCanteiro",
                    },
                },
            },
            ListaCreate: {
                type: "object",
                required: ["canteiro_id", "plant_id", "created_by"],
                properties: {
                    canteiro_id: { type: "string" },
                    plant_id: { type: "string" },
                    created_by: { type: "string" },
                    name: { type: "string" },
                },
            },
            FormularioCreate: {
                type: "object",
                required: ["list_id", "user_id", "type"],
                properties: {
                    list_id: { type: "string" },
                    user_id: { type: "string" },
                    type: { type: "string", example: "SEMANAL" },
                    observations: { type: "string" },
                },
            },
            RelatorioGenerate: {
                type: "object",
                required: ["user_id", "list_id"],
                properties: {
                    user_id: { type: "string" },
                    list_id: { type: "string" },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    error: { type: "string" },
                    message: { type: "string" },
                },
            },
        },
    },
    paths: {
        // ── Health ──────────────────────────────────────────────
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Status do servidor",
                responses: { "200": { description: "OK" } },
            },
        },

        // ── Auth ────────────────────────────────────────────────
        "/users/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Tokens",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/TokensResponse" },
                            },
                        },
                    },
                    "401": { description: "Credenciais inválidas" },
                },
            },
        },
        "/users/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Renovar accessToken",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RefreshRequest" },
                        },
                    },
                },
                responses: { "200": { description: "Novos tokens" } },
            },
        },
        "/users/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RefreshRequest" },
                        },
                    },
                },
                responses: { "200": { description: "Logout ok" } },
            },
        },

        // ── Users ───────────────────────────────────────────────
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Listar todos os usuários",
                responses: { "200": { description: "Lista de usuários" } },
            },
            post: {
                tags: ["Users"],
                summary: "Cadastrar usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserCreate" },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Buscar usuário por id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Usuário" } },
            },
        },
        "/users/{id}/profile": {
            put: {
                tags: ["Users"],
                summary: "Atualizar nome ou senha",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    password: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "200": { description: "Atualizado" } },
            },
        },

        // ── Institutions ────────────────────────────────────────
        "/institutions": {
            get: {
                tags: ["Institutions"],
                summary: "Listar instituições",
                responses: { "200": { description: "Lista" } },
            },
            post: {
                tags: ["Institutions"],
                summary: "Criar instituição",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name"],
                                properties: { name: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criada" } },
            },
        },

        // ── Alunos ──────────────────────────────────────────────
        "/alunos/{id}/resumo": {
            get: {
                tags: ["Alunos"],
                summary: "Resumo do aluno (totais)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Resumo" } },
            },
        },
        "/alunos/{userId}/home": {
            get: {
                tags: ["Alunos"],
                summary: "Home do aluno (canteiros via UserCanteiro + totais)",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Home" } },
            },
        },

        // ── UserCanteiro ────────────────────────────────────────
        "/user-canteiros": {
            post: {
                tags: ["UserCanteiro"],
                summary: "Vincular usuário a canteiro",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserCanteiroRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Vínculo criado" },
                    "409": { description: "Vínculo já existe" },
                },
            },
            delete: {
                tags: ["UserCanteiro"],
                summary: "Remover vínculo",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserCanteiroRequest" },
                        },
                    },
                },
                responses: { "200": { description: "Removido" } },
            },
        },
        "/user-canteiros/user/{userId}": {
            get: {
                tags: ["UserCanteiro"],
                summary: "Listar canteiros de um usuário",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/user-canteiros/canteiro/{canteiroId}": {
            get: {
                tags: ["UserCanteiro"],
                summary: "Listar usuários de um canteiro",
                parameters: [
                    { name: "canteiroId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Canteiros ───────────────────────────────────────────
        "/canteiros": {
            get: {
                tags: ["Canteiros"],
                summary: "Canteiros (por user_id na query)",
                parameters: [
                    { name: "user_id", in: "query", schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
            post: {
                tags: ["Canteiros"],
                summary: "Criar canteiro (vincula via UserCanteiro se user_id vier)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CanteiroCreate" },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/canteiros/user/{userId}": {
            get: {
                tags: ["Canteiros"],
                summary: "Canteiros de um usuário (via UserCanteiro)",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/canteiros/{canteiroId}/listas": {
            get: {
                tags: ["Canteiros"],
                summary: "Listas de formulários de um canteiro",
                parameters: [
                    { name: "canteiroId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Plantas Forrageiras ─────────────────────────────────
        "/plantas-forrageiras": {
            get: {
                tags: ["PlantasForrageiras"],
                summary: "Listar plantas (opcionalmente filtrar por categoria)",
                parameters: [
                    {
                        name: "category",
                        in: "query",
                        schema: {
                            type: "string",
                            enum: [
                                "CACTACEA",
                                "CULTURA_ANUAL",
                                "GRAMINEA_PORTE_ALTO",
                                "GRAMINEA_PORTE_BAIXO",
                                "GRAMINEA_PORTE_MEDIO",
                                "LEGUMINOSA_ARBUSTIVA",
                                "LEGUMINOSA_HERBACEA",
                                "OLEAGINOSA_FORRAGEIRA",
                            ],
                        },
                    },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/plantas-forrageiras/{id}": {
            get: {
                tags: ["PlantasForrageiras"],
                summary: "Buscar planta por id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Planta" } },
            },
        },

        // ── Listas de Formulários ───────────────────────────────
        "/listas-formularios": {
            post: {
                tags: ["ListasFormularios"],
                summary: "Criar lista (valida vínculo UserCanteiro do created_by)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/ListaCreate" },
                        },
                    },
                },
                responses: { "201": { description: "Criada" } },
            },
        },
        "/listas-formularios/canteiro/{canteiroId}": {
            get: {
                tags: ["ListasFormularios"],
                summary: "Listas de um canteiro",
                parameters: [
                    { name: "canteiroId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/listas-formularios/{listaId}": {
            get: {
                tags: ["ListasFormularios"],
                summary: "Lista por id (com formulários)",
                parameters: [
                    { name: "listaId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/listas-formularios/{id}/formularios": {
            get: {
                tags: ["ListasFormularios"],
                summary: "Formulários da lista (cronológico)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Formulários ─────────────────────────────────────────
        "/formularios": {
            get: {
                tags: ["Formularios"],
                summary: "Formulários do usuário (?user_id=)",
                parameters: [
                    { name: "user_id", in: "query", schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
            post: {
                tags: ["Formularios"],
                summary: "Criar formulário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/FormularioCreate" },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/formularios/user/{userId}": {
            get: {
                tags: ["Formularios"],
                summary: "Formulários de um aluno",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/formularios/{id}": {
            get: {
                tags: ["Formularios"],
                summary: "Formulário por id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Formulário" } },
            },
            put: {
                tags: ["Formularios"],
                summary: "Atualizar formulário",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object" } } },
                },
                responses: { "200": { description: "Atualizado" } },
            },
        },
        "/formularios/{id}/checklist": {
            get: {
                tags: ["Formularios"],
                summary: "Checklist do formulário",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Itens" } },
            },
            post: {
                tags: ["Formularios"],
                summary: "Criar checklist em lote (template_ids)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    template_ids: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/formularios/{id}/measurements": {
            get: {
                tags: ["Formularios"],
                summary: "Medições do formulário",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Itens" } },
            },
            post: {
                tags: ["Formularios"],
                summary: "Criar medições em lote",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    measurements: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                template_id: { type: "string" },
                                                value: { type: "number" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/formularios/{id}/photos": {
            get: {
                tags: ["Formularios"],
                summary: "Fotos do formulário",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
            post: {
                tags: ["Formularios"],
                summary: "Upload de foto",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    photo: { type: "string", format: "binary" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Enviada" } },
            },
        },
        "/formularios/{id}/finalizar": {
            post: {
                tags: ["Formularios"],
                summary: "Finalizar formulário",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Finalizado" } },
            },
        },
        "/formularios/{id}/sync": {
            post: {
                tags: ["Formularios"],
                summary: "Sincronizar dados offline",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object" } } },
                },
                responses: { "200": { description: "Sincronizado" } },
            },
        },

        // ── Checklist ───────────────────────────────────────────
        "/checklist": {
            post: {
                tags: ["Checklist"],
                summary: "Criar item de checklist",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["form_id", "template_id"],
                                properties: {
                                    form_id: { type: "string" },
                                    template_id: { type: "string" },
                                    checked: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/checklist/{id}": {
            put: {
                tags: ["Checklist"],
                summary: "Atualizar checked",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["checked"],
                                properties: { checked: { type: "boolean" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "Atualizado" } },
            },
        },
        "/checklist/formulario/{formularioId}": {
            get: {
                tags: ["Checklist"],
                summary: "Checklist do formulário",
                parameters: [
                    { name: "formularioId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Measurements ────────────────────────────────────────
        "/measurements": {
            post: {
                tags: ["Measurements"],
                summary: "Criar medição",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["form_id", "template_id"],
                                properties: {
                                    form_id: { type: "string" },
                                    template_id: { type: "string" },
                                    value: { type: "number" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criada" } },
            },
        },
        "/measurements/{id}": {
            put: {
                tags: ["Measurements"],
                summary: "Atualizar value",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["value"],
                                properties: { value: { type: "number" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "Atualizada" } },
            },
        },
        "/measurements/formulario/{formularioId}": {
            get: {
                tags: ["Measurements"],
                summary: "Medições do formulário",
                parameters: [
                    { name: "formularioId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Photos ──────────────────────────────────────────────
        "/photos": {
            post: {
                tags: ["Photos"],
                summary: "Registrar foto por URL",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["form_id", "url"],
                                properties: {
                                    form_id: { type: "string" },
                                    url: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criada" } },
            },
        },
        "/photos/upload": {
            post: {
                tags: ["Photos"],
                summary: "Upload de arquivo (multipart)",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    photo: { type: "string", format: "binary" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Enviada" } },
            },
        },
        "/photos/formulario/{formularioId}": {
            get: {
                tags: ["Photos"],
                summary: "Fotos do formulário",
                parameters: [
                    { name: "formularioId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/photos/{id}": {
            delete: {
                tags: ["Photos"],
                summary: "Remover foto",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Removida" } },
            },
        },

        // ── PlantTemplates ──────────────────────────────────────
        "/plant-templates": {
            get: {
                tags: ["PlantTemplates"],
                summary: "Templates por planta (?plant_id=)",
                parameters: [
                    { name: "plant_id", in: "query", schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
            post: {
                tags: ["PlantTemplates"],
                summary: "Criar template",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["plant_id", "field_name", "unit"],
                                properties: {
                                    plant_id: { type: "string" },
                                    field_name: { type: "string" },
                                    unit: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/plant-templates/plant/{plantId}": {
            get: {
                tags: ["PlantTemplates"],
                summary: "Templates de uma planta",
                parameters: [
                    { name: "plantId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Relatórios ──────────────────────────────────────────
        "/relatorios/user/{userId}": {
            get: {
                tags: ["Relatorios"],
                summary: "Relatórios do aluno",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },
        "/relatorios/generate": {
            post: {
                tags: ["Relatorios"],
                summary: "Gerar relatório (valida UserCanteiro do user_id × canteiro da lista)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RelatorioGenerate" },
                        },
                    },
                },
                responses: { "201": { description: "Criado" } },
            },
        },
        "/relatorios/{id}": {
            get: {
                tags: ["Relatorios"],
                summary: "Relatório por id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Relatório" } },
            },
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar múltiplas seções",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    introduction: { type: "string" },
                                    objective: { type: "string" },
                                    development: { type: "string" },
                                    final_thoughts: { type: "string" },
                                    references: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "200": { description: "Atualizado" } },
            },
        },
        "/relatorios/{id}/objective": {
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar objetivo",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { objective: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "OK" } },
            },
        },
        "/relatorios/{id}/introduction": {
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar introdução",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { introduction: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "OK" } },
            },
        },
        "/relatorios/{id}/development": {
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar desenvolvimento",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { development: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "OK" } },
            },
        },
        "/relatorios/{id}/final-thoughts": {
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar considerações finais",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { final_thoughts: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "OK" } },
            },
        },
        "/relatorios/{id}/references": {
            put: {
                tags: ["Relatorios"],
                summary: "Atualizar referências",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { references: { type: "string" } },
                            },
                        },
                    },
                },
                responses: { "200": { description: "OK" } },
            },
        },
        "/relatorios/{id}/submit": {
            post: {
                tags: ["Relatorios"],
                summary: "Submeter relatório",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Submetido" } },
            },
        },
        "/relatorios/{id}/export-pdf": {
            get: {
                tags: ["Relatorios"],
                summary: "Exportar PDF (stub)",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "501": { description: "Não implementado" } },
            },
        },

        // ── Turmas ──────────────────────────────────────────────
        "/turmas": {
            get: {
                tags: ["Turmas"],
                summary: "Listar turmas",
                responses: { "200": { description: "Lista" } },
            },
        },
        "/turmas/{id}": {
            get: {
                tags: ["Turmas"],
                summary: "Turma por id",
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Turma" } },
            },
        },

        // ── AlunoTurma ──────────────────────────────────────────
        "/aluno-turma": {
            post: {
                tags: ["AlunoTurma"],
                summary: "Vincular aluno a turma",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["user_id", "turma_id"],
                                properties: {
                                    user_id: { type: "string" },
                                    turma_id: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: { "201": { description: "Vinculado" } },
            },
        },
        "/aluno-turma/user/{userId}": {
            get: {
                tags: ["AlunoTurma"],
                summary: "Turmas do aluno",
                parameters: [
                    { name: "userId", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: { "200": { description: "Lista" } },
            },
        },

        // ── Academic Periods ────────────────────────────────────
        "/academic-periods": {
            get: {
                tags: ["AcademicPeriods"],
                summary: "Listar períodos letivos",
                responses: { "200": { description: "Lista" } },
            },
        },
        "/academic-periods/active": {
            get: {
                tags: ["AcademicPeriods"],
                summary: "Período letivo ativo",
                responses: { "200": { description: "Período ativo" } },
            },
        },
    },
};

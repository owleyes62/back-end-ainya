// Schemas reutilizáveis do OpenAPI.
// Referenciados via $ref: "#/components/schemas/<Nome>" nos paths.

export const schemas = {
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
        required: ["canteiro_id", "created_by"],
        properties: {
            canteiro_id: { type: "string" },
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
};

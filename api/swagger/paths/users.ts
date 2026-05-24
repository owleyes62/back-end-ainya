export const userPaths = {
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
};

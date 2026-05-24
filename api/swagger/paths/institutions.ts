export const institutionPaths = {
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
};

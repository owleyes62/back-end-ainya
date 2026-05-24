export const canteiroPaths = {
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
};

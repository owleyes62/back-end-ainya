export const userCanteiroPaths = {
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
};

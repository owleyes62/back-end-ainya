export const listaPaths = {
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
};

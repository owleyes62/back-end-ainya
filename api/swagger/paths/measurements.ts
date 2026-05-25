export const measurementPaths = {
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
};

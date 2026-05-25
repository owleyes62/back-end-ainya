export const checklistPaths = {
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
};

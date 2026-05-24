export const photoPaths = {
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
};

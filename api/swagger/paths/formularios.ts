export const formularioPaths = {
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
};

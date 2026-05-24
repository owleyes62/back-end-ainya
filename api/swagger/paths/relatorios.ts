export const relatorioPaths = {
    "/relatorios/user/{userId}": {
        get: {
            tags: ["Relatorios"],
            summary: "Relatórios do aluno",
            parameters: [
                { name: "userId", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Lista" } },
        },
    },
    "/relatorios/generate": {
        post: {
            tags: ["Relatorios"],
            summary: "Gerar relatório (valida UserCanteiro do user_id × canteiro da lista)",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RelatorioGenerate" },
                    },
                },
            },
            responses: { "201": { description: "Criado" } },
        },
    },
    "/relatorios/{id}": {
        get: {
            tags: ["Relatorios"],
            summary: "Relatório por id",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Relatório" } },
        },
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar múltiplas seções",
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
                                introduction: { type: "string" },
                                objective: { type: "string" },
                                development: { type: "string" },
                                final_thoughts: { type: "string" },
                                references: { type: "string" },
                            },
                        },
                    },
                },
            },
            responses: { "200": { description: "Atualizado" } },
        },
    },
    "/relatorios/{id}/objective": {
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar objetivo",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { objective: { type: "string" } },
                        },
                    },
                },
            },
            responses: { "200": { description: "OK" } },
        },
    },
    "/relatorios/{id}/introduction": {
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar introdução",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { introduction: { type: "string" } },
                        },
                    },
                },
            },
            responses: { "200": { description: "OK" } },
        },
    },
    "/relatorios/{id}/development": {
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar desenvolvimento",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { development: { type: "string" } },
                        },
                    },
                },
            },
            responses: { "200": { description: "OK" } },
        },
    },
    "/relatorios/{id}/final-thoughts": {
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar considerações finais",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { final_thoughts: { type: "string" } },
                        },
                    },
                },
            },
            responses: { "200": { description: "OK" } },
        },
    },
    "/relatorios/{id}/references": {
        put: {
            tags: ["Relatorios"],
            summary: "Atualizar referências",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { references: { type: "string" } },
                        },
                    },
                },
            },
            responses: { "200": { description: "OK" } },
        },
    },
    "/relatorios/{id}/submit": {
        post: {
            tags: ["Relatorios"],
            summary: "Submeter relatório",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Submetido" } },
        },
    },
    "/relatorios/{id}/export-pdf": {
        get: {
            tags: ["Relatorios"],
            summary: "Exportar relatório em PDF",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: {
                "200": {
                    description: "PDF do relatório",
                    content: {
                        "application/pdf": {
                            schema: { type: "string", format: "binary" },
                        },
                    },
                },
                "404": { description: "Relatório não encontrado" },
            },
        },
    },
};

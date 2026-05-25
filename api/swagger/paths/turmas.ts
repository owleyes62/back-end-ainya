export const turmaPaths = {
    "/turmas": {
        get: {
            tags: ["Turmas"],
            summary: "Listar turmas",
            responses: { "200": { description: "Lista" } },
        },
    },
    "/turmas/{id}": {
        get: {
            tags: ["Turmas"],
            summary: "Turma por id",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Turma" } },
        },
    },
};

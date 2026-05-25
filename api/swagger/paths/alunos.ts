export const alunoPaths = {
    "/alunos/{id}/resumo": {
        get: {
            tags: ["Alunos"],
            summary: "Resumo do aluno (totais)",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Resumo" } },
        },
    },
    "/alunos/{userId}/home": {
        get: {
            tags: ["Alunos"],
            summary: "Home do aluno (canteiros via UserCanteiro + totais)",
            parameters: [
                { name: "userId", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Home" } },
        },
    },
};

export const alunoTurmaPaths = {
    "/aluno-turma": {
        post: {
            tags: ["AlunoTurma"],
            summary: "Vincular aluno a turma",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["user_id", "turma_id"],
                            properties: {
                                user_id: { type: "string" },
                                turma_id: { type: "string" },
                            },
                        },
                    },
                },
            },
            responses: { "201": { description: "Vinculado" } },
        },
    },
    "/aluno-turma/user/{userId}": {
        get: {
            tags: ["AlunoTurma"],
            summary: "Turmas do aluno",
            parameters: [
                { name: "userId", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Lista" } },
        },
    },
};

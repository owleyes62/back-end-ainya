export const academicPeriodPaths = {
    "/academic-periods": {
        get: {
            tags: ["AcademicPeriods"],
            summary: "Listar períodos letivos",
            responses: { "200": { description: "Lista" } },
        },
    },
    "/academic-periods/active": {
        get: {
            tags: ["AcademicPeriods"],
            summary: "Período letivo ativo",
            responses: { "200": { description: "Período ativo" } },
        },
    },
};

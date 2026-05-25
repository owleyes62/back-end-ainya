export const healthPaths = {
    "/health": {
        get: {
            tags: ["Health"],
            summary: "Status do servidor",
            security: [],
            responses: { "200": { description: "OK" } },
        },
    },
};

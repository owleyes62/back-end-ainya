export const healthPaths = {
    "/health": {
        get: {
            tags: ["Health"],
            summary: "Status do servidor",
            responses: { "200": { description: "OK" } },
        },
    },
};

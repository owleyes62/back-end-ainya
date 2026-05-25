export const authPaths = {
    "/users/login": {
        post: {
            tags: ["Auth"],
            summary: "Login",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/LoginRequest" },
                    },
                },
            },
            responses: {
                "200": {
                    description: "Tokens",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/TokensResponse" },
                        },
                    },
                },
                "401": { description: "Credenciais inválidas" },
            },
        },
    },
    "/users/refresh": {
        post: {
            tags: ["Auth"],
            summary: "Renovar accessToken",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RefreshRequest" },
                    },
                },
            },
            responses: { "200": { description: "Novos tokens" } },
        },
    },
    "/users/logout": {
        post: {
            tags: ["Auth"],
            summary: "Logout",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/RefreshRequest" },
                    },
                },
            },
            responses: { "200": { description: "Logout ok" } },
        },
    },
};

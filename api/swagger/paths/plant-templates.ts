export const plantTemplatePaths = {
    "/plant-templates": {
        get: {
            tags: ["PlantTemplates"],
            summary: "Templates por planta (?plant_id=)",
            parameters: [
                { name: "plant_id", in: "query", schema: { type: "string" } },
            ],
            responses: { "200": { description: "Lista" } },
        },
        post: {
            tags: ["PlantTemplates"],
            summary: "Criar template",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["plant_id", "field_name", "unit"],
                            properties: {
                                plant_id: { type: "string" },
                                field_name: { type: "string" },
                                unit: { type: "string" },
                            },
                        },
                    },
                },
            },
            responses: { "201": { description: "Criado" } },
        },
    },
    "/plant-templates/plant/{plantId}": {
        get: {
            tags: ["PlantTemplates"],
            summary: "Templates de uma planta",
            parameters: [
                { name: "plantId", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Lista" } },
        },
    },
};

export const plantaForrageiraPaths = {
    "/plantas-forrageiras": {
        get: {
            tags: ["PlantasForrageiras"],
            summary: "Listar plantas (opcionalmente filtrar por categoria)",
            parameters: [
                {
                    name: "category",
                    in: "query",
                    schema: {
                        type: "string",
                        enum: [
                            "CACTACEA",
                            "CULTURA_ANUAL",
                            "GRAMINEA_PORTE_ALTO",
                            "GRAMINEA_PORTE_BAIXO",
                            "GRAMINEA_PORTE_MEDIO",
                            "LEGUMINOSA_ARBUSTIVA",
                            "LEGUMINOSA_HERBACEA",
                            "OLEAGINOSA_FORRAGEIRA",
                        ],
                    },
                },
            ],
            responses: { "200": { description: "Lista" } },
        },
    },
    "/plantas-forrageiras/{id}": {
        get: {
            tags: ["PlantasForrageiras"],
            summary: "Buscar planta por id",
            parameters: [
                { name: "id", in: "path", required: true, schema: { type: "string" } },
            ],
            responses: { "200": { description: "Planta" } },
        },
    },
};

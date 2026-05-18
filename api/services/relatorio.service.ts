
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../core/httpError.js";

export class RelatorioService {
    
    // ATIVIDADE 1: Buscar todos os relatórios do aluno
    static async getRelatoriosByUser(userId: string) {
        return await prisma.relatorio.findMany({
            where: { user_id: userId },
            include: {
                list: {
                    include: {
                        plant: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // ATIVIDADE 1: Gerar um novo relatório a partir da lista
    static async createRelatorio(userId: string, listId: string) {
        // 1. Busca a lista e a planta associada
        const lista = await prisma.listaDeFormularios.findUnique({
            where: { id: listId },
            include: { plant: true }
        });

        if (!lista) {
            throw new HttpError("Lista de formulários não encontrada.", 404);
        }

        // 2. Texto base gerado automaticamente
        const textoObjetivoGerado = `Acompanhar e registrar o desenvolvimento de ${lista.plant.name} ao longo do semestre, documentando medições semanais de altura, cobertura do solo e estádio fenológico.`;

        // 3. Cria o relatório como RASCUNHO
        return await prisma.relatorio.create({
            data: {
                user_id: userId,
                list_id: listId,
                canteiro_id: lista.canteiro_id,
                status: 'RASCUNHO',
                objective: textoObjetivoGerado,
                introduction: '',
                development: '',
                final_thoughts: '',
                references: '',
                grade: 0.0,
                feedback: '',
                submited_at: new Date(), // Data provisória exigida pelo banco
            },
        });
    }

    // Atividade 2 - Buscar um relatório específico pelo ID
    static async getRelatorioById(id: string) {
        const relatorio = await prisma.relatorio.findUnique({
            where: { id: id },

            include: {
                list: {
                    include: {
                        plant: true
                    }
                }
            }
        });

        if (!relatorio) {
            throw new HttpError("Relatório não encontrado.", 404);
        }

        return relatorio;
    }

    // Atividade 2 - Atualizar apenas o texto do objetivo (Salvamento Automático)
    static async updateObjective(id: string, novoObjetivo: string) {
  
        return await prisma.relatorio.update({
            where: { id: id },
            data: {
                objective: novoObjetivo
            }
        });
    }
}
    
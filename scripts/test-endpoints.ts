// Script simples que testa os endpoints da API em sequência.
// Roda com: npx tsx scripts/test-endpoints.ts
//
// Mantém os IDs gerados em memória e dispara cada chamada com fetch.
// Loga o resultado linha a linha e salva tudo em scripts/results.json.

import fs from "node:fs";

// PNG 1x1 transparente — menor imagem válida para os testes de upload.
const PNG_1X1 = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63606060600000000400015a1bd9710000000049454e44ae426082",
    "hex"
);

const BASE = process.env.API_BASE ?? "http://localhost:3000/api";

type Result = {
    step: string;
    method: string;
    url: string;
    body?: unknown;
    status: number | null;
    ok: boolean;
    summary: string;
    response?: unknown;
};

const results: Result[] = [];
const state: Record<string, string> = {};

function shortPreview(value: unknown): string {
    try {
        const json = JSON.stringify(value);
        if (!json) return "";
        return json.length > 200 ? json.slice(0, 200) + "..." : json;
    } catch {
        return String(value);
    }
}

async function call(
    step: string,
    method: string,
    path: string,
    body?: unknown,
    expectStatus: number[] = [200, 201]
): Promise<Result> {
    const url = `${BASE}${path}`;
    const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (body !== undefined) init.body = JSON.stringify(body);

    let status: number | null = null;
    let response: unknown = null;
    let ok = false;
    let summary = "";

    try {
        const res = await fetch(url, init);
        status = res.status;
        const text = await res.text();
        try { response = JSON.parse(text); } catch { response = text; }
        ok = expectStatus.includes(status);
        summary = ok ? "OK" : `status=${status} ${shortPreview(response)}`;
    } catch (err: any) {
        summary = `network error: ${err?.message ?? err}`;
    }

    const r: Result = { step, method, url, body, status, ok, summary, response };
    results.push(r);

    const tag = ok ? "OK  " : "FAIL";
    const line = `[${tag}] ${method.padEnd(6)} ${path.padEnd(48)} -> ${status ?? "?"} ${ok ? "" : summary.slice(0, 120)}`;
    console.log(line);

    return r;
}

// Variante para multipart/form-data (upload de arquivo).
async function callMultipart(
    step: string,
    method: string,
    path: string,
    form: FormData,
    expectStatus: number[] = [200, 201]
): Promise<Result> {
    const url = `${BASE}${path}`;

    let status: number | null = null;
    let response: unknown = null;
    let ok = false;
    let summary = "";

    try {
        const res = await fetch(url, { method, body: form });
        status = res.status;
        const text = await res.text();
        try { response = JSON.parse(text); } catch { response = text; }
        ok = expectStatus.includes(status);
        summary = ok ? "OK" : `status=${status} ${shortPreview(response)}`;
    } catch (err: any) {
        summary = `network error: ${err?.message ?? err}`;
    }

    const r: Result = { step, method, url, status, ok, summary, response };
    results.push(r);

    const tag = ok ? "OK  " : "FAIL";
    console.log(`[${tag}] ${method.padEnd(6)} ${path.padEnd(48)} -> ${status ?? "?"} ${ok ? "" : summary.slice(0, 120)}`);

    return r;
}

// Variante para resposta binária (PDF).
async function callBinary(
    step: string,
    method: string,
    pathUrl: string,
    expectStatus: number[] = [200]
): Promise<Result> {
    const url = `${BASE}${pathUrl}`;

    let status: number | null = null;
    let response: unknown = null;
    let ok = false;
    let summary = "";

    try {
        const res = await fetch(url, { method });
        status = res.status;
        const buf = Buffer.from(await res.arrayBuffer());
        ok = expectStatus.includes(status);
        const contentType = res.headers.get("content-type") ?? "";
        response = { contentType, size: buf.length, head: buf.subarray(0, 8).toString("ascii") };
        summary = ok ? `OK ${buf.length}B ${contentType}` : `status=${status}`;
    } catch (err: any) {
        summary = `network error: ${err?.message ?? err}`;
    }

    const r: Result = { step, method, url, status, ok, summary, response };
    results.push(r);

    const tag = ok ? "OK  " : "FAIL";
    console.log(`[${tag}] ${method.padEnd(6)} ${pathUrl.padEnd(48)} -> ${status ?? "?"} ${ok ? (response as any).contentType + " " + (response as any).size + "B" : summary.slice(0, 120)}`);

    return r;
}

async function main() {
    console.log(`\nBase URL: ${BASE}\n`);

    // ──────────────────────────────────────────────────────────
    // 1. Health
    // ──────────────────────────────────────────────────────────
    console.log("# 1. Health");
    await call("health", "GET", "/health");

    // ──────────────────────────────────────────────────────────
    // 2. Institutions
    // ──────────────────────────────────────────────────────────
    console.log("\n# 2. Institutions");
    await call("institutions.list", "GET", "/institutions");

    const inst = await call("institutions.create", "POST", "/institutions", {
        name: `Instituição Teste ${Date.now()}`,
    });
    if (inst.ok && (inst.response as any)?.id) {
        state.institutionId = (inst.response as any).id;
        console.log(`  -> institutionId = ${state.institutionId}`);
    }

    // ──────────────────────────────────────────────────────────
    // 3. Users / Auth
    // ──────────────────────────────────────────────────────────
    console.log("\n# 3. Users / Auth");
    const ts = Date.now();
    const email = `teste${ts}@email.com`;
    const senha = "senha123456";

    await call("users.create", "POST", "/users", {
        name: "Aluno Teste",
        email,
        password: senha,
        role: "aluno",
        institutionId: state.institutionId,
    });

    // create não retorna user; pegamos pela listagem
    const usersList = await call("users.list", "GET", "/users");
    if (usersList.ok && Array.isArray(usersList.response)) {
        const me = (usersList.response as any[]).find((u) => u.email === email);
        if (me?.id) {
            state.userId = me.id;
            console.log(`  -> userId = ${state.userId}`);
        }
    }

    const login = await call("users.login", "POST", "/users/login", { email, password: senha });
    if (login.ok) {
        state.accessToken = (login.response as any)?.accessToken ?? "";
        state.refreshToken = (login.response as any)?.refreshToken ?? "";
        console.log(`  -> accessToken? ${Boolean(state.accessToken)} refreshToken? ${Boolean(state.refreshToken)}`);
    }

    if (state.userId) {
        await call("users.findById", "GET", `/users/${state.userId}`);
        await call(
            "users.updateProfile",
            "PUT",
            `/users/${state.userId}/profile`,
            { name: "Aluno Teste Renomeado" }
        );
    }

    if (state.refreshToken) {
        const ref = await call("users.refresh", "POST", "/users/refresh", { refreshToken: state.refreshToken });
        if (ref.ok) {
            state.refreshToken = (ref.response as any)?.refreshToken ?? state.refreshToken;
        }
    }

    // logout só no final do script

    // ──────────────────────────────────────────────────────────
    // 4. Plantas Forrageiras
    // ──────────────────────────────────────────────────────────
    console.log("\n# 4. Plantas Forrageiras");
    const plantas = await call("plantas.list", "GET", "/plantas-forrageiras");
    if (plantas.ok && Array.isArray(plantas.response) && (plantas.response as any[]).length > 0) {
        state.plantId = (plantas.response as any[])[0].id;
        console.log(`  -> plantId = ${state.plantId}`);
    }
    await call("plantas.filterCategory", "GET", "/plantas-forrageiras?category=CACTACEA");
    if (state.plantId) {
        await call("plantas.findById", "GET", `/plantas-forrageiras/${state.plantId}`);
    }

    // ──────────────────────────────────────────────────────────
    // 5. Canteiros
    // ──────────────────────────────────────────────────────────
    console.log("\n# 5. Canteiros");
    if (state.plantId && state.userId) {
        const cant = await call("canteiros.create", "POST", "/canteiros", {
            plant_id: state.plantId,
            name: `Canteiro Teste ${ts}`,
            user_id: state.userId, // cria o vínculo UserCanteiro junto
        });
        if (cant.ok) {
            state.canteiroId = (cant.response as any)?.id ?? "";
            console.log(`  -> canteiroId = ${state.canteiroId}`);
        }
        await call("canteiros.findByUser", "GET", `/canteiros/user/${state.userId}`);
        if (state.canteiroId) {
            await call("canteiros.findListas", "GET", `/canteiros/${state.canteiroId}/listas`);
        }
    }

    // ──────────────────────────────────────────────────────────
    // 6. UserCanteiro
    // ──────────────────────────────────────────────────────────
    console.log("\n# 6. UserCanteiro");
    if (state.userId) {
        await call("userCanteiro.findByUser", "GET", `/user-canteiros/user/${state.userId}`);
    }
    if (state.canteiroId) {
        await call("userCanteiro.findByCanteiro", "GET", `/user-canteiros/canteiro/${state.canteiroId}`);
    }
    // Já criado junto com o canteiro. Testa duplicate detection:
    if (state.userId && state.canteiroId) {
        await call(
            "userCanteiro.createDuplicate",
            "POST",
            "/user-canteiros",
            { user_id: state.userId, canteiro_id: state.canteiroId },
            [409] // esperado: já existe
        );
    }

    // ──────────────────────────────────────────────────────────
    // 7. PlantTemplate (antes da lista para usar templates depois)
    // ──────────────────────────────────────────────────────────
    console.log("\n# 7. PlantTemplate");
    if (state.plantId) {
        const tpls = await call("planttemplates.byPlant", "GET", `/plant-templates/plant/${state.plantId}`);
        const data = (tpls.response as any)?.data ?? tpls.response;
        if (Array.isArray(data) && data.length > 0) {
            state.templateId = data[0].id;
            console.log(`  -> templateId = ${state.templateId}`);
        }
    }

    // ──────────────────────────────────────────────────────────
    // 8. ListaDeFormularios
    // ──────────────────────────────────────────────────────────
    console.log("\n# 8. ListaDeFormularios");
    if (state.canteiroId && state.plantId && state.userId) {
        const lst = await call("listas.create", "POST", "/listas-formularios", {
            canteiro_id: state.canteiroId,
            plant_id: state.plantId,
            created_by: state.userId,
            name: `Lista Teste ${ts}`,
        });
        if (lst.ok) {
            state.listaId = (lst.response as any)?.id ?? "";
            console.log(`  -> listaId = ${state.listaId}`);
        }
        await call("listas.byCanteiro", "GET", `/listas-formularios/canteiro/${state.canteiroId}`);
        if (state.listaId) {
            await call("listas.findById", "GET", `/listas-formularios/${state.listaId}`);
            await call("listas.formularios", "GET", `/listas-formularios/${state.listaId}/formularios`);
        }
    }

    // ──────────────────────────────────────────────────────────
    // 9. Formulario
    // ──────────────────────────────────────────────────────────
    console.log("\n# 9. Formulario");
    if (state.listaId && state.userId) {
        const form = await call("formularios.create", "POST", "/formularios", {
            list_id: state.listaId,
            user_id: state.userId,
            type: "SEMANAL",
            observations: "Teste",
        });
        if (form.ok) {
            state.formularioId = (form.response as any)?.data?.id ?? (form.response as any)?.id ?? "";
            console.log(`  -> formularioId = ${state.formularioId}`);
        }
        await call("formularios.findByUser", "GET", `/formularios/user/${state.userId}`);
        if (state.formularioId) {
            await call("formularios.findById", "GET", `/formularios/${state.formularioId}`);
            await call("formularios.checklist", "GET", `/formularios/${state.formularioId}/checklist`);
            await call("formularios.measurements", "GET", `/formularios/${state.formularioId}/measurements`);
            await call("formularios.photos", "GET", `/formularios/${state.formularioId}/photos`);
            await call("formularios.update", "PATCH", `/formularios/${state.formularioId}`, { observations: "Atualizado" });
        }
    }

    // ──────────────────────────────────────────────────────────
    // 10. Checklist
    // ──────────────────────────────────────────────────────────
    console.log("\n# 10. Checklist");
    if (state.formularioId && state.templateId) {
        const chk = await call("checklist.create", "POST", "/checklist", {
            form_id: state.formularioId,
            template_id: state.templateId,
            checked: false,
        });
        if (chk.ok) {
            const r = chk.response as any;
            state.checklistId = r?.data?.id ?? r?.id ?? "";
            console.log(`  -> checklistId = ${state.checklistId}`);
        }
        await call("checklist.listByFormulario", "GET", `/checklist/formulario/${state.formularioId}`);
        if (state.checklistId) {
            await call("checklist.update", "PUT", `/checklist/${state.checklistId}`, { checked: true });
        }
    }

    // ──────────────────────────────────────────────────────────
    // 11. Measurement
    // ──────────────────────────────────────────────────────────
    console.log("\n# 11. Measurement");
    if (state.formularioId && state.templateId) {
        const m = await call("measurement.create", "POST", "/measurements", {
            form_id: state.formularioId,
            template_id: state.templateId,
            value: 42.5,
        });
        if (m.ok) {
            const r = m.response as any;
            state.measurementId = r?.data?.id ?? r?.id ?? "";
            console.log(`  -> measurementId = ${state.measurementId}`);
        }
        await call("measurement.listByFormulario", "GET", `/measurements/formulario/${state.formularioId}`);
        if (state.measurementId) {
            await call("measurement.update", "PUT", `/measurements/${state.measurementId}`, { value: 100 });
        }
    }

    // ──────────────────────────────────────────────────────────
    // 12. Photo
    // ──────────────────────────────────────────────────────────
    console.log("\n# 12. Photo");
    if (state.formularioId) {
        await call("photo.listByFormulario", "GET", `/photos/formulario/${state.formularioId}`);
        // Registrar foto via URL (não testa upload binário aqui)
        const ph = await call("photo.createByUrl", "POST", "/photos", {
            form_id: state.formularioId,
            url: "/uploads/teste.jpg",
        });
        if (ph.ok) {
            const r = ph.response as any;
            state.photoId = r?.data?.id ?? r?.id ?? "";
            console.log(`  -> photoId = ${state.photoId}`);
        }
        if (state.photoId) {
            await call("photo.delete", "DELETE", `/photos/${state.photoId}`);
        }

        // Upload real (multipart) usando PNG 1x1 em memória.
        const form = new FormData();
        form.append("photo", new Blob([new Uint8Array(PNG_1X1)], { type: "image/png" }), "test.png");
        await callMultipart(
            "photo.uploadMultipart",
            "POST",
            `/formularios/${state.formularioId}/photos`,
            form
        );
    }

    // ──────────────────────────────────────────────────────────
    // 12.5 Formulario.sync (offline → server)
    // ──────────────────────────────────────────────────────────
    console.log("\n# 12.5 Formulario.sync");
    if (state.formularioId && state.templateId) {
        await call("formulario.sync", "POST", `/formularios/${state.formularioId}/sync`, {
            formulario: {
                type: "SEMANAL",
                observations: "sincronizado offline",
                ended_at: new Date().toISOString(),
            },
            checklist: [{ template_id: state.templateId, checked: true }],
            measurements: [{ template_id: state.templateId, value: 77 }],
            photos: [{ url: "/uploads/sync.jpg" }],
        });
    }

    // ──────────────────────────────────────────────────────────
    // 13. Relatorio
    // ──────────────────────────────────────────────────────────
    console.log("\n# 13. Relatorio");
    if (state.userId && state.listaId) {
        const rel = await call("relatorio.generate", "POST", "/relatorios/generate", {
            user_id: state.userId,
            list_id: state.listaId,
        });
        if (rel.ok) {
            state.relatorioId = (rel.response as any)?.id ?? "";
            console.log(`  -> relatorioId = ${state.relatorioId}`);
        }
        await call("relatorio.byUser", "GET", `/relatorios/user/${state.userId}`);
        if (state.relatorioId) {
            await call("relatorio.findById", "GET", `/relatorios/${state.relatorioId}`);
            await call("relatorio.updateIntroduction", "PUT", `/relatorios/${state.relatorioId}/introduction`, { introduction: "intro" });
            await call("relatorio.updateObjective", "PUT", `/relatorios/${state.relatorioId}/objective`, { objective: "obj" });
            await call("relatorio.updateDevelopment", "PUT", `/relatorios/${state.relatorioId}/development`, { development: "dev" });
            await call("relatorio.updateFinalThoughts", "PUT", `/relatorios/${state.relatorioId}/final-thoughts`, { final_thoughts: "fim" });
            await call("relatorio.updateReferences", "PUT", `/relatorios/${state.relatorioId}/references`, { references: "refs" });
            await call("relatorio.updateMulti", "PUT", `/relatorios/${state.relatorioId}`, { objective: "obj2" });
            await call("relatorio.submit", "POST", `/relatorios/${state.relatorioId}/submit`);
            await callBinary("relatorio.exportPdf", "GET", `/relatorios/${state.relatorioId}/export-pdf`);
        }
    }

    // ──────────────────────────────────────────────────────────
    // 14. Turma / AlunoTurma / AcademicPeriod
    // ──────────────────────────────────────────────────────────
    console.log("\n# 14. Turma / AlunoTurma / AcademicPeriod");
    await call("turma.list", "GET", "/turmas");
    await call("academicperiod.list", "GET", "/academic-periods");
    await call("academicperiod.active", "GET", "/academic-periods/active", undefined, [200, 404]);
    if (state.userId) {
        await call("alunoturma.byUser", "GET", `/aluno-turma/user/${state.userId}`);
    }
    // create de turma/alunoturma exige fixtures que não foram criadas; pulamos

    // ──────────────────────────────────────────────────────────
    // 15. Aluno (Home / Resumo)
    // ──────────────────────────────────────────────────────────
    console.log("\n# 15. Aluno");
    if (state.userId) {
        await call("aluno.resumo", "GET", `/alunos/${state.userId}/resumo`);
        await call("aluno.home", "GET", `/alunos/${state.userId}/home`);
    }

    // ──────────────────────────────────────────────────────────
    // 16. Logout (no final)
    // ──────────────────────────────────────────────────────────
    console.log("\n# 16. Logout");
    if (state.refreshToken) {
        await call("users.logout", "POST", "/users/logout", { refreshToken: state.refreshToken });
    }

    // ──────────────────────────────────────────────────────────
    // Salva resultado em JSON
    // ──────────────────────────────────────────────────────────
    fs.writeFileSync("scripts/results.json", JSON.stringify({ state, results }, null, 2));

    const okCount = results.filter((r) => r.ok).length;
    const failCount = results.length - okCount;
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Total: ${results.length}   OK: ${okCount}   FAIL: ${failCount}`);
    console.log(`State: ${JSON.stringify(state, null, 2)}`);
    console.log(`Results: scripts/results.json`);
}

main().catch((e) => {
    console.error("Erro fatal:", e);
    process.exit(1);
});

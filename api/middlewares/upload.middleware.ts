import multer from "multer";
import path from "node:path";
import fs from "node:fs";

// ATENÇÃO PRODUÇÃO (Vercel):
// O filesystem da Vercel é efêmero e read-only fora de /tmp, então o
// diskStorage abaixo não funciona em deploy. Para subir para a Vercel,
// trocar pelo Vercel Blob (storage em memória + upload via @vercel/blob).
//
// Passo a passo quando formos migrar:
// 1) npm i @vercel/blob
// 2) Adicionar BLOB_READ_WRITE_TOKEN no painel da Vercel
// 3) Substituir o multer.diskStorage por multer.memoryStorage()
// 4) No PhotoController, fazer o upload com `put(filename, req.file.buffer, ...)`
//    (exemplo já está comentado em api/controllers/photo.controller.ts)
//
// Por enquanto, mantém o disco local — funciona em dev, vai falhar na Vercel.

const uploadDir = path.resolve("public/uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

// VERSÃO VERCEL BLOB (descomentar quando migrar):
// export const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 5 * 1024 * 1024 },
//     fileFilter: (_req, file, cb) => {
//         const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error("Tipo de arquivo inválido. Use JPEG, PNG ou WEBP."));
//         }
//         cb(null, true);
//     },
// });

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Tipo de arquivo inválido. Use JPEG, PNG ou WEBP."));
        }

        cb(null, true);
    },
});
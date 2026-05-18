/*
  Warnings:

  - You are about to drop the column `user_id` on the `Canteiro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Canteiro" DROP CONSTRAINT "Canteiro_user_id_fkey";

-- AlterTable
ALTER TABLE "Canteiro" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "aluno" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCanteiro" (
    "user_id" TEXT NOT NULL,
    "canteiro_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCanteiro_pkey" PRIMARY KEY ("user_id","canteiro_id")
);

-- AddForeignKey
ALTER TABLE "UserCanteiro" ADD CONSTRAINT "UserCanteiro_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCanteiro" ADD CONSTRAINT "UserCanteiro_canteiro_id_fkey" FOREIGN KEY ("canteiro_id") REFERENCES "Canteiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

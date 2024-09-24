/*
  Warnings:

  - You are about to drop the column `ticktet_pict` on the `ticketorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ticketorder` DROP COLUMN `ticktet_pict`,
    ADD COLUMN `roleTicket` VARCHAR(191) NULL,
    ADD COLUMN `ticket_pict` VARCHAR(191) NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `saldo` INTEGER NOT NULL DEFAULT 100000;

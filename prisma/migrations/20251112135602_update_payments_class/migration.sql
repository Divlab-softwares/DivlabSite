-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "trxref" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP NOT NULL;

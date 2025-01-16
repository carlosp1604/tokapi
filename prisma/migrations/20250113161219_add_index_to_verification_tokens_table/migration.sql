-- DropIndex
DROP INDEX `verification_tokens_email_type_expires_at_used_at_idx` ON `verification_tokens`;

-- CreateIndex
CREATE INDEX `verification_tokens_email_type_created_at_idx` ON `verification_tokens`(`email`, `type`, `created_at`);

-- Begin the migration transaction
BEGIN;

-- Needed for setting NOT NULL constraint at owner_id
DELETE FROM tb_resize_job;

-- Add the new column with a NOT NULL constraint.
ALTER TABLE tb_resize_job
ADD COLUMN owner_id INT NOT NULL;

-- Add the foreign key constraint referencing tb_user(user_id)
ALTER TABLE tb_resize_job
ADD CONSTRAINT fk_resize_job_owner
FOREIGN KEY (owner_id)
REFERENCES tb_user(user_id)
ON DELETE CASCADE;

-- Commit the transaction
COMMIT;
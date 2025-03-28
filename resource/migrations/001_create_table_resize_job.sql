DROP TABLE IF EXISTS resize_job;

CREATE TABLE IF NOT EXISTS resize_job (
    resize_job_id SERIAL PRIMARY KEY,
    resize_job_uuid VARCHAR(50) UNIQUE,
    status VARCHAR(20) NOT NULL,
    imgs_urls TEXT[] NOT NULL,
    algorithm VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

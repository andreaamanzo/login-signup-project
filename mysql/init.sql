CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(100) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  token TEXT,
  verified BOOLEAN DEFAULT FALSE
);

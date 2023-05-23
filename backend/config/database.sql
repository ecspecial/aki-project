-- Конфигурация базы данных PostgreSQL

-- Создание базы даннх
CREATE DATABASE akidb;

-- установка модуля для генерации uuid 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- проверка установки модуля для генерации uuid 
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Создание таблицы "Users"
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    rating FLOAT,
    photo BYTEA,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы "SpaceOwners"
CREATE TABLE spaceowners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    position VARCHAR(255),
    legal_entity_name VARCHAR(255),
    inn VARCHAR(255),
    rating FLOAT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Создание таблицы "Spaces"
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(255),
    industry VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    operating_hours VARCHAR(255),
    renter_count INT,
    price BIGINT,
    rating FLOAT,
    photos BYTEA[],
    verified BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Создание таблицы "Services"
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID,
    name VARCHAR(255),
    price BIGINT,
    FOREIGN KEY (space_id) REFERENCES spaces(id)
);

-- Создание таблицы "Bookings"
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID,
    renter_user_id UUID,
    owner_user_id UUID,
    start_date DATE,
    end_date DATE,
    signed BOOLEAN DEFAULT false,
    price BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id),
    FOREIGN KEY (renter_user_id) REFERENCES users(id),
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

-- Подключаеся к базе данных
psql -h localhost -U postgres -d akidb

-- Настройка PostgreSQL на ECS Cloud
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

-- Открыть PostgreSQL под пользователем postgres
sudo su - postgres

-- Выходим из PostgreSQL
\q exit

-- Конфигурация базы данных PostgreSQL

-- Создание базы даннх
CREATE DATABASE akidb;



-- Настройка PostgreSQL на ECS Cloud, образ Ubuntu
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

-- Подключаеся к PostgreSQL с помощью пользователя postgres на сервере
sudo -u postgres psql

-- Создаем новую базу данных для нового пользователя 
CREATE DATABASE akidb;

-- Создаем нового пользователя и предоставляем роль
CREATE USER akiuser WITH ENCRYPTED PASSWORD 'new_password';
GRANT ALL ON DATABASE akidb TO akiuser;
ALTER DATABASE akidb OWNER TO akiuser;
GRANT USAGE, CREATE ON SCHEMA PUBLIC TO akiuser;

-- Выход из базы данных
exit

-- Подключаеся к базе данных
psql -h localhost -U new_username -d database_name

-- установка модуля для генерации uuid 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- проверка установки модуля для генерации uuid 
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Создание таблицы "users"
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    rating FLOAT,
    photo TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы "organisations"
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_position VARCHAR(255) NOT NULL,
    legal_entity_name VARCHAR(255) UNIQUE NOT NULL,
    inn VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Создание таблицы "spaces"
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    space_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255)[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    operating_hours VARCHAR(255),
    renter_count INT,
    price BIGINT NOT NULL,
    rating FLOAT,
    photos TEXT[] DEFAULT '{}',
    latitude FLOAT,
    longitude FLOAT,
    verified BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Создание таблицы "services"
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID,
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    FOREIGN KEY (space_id) REFERENCES spaces(id)
);

-- Создание таблицы "bookings"
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id UUID,
    renter_user_id UUID,
    owner_user_id UUID,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    signed BOOLEAN DEFAULT false,
    price BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id),
    FOREIGN KEY (renter_user_id) REFERENCES users(id),
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

-- Выход из базы данных
\q

-- Выход из PostgreSQL
exit
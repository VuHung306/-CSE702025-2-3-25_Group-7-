CREATE DATABASE mydb;
USE mydb;

CREATE TABLE book (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    author VARCHAR(45) NOT NULL,
    release_day DATE NOT NULL,
    status TINYINT NULL,
    isbn VARCHAR(45) NULL UNIQUE,
    publisher VARCHAR(45) NULL,

    PRIMARY KEY (id)
);

CREATE TABLE type (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE user (
    id VARCHAR(225) NOT NULL,
    username VARCHAR(45) NOT NULL,
    password VARCHAR(45) NOT NULL,
    firstname VARCHAR(45) NULL,
    lastname VARCHAR(45) NULL,
    email VARCHAR(45) NOT NULL,
    phone VARCHAR(45) NULL,
    dob DATE NULL,
    Role_id INT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_user_role
        FOREIGN KEY (Role_id)
        REFERENCES role(id)
);

CREATE TABLE book_has_type (
    Book_id INT NOT NULL,
    Type_id INT NOT NULL,

    PRIMARY KEY (Book_id, Type_id),

    CONSTRAINT fk_book_has_type_book
        FOREIGN KEY (Book_id)
        REFERENCES book(id),

    CONSTRAINT fk_book_has_type_type
        FOREIGN KEY (Type_id)
        REFERENCES type(id)
);

CREATE TABLE borrow (
    id INT NOT NULL AUTO_INCREMENT,
    borrowtime DATETIME NOT NULL,
    returntime DATETIME NULL,
    quantity INT NOT NULL DEFAULT 1,
    Book_id INT NOT NULL,
    duedate DATETIME NULL,
    fineamount DECIMAL(10,2) NULL DEFAULT 0,
    status TINYINT NULL DEFAULT 0,
    user_id VARCHAR(225) NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_borrow_book
        FOREIGN KEY (Book_id)
        REFERENCES book(id),

    CONSTRAINT fk_borrow_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
);

INSERT INTO role (name)
VALUES
('ADMIN'),
('Librarian'),
('USER');

INSERT INTO user (
    id,
    username,
    password,
    firstname,
    lastname,
    email,
    phone,
    dob,
    Role_id
)
VALUES (
    'admin',
    'admin',
    'admin123',
    'Admin',
    'System',
    'admin@gmail.com',
    '0123456789',
    '2000-01-01',
    1
);
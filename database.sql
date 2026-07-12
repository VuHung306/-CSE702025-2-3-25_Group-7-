DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mydb;

CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    release_day DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    isbn VARCHAR(45) UNIQUE,
    publisher VARCHAR(255)
);

CREATE TABLE type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE `user` (
    id VARCHAR(225) PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    firstname VARCHAR(45),
    lastname VARCHAR(45),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(45),
    dob DATE,
    role_id INT NOT NULL,
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
);

CREATE TABLE book_has_type (
    book_id INT NOT NULL,
    Type_id INT NOT NULL,

    PRIMARY KEY (Book_id, Type_id),

    CONSTRAINT fk_book_has_type_book
        FOREIGN KEY (book_id)
        REFERENCES book(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_book_has_type_type
        FOREIGN KEY (Type_id)
        REFERENCES type(id)
        ON DELETE CASCADE
);

CREATE TABLE borrow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrowtime DATETIME NOT NULL,
    returntime DATETIME,
    quantity INT NOT NULL DEFAULT 1,
    Book_id INT NOT NULL,
    duedate DATETIME,
    fineamount DECIMAL(10,2) DEFAULT 0,
    status BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(225) NOT NULL,

    CONSTRAINT fk_borrow_book
        FOREIGN KEY (Book_id)
        REFERENCES book(id),

    CONSTRAINT fk_borrow_user
        FOREIGN KEY (user_id)
        REFERENCES `user`(id)
);

INSERT INTO role(name)
VALUES
('ADMIN'),
('LIBRARIAN'),
('USER');

INSERT INTO `user`
(id,username,password,firstname,lastname,email,phone,dob,role_id)
VALUES
('admin','admin','admin123','Admin','System',
'admin@gmail.com','0123456789','2000-01-01',1);

USE mydb;

-- Chỉ chạy phần này nếu bảng type chưa có 6 thể loại
INSERT INTO type (name) VALUES
('Công nghệ'),
('Văn học'),
('Kinh tế'),
('Ngoại ngữ'),
('Khoa học'),
('Kỹ năng sống');

-- Thêm 30 sách
INSERT INTO book (name, author, release_day, status, isbn, publisher) VALUES
-- Công nghệ
('Clean Code', 'Robert C. Martin', '2008-08-01', 1, '9780132350884', 'Prentice Hall'),
('Java Cơ Bản', 'Herbert Schildt', '2021-01-01', 1, '9781260440232', 'McGraw Hill'),
('Eloquent JavaScript', 'Marijn Haverbeke', '2018-12-04', 1, '9781593279509', 'No Starch Press'),
('You Dont Know JS', 'Kyle Simpson', '2015-12-27', 1, '9781491924464', 'OReilly Media'),
('HTML and CSS', 'Jon Duckett', '2011-11-08', 1, '9781118008188', 'Wiley'),

-- Văn học
('Nhà Giả Kim', 'Paulo Coelho', '1988-01-01', 1, '9780061122415', 'HarperOne'),
('Kiêu Hãnh Và Định Kiến', 'Jane Austen', '1813-01-28', 1, '9780141439518', 'Penguin Classics'),
('Ông Già Và Biển Cả', 'Ernest Hemingway', '1952-09-01', 1, '9780684801223', 'Scribner'),
('Không Gia Đình', 'Hector Malot', '1878-01-01', 1, '9780143039241', 'Penguin Classics'),
('Tắt Đèn', 'Ngô Tất Tố', '1939-01-01', 1, '9786043050841', 'Văn Học'),

-- Kinh tế
('Cha Giàu Cha Nghèo', 'Robert Kiyosaki', '1997-04-01', 1, '9781612680194', 'Plata Publishing'),
('Tư Duy Nhanh Và Chậm', 'Daniel Kahneman', '2011-10-25', 1, '9780374533557', 'Farrar Straus'),
('Kinh Tế Học Hài Hước', 'Steven Levitt', '2005-04-12', 1, '9780060731335', 'William Morrow'),
('Tâm Lý Học Về Tiền', 'Morgan Housel', '2020-09-08', 1, '9780857197689', 'Harriman House'),
('Quốc Gia Khởi Nghiệp', 'Dan Senor', '2009-09-07', 1, '9781455502395', 'Twelve'),

-- Ngoại ngữ
('English Grammar in Use', 'Raymond Murphy', '2019-01-01', 1, '9781108457651', 'Cambridge'),
('English Vocabulary in Use', 'Michael McCarthy', '2017-01-01', 1, '9781316631751', 'Cambridge'),
('Minna no Nihongo I', '3A Corporation', '2012-01-01', 1, '9784883196036', '3A Corporation'),
('Giáo Trình Hán Ngữ 1', 'Dương Ký Châu', '2014-01-01', 1, '9787561926234', 'Peking University'),
('Practice Makes Perfect Spanish', 'Dorothy Richmond', '2010-01-01', 1, '9780071639257', 'McGraw Hill'),

-- Khoa học
('Lược Sử Thời Gian', 'Stephen Hawking', '1988-04-01', 1, '9780553380163', 'Bantam'),
('Vũ Trụ Trong Vỏ Hạt Dẻ', 'Stephen Hawking', '2001-11-06', 1, '9780553802023', 'Bantam'),
('Sapiens', 'Yuval Noah Harari', '2011-01-01', 1, '9780062316097', 'Harper'),
('Gene', 'Siddhartha Mukherjee', '2016-05-17', 1, '9781476733500', 'Scribner'),
('Vũ Trụ', 'Carl Sagan', '1980-01-01', 1, '9780345539434', 'Random House'),

-- Kỹ năng sống
('Đắc Nhân Tâm', 'Dale Carnegie', '1936-01-01', 1, '9780671027032', 'Simon Schuster'),
('7 Thói Quen Hiệu Quả', 'Stephen Covey', '1989-08-15', 1, '9781982137274', 'Simon Schuster'),
('Atomic Habits', 'James Clear', '2018-10-16', 1, '9780735211292', 'Avery'),
('Deep Work', 'Cal Newport', '2016-01-05', 1, '9781455586691', 'Grand Central'),
('Quản Lý Thời Gian', 'Brian Tracy', '2014-01-01', 1, '9780814433438', 'Amacom');

-- Liên kết sách với thể loại
INSERT INTO book_has_type (Book_id, Type_id)
SELECT b.id, t.id
FROM book b
JOIN type t ON
    (b.name IN ('Clean Code','Java Cơ Bản','Eloquent JavaScript','You Dont Know JS','HTML and CSS') AND t.name = 'Công nghệ')
 OR (b.name IN ('Nhà Giả Kim','Kiêu Hãnh Và Định Kiến','Ông Già Và Biển Cả','Không Gia Đình','Tắt Đèn') AND t.name = 'Văn học')
 OR (b.name IN ('Cha Giàu Cha Nghèo','Tư Duy Nhanh Và Chậm','Kinh Tế Học Hài Hước','Tâm Lý Học Về Tiền','Quốc Gia Khởi Nghiệp') AND t.name = 'Kinh tế')
 OR (b.name IN ('English Grammar in Use','English Vocabulary in Use','Minna no Nihongo I','Giáo Trình Hán Ngữ 1','Practice Makes Perfect Spanish') AND t.name = 'Ngoại ngữ')
 OR (b.name IN ('Lược Sử Thời Gian','Vũ Trụ Trong Vỏ Hạt Dẻ','Sapiens','Gene','Vũ Trụ') AND t.name = 'Khoa học')
 OR (b.name IN ('Đắc Nhân Tâm','7 Thói Quen Hiệu Quả','Atomic Habits','Deep Work','Quản Lý Thời Gian') AND t.name = 'Kỹ năng sống');

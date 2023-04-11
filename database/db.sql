CREATE DATABASE pat035;

use pat035;

create table hotel_access(
    id int(11) NOT NULL auto_increment,
    correo varchar(60) NOT NULL,
    password varchar(60) NOT NULL,
    estatus INT NOT NULL,
    PRIMARY KEY (id)
);

create TABLE hotel(
    id int(11) ,
    nombre varchar(300) NOT NULL,
    direccion varchar(300) NOT NULL,
    telefono varchar(15) NOT NULL,
    rfc varchar(13) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES hotel_access(id)
);

CREATE TABLE empleado(
    idEmpleado int(11) NOT NULL auto_increment ,
    nombre varchar(300) NOT NULL,
    sexo VARCHAR(1) NOT NULL,
    telefono varchar(15) NOT NULL,
    correo varchar(300) NOT NULL,
    puesto varchar(300) NOT NULL,
    idhotel int(11) NOT NULL,
    PRIMARY KEY (idEmpleado),
    FOREIGN KEY (idhotel) REFERENCES hotel(id)
);

--INSERT INTO hotel_access (correo, password, estatus) VALUES ('jesus@gmail.com', '123', 0);

INSERT INTO empleado (nombre, sexo, telefono, correo, puesto, idhotel) VALUES ('Ian enrique robles', 'M', '1234567890', 'ianEnrique@gmail.com','Gefe de Ventas', 1);
INSERT INTO empleado (nombre, sexo, telefono, correo, puesto, idhotel) VALUES ('Katherin Robles', 'F', '1234567890', 'katherin@gmail.com','Barrendera', 1);

describe hotel_access;
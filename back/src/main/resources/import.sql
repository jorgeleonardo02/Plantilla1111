INSERT INTO categorias(nombre) VALUES('Desarrollo web'); 
INSERT INTO categorias(nombre) VALUES('Ciencias de La informacion'); 
INSERT INTO categorias(nombre) VALUES('Desarrollo movil'); 
INSERT INTO categorias(nombre) VALUES('Lenguajes de programacion'); 
INSERT INTO categorias(nombre) VALUES('Desarrollo de videojuegos'); 
INSERT INTO categorias(nombre) VALUES('Diseno y desarrollo de bases de datos'); 
INSERT INTO categorias(nombre) VALUES('Testeo de software'); 
INSERT INTO categorias(nombre) VALUES('Ingenieria de software'); 
INSERT INTO categorias(nombre) VALUES('Herramientas de desarrollo de software'); 
INSERT INTO categorias(nombre) VALUES('Desarrollo sin codigo');  
INSERT INTO rol(rol_nombre) VALUES('ROLE_ADMIN'); 
INSERT INTO rol(rol_nombre) VALUES('ROLE_DOCENTE'); 
INSERT INTO rol(rol_nombre) VALUES('ROLE_ESTUDIANTE'); 
INSERT INTO rol(rol_nombre) VALUES('ROLE_VISITANTE');
INSERT INTO rol(rol_nombre) VALUES('ROLE_GERENCIA');
INSERT INTO usuario (nombre, nombre_usuario, correo, password) VALUES ('jorge Leonardo Bateca Parada', 'leonardob', 'leonardobate_02@hotmail.com','$2a$10$vTmRa9PVRA7vcuxO4id.JOgs9JuqXoyscKzUgEy51lQrBvld4OOSy');
INSERT INTO usuario (nombre, nombre_usuario, correo, password) VALUES ('Sergio Bateca', 'sbateca', 'sbtk87@hotmail.com', '$2a$10$C8S3mI4xdA9jhhHma6.fh.ueXMqehl7Qsa9GXLfdQnNBgMOr5ru2W');
INSERT INTO usuario_rol (usuario_id, rol_id) VALUES ('1','1');
INSERT INTO usuario_rol (usuario_id, rol_id) VALUES ('2','1');

INSERT INTO clientes (nombre, apellido ) VALUES ('Jorge Leonardo','Bateca Parada');





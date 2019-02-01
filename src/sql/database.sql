create database news_portal;

use news_portal;
 
create table news(
	id_news int not null primary key auto_increment,
	title varchar(100),
	news text,
	data_created timestamp default current_timestamp
);

insert into news(title,news) values ('mi noticia','Solo para rellenar');
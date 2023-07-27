-- --
-- -- PostgreSQL database cluster dump
-- --

-- SET default_transaction_read_only = off;

-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;

-- --
-- -- Drop databases (except postgres and template1)
-- --

-- DROP DATABASE test_db;




-- --
-- -- Drop roles
-- --

-- DROP ROLE test_db;


-- --
-- -- Roles
-- --

-- CREATE ROLE test_db;
-- ALTER ROLE test_db WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:ORvLeldqZF5ST7enCKwDdg==$lWgc/MWovD+oZ4rQrfoDyzQ35KKFCcqgK7hXxhHEIXE=:BIEUzw9Cghj6zOVp/mqBnmGjYko+YVXuU0juy5dGbMw=';






-- --
-- -- Databases
-- --

-- --
-- -- Database "template1" dump
-- --

-- --
-- -- PostgreSQL database dump
-- --

-- -- Dumped from database version 14.5
-- -- Dumped by pg_dump version 14.5

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
-- DROP DATABASE template1;
-- --
-- -- Name: template1; Type: DATABASE; Schema: -; Owner: test_db
-- --

-- CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE template1 OWNER TO test_db;

-- \connect template1

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: test_db
-- --

-- COMMENT ON DATABASE template1 IS 'default template for new databases';


-- --
-- -- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: test_db
-- --

-- ALTER DATABASE template1 IS_TEMPLATE = true;


-- \connect template1

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- Name: DATABASE template1; Type: ACL; Schema: -; Owner: test_db
-- --

-- REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
-- GRANT CONNECT ON DATABASE template1 TO PUBLIC;


-- --
-- -- PostgreSQL database dump complete
-- --

-- --
-- -- Database "postgres" dump
-- --

-- --
-- -- PostgreSQL database dump
-- --

-- -- Dumped from database version 14.5
-- -- Dumped by pg_dump version 14.5

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- DROP DATABASE postgres;
-- --
-- -- Name: postgres; Type: DATABASE; Schema: -; Owner: test_db
-- --

-- CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE postgres OWNER TO test_db;

-- \connect postgres

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: test_db
-- --

-- COMMENT ON DATABASE postgres IS 'default administrative connection database';


-- --
-- -- PostgreSQL database dump complete
-- --

-- --
-- -- Database "test_db" dump
-- --

-- --
-- -- PostgreSQL database dump
-- --

-- -- Dumped from database version 14.5
-- -- Dumped by pg_dump version 14.5

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- Name: test_db; Type: DATABASE; Schema: -; Owner: test_db
-- --

-- CREATE DATABASE test_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE test_db OWNER TO test_db;

-- \connect test_db

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

-- --
-- -- Name: access$rights; Type: TABLE; Schema: public; Owner: test_db
-- --

CREATE TABLE public."access$rights" (
    ar_id integer NOT NULL,
    ar_type character varying NOT NULL,
    decription character varying NOT NULL
);


ALTER TABLE public."access$rights" OWNER TO test_db;

--
-- Name: access$rights_ar_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

ALTER TABLE public."access$rights" ALTER COLUMN ar_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."access$rights_ar_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: employee$stocks; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."employee$stocks" (
    empl_id integer NOT NULL,
    stock_id integer NOT NULL
);


ALTER TABLE public."employee$stocks" OWNER TO test_db;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public.employees (
    empl_id integer NOT NULL,
    ar_id integer NOT NULL,
    fio character varying NOT NULL,
    login character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.employees OWNER TO test_db;

--
-- Name: employees_empl_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

ALTER TABLE public.employees ALTER COLUMN empl_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.employees_empl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product$price; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."product$price" (
    price_id integer NOT NULL,
    variation_id integer NOT NULL,
    price double precision NOT NULL,
    active_till timestamp with time zone NOT NULL,
    active_from timestamp with time zone NOT NULL
);


ALTER TABLE public."product$price" OWNER TO test_db;

--
-- Name: newtable_price_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public.newtable_price_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.newtable_price_id_seq OWNER TO test_db;

--
-- Name: newtable_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public.newtable_price_id_seq OWNED BY public."product$price".price_id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    product_name character varying(80) NOT NULL,
    description character varying(250),
    tags character varying(100) NOT NULL,
    creation_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_date timestamp with time zone,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.product OWNER TO test_db;

--
-- Name: product$sales; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."product$sales" (
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    variation_id integer NOT NULL,
    stock_id integer NOT NULL,
    sold_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount integer NOT NULL
);


ALTER TABLE public."product$sales" OWNER TO test_db;

--
-- Name: product$sales_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public."product$sales_sale_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."product$sales_sale_id_seq" OWNER TO test_db;

--
-- Name: product$sales_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public."product$sales_sale_id_seq" OWNED BY public."product$sales".sale_id;


--
-- Name: product$stocks; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."product$stocks" (
    accounting_id integer NOT NULL,
    stock_id integer NOT NULL,
    product_id integer NOT NULL,
    amount integer,
    variation_id integer NOT NULL
);


ALTER TABLE public."product$stocks" OWNER TO test_db;

--
-- Name: product$stocks$product$list_in_sctock_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public."product$stocks$product$list_in_sctock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."product$stocks$product$list_in_sctock_id_seq" OWNER TO test_db;

--
-- Name: product$stocks$product$list_in_sctock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public."product$stocks$product$list_in_sctock_id_seq" OWNED BY public."product$stocks".accounting_id;


--
-- Name: product$variations; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."product$variations" (
    variation_id integer NOT NULL,
    product_id integer NOT NULL,
    v_type_id integer NOT NULL
);

ALTER TABLE public."product$variations" OWNER TO test_db;

--
-- Name: product$variations_variation_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public."product$variations_variation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."product$variations_variation_id_seq" OWNER TO test_db;

--
-- Name: product$variations_variation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public."product$variations_variation_id_seq" OWNED BY public."product$variations".variation_id;


--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_product_id_seq OWNER TO test_db;

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;


--
-- Name: stocks; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public.stocks (
    stock_id integer NOT NULL,
    stock_name character varying(80) NOT NULL,
    address character varying(100) NOT NULL
);


ALTER TABLE public.stocks OWNER TO test_db;

--
-- Name: stocks_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

CREATE SEQUENCE public.stocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stocks_id_seq OWNER TO test_db;

--
-- Name: stocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test_db
--

ALTER SEQUENCE public.stocks_id_seq OWNED BY public.stocks.stock_id;


--
-- Name: unit$types; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."unit$types" (
    u_type_id integer NOT NULL,
    type character varying NOT NULL
);


ALTER TABLE public."unit$types" OWNER TO test_db;

--
-- Name: unit$types_type_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

ALTER TABLE public."unit$types" ALTER COLUMN u_type_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."unit$types_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: variation$types; Type: TABLE; Schema: public; Owner: test_db
--

CREATE TABLE public."variation$types" (
    v_type_id integer NOT NULL,
    u_type_id integer NOT NULL,
    variation character varying NOT NULL
);


ALTER TABLE public."variation$types" OWNER TO test_db;

--
-- Name: variation$types_v_type_id_seq; Type: SEQUENCE; Schema: public; Owner: test_db
--

ALTER TABLE public."variation$types" ALTER COLUMN v_type_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."variation$types_v_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: product$price price_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$price" ALTER COLUMN price_id SET DEFAULT nextval('public.newtable_price_id_seq'::regclass);


--
-- Name: product$sales sale_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$sales" ALTER COLUMN sale_id SET DEFAULT nextval('public."product$sales_sale_id_seq"'::regclass);


--
-- Name: product$stocks accounting_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$stocks" ALTER COLUMN accounting_id SET DEFAULT nextval('public."product$stocks$product$list_in_sctock_id_seq"'::regclass);


--
-- Name: product$variations variation_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$variations" ALTER COLUMN variation_id SET DEFAULT nextval('public."product$variations_variation_id_seq"'::regclass);


--
-- Name: stocks stock_id; Type: DEFAULT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.stocks ALTER COLUMN stock_id SET DEFAULT nextval('public.stocks_id_seq'::regclass);


--
-- Data for Name: access$rights; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."access$rights" (ar_id, ar_type, decription) FROM stdin;
1	full_access	Полный доступ
2	stock_manager	Управляющий склада
4	stock_worker	Работник склада
3	seller	Продавец
\.


--
-- Data for Name: employee$stocks; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."employee$stocks" (empl_id, stock_id) FROM stdin;
1	1
1	2
1	3
1	25
1	26
2	26
4	2
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public.employees (empl_id, ar_id, fio, login, password) FROM stdin;
1	1	Закиров Исмаил Эркинджонугли	ismail.zakirov	$2b$04$LWw48arSvrwf0y1O1fgZb.fJNSdrOt5pt2ecn7Q3iHbEjsonSXy5y
2	2	Test Stock Manager	stock.manager	$2b$04$LWw48arSvrwf0y1O1fgZb.fJNSdrOt5pt2ecn7Q3iHbEjsonSXy5y
4	3	Точно Пидор	tochno.pidor	$2b$04$LWw48arSvrwf0y1O1fgZb.fJNSdrOt5pt2ecn7Q3iHbEjsonSXy5y
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public.product (product_id, product_name, description, tags, creation_date, deleted_date, deleted) FROM stdin;
2	Порошок Ariel	Порошок Ariel	стиральный порошок	2022-10-14 16:28:10+05	\N	f
3	Чай Ahmad	Чай Ahmad	черный чай	2022-10-14 10:00:50+05	\N	f
1	Вода Hydrolife	Вода Hydrolife	вода	2022-10-14 09:28:25+05	\N	f
7	Зеленый чай Tudor	Зеленый чай c эктсрактом лимона	зеленый чай	2022-10-17 15:37:56.875847+05	\N	f
12	Some prod	Some prod description	some tag	2022-10-18 14:52:14.534567+05	\N	f
8	Coca-Cola classic	Газированный напиток Coca-Cola	газировка	2022-10-17 16:42:17.357223+05	\N	f
14	Fanta Citrus	Газированный напиток Fanta с цитрусовым вкусом	газировка	2022-10-21 12:41:16.987146+05	\N	f
15	Батончик Snickers	Питательный батончик Snickers	питательный батончик	2022-10-21 15:01:26.518758+05	\N	f
16	Монитор LG	Описание монитора	монитор,пк	2022-10-21 16:13:35.820946+05	\N	f
17	Шоколад Kinder	Молочный шоколад Kinder	шоколад, молочный	2022-10-25 13:33:24.602995+05	\N	f
18	test	test	tes	2022-10-25 17:28:57.30617+05	\N	f
19	Чипсы Lays (Сметана и Лук)	Картофельные чипсы Lays	чипсы, сметана и лук	2022-10-27 17:25:12.930922+05	\N	f
23	tes1t	te1st	tes1t	2022-10-28 10:03:32.628488+05	\N	f
29	Чипсы Lays (Сыр)	Картофельные чипсы Lays	чипсы, со вкусом сыра	2022-10-28 13:18:09.140184+05	\N	f
31	Шоколданый батончик Twix	Twix	twix, шоколданый	2022-10-31 10:10:25.220329+05	\N	f
69	Печенье Ulker Biscrem	Печенье Biscrem	печенье, сладости	2022-11-04 17:55:48.186709+05	\N	f
71	Общая тетрадь в клетку	тетрадь в клетку	тетрадь, общая, в клетку	2022-11-10 10:19:07.439953+05	\N	f
72	Чай Fuse Tea Манго и Ромашка	Чай Fuse Tea со вкусом  манго и ромашки	чай, ice tea, чайный напитон	2022-11-11 16:23:19.273286+05	\N	f
\.


--
-- Data for Name: product$price; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."product$price" (price_id, variation_id, price, active_till, active_from) FROM stdin;
155	78	10000	2023-06-06 14:02:42+05	2024-06-06 14:02:45+05
\.


--
-- Data for Name: product$sales; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."product$sales" (sale_id, product_id, variation_id, stock_id, sold_date, amount) FROM stdin;
\.


--
-- Data for Name: product$stocks; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."product$stocks" (accounting_id, stock_id, product_id, amount, variation_id) FROM stdin;
105	1	2	100	78
106	2	3	142	80
107	2	2	54	80
108	3	72	0	82
\.


--
-- Data for Name: product$variations; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."product$variations" (variation_id, product_id, v_type_id) FROM stdin;
78	2	9
79	2	5
80	3	3
81	3	6
82	72	2
\.


--
-- Data for Name: stocks; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public.stocks (stock_id, stock_name, address) FROM stdin;
1	Склад 1	Юнусабад 8
2	Склад 2	Сергели 7
3	Склад 3	Куйлюк 2
25	Склад 4	Чиланзар 25
26	Склад 5	Ипподром
\.


--
-- Data for Name: unit$types; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."unit$types" (u_type_id, type) FROM stdin;
3	Лист.
2	МЛ.
1	Г.
\.


--
-- Data for Name: variation$types; Type: TABLE DATA; Schema: public; Owner: test_db
--

COPY public."variation$types" (v_type_id, u_type_id, variation) FROM stdin;
1	1	50
2	1	100
3	1	150
4	1	200
5	1	250
6	1	300
7	1	400
9	1	500
10	1	1000
12	1	1500
13	1	2000
14	1	2500
15	1	3000
16	2	500
17	2	1000
18	2	1500
19	2	2000
\.


--
-- Name: access$rights_ar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."access$rights_ar_id_seq"', 4, true);


--
-- Name: employees_empl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public.employees_empl_id_seq', 4, true);


--
-- Name: newtable_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public.newtable_price_id_seq', 155, true);


--
-- Name: product$sales_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."product$sales_sale_id_seq"', 127, true);


--
-- Name: product$stocks$product$list_in_sctock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."product$stocks$product$list_in_sctock_id_seq"', 108, true);


--
-- Name: product$variations_variation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."product$variations_variation_id_seq"', 82, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public.product_product_id_seq', 72, true);


--
-- Name: stocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public.stocks_id_seq', 26, true);


--
-- Name: unit$types_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."unit$types_type_id_seq"', 3, true);


--
-- Name: variation$types_v_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test_db
--

SELECT pg_catalog.setval('public."variation$types_v_type_id_seq"', 19, true);


--
-- Name: access$rights access$rights_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."access$rights"
    ADD CONSTRAINT "access$rights_pkey" PRIMARY KEY (ar_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (empl_id);


--
-- Name: product$price newtable_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$price"
    ADD CONSTRAINT newtable_pkey PRIMARY KEY (price_id);


--
-- Name: product$sales product$sales_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$sales"
    ADD CONSTRAINT "product$sales_pkey" PRIMARY KEY (sale_id);


--
-- Name: product$stocks product$stocks$product$list_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$stocks"
    ADD CONSTRAINT "product$stocks$product$list_pkey" PRIMARY KEY (accounting_id);


--
-- Name: product$variations product$variations_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$variations"
    ADD CONSTRAINT "product$variations_pkey" PRIMARY KEY (variation_id);


--
-- Name: product product_ix1; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_ix1 UNIQUE (product_name);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: stocks stocks_ix1; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.stocks
    ADD CONSTRAINT stocks_ix1 UNIQUE (stock_name);


--
-- Name: stocks stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.stocks
    ADD CONSTRAINT stocks_pkey PRIMARY KEY (stock_id);


--
-- Name: unit$types unit$types_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."unit$types"
    ADD CONSTRAINT "unit$types_pkey" PRIMARY KEY (u_type_id);


--
-- Name: variation$types variation$types_pkey; Type: CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."variation$types"
    ADD CONSTRAINT "variation$types_pkey" PRIMARY KEY (v_type_id);


--
-- Name: employees employees_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_fk1 FOREIGN KEY (ar_id) REFERENCES public."access$rights"(ar_id);


--
-- Name: employee$stocks employeestocks_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."employee$stocks"
    ADD CONSTRAINT employeestocks_fk1 FOREIGN KEY (empl_id) REFERENCES public.employees(empl_id);


--
-- Name: employee$stocks employeestocks_fk2; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."employee$stocks"
    ADD CONSTRAINT employeestocks_fk2 FOREIGN KEY (stock_id) REFERENCES public.stocks(stock_id);


--
-- Name: product$price newtable_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$price"
    ADD CONSTRAINT newtable_fk1 FOREIGN KEY (variation_id) REFERENCES public."product$variations"(variation_id);


--
-- Name: product$sales productsales_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$sales"
    ADD CONSTRAINT productsales_fk1 FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: product$sales productsales_fk2; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$sales"
    ADD CONSTRAINT productsales_fk2 FOREIGN KEY (variation_id) REFERENCES public."product$variations"(variation_id);


--
-- Name: product$sales productsales_fk3; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$sales"
    ADD CONSTRAINT productsales_fk3 FOREIGN KEY (stock_id) REFERENCES public.stocks(stock_id);


--
-- Name: product$stocks productstocksproductlist_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$stocks"
    ADD CONSTRAINT productstocksproductlist_fk1 FOREIGN KEY (stock_id) REFERENCES public.stocks(stock_id);


--
-- Name: product$stocks productstocksproductlist_fk2; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$stocks"
    ADD CONSTRAINT productstocksproductlist_fk2 FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: product$stocks productstocksproductlist_fk3; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$stocks"
    ADD CONSTRAINT productstocksproductlist_fk3 FOREIGN KEY (variation_id) REFERENCES public."product$variations"(variation_id);


--
-- Name: product$variations productvariations_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$variations"
    ADD CONSTRAINT productvariations_fk1 FOREIGN KEY (product_id) REFERENCES public.product(product_id);


--
-- Name: product$variations productvariations_fk2; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."product$variations"
    ADD CONSTRAINT productvariations_fk2 FOREIGN KEY (v_type_id) REFERENCES public."variation$types"(v_type_id);


--
-- Name: variation$types variationtypes_fk1; Type: FK CONSTRAINT; Schema: public; Owner: test_db
--

ALTER TABLE ONLY public."variation$types"
    ADD CONSTRAINT variationtypes_fk1 FOREIGN KEY (u_type_id) REFERENCES public."unit$types"(u_type_id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--


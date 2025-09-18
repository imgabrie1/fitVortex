--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: gabriel
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO gabriel;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: gabriel
--

COMMENT ON SCHEMA public IS '';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: exercise_primarymuscle_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.exercise_primarymuscle_enum AS ENUM (
    'Peito (Total)',
    'Peito Superior',
    'Peito Médio',
    'Peito Inferior',
    'Costas (Total)',
    'Costas Superior',
    'Costas Inferior',
    'Dorsais (Latíssimo do Dorso)',
    'Rombóides',
    'Pernas (Total)',
    'Quadríceps (Total)',
    'Reto Femoral',
    'Vasto Lateral',
    'Vasto Medial',
    'Vasto Intermédio',
    'Posterior de Coxa (Total)',
    'Bíceps Femoral',
    'Semitendíneo',
    'Semimembranoso',
    'Panturrilhas (Total)',
    'Gastrocnêmio',
    'Sóleo',
    'Glúteos',
    'Ombros (Total)',
    'Deltóide Anterior',
    'Deltóide Lateral',
    'Deltóide Posterior',
    'Bíceps (Total)',
    'Cabeça Longa do Bíceps',
    'Cabeça Curta do Bíceps',
    'Braquial',
    'Tríceps (Total)',
    'Cabeça Longa do Tríceps',
    'Cabeça Medial do Tríceps',
    'Cabeça Lateral do Tríceps',
    'Antebraços',
    'Abdominais (Total)',
    'Abdominais Superiores',
    'Abdominais Inferiores',
    'Oblíquos',
    'Trapézios'
);


ALTER TYPE public.exercise_primarymuscle_enum OWNER TO gabriel;

--
-- Name: exercise_resistancetype_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.exercise_resistancetype_enum AS ENUM (
    'Peso corporal',
    'Peso livre',
    'Máquina com anilhas',
    'Máquina com polias',
    'elástico',
    'other'
);


ALTER TYPE public.exercise_resistancetype_enum OWNER TO gabriel;

--
-- Name: macro_cycle_volume_musclegroup_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.macro_cycle_volume_musclegroup_enum AS ENUM (
    'Peito (Total)',
    'Peito Superior',
    'Peito Médio',
    'Peito Inferior',
    'Costas (Total)',
    'Costas Superior',
    'Costas Inferior',
    'Dorsais (Latíssimo do Dorso)',
    'Rombóides',
    'Pernas (Total)',
    'Quadríceps (Total)',
    'Reto Femoral',
    'Vasto Lateral',
    'Vasto Medial',
    'Vasto Intermédio',
    'Posterior de Coxa (Total)',
    'Bíceps Femoral',
    'Semitendíneo',
    'Semimembranoso',
    'Panturrilhas (Total)',
    'Gastrocnêmio',
    'Sóleo',
    'Glúteos',
    'Ombros (Total)',
    'Deltóide Anterior',
    'Deltóide Lateral',
    'Deltóide Posterior',
    'Bíceps (Total)',
    'Cabeça Longa do Bíceps',
    'Cabeça Curta do Bíceps',
    'Braquial',
    'Tríceps (Total)',
    'Cabeça Longa do Tríceps',
    'Cabeça Medial do Tríceps',
    'Cabeça Lateral do Tríceps',
    'Antebraços',
    'Abdominais (Total)',
    'Abdominais Superiores',
    'Abdominais Inferiores',
    'Oblíquos',
    'Trapézios'
);


ALTER TYPE public.macro_cycle_volume_musclegroup_enum OWNER TO gabriel;

--
-- Name: macro_cycle_volume_recommendation_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.macro_cycle_volume_recommendation_enum AS ENUM (
    'up',
    'down',
    'same'
);


ALTER TYPE public.macro_cycle_volume_recommendation_enum OWNER TO gabriel;

--
-- Name: micro_cycle_volume_musclegroup_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.micro_cycle_volume_musclegroup_enum AS ENUM (
    'Peito (Total)',
    'Peito Superior',
    'Peito Médio',
    'Peito Inferior',
    'Costas (Total)',
    'Costas Superior',
    'Costas Inferior',
    'Dorsais (Latíssimo do Dorso)',
    'Rombóides',
    'Pernas (Total)',
    'Quadríceps (Total)',
    'Reto Femoral',
    'Vasto Lateral',
    'Vasto Medial',
    'Vasto Intermédio',
    'Posterior de Coxa (Total)',
    'Bíceps Femoral',
    'Semitendíneo',
    'Semimembranoso',
    'Panturrilhas (Total)',
    'Gastrocnêmio',
    'Sóleo',
    'Glúteos',
    'Ombros (Total)',
    'Deltóide Anterior',
    'Deltóide Lateral',
    'Deltóide Posterior',
    'Bíceps (Total)',
    'Cabeça Longa do Bíceps',
    'Cabeça Curta do Bíceps',
    'Braquial',
    'Tríceps (Total)',
    'Cabeça Longa do Tríceps',
    'Cabeça Medial do Tríceps',
    'Cabeça Lateral do Tríceps',
    'Antebraços',
    'Abdominais (Total)',
    'Abdominais Superiores',
    'Abdominais Inferiores',
    'Oblíquos',
    'Trapézios'
);


ALTER TYPE public.micro_cycle_volume_musclegroup_enum OWNER TO gabriel;

--
-- Name: sets_side_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.sets_side_enum AS ENUM (
    'left',
    'right',
    'both'
);


ALTER TYPE public.sets_side_enum OWNER TO gabriel;

--
-- Name: workout_volume_entries_musclegroup_enum; Type: TYPE; Schema: public; Owner: gabriel
--

CREATE TYPE public.workout_volume_entries_musclegroup_enum AS ENUM (
    'Peito (Total)',
    'Peito Superior',
    'Peito Médio',
    'Peito Inferior',
    'Costas (Total)',
    'Costas Superior',
    'Costas Inferior',
    'Dorsais (Latíssimo do Dorso)',
    'Rombóides',
    'Pernas (Total)',
    'Quadríceps (Total)',
    'Reto Femoral',
    'Vasto Lateral',
    'Vasto Medial',
    'Vasto Intermédio',
    'Posterior de Coxa (Total)',
    'Bíceps Femoral',
    'Semitendíneo',
    'Semimembranoso',
    'Panturrilhas (Total)',
    'Gastrocnêmio',
    'Sóleo',
    'Glúteos',
    'Ombros (Total)',
    'Deltóide Anterior',
    'Deltóide Lateral',
    'Deltóide Posterior',
    'Bíceps (Total)',
    'Cabeça Longa do Bíceps',
    'Cabeça Curta do Bíceps',
    'Braquial',
    'Tríceps (Total)',
    'Cabeça Longa do Tríceps',
    'Cabeça Medial do Tríceps',
    'Cabeça Lateral do Tríceps',
    'Antebraços',
    'Abdominais (Total)',
    'Abdominais Superiores',
    'Abdominais Inferiores',
    'Oblíquos',
    'Trapézios'
);


ALTER TYPE public.workout_volume_entries_musclegroup_enum OWNER TO gabriel;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: exercise; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.exercise (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    "imageURL" character varying,
    description character varying,
    "resistanceType" public.exercise_resistancetype_enum NOT NULL,
    "primaryMuscle" public.exercise_primarymuscle_enum NOT NULL,
    "secondaryMuscle" jsonb DEFAULT '[]'::jsonb,
    default_unilateral boolean DEFAULT false NOT NULL
);


ALTER TABLE public.exercise OWNER TO gabriel;

--
-- Name: macro_cycle; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.macro_cycle (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "microQuantity" integer NOT NULL,
    "userId" uuid,
    "macroCycleName" character varying NOT NULL
);


ALTER TABLE public.macro_cycle OWNER TO gabriel;

--
-- Name: macro_cycle_item; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.macro_cycle_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "macroCycleId" uuid,
    "microCycleId" uuid
);


ALTER TABLE public.macro_cycle_item OWNER TO gabriel;

--
-- Name: macro_cycle_volume; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.macro_cycle_volume (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "muscleGroup" public.macro_cycle_volume_musclegroup_enum NOT NULL,
    "totalVolume" integer NOT NULL,
    "changePct" integer NOT NULL,
    recommendation public.macro_cycle_volume_recommendation_enum NOT NULL,
    "macroCycleId" uuid
);


ALTER TABLE public.macro_cycle_volume OWNER TO gabriel;

--
-- Name: micro_cycle; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.micro_cycle (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL,
    "trainingDays" integer DEFAULT 1 NOT NULL,
    "userID" uuid NOT NULL,
    "microCycleName" character varying NOT NULL
);


ALTER TABLE public.micro_cycle OWNER TO gabriel;

--
-- Name: micro_cycle_item; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.micro_cycle_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "microCycleId" uuid,
    "workoutId" uuid
);


ALTER TABLE public.micro_cycle_item OWNER TO gabriel;

--
-- Name: micro_cycle_volume; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.micro_cycle_volume (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "muscleGroup" public.micro_cycle_volume_musclegroup_enum NOT NULL,
    "totalVolume" double precision NOT NULL,
    "microCycleId" uuid
);


ALTER TABLE public.micro_cycle_volume OWNER TO gabriel;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO gabriel;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: gabriel
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO gabriel;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gabriel
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: sets; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.sets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    reps integer NOT NULL,
    weight numeric(5,2) NOT NULL,
    notes character varying(255),
    side public.sets_side_enum DEFAULT 'both'::public.sets_side_enum NOT NULL,
    "microCycleItemId" uuid,
    "exerciseId" uuid
);


ALTER TABLE public.sets OWNER TO gabriel;

--
-- Name: user; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    password character varying(125) NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL,
    "updatedAt" date DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO gabriel;

--
-- Name: workout; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.workout (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    "volumeId" uuid
);


ALTER TABLE public.workout OWNER TO gabriel;

--
-- Name: workout_exercises; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.workout_exercises (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "targetSets" integer NOT NULL,
    "workoutId" uuid,
    "exerciseId" uuid
);


ALTER TABLE public.workout_exercises OWNER TO gabriel;

--
-- Name: workout_volume_entries; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.workout_volume_entries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "muscleGroup" public.workout_volume_entries_musclegroup_enum NOT NULL,
    volume double precision DEFAULT '0'::double precision NOT NULL,
    sets integer DEFAULT 0 NOT NULL,
    "workoutVolumeId" uuid
);


ALTER TABLE public.workout_volume_entries OWNER TO gabriel;

--
-- Name: workout_volumes; Type: TABLE; Schema: public; Owner: gabriel
--

CREATE TABLE public.workout_volumes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.workout_volumes OWNER TO gabriel;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: exercise; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.exercise (id, name, "imageURL", description, "resistanceType", "primaryMuscle", "secondaryMuscle", default_unilateral) FROM stdin;
07643bec-5b53-4919-a508-d686ab7dad44	Supino Reto	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00251101-Barbell-Bench-Press_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito (Total)	["Deltóide Anterior", "Tríceps (Total)"]	f
dd56d709-d7b1-45b4-b647-b43fd273ac4b	Cruxifixo Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03081101-Dumbbell-Fly_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito (Total)	["Deltóide Anterior"]	f
446b0784-77ef-4ca5-b355-f4177f70c112	Pullover Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04331101-Dumbbell-Straight-Arm-Pullover_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito Superior	["Deltóide Anterior"]	f
61c64534-6bf8-4e78-a2d2-35f1e65d5385	Supino Reto Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05761101-Lever-Chest-Press-(plate-loaded)_Chest_small.png&w=1200&q=100		Máquina com anilhas	Peito (Total)	["Deltóide Anterior", "Tríceps (Total)"]	f
20ecd7d9-a6a2-4b5c-9752-5686da8d6105	Supino Inclinado Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F12991101-Leverage-Incline-Chest-Press_Chest_small.png&w=1200&q=100		Máquina com anilhas	Peito Superior	["Deltóide Anterior", "Tríceps (Total)"]	f
0b7be82c-e0bf-474a-acf6-ddb6cd0ea05f	Supino Declinado Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F13001101-Lever-Decline-Chest-Press_Chest_small.png&w=1200&q=100		Máquina com anilhas	Peito Inferior	["Deltóide Anterior", "Tríceps (Total)"]	f
efd0159d-4b79-4046-be32-283b4791e78c	Supino com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05771101-Lever-Chest-Press_Chest_small.png&w=1200&q=100		Máquina com polias	Peito (Total)	["Deltóide Anterior", "Tríceps (Total)"]	f
0fdf0cca-0fe6-4b00-92a9-6b909e3d5a1b	Supino Inclinado com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F14791101-Lever-Incline-Chest-Press_Chest_small.png&w=1200&q=100		Máquina com polias	Peito Superior	["Deltóide Anterior", "Tríceps (Total)"]	f
859e9084-d50f-432e-861e-3ae7ac39c7e7	Supino Declinado com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F12611101-Cable-Decline-Press_Chest_small.png&w=1200&q=100		Máquina com polias	Peito Inferior	["Deltóide Anterior", "Tríceps (Total)"]	f
f6e21dc5-9055-4f3e-9db6-c3608879de59	Cruxifixo com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05961101-Lever-Seated-Fly_Chest_small.png&w=1200&q=100		Máquina com polias	Peito (Total)	["Deltóide Anterior"]	f
41a8fcde-45f8-48ac-ac11-5d4fa49b9bad	Cruxifixo Inferior com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02271101-Cable-Standing-Fly_Chest-FIX_small.png&w=1200&q=100		Máquina com polias	Peito Inferior	["Deltóide Anterior"]	f
3dd6b0e7-e7b2-488f-b13d-6af23aff58cf	Cruxifixo Superior com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01791101-Cable-Low-Fly_Chest-FIX_small.png&w=1200&q=100		Máquina com polias	Peito Superior	["Deltóide Anterior"]	f
2f4a8047-2aa4-4cca-ad2f-c840af188791	Supino Inclinado Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03141101-Dumbbell-Incline-Bench-Press_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito Superior	["Deltóide Anterior", "Tríceps (Total)"]	f
a8a42c35-ead5-4b3e-89f5-d79e56528c2a	Supino Declinado Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03011101-Dumbbell-Decline-Bench-Press_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito Inferior	["Deltóide Anterior", "Tríceps (Total)"]	f
53268749-47ae-4398-8d4e-2dbe5fadaf61	Cruxifixo Declinado Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03021101-Dumbbell-Decline-Fly_Chest_small.png&w=1200&q=100		Peso livre	Peito Inferior	["Deltóide Anterior"]	f
24b66423-bebe-498b-b9a2-e5aaf70474d7	Cruxifixo Inclinado Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03191101-Dumbbell-Incline-Fly_Chest-FIX_small.png&w=1200&q=100		Peso livre	Peito Superior	["Deltóide Anterior"]	f
497d1613-d1ad-4ce8-a61b-092d5bcb09c5	Remada Fechada Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02931101-Dumbbell-Bent-Over-Row_Back-FIX_small.png&w=1200&q=100		Peso livre	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
c0c7ba52-2666-4943-892d-e83de741a58a	Remada Aberta Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00271101-Barbell-Bent-Over-Row_Back-FIX_small.png&w=1200&q=100		Peso livre	Costas Superior	["Deltóide Posterior", "Bíceps (Total)"]	f
f2dab865-b591-445d-a1c2-e3d8e1dff9fc	Serrote Peso Livre (Unilateral)	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02921101-Dumbbell-Bent-over-Row_back_Back-AFIX_small.png&w=1200&q=100		Peso livre	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
68b69ae2-0527-49ab-a11c-f7cdcaa6052a	Remada Baixa Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05881101-Lever-Narrow-Grip-Seated-Row-(plate-loaded)_Back_small.png&w=1200&q=100		Máquina com anilhas	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
7bdecc33-e402-4915-8333-751cbb5a10ba	Remada Aberta Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F42141101-Lever-Low-Row-(plate-loaded)_Back_small.png&w=1200&q=100		Máquina com anilhas	Costas Superior	["Deltóide Posterior", "Bíceps (Total)"]	f
c83bfbbe-bd20-41d0-ab73-21cf9e00d737	Puxada ALta Pronada Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F18701101-Lever-Lateral-Pulldown-(plate-loaded)_Back_small.png&w=1200&q=100		Máquina com anilhas	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
32a93106-e83e-47bb-ac15-8a39bc44e9b6	Puxada ALta Supinada Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F27361101-Lever-Reverse-grip-Lateral-Pulldown-(plate-loaded)_Back_small.png&w=1200&q=100		Máquina com anilhas	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
91832f35-3e74-4206-a3fe-13f1609d0544	Remada Baixa na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02391101-Cable-Straight-Back-Seated-Row_Back_small.png&w=1200&q=100		Máquina com polias	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
a2cc144a-814a-40d2-ada9-e93a151dce9a	Remada Aberta na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02181101-Cable-Seated-Wide-grip-Row_Back_small.png&w=1200&q=100		Máquina com polias	Costas Superior	["Deltóide Posterior", "Bíceps (Total)"]	f
7e5b7f39-e38e-4e90-8771-25c241b6ca54	Puxada Alta Neutra na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F26161101-Cable-Lateral-Pulldown-with-V-bar_Back_small.png&w=1200&q=100		Máquina com polias	Costas Inferior	["Deltóide Posterior", "Bíceps (Total)"]	f
37340390-7bea-42d3-839c-d3961b90b5ea	Pulldown na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F12291101-Cable-Standing-Lat-Pushdown-(rope-equipment)_Back_small.png&w=1200&q=100		Máquina com polias	Costas Inferior	["Deltóide Posterior"]	f
66426bfa-384f-4ae8-8754-ffab9f63c505	Rosca Scott na Máquina	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05921101-Lever-Preacher-Curl_Upper-Arms-FIX_small.png&w=1200&q=100		Máquina com anilhas	Cabeça Curta do Bíceps	[]	f
1e8c3f28-0cbd-42a8-9a7a-5c8cc09e0a72	Rosca Scott Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F16271101-EZ-Barbell-Close-Grip-Preacher-Curl_Upper-Arms-FIX_small.png&w=1200&q=100		Peso livre	Cabeça Curta do Bíceps	[]	f
e09d4a2c-8125-4ad7-bed1-a80da6699e77	Rosca Inclinada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03171101-Dumbbell-Incline-Curl-II_Upper-Arms_small.png&w=1200&q=100		Peso livre	Cabeça Longa do Bíceps	[]	f
363cabb8-6b29-4b77-8e82-6de7155a6b61	Rosca Direta Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04471101-EZ-Barbell-Curl_Upper-Arms_small.png&w=1200&q=100		Peso livre	Bíceps (Total)	[]	f
1abfcecb-08b3-4456-adbf-a644db079678	Rosca Direta na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F08681101-Cable-Curl-(male)_Upper-Arms-FIX_small.png&w=1200&q=100		Máquina com polias	Bíceps (Total)	[]	f
c7f563e0-719b-45a6-bf70-668d23a8f989	Tríceps Barra na Polia 	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02411101-Cable-Triceps-Pushdown-(V-bar-attachment)_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Tríceps (Total)	[]	f
3a2ccefd-1b52-452e-a6ed-a5655d566360	Tríceps Corda na Polia 	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02001101-Cable-Pushdown-(with-rope-attachment)_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Tríceps (Total)	[]	f
096a3c5b-ae88-423b-ac48-2ab7cb1a3af8	Tríceps Francês na Polia 	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01941101-Cable-Overhead-Triceps-Extension-(rope-attachment)_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Cabeça Longa do Tríceps	[]	f
99814ba2-3e25-426e-9a44-2e34915f3209	Tríceps Testa na Polia 	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F17221101-Cable-High-Pulley-Overhead-Tricep-Extension_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Cabeça Longa do Tríceps	[]	f
72ad73bb-2c69-40c9-b622-7c34dc44ad24	Tríceps Coice Bilateral na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F17281101-Cable-Two-Arm-Tricep-Kickback_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Tríceps (Total)	[]	f
12db4176-ebda-471e-b737-5d4e1878baa3	Tríceps Coice Bilateral Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04201101-Dumbbell-Standing-Kickback_Upper-Arms_small.png&w=1200&q=100		Peso livre	Tríceps (Total)	[]	f
802482f7-e01d-4467-921a-7fd3391544ba	Tríceps Coice Unilateral Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03331101-Dumbbell-Kickback_Upper-Arms_small.png&w=1200&q=100		Peso livre	Tríceps (Total)	[]	t
d4dea803-ae2d-4eae-96c4-446a71795e73	Tríceps Coice Unilateral na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F08601101-Cable-kickback_Upper-arms-FIX_small.png&w=1200&q=100		Máquina com polias	Tríceps (Total)	[]	t
8fa6977f-e841-4c80-a0e7-55c71e8de952	Tríceps Francês Unilateral na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01491101-Cable-Alternate-Triceps-Extension_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Cabeça Longa do Tríceps	[]	t
9145f97e-7e5e-49b8-a61b-3604f8b8dc49	Rosca Bayesian	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F26561101-Cable-One-Arm-Biceps-Curl-(VERSION-2)_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Cabeça Longa do Bíceps	[]	t
50a10fe2-a2ec-42ed-a82a-d57768c3cbca	Rosca Concentrada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02971101-Dumbbell-Concentration-Curl_Upper-Arms_small.png&w=1200&q=100		Peso livre	Cabeça Curta do Bíceps	[]	t
ca2f33f3-c311-4436-b815-c6cbbe798156	Tríceps Testa Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00601101-Barbell-Lying-Triceps-Extension-Skull-Crusher_Triceps-SFIX_small.png&w=1200&q=100		Peso livre	Cabeça Longa do Tríceps	[]	f
1bec0f49-f105-4eb1-9bea-25dc78b2da95	Tríceps Francês Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03891101-Dumbbell-Seated-Bench-Extension_Upper-Arms-FIX_small.png&w=1200&q=100		Peso livre	Cabeça Longa do Tríceps	[]	f
76fcfa6d-9fdd-4c27-a577-b572eb05211d	Tríceps Francês Unilateral Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04231101-Dumbbell-Standing-One-Arm-Extension_Upper-Arms_small.png&w=1200&q=100		Peso livre	Cabeça Longa do Tríceps	[]	t
2afe8664-f90e-450d-935d-1ef2afc6515b	Extensão de Tríceps na Máquina	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06071101-Lever-Triceps-Extension_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Cabeça Longa do Tríceps	[]	f
523b6468-e646-4071-b644-fdc27cf1e0c9	Tríceps Dip Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F18711101-Lever-Triceps-Dip-(plate-loaded)_Upper-Arms_small.png&w=1200&q=100		Máquina com anilhas	Tríceps (Total)	[]	f
104da5dc-53c2-4562-a862-a7fd8a2538d7	Tríceps Dip na Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F14511101-Lever-Seated-Dip_Upper-Arms_small.png&w=1200&q=100		Máquina com polias	Tríceps (Total)	[]	f
f0c0f9e9-512e-4e34-a8ff-911b71147503	Tríceps Dip Peso Corporal	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F08141101-Triceps-Dip_Upper-Arms_small.png&w=1200&q=100		Peso corporal	Tríceps (Total)	[]	f
1d2ff9c9-00b4-4847-96cb-60cd36e55fc6	Agachamento Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00431101-Barbell-Full-Squat_Thighs_small.png&w=1200&q=100		Peso livre	Quadríceps (Total)	["Glúteos"]	f
4634e6f4-6e08-4df0-a7b0-7d644a09b6d7	Agachamento Hack	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F07411101-Sled-Closer-Hack-Squat_Thighs_small.png&w=1200&q=100		Máquina com anilhas	Quadríceps (Total)	["Glúteos"]	f
5a7b44cf-b6a0-49c5-8be5-e77b9a88e9ea	Agachamento Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F10381101-Lever-Chair-Squat_Thighs_small.png&w=1200&q=100		Máquina com polias	Quadríceps (Total)	["Glúteos"]	f
646d9db2-8169-4f1a-9457-4b2f96e6d440	Cadeira Extensora Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05851101-Lever-Leg-Extension_Thighs_small.png&w=1200&q=100		Máquina com polias	Reto Femoral	[]	f
065f398b-dfdd-4861-a69f-b15db03a5031	Cadeira Extensora Máquina Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F18731101-Lever-Leg-Extension-(plate-loaded)_Thighs_small.png&w=1200&q=100		Máquina com anilhas	Reto Femoral	[]	f
26b0c7ad-74f8-4072-8cca-236b506a2e94	Leg Press com Anilhas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F22241101-Sled-45-degrees-Leg-Press-(female)_Thighs_small.png&w=1200&q=100		Máquina com anilhas	Quadríceps (Total)	["Glúteos"]	f
3a875f68-883b-4554-908f-f7f9af31cee5	Leg Press com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F22671101-Lever-Seated-Leg-Press_Thighs_small.png&w=1200&q=100		Máquina com polias	Quadríceps (Total)	["Glúteos"]	f
37d2ecc1-e539-4981-a662-554bc3586362	Leg Press com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F22901101-Dumbbell-Bulgarian-Split-Squat-(female)_Thighs_small.png&w=1200&q=100		Peso livre	Quadríceps (Total)	["Glúteos"]	t
717b0362-2174-4354-ae97-204edfc1bfcb	Afundo Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F29601101-Dumbbell-Split-Squat_Thighs_small.png&w=1200&q=100		Peso livre	Quadríceps (Total)	["Glúteos"]	t
0cf5cf94-adea-4b09-8b8b-eee16ec81f9c	Cadeira Flexora Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05991101-Lever-Seated-Leg-Curl_Thighs-FIX_small.png&w=1200&q=100		Máquina com polias	Posterior de Coxa (Total)	[]	f
abecf34b-5559-4bb5-9d37-200200840ebc	Mesa Flexora Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05861101-Lever-Lying-Leg-Curl_Thighs_small.png&w=1200&q=100		Máquina com polias	Posterior de Coxa (Total)	[]	f
e4766e74-974b-4ce3-8e59-55f5eec01d85	Flexor de Joelho em Pé Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05821101-Lever-Kneeling-Leg-Curl-(plate-loaded)_Thighs_small.png&w=1200&q=100		Máquina com anilhas	Posterior de Coxa (Total)	[]	f
a3bd28f3-bd54-4c16-9517-94f33cf5d1d0	Stiff Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F15431101-Barbell-Stiff-Legged-Deadlift_Hips_small.png&w=1200&q=100		Peso livre	Posterior de Coxa (Total)	["Glúteos"]	f
65f71b99-2c49-4baf-b2d4-c67fcd26f012	Levantamento Terra	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01161101-Barbell-Straight-Leg-Deadlift_Thighs-AFIX_small.png&w=1200&q=100		Peso livre	Posterior de Coxa (Total)	["Glúteos"]	f
fed5f5e2-ab2e-4d7e-9392-2ec259e67785	Elevação Lateral	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03341101-Dumbbell-Lateral-Raise_shoulder-AFIX_small.png&w=1200&q=100		Peso livre	Deltóide Lateral	[]	f
4abe42dc-0cd2-4d24-9907-4833d98573df	Desenvolvimento Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04051101-Dumbbell-Seated-Shoulder-Press_Shoulders_small.png&w=1200&q=100		Peso livre	Deltóide Anterior	["Deltóide Lateral", "Cabeça Longa do Tríceps"]	f
9a5a9f5b-ca21-4c49-9427-375be45f9773	Elevação Frontal	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03101101-Dumbbell-Front-Raise_Shoulders_small.png&w=1200&q=100		Peso livre	Deltóide Anterior	[]	f
7e07e44e-4881-456e-b36d-f842df168c55	Cruxifixo Inverso Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F24871101-Dumbbell-Rear-Delt-Fly-(female)_Shoulders_small.png&w=1200&q=100		Peso livre	Deltóide Posterior	["Costas Superior"]	f
f9b01f6b-72da-45c9-8259-eb9a42e09ac6	Elevação Lateral na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F22311101-Cable-One-Arm-Lateral-Raise-(female)_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Lateral	[]	t
08bc38fa-1854-4c7c-aa26-91c91b403bb6	Elevação Frontal na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F40141101-Cable-Standing-Front-Raise-Variation_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Anterior	[]	f
c7cfcb25-11f7-4e41-9524-d9568c0f2749	Elevação Frontal Unilateral na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F26891101-Cable-One-Arm-Front-Raise-(female)_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Anterior	[]	t
9eaf6344-af42-4b58-98a9-83aa51c11e1b	Elevação Lateral Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F33431101-Lever-Lateral-Raise-(VERSION-2)_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Lateral	[]	f
34b01399-a085-4740-8bb1-a8a935b1df61	Desenvolvimento Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F14541101-Lever-Seated-Shoulder-Press_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Anterior	["Deltóide Lateral", "Cabeça Longa do Tríceps"]	f
8c5f35c0-5f1f-4be9-b56d-fc58ca823890	Desenvolvimento Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05871101-Lever-Military-Press-(plate-loaded)_shoulder_small.png&w=1200&q=100		Máquina com anilhas	Deltóide Anterior	["Deltóide Lateral", "Cabeça Longa do Tríceps"]	f
650689c2-a4fa-4d37-b0a8-c0568b0889d7	Cruxifixo Inverso Máquina com Placas	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06011101-Lever-Seated-Reverse-Fly-(parallel-grip)_shoulder_small.png&w=1200&q=100		Máquina com polias	Deltóide Posterior	["Costas Superior"]	f
aa10f2ce-f96d-4110-b1e2-b2841391febf	Cruxifixo Inverso na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F41221101-Cable-One-Arm-Reverse-Fly-(male)_Shoulders_small.png&w=1200&q=100		Máquina com polias	Deltóide Posterior	["Costas Superior"]	t
66a4242f-9804-4278-a2a0-e46db9c621ea	Elevação Pélvica Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F10601101-Barbell-Hip-Thrust_Hips_small.png&w=1200&q=100		Peso livre	Glúteos	["Posterior de Coxa (Total)"]	f
ad05ae66-e178-49b9-b888-7dc6776e8066	Elevação Pélvica Articulada	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F35491101-Lever-Hip-Thrust-(plate-loaded)-(female)_Hips_small.png&w=1200&q=100		Máquina com anilhas	Glúteos	["Posterior de Coxa (Total)"]	f
f0323f34-ed09-4108-a31f-e282632b9343	Cadeira Abdutora	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F36111101-Lever-Seated-Hip-Abduction-(female)_Hips_small.png&w=1200&q=100		Máquina com polias	Glúteos	[]	f
cf060d60-c3a5-4c38-a996-32cd6a7e217d	Extensão de Quadril na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F44211101-Cable-Donkey-Kickback-(female)_Hips_small.png&w=1200&q=100		Máquina com polias	Glúteos	["Posterior de Coxa (Total)"]	t
12f9452e-0bc8-4cc0-a51f-defe0fb65054	Extensão de Quadril na Máquina	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F10311101-Lever-Standing-Hip-Extension_Hips_small.png&w=1200&q=100		Máquina com polias	Glúteos	["Posterior de Coxa (Total)"]	t
05dc68cc-86a4-4eda-88d2-ab523740d89d	Abdominal no Chão	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02741101-Crunch-Floor-m_waist_small.png&w=1200&q=100		Peso corporal	Abdominais (Total)	[]	f
8fbc1157-c9f9-44f7-be53-efd0ca5e8e89	Abdominal no Chão com Peso	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06411101-Otis-Up_waist_small.png&w=1200&q=100		Peso livre	Abdominais (Total)	[]	f
960df140-cc21-4f1c-8ea5-c272abfe23ef	Abdominal na Máquina	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F18571101-Lever-Total-Abdominal-Crunch_Waist_small.png&w=1200&q=100		Máquina com polias	Abdominais (Total)	[]	f
293d4730-872d-4457-aaa9-0f7df19f6d19	Abdominal na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01751101-Cable-Kneeling-Crunch_Waist-FIX_small.png&w=1200&q=100		Máquina com polias	Abdominais (Total)	[]	f
95a4655b-c036-46a5-bec9-eebe28434607	Panturrilha em Pé na Máquina	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06051101-Lever-Standing-Calf-Raise_Calf_small.png&w=1200&q=100		Máquina com polias	Gastrocnêmio	[]	f
3ec22553-1f2d-4b8b-bca3-2934407e667a	Panturrilha LegPress Joelho Estendido	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F13911101-Sled-Calf-Press-On-Leg-Press_Calves_small.png&w=1200&q=100		Máquina com anilhas	Gastrocnêmio	[]	f
93a83379-ae2d-436b-bbe7-98f8ce1360d5	Panturrilha em Pé Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04171101-Dumbbell-Standing-Calf-Raise_Calf_small.png&w=1200&q=100		Peso livre	Gastrocnêmio	[]	f
5a5d4d76-1759-427e-bd38-b2c78770ed87	Panturrilha Sentado Articulado	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05941101-Lever-Seated-Calf-Raise-(plate-loaded)_Calf_small.png&w=1200&q=100		Máquina com anilhas	Sóleo	[]	f
d63a076a-2fd0-4e77-bdb7-e7e7ca05294d	Panturrilha Sentado Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00881101-Barbell-Seated-Calf-Raise_Calves_small.png&w=1200&q=100		Peso livre	Sóleo	[]	f
25a98e65-ff94-4780-88d5-fb5d441819af	Rosca Inversa na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F29541101-Cable-Standing-Reverse-Grip-Curl-(Straight-bar)_Forearms_small.png&w=1200&q=100		Máquina com polias	Braquial	[]	f
dff90760-8bf4-4aa6-bf5e-cf22b006a401	Rosca Inversa Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04511101-EZ-Barbell-Reverse-Grip-Curl_Forearms_small.png&w=1200&q=100		Peso livre	Braquial	[]	f
5f9e4b26-6685-445f-be6e-d477b0d7794a	Rosca Martelo na Polia	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01651101-Cable-Hammer-Curl-(with-rope)-m_Forearms_small.png&w=1200&q=100		Máquina com polias	Braquial	[]	f
28f6d8b4-64a2-4497-9393-31b8afff9a4b	Rosca Martelo Peso Livre	https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02981101-Dumbbell-Cross-Body-Hammer-Curl_Forearms_small.png&w=1200&q=100		Peso livre	Braquial	[]	f
\.


--
-- Data for Name: macro_cycle; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.macro_cycle (id, "startDate", "endDate", "microQuantity", "userId", "macroCycleName") FROM stdin;
df649be0-c530-48aa-a271-2a1c8e9cdae9	2025-09-15	2025-10-13	2	1bfe67a1-ea2c-4da9-b559-cb955e86e3c1	trimestre
\.


--
-- Data for Name: macro_cycle_item; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.macro_cycle_item (id, "createdAt", "macroCycleId", "microCycleId") FROM stdin;
5ff581d9-050b-4ddd-a53d-7d64cadedb43	2025-09-18 00:22:42.028627	df649be0-c530-48aa-a271-2a1c8e9cdae9	ac2b066f-f06b-4034-b100-9695be0fbafc
3497b13d-b371-468a-af26-5e1c54bbf98c	2025-09-18 00:22:54.160278	df649be0-c530-48aa-a271-2a1c8e9cdae9	0290f9cc-fedf-4ede-9e8d-02264ad3c083
\.


--
-- Data for Name: macro_cycle_volume; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.macro_cycle_volume (id, "muscleGroup", "totalVolume", "changePct", recommendation, "macroCycleId") FROM stdin;
\.


--
-- Data for Name: micro_cycle; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.micro_cycle (id, "createdAt", "trainingDays", "userID", "microCycleName") FROM stdin;
ac2b066f-f06b-4034-b100-9695be0fbafc	2025-09-18	2	1bfe67a1-ea2c-4da9-b559-cb955e86e3c1	semana 1
0290f9cc-fedf-4ede-9e8d-02264ad3c083	2025-09-18	2	1bfe67a1-ea2c-4da9-b559-cb955e86e3c1	semana 2
\.


--
-- Data for Name: micro_cycle_item; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.micro_cycle_item (id, "createdAt", "microCycleId", "workoutId") FROM stdin;
78d7f844-5488-416d-8859-9d7ddd30aab2	2025-09-18 00:31:05.960728	ac2b066f-f06b-4034-b100-9695be0fbafc	92faf882-76b1-4e31-ba94-216f509f0193
f034090f-49af-4af1-ac50-d9359161f921	2025-09-18 00:31:20.33166	ac2b066f-f06b-4034-b100-9695be0fbafc	bdaf85b6-939f-4418-aba6-42958f7f595d
21c8e3e7-2a52-4d44-bf67-ed7a67382a2b	2025-09-18 00:31:58.737275	0290f9cc-fedf-4ede-9e8d-02264ad3c083	92faf882-76b1-4e31-ba94-216f509f0193
d91e07ea-f481-45c5-b0a5-b69b7743bb94	2025-09-18 00:32:10.524668	0290f9cc-fedf-4ede-9e8d-02264ad3c083	bdaf85b6-939f-4418-aba6-42958f7f595d
\.


--
-- Data for Name: micro_cycle_volume; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.micro_cycle_volume (id, "muscleGroup", "totalVolume", "microCycleId") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1755723172622	InitialMigration1755723172622
2	1756838413731	AddNameINMicroAndMacro1756838413731
\.


--
-- Data for Name: sets; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.sets (id, reps, weight, notes, side, "microCycleItemId", "exerciseId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public."user" (id, email, name, password, admin, "createdAt", "updatedAt") FROM stdin;
1bfe67a1-ea2c-4da9-b559-cb955e86e3c1	gabrielcoloradogvda@gmail.com	Gabriel Andrade	$2b$10$v21T6yxAoGWnHnLNB8PeYOD.QqIT9d2gm9/8Km5Hyw6RC.fEulI9G	t	2025-08-20	2025-08-20
\.


--
-- Data for Name: workout; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.workout (id, name, "volumeId") FROM stdin;
92faf882-76b1-4e31-ba94-216f509f0193	SEGUNDA	\N
bdaf85b6-939f-4418-aba6-42958f7f595d	TERÇA	\N
\.


--
-- Data for Name: workout_exercises; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.workout_exercises (id, "targetSets", "workoutId", "exerciseId") FROM stdin;
4e2ba921-db1b-4dde-86b1-ce2a1b219fc0	4	92faf882-76b1-4e31-ba94-216f509f0193	07643bec-5b53-4919-a508-d686ab7dad44
dbcfd13d-45ec-45ba-b89c-c48f81be4b63	3	92faf882-76b1-4e31-ba94-216f509f0193	dd56d709-d7b1-45b4-b647-b43fd273ac4b
29ae59fe-0e57-4c6a-abe4-03f71dce58db	4	bdaf85b6-939f-4418-aba6-42958f7f595d	68b69ae2-0527-49ab-a11c-f7cdcaa6052a
e7cc1cb7-8830-4845-9c08-09fa41674ab0	3	bdaf85b6-939f-4418-aba6-42958f7f595d	7bdecc33-e402-4915-8333-751cbb5a10ba
\.


--
-- Data for Name: workout_volume_entries; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.workout_volume_entries (id, "muscleGroup", volume, sets, "workoutVolumeId") FROM stdin;
\.


--
-- Data for Name: workout_volumes; Type: TABLE DATA; Schema: public; Owner: gabriel
--

COPY public.workout_volumes (id) FROM stdin;
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gabriel
--

SELECT pg_catalog.setval('public.migrations_id_seq', 2, true);


--
-- Name: macro_cycle_volume PK_06a8d335337fda85b349b39deee; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle_volume
    ADD CONSTRAINT "PK_06a8d335337fda85b349b39deee" PRIMARY KEY (id);


--
-- Name: micro_cycle PK_25c7af34d0124ba6d331695e028; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle
    ADD CONSTRAINT "PK_25c7af34d0124ba6d331695e028" PRIMARY KEY (id);


--
-- Name: workout_exercises PK_377f9ead6fd69b29f0d0feb1028; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT "PK_377f9ead6fd69b29f0d0feb1028" PRIMARY KEY (id);


--
-- Name: sets PK_5d15ed8b3e2a5cb6e9c9921d056; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT "PK_5d15ed8b3e2a5cb6e9c9921d056" PRIMARY KEY (id);


--
-- Name: workout_volumes PK_658bade8789bcf04c035f043f36; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_volumes
    ADD CONSTRAINT "PK_658bade8789bcf04c035f043f36" PRIMARY KEY (id);


--
-- Name: micro_cycle_item PK_69fc88977e6c0fcf036e0741c1b; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle_item
    ADD CONSTRAINT "PK_69fc88977e6c0fcf036e0741c1b" PRIMARY KEY (id);


--
-- Name: micro_cycle_volume PK_7ea2160b406b92e82d7e201986e; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle_volume
    ADD CONSTRAINT "PK_7ea2160b406b92e82d7e201986e" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: exercise PK_a0f107e3a2ef2742c1e91d97c14; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.exercise
    ADD CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY (id);


--
-- Name: macro_cycle PK_c5e75e4306eca0738c2319ec4b5; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle
    ADD CONSTRAINT "PK_c5e75e4306eca0738c2319ec4b5" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: macro_cycle_item PK_e03ff97bf31d5b71bb07b04667d; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle_item
    ADD CONSTRAINT "PK_e03ff97bf31d5b71bb07b04667d" PRIMARY KEY (id);


--
-- Name: workout PK_ea37ec052825688082b19f0d939; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY (id);


--
-- Name: workout_volume_entries PK_f16200e31414a7c1064829a78f9; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_volume_entries
    ADD CONSTRAINT "PK_f16200e31414a7c1064829a78f9" PRIMARY KEY (id);


--
-- Name: workout REL_e5cb19199eb45a66180c1ec2b2; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "REL_e5cb19199eb45a66180c1ec2b2" UNIQUE ("volumeId");


--
-- Name: workout_volume_entries UQ_dea4a815e0000fcaad9e7c5430d; Type: CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_volume_entries
    ADD CONSTRAINT "UQ_dea4a815e0000fcaad9e7c5430d" UNIQUE ("workoutVolumeId", "muscleGroup");


--
-- Name: workout_exercises FK_1222e38fcd49c77d6ae78c6b073; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT "FK_1222e38fcd49c77d6ae78c6b073" FOREIGN KEY ("exerciseId") REFERENCES public.exercise(id) ON DELETE CASCADE;


--
-- Name: micro_cycle_item FK_3b348dc3746e9ef25e46294c262; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle_item
    ADD CONSTRAINT "FK_3b348dc3746e9ef25e46294c262" FOREIGN KEY ("workoutId") REFERENCES public.workout(id);


--
-- Name: micro_cycle_item FK_75df0a62600dcbbeea6409ac1e6; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle_item
    ADD CONSTRAINT "FK_75df0a62600dcbbeea6409ac1e6" FOREIGN KEY ("microCycleId") REFERENCES public.micro_cycle(id) ON DELETE CASCADE;


--
-- Name: sets FK_764d0ec5fee5e7bddcf69b1f9f5; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT "FK_764d0ec5fee5e7bddcf69b1f9f5" FOREIGN KEY ("microCycleItemId") REFERENCES public.micro_cycle_item(id) ON DELETE CASCADE;


--
-- Name: macro_cycle FK_8a71eacd0731ee9d5f9418332ab; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle
    ADD CONSTRAINT "FK_8a71eacd0731ee9d5f9418332ab" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: macro_cycle_item FK_9020235adb9543ae0c714f016e0; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle_item
    ADD CONSTRAINT "FK_9020235adb9543ae0c714f016e0" FOREIGN KEY ("macroCycleId") REFERENCES public.macro_cycle(id) ON DELETE CASCADE;


--
-- Name: workout_volume_entries FK_99b8a6cdddf4633b6fd74149e0c; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_volume_entries
    ADD CONSTRAINT "FK_99b8a6cdddf4633b6fd74149e0c" FOREIGN KEY ("workoutVolumeId") REFERENCES public.workout_volumes(id) ON DELETE CASCADE;


--
-- Name: micro_cycle_volume FK_a93d3dd63767b67e9427cc64612; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle_volume
    ADD CONSTRAINT "FK_a93d3dd63767b67e9427cc64612" FOREIGN KEY ("microCycleId") REFERENCES public.micro_cycle(id);


--
-- Name: macro_cycle_item FK_ba09bb37e11ecd83f53d58bbb26; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle_item
    ADD CONSTRAINT "FK_ba09bb37e11ecd83f53d58bbb26" FOREIGN KEY ("microCycleId") REFERENCES public.micro_cycle(id);


--
-- Name: micro_cycle FK_ca40d2987f6b628c7aaf5bc6ca6; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.micro_cycle
    ADD CONSTRAINT "FK_ca40d2987f6b628c7aaf5bc6ca6" FOREIGN KEY ("userID") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: sets FK_cca58e1bb2859ccf722d4633a1b; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT "FK_cca58e1bb2859ccf722d4633a1b" FOREIGN KEY ("exerciseId") REFERENCES public.exercise(id);


--
-- Name: macro_cycle_volume FK_d5bb7ce3b595e5c4be74a2b285d; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.macro_cycle_volume
    ADD CONSTRAINT "FK_d5bb7ce3b595e5c4be74a2b285d" FOREIGN KEY ("macroCycleId") REFERENCES public.macro_cycle(id);


--
-- Name: workout_exercises FK_d616bcfffe0b6bb322281ae3754; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754" FOREIGN KEY ("workoutId") REFERENCES public.workout(id) ON DELETE CASCADE;


--
-- Name: workout FK_e5cb19199eb45a66180c1ec2b26; Type: FK CONSTRAINT; Schema: public; Owner: gabriel
--

ALTER TABLE ONLY public.workout
    ADD CONSTRAINT "FK_e5cb19199eb45a66180c1ec2b26" FOREIGN KEY ("volumeId") REFERENCES public.workout_volumes(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: gabriel
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


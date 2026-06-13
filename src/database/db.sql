-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: ren_fun
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aut_ren`
--

DROP TABLE IF EXISTS `aut_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aut_ren` (
  `cod_aut` int NOT NULL AUTO_INCREMENT,
  `ced_aut` varchar(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `pro_aut` int NOT NULL,
  `nom_aut` varchar(60) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `ape_aut` varchar(50) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `ran_aut` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `dec_aut` text COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_aut`),
  UNIQUE KEY `uq_aut_ced` (`ced_aut`),
  KEY `fk_aut_pro` (`pro_aut`),
  CONSTRAINT `fk_aut_pro` FOREIGN KEY (`pro_aut`) REFERENCES `ran_ren` (`cod_ran`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aut_ren`
--

LOCK TABLES `aut_ren` WRITE;
/*!40000 ALTER TABLE `aut_ren` DISABLE KEYS */;
INSERT INTO `aut_ren` VALUES (1,'12973684',2,'YARITZA ISABEL ','PEÑA DUARTE','PRESIDENTA','SEGÚN DECRETO N.° 30 DE FECHA 07/08/2025, PUBLICADO EN GACETA OFICIAL EXTRAORDINARIA  DEL ESTADO TÁCHIRA N.° 12818 DE LA MISMA FECHA'),(2,'15233763',2,'DECCY COROMOTO','PERNIA LEAL','JEFE DE DIVISION DE ADMINISTRACIÓN','SEGÚN RESOLUCIÓN 12-2025 DE FECHA 03/09/2025, PUBLICADA EN GACETA OFICIAL EXTRAORDINARIA DEL ESTADO TÁCHIRA N.° 12836 DE FECHA 05/09/2025'),(3,'SINCEDULA',2,'MILAGROS DEL VALLE','RAMOS GARCIA','DIRECTORA DE ADMINISTRACIÓN Y FINANZAS','SINDECRETO');
/*!40000 ALTER TABLE `aut_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ben_ren`
--

DROP TABLE IF EXISTS `ben_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ben_ren` (
  `cod_ben` int unsigned NOT NULL AUTO_INCREMENT,
  `rif_ben` char(12) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nom_ben` char(80) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `dir_ben` text COLLATE utf8mb4_spanish2_ci NOT NULL,
  `sta_ben` int NOT NULL,
  PRIMARY KEY (`cod_ben`),
  UNIQUE KEY `uq_ben_ren_rif_ben` (`rif_ben`),
  KEY `fk_ben_sta` (`sta_ben`),
  CONSTRAINT `fk_ben_sta` FOREIGN KEY (`sta_ben`) REFERENCES `sta_ren` (`cod_sta`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ben_ren`
--

LOCK TABLES `ben_ren` WRITE;
/*!40000 ALTER TABLE `ben_ren` DISABLE KEYS */;
INSERT INTO `ben_ren` VALUES (1,'G-20000513-0','FUNDES-TÁCHIRA','7MA AVENIDA CENTRO CÍVICO',1),(2,'G-200005130','TESORO NACIONAL','CARACAS',1),(3,'G-20016852-8','SEDEBAT','AV PLS PILAS ENTRE CALLE VILLA ESCONDIDA Y AV. NORTE EDIF. PPAL JUNTO AL COLEGIO DE CONTADORES SAN CRISTOBAL',1),(4,'V-11498709-0','JOSE ALFREDO RODRIGUEZ SALAS','LA ROMERA',1),(5,'J-14259273-5','CARLOS JAVIER CARRERO MORA','EL DIAMANTE',1),(6,'V-30781641','Mariana','JUNCO',1),(7,'V-30785815','bssdiffa','DFSGDFG',1);
/*!40000 ALTER TABLE `ben_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctd_ren`
--

DROP TABLE IF EXISTS `ctd_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctd_ren` (
  `cod_ctd` int unsigned NOT NULL AUTO_INCREMENT,
  `ced_ctd` char(15) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `ape_ctd` char(50) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nom_ctd` char(50) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `dir_ctd` char(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `sta_ctd` int NOT NULL,
  PRIMARY KEY (`cod_ctd`),
  UNIQUE KEY `uq_ctd_ren_ced_ctd` (`ced_ctd`),
  KEY `fk_ctd_sta` (`sta_ctd`),
  CONSTRAINT `fk_ctd_sta` FOREIGN KEY (`sta_ctd`) REFERENCES `sta_ren` (`cod_sta`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctd_ren`
--

LOCK TABLES `ctd_ren` WRITE;
/*!40000 ALTER TABLE `ctd_ren` DISABLE KEYS */;
INSERT INTO `ctd_ren` VALUES (1,'V-15233768','Pernia Leal','Deccy Coromoto','Táriba Centro',1);
/*!40000 ALTER TABLE `ctd_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drn_ren`
--

DROP TABLE IF EXISTS `drn_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drn_ren` (
  `cod_drn` int NOT NULL AUTO_INCREMENT,
  `cab_drn` int DEFAULT NULL,
  `par_drn` int DEFAULT NULL,
  `des_drn` varchar(200) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `mon_drn` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`cod_drn`),
  KEY `fk_drn_ndb` (`cab_drn`),
  KEY `fk_drn_par` (`par_drn`),
  CONSTRAINT `fk_drn_ndb` FOREIGN KEY (`cab_drn`) REFERENCES `ndb_ren` (`cod_ndb`),
  CONSTRAINT `fk_drn_par` FOREIGN KEY (`par_drn`) REFERENCES `par_ren` (`cod_par`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drn_ren`
--

LOCK TABLES `drn_ren` WRITE;
/*!40000 ALTER TABLE `drn_ren` DISABLE KEYS */;
INSERT INTO `drn_ren` VALUES (33,20,4,'desktop ',20674.25),(34,20,5,'tetera',19000.00),(35,21,NULL,'pago timbre fiscal',38.19),(36,22,NULL,'IVA 75%',2820.87),(37,23,1,'SRGSUIDF',300.00),(38,24,NULL,'IFHSFOGIDS',300.00),(39,25,NULL,'DFGDF',500.00),(40,26,1,'SDFGSF',3500.00),(41,27,1,'BJIGUJ',39033.31),(42,28,NULL,'KFGIS',140.00),(43,29,1,'HSFIGH',35100.00),(44,30,NULL,'IHHIO',10000.00),(45,31,1,'HVUG',2000.25),(47,33,NULL,'HFGISD',300.00),(48,34,1,'FSDFG',300.00),(49,35,NULL,'FSDFG',100.00),(57,41,NULL,'DSFSD',300.00),(58,42,1,'GYUG',250.00),(59,43,1,'FSDF',200.00),(60,44,6,'COMISION BANCARIA ',60.00),(61,45,1,'HJHJ',50000.00);
/*!40000 ALTER TABLE `drn_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ndb_ren`
--

DROP TABLE IF EXISTS `ndb_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ndb_ren` (
  `cod_ndb` int NOT NULL AUTO_INCREMENT,
  `num_ndb` char(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fec_ndb` char(10) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `ben_ndb` int unsigned NOT NULL,
  `rnd_ndb` int DEFAULT NULL,
  `pro_ndb` int DEFAULT NULL,
  `con_ndb` text COLLATE utf8mb4_spanish2_ci,
  `mon_ndb` decimal(12,2) DEFAULT NULL,
  `ban_ndb` char(30) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `ref_ndb` char(15) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `rtc_ndb` decimal(12,2) DEFAULT NULL COMMENT 'Retencion de IVA',
  `tbf_ndb` decimal(12,2) DEFAULT NULL COMMENT 'Timbre Fiscal',
  `isl_ndb` decimal(12,2) DEFAULT NULL COMMENT 'Impuesto Sobre la Renta',
  `sub_ndb` decimal(12,2) DEFAULT NULL COMMENT 'Subtotal',
  PRIMARY KEY (`cod_ndb`),
  KEY `fk_ndb_rnd` (`rnd_ndb`),
  KEY `fk_ndb_pro` (`pro_ndb`),
  KEY `fk_ndb_ben` (`ben_ndb`),
  CONSTRAINT `fk_ndb_ben` FOREIGN KEY (`ben_ndb`) REFERENCES `ben_ren` (`cod_ben`),
  CONSTRAINT `fk_ndb_pro` FOREIGN KEY (`pro_ndb`) REFERENCES `pro_ren` (`cod_pro`),
  CONSTRAINT `fk_ndb_rnd` FOREIGN KEY (`rnd_ndb`) REFERENCES `rnd_ren` (`cod_rnd`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ndb_ren`
--

LOCK TABLES `ndb_ren` WRITE;
/*!40000 ALTER TABLE `ndb_ren` DISABLE KEYS */;
INSERT INTO `ndb_ren` VALUES (20,'ND-25155','2025-12-30',5,19,1,'COMPRA DE EQUIPOS DE COMPUTACION (SWUITCH DESKTOP 8 PUERTOS 10/100MPS) Y 01 TETERA ELECTRONICA',39674.25,'BANCO BICENTENARIO','48278492',0.00,0.00,0.00,0.00),(21,'ND-25213','2026-01-09',3,19,1,'PAGO DE TIMBRE FISCAL MES DICIEMBRE 2025 (FAC. 135)',38.19,'BANCO BICENTENARIO','86020418',0.00,0.00,0.00,0.00),(22,'ND-25217','2026-01-09',2,19,1,'PAGO IVA 75% (FAC 135)',2820.87,'BANCO BICENTENARIO','668022',0.00,0.00,0.00,0.00),(23,'ND-1524','2026-05-21',1,20,1,'BUGIUI',200.00,'BANCO DE VENEZUELA','21654684',100.00,0.00,0.00,300.00),(24,'ND-24617','2026-05-21',1,21,1,'VBOISF',300.00,'BANCO ACTIVO','54648494',0.00,0.00,0.00,0.00),(25,'ND-2110','2026-05-21',3,22,1,'WTTW',500.00,'BANCO DEL TESORO','56646',0.00,0.00,0.00,0.00),(26,'ND-1220','2026-05-21',1,22,2,'SDNGNSDOG FUCK',3360.00,'BANCO PLAZA','51651',50.00,80.00,10.00,3500.00),(27,'ND-12205','2026-05-21',3,23,1,'DVZC',39033.31,'BANCO PLAZA','',0.00,0.00,0.00,0.00),(28,'ND-1530','2026-05-22',4,23,2,'TAKASGDF',140.00,'BANCO DE VENEZUELA','587548',0.00,0.00,0.00,0.00),(29,'ND-854','2026-05-22',1,24,1,'OLA',35000.00,'BANCO PLAZA','894656',100.00,0.00,0.00,35100.00),(30,'ND-852','2026-05-22',4,25,1,'UISFHGO',10000.00,'BANCO PLAZA','555555656',0.00,0.00,0.00,0.00),(31,'ND-789','2026-05-22',1,26,2,'UGU',2000.25,'BANCO ACTIVO','156465',0.00,0.00,0.00,0.00),(33,'ND-584','2026-05-22',1,28,1,'SDGS',300.00,'BANCO PLAZA','2165',0.00,0.00,0.00,0.00),(34,'ND-258','2026-05-22',1,30,1,'FDSGDOLAAAA',300.00,'BANCO ACTIVO','4645',0.00,0.00,0.00,0.00),(35,'ND-87964','2026-05-22',1,21,1,'IHDSOIG',100.00,'BANCO PLAZA','1151',0.00,0.00,0.00,0.00),(41,'ND-845','2026-05-22',1,34,1,'DFSD',300.00,'BANCO ACTIVO','24542',0.00,0.00,0.00,0.00),(42,'ND-741','2026-05-22',1,35,1,'FSDF',250.00,'BANCO ACTIVO','6545',0.00,0.00,0.00,0.00),(43,'ND-9630','2026-05-22',1,36,1,'DGSFG',200.00,'BANCO PLAZA','54552',0.00,0.00,0.00,0.00),(44,'ND-25261','2026-01-30',1,37,1,'PAGO DE COMISIONES  ',60.00,'BANCO BICENTENARIO','25261',0.00,0.00,0.00,0.00),(45,'ND-8554','2026-06-04',1,37,1,'UIHIU',50000.00,'BANCO ACTIVO','89825',0.00,0.00,0.00,0.00),(46,'ND-123','2026-06-08',1,37,1,'JBDUBAIFD',50.00,'BANCO PLAZA','516',0.00,0.00,0.00,0.00),(47,'ND-1548','2026-06-08',2,37,1,'GHKHJ',800.00,'DEL SUR','5245',0.00,0.00,0.00,0.00),(48,'ND-965421','2026-06-08',2,37,1,'DFGDGH',900.00,'DEL SUR','533574',0.00,0.00,0.00,0.00),(49,'ND-7821231','2026-06-08',2,37,1,'FGHFG',8900.00,'BANCO ACTIVO','534523',0.00,0.00,0.00,0.00),(50,'ND-45423','2026-06-08',1,37,1,'DFGFHFG',123.00,'BANCO PLAZA','542',0.00,0.00,0.00,0.00);
/*!40000 ALTER TABLE `ndb_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opg_ren`
--

DROP TABLE IF EXISTS `opg_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opg_ren` (
  `cod_opg` int NOT NULL AUTO_INCREMENT,
  `num_opg` int NOT NULL,
  `ctd_opg` int unsigned NOT NULL,
  `fec_opg` char(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `fco_opg` char(10) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `fdc_opg` char(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `dcr_opg` char(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `mon_opg` decimal(12,2) NOT NULL,
  `con_opg` text COLLATE utf8mb4_spanish2_ci NOT NULL,
  `sta_opg` int NOT NULL,
  `par_opg` int NOT NULL,
  `gac_opg` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_opg`),
  KEY `fk_opg_par` (`par_opg`),
  KEY `fk_opg_sta` (`sta_opg`),
  KEY `fk_opg_ctd` (`ctd_opg`),
  CONSTRAINT `fk_opg_ctd` FOREIGN KEY (`ctd_opg`) REFERENCES `ctd_ren` (`cod_ctd`),
  CONSTRAINT `fk_opg_par` FOREIGN KEY (`par_opg`) REFERENCES `par_ren` (`cod_par`),
  CONSTRAINT `fk_opg_sta` FOREIGN KEY (`sta_opg`) REFERENCES `sta_ren` (`cod_sta`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opg_ren`
--

LOCK TABLES `opg_ren` WRITE;
/*!40000 ALTER TABLE `opg_ren` DISABLE KEYS */;
INSERT INTO `opg_ren` VALUES (13,41320021,1,'2026-05-21','2026-05-22','2024-12-20','132',42533.31,'TRANFERENCIA DE CAPITAL A ENTES DESCENTRALIZADOS SIN FINES EMPRESARIALES. RECURSOS CORRESPONDIENTES A LOS MESES DE NOVIEMBRE Y DICIEMBRE DEL EJERCICIO FISCAL 2025',4,3,'1'),(14,584,1,'2026-05-21','2026-05-22','2024-12-24','132',500.00,'HFPSRG',4,3,'1'),(15,2110,1,'2026-05-21','2026-05-21','2026-05-21','132',42533.31,'RERH',4,3,'1'),(16,1203,1,'2026-05-20','2026-05-22','2025-12-24','132',45360.25,'PAGO COSAS',4,3,'1'),(17,856,1,'2026-05-22','2026-05-22','2026-05-22','132',500.00,'HGUGI',4,3,'1'),(18,1808,1,'2026-05-22','2026-05-22','2026-05-22','132',500.00,'HISGHO',4,3,'1'),(19,2799,1,'2025-09-17','2025-09-19','2024-12-20','132',63800.01,'TRANSFERENCIAS DE CAPITAL A ENTES ',3,3,'1');
/*!40000 ALTER TABLE `opg_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `par_ren`
--

DROP TABLE IF EXISTS `par_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `par_ren` (
  `cod_par` int NOT NULL AUTO_INCREMENT,
  `num_par` varchar(100) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `nom_par` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_par`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `par_ren`
--

LOCK TABLES `par_ren` WRITE;
/*!40000 ALTER TABLE `par_ren` DISABLE KEYS */;
INSERT INTO `par_ren` VALUES (1,'13.01.51.4.02.01.01','ALIMENTOS Y BEBIDAS'),(2,'13.01.51.4.03.18.01','MATERIALES EDUCATIVOS'),(3,'13.05.51.4-07.01.03.02.003.002-000','ORDEN DE PAGO'),(4,'13.01.51.4.04.09.02','EQUIPOS DE COMPUTACION'),(5,'13.01.51.4.04.09.03','EQUIPOS DE COCINA'),(6,'13.01.51.4.03.08.02','COMISIONES BANCARIAS'),(8,'13.01.51.4.02.10.06','BOTON');
/*!40000 ALTER TABLE `par_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pro_ren`
--

DROP TABLE IF EXISTS `pro_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pro_ren` (
  `cod_pro` int NOT NULL AUTO_INCREMENT,
  `nom_pro` char(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `sta_pro` int NOT NULL,
  PRIMARY KEY (`cod_pro`),
  KEY `fk_pro_sta` (`sta_pro`),
  CONSTRAINT `fk_pro_sta` FOREIGN KEY (`sta_pro`) REFERENCES `sta_ren` (`cod_sta`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pro_ren`
--

LOCK TABLES `pro_ren` WRITE;
/*!40000 ALTER TABLE `pro_ren` DISABLE KEYS */;
INSERT INTO `pro_ren` VALUES (1,'Programa 01 Servicios Centrales',1),(2,'Programa 02 Atención Ciudadana',1);
/*!40000 ALTER TABLE `pro_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ran_ren`
--

DROP TABLE IF EXISTS `ran_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ran_ren` (
  `cod_ran` int NOT NULL AUTO_INCREMENT,
  `nom_ran` varchar(30) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `abr_ran` varchar(10) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  PRIMARY KEY (`cod_ran`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ran_ren`
--

LOCK TABLES `ran_ren` WRITE;
/*!40000 ALTER TABLE `ran_ren` DISABLE KEYS */;
INSERT INTO `ran_ren` VALUES (1,'Ingeniero','Ing.'),(2,'Licenciada','Lcda.'),(3,'Abogado',''),(4,'Economista',NULL),(5,'Administrador','Admin.');
/*!40000 ALTER TABLE `ran_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rnd_ren`
--

DROP TABLE IF EXISTS `rnd_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rnd_ren` (
  `cod_rnd` int NOT NULL AUTO_INCREMENT,
  `num_rnd` char(5) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `opg_rnd` int DEFAULT NULL,
  `fec_rnd` char(10) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `prd_rnd` char(80) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `avs_rnd` char(200) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `sta_rnd` int DEFAULT NULL,
  `rnt_rnd` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`cod_rnd`),
  KEY `fk_rnd_opg` (`opg_rnd`),
  CONSTRAINT `fk_rnd_opg` FOREIGN KEY (`opg_rnd`) REFERENCES `opg_ren` (`cod_opg`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rnd_ren`
--

LOCK TABLES `rnd_ren` WRITE;
/*!40000 ALTER TABLE `rnd_ren` DISABLE KEYS */;
INSERT INTO `rnd_ren` VALUES (19,'01',13,'2026-05-21','TRSNSFERENCIA DE CAPITAL IV TRIMESTRE (NOV - DIC)','DECIMO SEGUNDO AVANCE',1,NULL),(20,'01',14,'2026-05-21','DICIEMBRE','sdfs',1,NULL),(21,'02',14,'2026-05-21','JUNIO','uhrig',1,100.00),(22,'01',15,'2026-05-21','MARZO - DICIEMBRE','DECIMO SEGUNDO AVANCE',1,NULL),(23,'02',15,'2026-05-21','JUNIO','uhrig',1,500.00),(24,'01',16,'2026-05-22','JUNIO','uhrig',1,NULL),(25,'02',16,'2026-05-22','DICIEMBRE','ola',1,1000.00),(26,'03',16,'2026-05-22','MAYO','dsefs',1,640.00),(28,'01',17,'2026-05-22','DICIEMBRE','',1,NULL),(30,'02',17,'2026-05-22','DICIEMBRE','',1,100.00),(34,'1',18,'2026-05-22','DICIEMBRE','66',1,NULL),(35,'02',18,'2026-05-22','DICIEMBRE','DECIMO SEGUNDO AVANCE',1,100.00),(36,'03',18,'2026-05-22','DICIEMBRE','sfsdgf',1,150.00),(37,'01',19,'2026-05-22','DICIEMBRE','',1,NULL),(38,'02',19,'2026-06-07','DICIEMBRE','DECIMO SEGUNDO AVANCE',1,NULL);
/*!40000 ALTER TABLE `rnd_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_ren`
--

DROP TABLE IF EXISTS `rol_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_ren` (
  `cod_rol` int NOT NULL AUTO_INCREMENT,
  `nom_rol` char(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_ren`
--

LOCK TABLES `rol_ren` WRITE;
/*!40000 ALTER TABLE `rol_ren` DISABLE KEYS */;
INSERT INTO `rol_ren` VALUES (1,'Administrador'),(2,'Coordinador'),(3,'Cuentadante');
/*!40000 ALTER TABLE `rol_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sta_ren`
--

DROP TABLE IF EXISTS `sta_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sta_ren` (
  `cod_sta` int NOT NULL AUTO_INCREMENT,
  `nom_sta` char(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`cod_sta`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sta_ren`
--

LOCK TABLES `sta_ren` WRITE;
/*!40000 ALTER TABLE `sta_ren` DISABLE KEYS */;
INSERT INTO `sta_ren` VALUES (1,'Activo'),(2,'Inactivo'),(3,'Pendiente'),(4,'Pagado'),(5,'Entregada');
/*!40000 ALTER TABLE `sta_ren` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usu_ren`
--

DROP TABLE IF EXISTS `usu_ren`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usu_ren` (
  `ced_usu` char(10) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `nom_usu` char(50) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `cla_usu` char(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `ema_usu` varchar(100) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `rol_usu` int NOT NULL,
  `sta_usu` int NOT NULL,
  PRIMARY KEY (`ced_usu`),
  KEY `fk_usu_rol` (`rol_usu`),
  KEY `fk_usu_sta` (`sta_usu`),
  CONSTRAINT `fk_usu_rol` FOREIGN KEY (`rol_usu`) REFERENCES `rol_ren` (`cod_rol`),
  CONSTRAINT `fk_usu_sta` FOREIGN KEY (`sta_usu`) REFERENCES `sta_ren` (`cod_sta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usu_ren`
--

LOCK TABLES `usu_ren` WRITE;
/*!40000 ALTER TABLE `usu_ren` DISABLE KEYS */;
INSERT INTO `usu_ren` VALUES ('12972129','William Rodríguez','$2a$10$MqRuL6/gQJ0QZabWJWN5WeFZaQ3j9S5rGkFnBurhDGAkDIsgTdx6u','william@fundes.gob.ve',1,1),('19976678','Marily Buenaño','$2a$10$lF1bO1E9PAfvs7zzZ.Idb.O5m.o2uly1F0JfWQV1PRFIf7Y7yekA6','marily@fundes.gob.ve',2,1);
/*!40000 ALTER TABLE `usu_ren` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 21:11:48

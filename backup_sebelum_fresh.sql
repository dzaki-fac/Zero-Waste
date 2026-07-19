-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: zero_waste
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-dc44958e29ffba8b810d21377ae366b5','i:2;',1784451797),('laravel-cache-dc44958e29ffba8b810d21377ae366b5:timer','i:1784451797;',1784451797);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklist_pekerjaan`
--

DROP TABLE IF EXISTS `checklist_pekerjaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checklist_pekerjaan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nip` varchar(30) NOT NULL,
  `jenis_pekerjaan` varchar(20) NOT NULL,
  `tanggal` date NOT NULL,
  `tugas` varchar(255) NOT NULL,
  `area` varchar(255) DEFAULT NULL,
  `status` enum('sudah','belum') NOT NULL DEFAULT 'belum',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `master_pekerjaan_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `checklist_pekerjaan_unique` (`nip`,`tanggal`,`master_pekerjaan_id`,`area`),
  KEY `checklist_pekerjaan_master_pekerjaan_id_foreign` (`master_pekerjaan_id`),
  CONSTRAINT `checklist_pekerjaan_master_pekerjaan_id_foreign` FOREIGN KEY (`master_pekerjaan_id`) REFERENCES `master_pekerjaan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklist_pekerjaan`
--

LOCK TABLES `checklist_pekerjaan` WRITE;
/*!40000 ALTER TABLE `checklist_pekerjaan` DISABLE KEYS */;
/*!40000 ALTER TABLE `checklist_pekerjaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distribusi`
--

DROP TABLE IF EXISTS `distribusi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `distribusi` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `tanggal` datetime NOT NULL,
  `berat` decimal(10,2) NOT NULL,
  `jenis_sampah` varchar(255) NOT NULL,
  `tujuan_distribusi` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distribusi_user_id_index` (`user_id`),
  CONSTRAINT `distribusi_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distribusi`
--

LOCK TABLES `distribusi` WRITE;
/*!40000 ALTER TABLE `distribusi` DISABLE KEYS */;
INSERT INTO `distribusi` VALUES (1,'Petugas 5','2026-07-13 16:09:47',3.19,'Botol','PlasticPay','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(2,'Petugas 2','2026-04-24 07:50:32',2.90,'Botol','Pupuk/kompos','Surabaya','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(3,'Petugas 5','2026-07-03 05:55:28',1.63,'Botol','Pupuk/kompos','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(4,'Petugas 3','2026-05-12 19:46:25',3.08,'Botol','TPS','Jakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(5,'Petugas 5','2026-07-01 00:39:58',0.56,'Botol','Pupuk/kompos','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(6,'Petugas 2','2026-07-05 12:27:28',11.12,'Daun','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(7,'Petugas 5','2026-05-01 12:01:43',15.45,'Daun','PlasticPay','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(8,'Petugas 1','2026-07-08 19:41:04',16.29,'Daun','Tujuan lainnya','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(9,'Petugas 3','2026-05-15 18:11:58',22.41,'Daun','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(10,'Petugas 2','2026-05-25 01:56:52',4.46,'Daun','Pupuk/kompos','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(11,'Petugas 4','2026-07-14 11:37:38',2.31,'Kardus dan Kertas','TPS','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(12,'Petugas 3','2026-04-29 01:18:41',2.88,'Kardus dan Kertas','PlasticPay','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(13,'Petugas 4','2026-06-02 14:17:18',1.76,'Kardus dan Kertas','PlasticPay','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(14,'Petugas 5','2026-05-14 07:15:29',1.85,'Kardus dan Kertas','PlasticPay','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(15,'Petugas 3','2026-07-08 14:01:25',2.92,'Kardus dan Kertas','PlasticPay','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(16,'Petugas 5','2026-06-01 19:08:32',1.12,'Lainnya','PlasticPay','Jakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(17,'Petugas 1','2026-06-16 11:36:23',4.33,'Lainnya','PlasticPay','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(18,'Petugas 2','2026-05-19 05:00:42',3.90,'Lainnya','Tujuan lainnya','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(19,'Petugas 1','2026-07-04 15:10:16',0.72,'Lainnya','PlasticPay','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(20,'Petugas 1','2026-07-05 21:21:21',1.68,'Lainnya','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(21,'Petugas 2','2026-06-04 14:01:49',14.01,'Plastik berwarna','TPS','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(22,'Petugas 3','2026-05-18 14:47:52',4.52,'Plastik berwarna','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(23,'Petugas 5','2026-05-03 06:41:01',18.31,'Plastik berwarna','PlasticPay','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(24,'Petugas 3','2026-05-28 11:38:39',4.86,'Plastik berwarna','PlasticPay','Yogyakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(25,'Petugas 2','2026-05-25 11:12:22',18.32,'Plastik berwarna','PlasticPay','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(26,'Petugas 5','2026-06-11 08:02:56',0.57,'Plastik putih','Tujuan lainnya','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(27,'Petugas 4','2026-06-12 01:50:31',2.99,'Plastik putih','TPS','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(28,'Petugas 1','2026-06-29 14:20:41',1.61,'Plastik putih','Pupuk/kompos','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(29,'Petugas 5','2026-04-20 15:02:37',2.74,'Plastik putih','Tujuan lainnya','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(30,'Petugas 2','2026-06-11 15:41:12',2.03,'Plastik putih','Pupuk/kompos','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(31,'Petugas 3','2026-05-26 08:40:37',1.28,'Ranting besar','PlasticPay','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(32,'Petugas 5','2026-06-17 04:40:53',1.06,'Ranting besar','Pupuk/kompos','Depok','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(33,'Petugas 5','2026-04-26 15:01:36',2.38,'Ranting besar','Pupuk/kompos','Bandung','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(34,'Petugas 2','2026-04-20 16:38:28',1.65,'Ranting besar','Tujuan lainnya','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(35,'Petugas 2','2026-06-27 09:41:29',0.26,'Ranting besar','PlasticPay','Yogyakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(36,'Petugas 5','2026-06-01 02:15:55',7.13,'Ranting kecil','PlasticPay','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(37,'Petugas 3','2026-06-13 15:59:27',10.42,'Ranting kecil','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(38,'Petugas 2','2026-07-09 16:22:42',9.79,'Ranting kecil','Tujuan lainnya','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(39,'Petugas 5','2026-06-21 10:13:31',14.98,'Ranting kecil','Pupuk/kompos','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(40,'Petugas 3','2026-07-10 22:04:25',11.08,'Ranting kecil','TPS','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(41,'Petugas 4','2026-07-07 12:35:01',18.17,'Sisa makanan','Pupuk/kompos','Jakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(42,'Petugas 2','2026-06-22 17:39:08',16.48,'Sisa makanan','PlasticPay','Surabaya','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(43,'Petugas 4','2026-05-29 11:27:45',11.98,'Sisa makanan','Tujuan lainnya','Yogyakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(44,'Petugas 2','2026-06-06 15:12:21',4.55,'Sisa makanan','Tujuan lainnya','Semarang','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(45,'Petugas 5','2026-05-29 03:58:50',10.05,'Sisa makanan','Pupuk/kompos','Surabaya','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(46,'Petugas 2','2026-06-05 11:23:47',11.68,'Styrofoam','Pupuk/kompos','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(47,'Petugas 4','2026-05-27 00:04:12',23.46,'Styrofoam','TPS','Jakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(48,'Petugas 1','2026-05-05 17:17:25',20.33,'Styrofoam','TPS','Malang','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(49,'Petugas 4','2026-04-21 13:40:36',22.48,'Styrofoam','TPS','Yogyakarta','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(50,'Petugas 5','2026-06-26 05:24:30',2.86,'Styrofoam','Tujuan lainnya','Bogor','2026-07-17 06:26:01','2026-07-17 06:26:01',6);
/*!40000 ALTER TABLE `distribusi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_pekerjaan`
--

DROP TABLE IF EXISTS `master_pekerjaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master_pekerjaan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama_pekerjaan` varchar(255) NOT NULL,
  `jenis_pekerjaan` varchar(20) NOT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_pekerjaan`
--

LOCK TABLES `master_pekerjaan` WRITE;
/*!40000 ALTER TABLE `master_pekerjaan` DISABLE KEYS */;
INSERT INTO `master_pekerjaan` VALUES (1,'Membersihkan furniture, meja, kursi, laci, lemari dari debu yang menempel','harian',1,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(2,'Membersihkan noda yang terdapat di pintu masuk atau front office','harian',2,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(3,'Membersihkan interior pintu dan seluruh permukaan kaca yang ada di kantor','harian',3,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(4,'Menyedot debu di area yang dilapisi karpet agar tidak berdebu','harian',4,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(5,'Vakum permukaan lantai yang keras atau mengepelnya hingga kering','harian',5,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(6,'Kosongkan tempat sampah dan membuangnya ke pembuangan sampah','harian',6,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(7,'Menyikat lantai dan WC kamar mandi','harian',7,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(8,'Membersihkan kusen jendela dan bagian atas partisi kantor agar tidak berdebu','mingguan',8,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(9,'Membersihkan kusen pintu dan ambang pintu dari kotoran dan debu','mingguan',9,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(10,'Jika ada telepon kantor, bersihkan dan sterilkan dengan cairan pembersih','mingguan',10,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(11,'Vakum permukaan kayu yang keras dan lantai yang sulit dipel','mingguan',11,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(12,'Mengganti sarung bantal sofa jika tersedia','mingguan',12,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(13,'Membersihkan permukaan atau area yang tinggi dan sulit dijangkau seperti kipas langit-langit, ventilasi dan rak','bulanan',13,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(14,'Membersihkan tirai dari debu yang menempel','bulanan',14,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(15,'Membersihkan saklar lampu dengan lap basah','bulanan',15,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(16,'Membersihkan furniture kayu','bulanan',16,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(17,'Membersihkan barang yang ditumbuhi sarang laba-laba','bulanan',17,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(18,'Membersihkan tepi sudut karpet dengan vakum','bulanan',18,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(19,'Bersihkan jok kursi dengan vakum','bulanan',19,1,'2026-07-17 06:25:56','2026-07-17 06:25:56'),(20,'Mengganti pengharum kamar mandi dan ruangan','bulanan',20,1,'2026-07-17 06:25:56','2026-07-17 06:25:56');
/*!40000 ALTER TABLE `master_pekerjaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_07_14_035454_create_penimbangan_table',1),(5,'2026_07_14_035455_create_distribusi_table',1),(6,'2026_07_14_035455_create_pilah_sampah_table',1),(7,'2026_07_15_150717_create_checklist_pekerjaan_table',1),(8,'2026_07_15_151000_change_petugas_id_to_nip_in_checklist_pekerjaan',1),(9,'2026_07_15_152000_rename_petugas_id_to_nip_in_checklist_pekerjaan',1),(10,'2026_07_15_153000_fix_nip_values_in_checklist_pekerjaan',1),(11,'2026_07_15_154000_add_jenis_pekerjaan_to_checklist_pekerjaan',1),(12,'2026_07_15_155000_create_master_pekerjaan_table',1),(13,'2026_07_15_155001_add_master_task_relation_to_checklist_pekerjaan',1),(14,'2026_07_15_160000_drop_snapshot_columns_from_checklist_pekerjaan',1),(15,'2026_07_16_000001_add_user_id_to_penimbangan_table',1),(16,'2026_07_16_000002_add_user_id_to_pilah_sampah_table',1),(17,'2026_07_16_000003_add_user_id_to_distribusi_table',1),(19,'2026_07_16_100000_add_area_to_checklist_and_master_pekerjaan',1),(20,'2026_07_16_110000_remove_area_from_master_pekerjaan',1),(21,'2026_07_16_120000_fix_checklist_unique_constraint',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penimbangan`
--

DROP TABLE IF EXISTS `penimbangan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `penimbangan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `tanggal` datetime NOT NULL,
  `berat_sampah` decimal(10,2) NOT NULL,
  `area` varchar(255) NOT NULL,
  `sub_area` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `penimbangan_user_id_index` (`user_id`),
  CONSTRAINT `penimbangan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penimbangan`
--

LOCK TABLES `penimbangan` WRITE;
/*!40000 ALTER TABLE `penimbangan` DISABLE KEYS */;
INSERT INTO `penimbangan` VALUES (1,'Petugas 1','2026-06-11 16:28:43',51.57,'Lantai 3',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',2),(2,'Petugas 4','2026-05-31 01:51:04',11.43,'Lantai 2',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(3,'Petugas 4','2026-05-18 16:44:23',58.89,'Lantai 1',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(4,'Petugas 5','2026-05-02 06:37:17',41.26,'Area Parkir',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',6),(5,'Petugas 2','2026-05-29 23:19:17',37.18,'Area Teras',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',3),(6,'Petugas 3','2026-04-22 16:56:56',57.22,'Area Parkir',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',4),(7,'Petugas 1','2026-07-10 17:18:32',32.77,'Area Halaman',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',2),(8,'Petugas 5','2026-07-01 05:23:45',13.24,'Lantai 2',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',6),(9,'Petugas 5','2026-04-19 03:10:33',58.14,'Area Parkir',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',6),(10,'Petugas 3','2026-05-22 07:43:04',5.62,'Area Parkir',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',4),(11,'Petugas 4','2026-06-09 22:17:01',58.27,'Lantai 3',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(12,'Petugas 4','2026-05-19 23:14:14',43.92,'Area Halaman',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(13,'Petugas 4','2026-06-30 20:26:20',22.32,'Lantai 2',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(14,'Petugas 3','2026-04-25 09:54:39',21.62,'Lantai 3',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',4),(15,'Petugas 4','2026-07-07 06:48:01',51.67,'Area Teras',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(16,'Petugas 5','2026-06-03 05:39:44',38.41,'Area Teras',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',6),(17,'Petugas 4','2026-07-03 03:37:17',59.42,'Lantai 2',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(18,'Petugas 4','2026-04-24 10:41:04',36.06,'Lantai 2',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(19,'Petugas 4','2026-04-28 03:37:06',52.98,'Lantai 3',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5),(20,'Petugas 4','2026-07-12 01:03:53',48.02,'Area Halaman',NULL,'2026-07-17 06:26:01','2026-07-17 06:26:01',5);
/*!40000 ALTER TABLE `penimbangan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pilah_sampah`
--

DROP TABLE IF EXISTS `pilah_sampah`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pilah_sampah` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `tanggal` datetime NOT NULL,
  `berat` decimal(10,2) NOT NULL,
  `jenis_sampah` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pilah_sampah_user_id_index` (`user_id`),
  CONSTRAINT `pilah_sampah_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pilah_sampah`
--

LOCK TABLES `pilah_sampah` WRITE;
/*!40000 ALTER TABLE `pilah_sampah` DISABLE KEYS */;
INSERT INTO `pilah_sampah` VALUES (1,'Petugas 1','2026-06-16 13:32:25',7.40,'Lainnya','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(2,'Petugas 3','2026-07-02 01:27:48',24.14,'Ranting kecil','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(3,'Petugas 5','2026-06-14 18:33:22',57.74,'Daun','2026-07-17 06:26:01','2026-07-17 06:26:01',6),(4,'Petugas 3','2026-05-11 00:58:13',58.47,'Daun','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(5,'Petugas 3','2026-06-12 06:14:20',51.31,'Plastik berwarna','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(6,'Petugas 2','2026-07-05 16:02:39',15.91,'Styrofoam','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(7,'Petugas 3','2026-05-13 13:54:25',16.10,'Lainnya','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(8,'Petugas 1','2026-05-15 20:54:34',50.39,'Sisa makanan','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(9,'Petugas 3','2026-06-28 15:18:31',34.42,'Sisa makanan','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(10,'Petugas 2','2026-05-04 03:22:07',9.46,'Ranting kecil','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(11,'Petugas 2','2026-04-20 14:11:05',17.22,'Kardus dan Kertas','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(12,'Petugas 2','2026-07-08 10:12:35',16.47,'Botol','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(13,'Petugas 3','2026-06-26 09:28:52',45.49,'Plastik berwarna','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(14,'Petugas 2','2026-05-06 22:32:07',10.86,'Sisa makanan','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(15,'Petugas 4','2026-07-01 23:47:01',16.85,'Plastik putih','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(16,'Petugas 1','2026-06-26 22:30:04',42.41,'Styrofoam','2026-07-17 06:26:01','2026-07-17 06:26:01',2),(17,'Petugas 3','2026-04-25 13:26:26',11.24,'Ranting besar','2026-07-17 06:26:01','2026-07-17 06:26:01',4),(18,'Petugas 4','2026-04-22 18:09:26',56.24,'Styrofoam','2026-07-17 06:26:01','2026-07-17 06:26:01',5),(19,'Petugas 2','2026-06-16 08:28:47',20.14,'Styrofoam','2026-07-17 06:26:01','2026-07-17 06:26:01',3),(20,'Petugas 2','2026-04-21 22:15:27',61.74,'Ranting kecil','2026-07-17 06:26:01','2026-07-17 06:26:01',3);
/*!40000 ALTER TABLE `pilah_sampah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'petugas',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_nip_unique` (`nip`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com','111111111111111110','admin',NULL,'$2y$12$KQ.uDYvgdSerG1Tu2A4TjeotgA7eabKR0XvZWOcpY/A3f17bGumAu',NULL,'2026-07-17 06:25:57','2026-07-17 06:25:57'),(2,'Petugas 1','petugas1@example.com','111111111111111111','petugas',NULL,'$2y$12$Cum0kfZta6aP8MjTG8qcIODHh1ydkICqUkHSa85Dl9GYcu6ONOVLW',NULL,'2026-07-17 06:25:57','2026-07-17 06:25:57'),(3,'Petugas 2','petugas2@example.com','111111111111111112','petugas',NULL,'$2y$12$COstmrN4fkw8BAnkQTgJS.RLAQ7dNgcqYNYrniOU/scR2S.ko19mS',NULL,'2026-07-17 06:25:58','2026-07-17 06:25:58'),(4,'Petugas 3','petugas3@example.com','111111111111111113','petugas',NULL,'$2y$12$N1DFsKrUwWOjvBZxcJ5/iu8e4fr34WaSdukfnvGo8Y9KzCFgOF7qu',NULL,'2026-07-17 06:25:58','2026-07-17 06:25:58'),(5,'Petugas 4','petugas4@example.com','111111111111111114','petugas',NULL,'$2y$12$EYUXukUn4IndaDRDEUW9BuqTdLXaHjQA8FX/UqJsfQ05QVp19U9b2',NULL,'2026-07-17 06:25:58','2026-07-17 06:25:58'),(6,'Petugas 5','petugas5@example.com','111111111111111115','petugas',NULL,'$2y$12$/BGRw1lmtDIQXpoizjuxku74wlv694Pv2R2cWcJ4AVl73ePdkLxDS',NULL,'2026-07-17 06:25:59','2026-07-17 06:25:59');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-19 16:29:34

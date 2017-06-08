/*
MySQL Backup
Source Server Version: 5.0.22
Source Database: translate
Date: 2017/6/2 23:16:25
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
--  Table structure for `newnotesnotebook`
-- ----------------------------
DROP TABLE IF EXISTS `newnotesnotebook`;
CREATE TABLE `newnotesnotebook` (
  `ID` int(11) NOT NULL,
  `NewNote` varchar(20) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`ID`,`NewNote`),
  KEY `NewNote` (`NewNote`),
  CONSTRAINT `newnotesnotebook_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `translatehistory` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newnotesnotebook_ibfk_2` FOREIGN KEY (`NewNote`) REFERENCES `translatehistory` (`Original`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `newwordsnotebook`
-- ----------------------------
DROP TABLE IF EXISTS `newwordsnotebook`;
CREATE TABLE `newwordsnotebook` (
  `ID` int(11) NOT NULL,
  `NewWord` varchar(20) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`ID`,`NewWord`),
  KEY `NewWord` (`NewWord`),
  CONSTRAINT `newwordsnotebook_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `userlist` (`ID`) ON UPDATE CASCADE,
  CONSTRAINT `newwordsnotebook_ibfk_2` FOREIGN KEY (`NewWord`) REFERENCES `translatehistory` (`Original`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `translatehistory`
-- ----------------------------
DROP TABLE IF EXISTS `translatehistory`;
CREATE TABLE `translatehistory` (
  `ID` int(11) NOT NULL default '0',
  `Original` varchar(20) collate utf8_unicode_ci NOT NULL,
  `URL` varchar(255) collate utf8_unicode_ci NOT NULL,
  `Translation` varchar(80) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`URL`,`ID`,`Original`,`Translation`),
  KEY `ID` (`ID`),
  KEY `ID_2` USING BTREE (`ID`),
  KEY `Original_2` USING BTREE (`Original`),
  KEY `Original` USING BTREE (`Original`),
  KEY `Translation` (`Translation`),
  CONSTRAINT `translatehistory_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `userlist` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `transreco`
-- ----------------------------
DROP TABLE IF EXISTS `transreco`;
CREATE TABLE `transreco` (
  `Original` varchar(20) collate utf8_unicode_ci NOT NULL,
  `Translation` varchar(80) collate utf8_unicode_ci NOT NULL,
  `PassNum` int(20) NOT NULL,
  PRIMARY KEY  (`Original`,`Translation`),
  KEY `Translation` (`Translation`),
  CONSTRAINT `transreco_ibfk_1` FOREIGN KEY (`Original`) REFERENCES `translatehistory` (`Original`) ON DELETE NO ACTION,
  CONSTRAINT `transreco_ibfk_2` FOREIGN KEY (`Translation`) REFERENCES `translatehistory` (`Translation`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `userlist`
-- ----------------------------
DROP TABLE IF EXISTS `userlist`;
CREATE TABLE `userlist` (
  `Name` varchar(16) collate utf8_unicode_ci NOT NULL,
  `Pwd` varchar(8) collate utf8_unicode_ci NOT NULL,
  `ID` int(11) NOT NULL auto_increment,
  PRIMARY KEY  (`Name`),
  KEY `ID` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `userrecommend`
-- ----------------------------
DROP TABLE IF EXISTS `userrecommend`;
CREATE TABLE `userrecommend` (
  `ID` int(11) NOT NULL,
  `Original` varchar(20) collate utf8_unicode_ci NOT NULL,
  `AllTranslation` varchar(255) collate utf8_unicode_ci NOT NULL default '',
  `AgreedNum` int(20) unsigned zerofill NOT NULL,
  PRIMARY KEY  (`ID`,`Original`),
  KEY `Original` (`Original`),
  CONSTRAINT `userrecommend_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `translatehistory` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userrecommend_ibfk_2` FOREIGN KEY (`Original`) REFERENCES `translatehistory` (`Original`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  View definition for `translategrade`
-- ----------------------------
DROP VIEW IF EXISTS `translategrade`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `translategrade` AS select `userlist`.`ID` AS `ID`,`translatehistory`.`Original` AS `Original` from (((((`translatehistory` join `newwordsnotebook`) join `userlist` on(((`translatehistory`.`ID` = `userlist`.`ID`) and (`newwordsnotebook`.`ID` = `userlist`.`ID`)))) join `newnotesnotebook` on(((`newnotesnotebook`.`NewNote` = `translatehistory`.`Original`) and (`newnotesnotebook`.`ID` = `translatehistory`.`ID`)))) join `transreco` on((`transreco`.`Original` = `translatehistory`.`Original`))) join `userrecommend` on(((`userrecommend`.`Original` = `translatehistory`.`Original`) and (`userrecommend`.`ID` = `translatehistory`.`ID`))));

-- ----------------------------
--  Records 
-- ----------------------------

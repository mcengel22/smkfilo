-- ilceler tablosunu oluştur
CREATE TABLE IF NOT EXISTS districts (
                                         id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                         city_id BIGINT UNSIGNED NOT NULL,
                                         name VARCHAR(20) NOT NULL,
                                         FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);
-- ----------------------------
-- Records of districts

-- ----------------------------
INSERT INTO districts
 VALUES ('1', '1', 'Aladağ(Karsantı)');
INSERT INTO districts
 VALUES ('2', '1', 'Ceyhan');
INSERT INTO districts
 VALUES ('3', '1', 'Çukurova');
INSERT INTO districts
 VALUES ('4', '1', 'Feke');
INSERT INTO districts
 VALUES ('5', '1', 'İmamoğlu');
INSERT INTO districts
 VALUES ('6', '1', 'Karaisalı');
INSERT INTO districts
 VALUES ('7', '1', 'Karataş');
INSERT INTO districts
 VALUES ('8', '1', 'Kozan');
INSERT INTO districts
 VALUES ('9', '1', 'Pozantı');
INSERT INTO districts
 VALUES ('10', '1', 'Saimbeyli');
INSERT INTO districts
 VALUES ('11', '1', 'Sarıçam');
INSERT INTO districts
 VALUES ('12', '1', 'Seyhan');
INSERT INTO districts
 VALUES ('13', '1', 'Tufanbeyli');
INSERT INTO districts
 VALUES ('14', '1', 'Yumurtalık');
INSERT INTO districts
 VALUES ('15', '1', 'Yüreğir');
INSERT INTO districts
 VALUES ('16', '2', 'Adıyaman');
INSERT INTO districts
 VALUES ('17', '2', 'Besni');
INSERT INTO districts
 VALUES ('18', '2', 'Çelikhan');
INSERT INTO districts
 VALUES ('19', '2', 'Gerger');
INSERT INTO districts
 VALUES ('20', '2', 'Gölbaşı');
INSERT INTO districts
 VALUES ('21', '2', 'Kahta');
INSERT INTO districts
 VALUES ('22', '2', 'Samsat');
INSERT INTO districts
 VALUES ('23', '2', 'Sincik');
INSERT INTO districts
 VALUES ('24', '2', 'Tut');
INSERT INTO districts
 VALUES ('25', '3', 'Afyonkarahisar');
INSERT INTO districts
 VALUES ('26', '3', 'Başmakçı');
INSERT INTO districts
 VALUES ('27', '3', 'Bayat');
INSERT INTO districts
 VALUES ('28', '3', 'Bolvadin');
INSERT INTO districts
 VALUES ('29', '3', 'Çay');
INSERT INTO districts
 VALUES ('30', '3', 'Çobanlar');
INSERT INTO districts
 VALUES ('31', '3', 'Dazkırı');
INSERT INTO districts
 VALUES ('32', '3', 'Dinar');
INSERT INTO districts
 VALUES ('33', '3', 'Emirdağ');
INSERT INTO districts
 VALUES ('34', '3', 'Evciler');
INSERT INTO districts
 VALUES ('35', '3', 'Hocalar');
INSERT INTO districts
 VALUES ('36', '3', 'İhsaniye');
INSERT INTO districts
 VALUES ('37', '3', 'İscehisar');
INSERT INTO districts
 VALUES ('38', '3', 'Kızılören');
INSERT INTO districts
 VALUES ('39', '3', 'Sandıklı');
INSERT INTO districts
 VALUES ('40', '3', 'Sincanlı(Sinanpaşa)');
INSERT INTO districts
 VALUES ('41', '3', 'Sultandağı');
INSERT INTO districts
 VALUES ('42', '3', 'Şuhut');
INSERT INTO districts
 VALUES ('43', '4', 'Ağrı');
INSERT INTO districts
 VALUES ('44', '4', 'Diyadin');
INSERT INTO districts
 VALUES ('45', '4', 'Doğubeyazıt');
INSERT INTO districts
 VALUES ('46', '4', 'Eleşkirt');
INSERT INTO districts
 VALUES ('47', '4', 'Hamur');
INSERT INTO districts
 VALUES ('48', '4', 'Patnos');
INSERT INTO districts
 VALUES ('49', '4', 'Taşlıçay');
INSERT INTO districts
 VALUES ('50', '4', 'Tutak');
INSERT INTO districts
 VALUES ('51', '5', 'Amasya');
INSERT INTO districts
 VALUES ('52', '5', 'Göynücek');
INSERT INTO districts
 VALUES ('53', '5', 'Gümüşhacıköy');
INSERT INTO districts
 VALUES ('54', '5', 'Hamamözü');
INSERT INTO districts
 VALUES ('55', '5', 'Merzifon');
INSERT INTO districts
 VALUES ('56', '5', 'Suluova');
INSERT INTO districts
 VALUES ('57', '5', 'Taşova');
INSERT INTO districts
 VALUES ('58', '6', 'Akyurt');
INSERT INTO districts
 VALUES ('59', '6', 'Altındağ');
INSERT INTO districts
 VALUES ('60', '6', 'Ayaş');
INSERT INTO districts
 VALUES ('61', '6', 'Bala');
INSERT INTO districts
 VALUES ('62', '6', 'Beypazarı');
INSERT INTO districts
 VALUES ('63', '6', 'Çamlıdere');
INSERT INTO districts
 VALUES ('64', '6', 'Çankaya');
INSERT INTO districts
 VALUES ('65', '6', 'Çubuk');
INSERT INTO districts
 VALUES ('66', '6', 'Elmadağ');
INSERT INTO districts
 VALUES ('67', '6', 'Etimesgut');
INSERT INTO districts
 VALUES ('68', '6', 'Evren');
INSERT INTO districts
 VALUES ('69', '6', 'Gölbaşı');
INSERT INTO districts
 VALUES ('70', '6', 'Güdül');
INSERT INTO districts
 VALUES ('71', '6', 'Haymana');
INSERT INTO districts
 VALUES ('72', '6', 'Kalecik');
INSERT INTO districts
 VALUES ('73', '6', 'Kazan');
INSERT INTO districts
 VALUES ('74', '6', 'Keçiören');
INSERT INTO districts
 VALUES ('75', '6', 'Kızılcahamam');
INSERT INTO districts
 VALUES ('76', '6', 'Mamak');
INSERT INTO districts
 VALUES ('77', '6', 'Nallıhan');
INSERT INTO districts
 VALUES ('78', '6', 'Polatlı');
INSERT INTO districts
 VALUES ('79', '6', 'Pursaklar');
INSERT INTO districts
 VALUES ('80', '6', 'Sincan');
INSERT INTO districts
 VALUES ('81', '6', 'Şereflikoçhisar');
INSERT INTO districts
 VALUES ('82', '6', 'Yenimahalle');
INSERT INTO districts
 VALUES ('83', '7', 'Akseki');
INSERT INTO districts
 VALUES ('84', '7', 'Aksu');
INSERT INTO districts
 VALUES ('85', '7', 'Alanya');
INSERT INTO districts
 VALUES ('86', '7', 'Döşemealtı');
INSERT INTO districts
 VALUES ('87', '7', 'Elmalı');
INSERT INTO districts
 VALUES ('88', '7', 'Finike');
INSERT INTO districts
 VALUES ('89', '7', 'Gazipaşa');
INSERT INTO districts
 VALUES ('90', '7', 'Gündoğmuş');
INSERT INTO districts
 VALUES ('91', '7', 'İbradı(Aydınkent)');
INSERT INTO districts
 VALUES ('92', '7', 'Kale(Demre)');
INSERT INTO districts
 VALUES ('93', '7', 'Kaş');
INSERT INTO districts
 VALUES ('94', '7', 'Kemer');
INSERT INTO districts
 VALUES ('95', '7', 'Kepez');
INSERT INTO districts
 VALUES ('96', '7', 'Konyaaltı');
INSERT INTO districts
 VALUES ('97', '7', 'Korkuteli');
INSERT INTO districts
 VALUES ('98', '7', 'Kumluca');
INSERT INTO districts
 VALUES ('99', '7', 'Manavgat');
INSERT INTO districts
 VALUES ('100', '7', 'Muratpaşa');
INSERT INTO districts
 VALUES ('101', '7', 'Serik');
INSERT INTO districts
 VALUES ('102', '8', 'Ardanuç');
INSERT INTO districts
 VALUES ('103', '8', 'Arhavi');
INSERT INTO districts
 VALUES ('104', '8', 'Artvin');
INSERT INTO districts
 VALUES ('105', '8', 'Borçka');
INSERT INTO districts
 VALUES ('106', '8', 'Hopa');
INSERT INTO districts
 VALUES ('107', '8', 'Murgul(Göktaş)');
INSERT INTO districts
 VALUES ('108', '8', 'Şavşat');
INSERT INTO districts
 VALUES ('109', '8', 'Yusufeli');
INSERT INTO districts
 VALUES ('110', '9', 'Aydın');
INSERT INTO districts
 VALUES ('111', '9', 'Bozdoğan');
INSERT INTO districts
 VALUES ('112', '9', 'Buharkent(Çubukdağı)');
INSERT INTO districts
 VALUES ('113', '9', 'Çine');
INSERT INTO districts
 VALUES ('114', '9', 'Didim(Yenihisar)');
INSERT INTO districts
 VALUES ('115', '9', 'Germencik');
INSERT INTO districts
 VALUES ('116', '9', 'İncirliova');
INSERT INTO districts
 VALUES ('117', '9', 'Karacasu');
INSERT INTO districts
 VALUES ('118', '9', 'Karpuzlu');
INSERT INTO districts
 VALUES ('119', '9', 'Koçarlı');
INSERT INTO districts
 VALUES ('120', '9', 'Köşk');
INSERT INTO districts
 VALUES ('121', '9', 'Kuşadası');
INSERT INTO districts
 VALUES ('122', '9', 'Kuyucak');
INSERT INTO districts
 VALUES ('123', '9', 'Nazilli');
INSERT INTO districts
 VALUES ('124', '9', 'Söke');
INSERT INTO districts
 VALUES ('125', '9', 'Sultanhisar');
INSERT INTO districts
 VALUES ('126', '9', 'Yenipazar');
INSERT INTO districts
 VALUES ('127', '10', 'Ayvalık');
INSERT INTO districts
 VALUES ('128', '10', 'Balıkesir');
INSERT INTO districts
 VALUES ('129', '10', 'Balya');
INSERT INTO districts
 VALUES ('130', '10', 'Bandırma');
INSERT INTO districts
 VALUES ('131', '10', 'Bigadiç');
INSERT INTO districts
 VALUES ('132', '10', 'Burhaniye');
INSERT INTO districts
 VALUES ('133', '10', 'Dursunbey');
INSERT INTO districts
 VALUES ('134', '10', 'Edremit');
INSERT INTO districts
 VALUES ('135', '10', 'Erdek');
INSERT INTO districts
 VALUES ('136', '10', 'Gömeç');
INSERT INTO districts
 VALUES ('137', '10', 'Gönen');
INSERT INTO districts
 VALUES ('138', '10', 'Havran');
INSERT INTO districts
 VALUES ('139', '10', 'İvrindi');
INSERT INTO districts
 VALUES ('140', '10', 'Kepsut');
INSERT INTO districts
 VALUES ('141', '10', 'Manyas');
INSERT INTO districts
 VALUES ('142', '10', 'Marmara');
INSERT INTO districts
 VALUES ('143', '10', 'Savaştepe');
INSERT INTO districts
 VALUES ('144', '10', 'Sındırgı');
INSERT INTO districts
 VALUES ('145', '10', 'Susurluk');
INSERT INTO districts
 VALUES ('146', '11', 'Bilecik');
INSERT INTO districts
 VALUES ('147', '11', 'Bozüyük');
INSERT INTO districts
 VALUES ('148', '11', 'Gölpazarı');
INSERT INTO districts
 VALUES ('149', '11', 'İnhisar');
INSERT INTO districts
 VALUES ('150', '11', 'Osmaneli');
INSERT INTO districts
 VALUES ('151', '11', 'Pazaryeri');
INSERT INTO districts
 VALUES ('152', '11', 'Söğüt');
INSERT INTO districts
 VALUES ('153', '11', 'Yenipazar');
INSERT INTO districts
 VALUES ('154', '12', 'Adaklı');
INSERT INTO districts
 VALUES ('155', '12', 'Bingöl');
INSERT INTO districts
 VALUES ('156', '12', 'Genç');
INSERT INTO districts
 VALUES ('157', '12', 'Karlıova');
INSERT INTO districts
 VALUES ('158', '12', 'Kığı');
INSERT INTO districts
 VALUES ('159', '12', 'Solhan');
INSERT INTO districts
 VALUES ('160', '12', 'Yayladere');
INSERT INTO districts
 VALUES ('161', '12', 'Yedisu');
INSERT INTO districts
 VALUES ('162', '13', 'Addistricts
vaz');
INSERT INTO districts
 VALUES ('163', '13', 'Ahlat');
INSERT INTO districts
 VALUES ('164', '13', 'Bitlis');
INSERT INTO districts
 VALUES ('165', '13', 'Güroymak');
INSERT INTO districts
 VALUES ('166', '13', 'Hizan');
INSERT INTO districts
 VALUES ('167', '13', 'Mutki');
INSERT INTO districts
 VALUES ('168', '13', 'Tatvan');
INSERT INTO districts
 VALUES ('169', '14', 'Bolu');
INSERT INTO districts
 VALUES ('170', '14', 'Dörtdivan');
INSERT INTO districts
 VALUES ('171', '14', 'Gerede');
INSERT INTO districts
 VALUES ('172', '14', 'Göynük');
INSERT INTO districts
 VALUES ('173', '14', 'Kıbrıscık');
INSERT INTO districts
 VALUES ('174', '14', 'Mengen');
INSERT INTO districts
 VALUES ('175', '14', 'Mudurnu');
INSERT INTO districts
 VALUES ('176', '14', 'Seben');
INSERT INTO districts
 VALUES ('177', '14', 'Yeniçağa');
INSERT INTO districts
 VALUES ('178', '15', 'Ağlasun');
INSERT INTO districts
 VALUES ('179', '15', 'Altınyayla(Dirmil)');
INSERT INTO districts
 VALUES ('180', '15', 'Bucak');
INSERT INTO districts
 VALUES ('181', '15', 'Burdur');
INSERT INTO districts
 VALUES ('182', '15', 'Çavdır');
INSERT INTO districts
 VALUES ('183', '15', 'Çeltikçi');
INSERT INTO districts
 VALUES ('184', '15', 'Gölhisar');
INSERT INTO districts
 VALUES ('185', '15', 'Karamanlı');
INSERT INTO districts
 VALUES ('186', '15', 'Kemer');
INSERT INTO districts
 VALUES ('187', '15', 'Tefenni');
INSERT INTO districts
 VALUES ('188', '15', 'Yeşilova');
INSERT INTO districts
 VALUES ('189', '16', 'Büyükorhan');
INSERT INTO districts
 VALUES ('190', '16', 'Gemlik');
INSERT INTO districts
 VALUES ('191', '16', 'Gürsu');
INSERT INTO districts
 VALUES ('192', '16', 'Harmancık');
INSERT INTO districts
 VALUES ('193', '16', 'İnegöl');
INSERT INTO districts
 VALUES ('194', '16', 'İznik');
INSERT INTO districts
 VALUES ('195', '16', 'Karacabey');
INSERT INTO districts
 VALUES ('196', '16', 'Keles');
INSERT INTO districts
 VALUES ('197', '16', 'Kestel');
INSERT INTO districts
 VALUES ('198', '16', 'Mudanya');
INSERT INTO districts
 VALUES ('199', '16', 'Mustafakemalpaşa');
INSERT INTO districts
 VALUES ('200', '16', 'Nilüfer');
INSERT INTO districts
 VALUES ('201', '16', 'Orhaneli');
INSERT INTO districts
 VALUES ('202', '16', 'Orhangazi');
INSERT INTO districts
 VALUES ('203', '16', 'Osmangazi');
INSERT INTO districts
 VALUES ('204', '16', 'Yenişehir');
INSERT INTO districts
 VALUES ('205', '16', 'Yıldırım');
INSERT INTO districts
 VALUES ('206', '17', 'Ayvacık');
INSERT INTO districts
 VALUES ('207', '17', 'Bayramiç');
INSERT INTO districts
 VALUES ('208', '17', 'Biga');
INSERT INTO districts
 VALUES ('209', '17', 'Bozcaada');
INSERT INTO districts
 VALUES ('210', '17', 'Çan');
INSERT INTO districts
 VALUES ('211', '17', 'Çanakkale');
INSERT INTO districts
 VALUES ('212', '17', 'Eceabat');
INSERT INTO districts
 VALUES ('213', '17', 'Ezine');
INSERT INTO districts
 VALUES ('214', '17', 'Gelibolu');
INSERT INTO districts
 VALUES ('215', '17', 'Gökçeada(İmroz)');
INSERT INTO districts
 VALUES ('216', '17', 'Lapseki');
INSERT INTO districts
 VALUES ('217', '17', 'Yenice');
INSERT INTO districts
 VALUES ('218', '18', 'Atkaracalar');
INSERT INTO districts
 VALUES ('219', '18', 'Bayramören');
INSERT INTO districts
 VALUES ('220', '18', 'Çankırı');
INSERT INTO districts
 VALUES ('221', '18', 'Çerkeş');
INSERT INTO districts
 VALUES ('222', '18', 'Eldivan');
INSERT INTO districts
 VALUES ('223', '18', 'Ilgaz');
INSERT INTO districts
 VALUES ('224', '18', 'Kızılırmak');
INSERT INTO districts
 VALUES ('225', '18', 'Korgun');
INSERT INTO districts
 VALUES ('226', '18', 'Kurşunlu');
INSERT INTO districts
 VALUES ('227', '18', 'Orta');
INSERT INTO districts
 VALUES ('228', '18', 'Şabanözü');
INSERT INTO districts
 VALUES ('229', '18', 'Yapraklı');
INSERT INTO districts
 VALUES ('230', '19', 'Alaca');
INSERT INTO districts
 VALUES ('231', '19', 'Bayat');
INSERT INTO districts
 VALUES ('232', '19', 'Boğazkale');
INSERT INTO districts
 VALUES ('233', '19', 'Çorum');
INSERT INTO districts
 VALUES ('234', '19', 'Dodurga');
INSERT INTO districts
 VALUES ('235', '19', 'İskilip');
INSERT INTO districts
 VALUES ('236', '19', 'Kargı');
INSERT INTO districts
 VALUES ('237', '19', 'Laçin');
INSERT INTO districts
 VALUES ('238', '19', 'Mecitözü');
INSERT INTO districts
 VALUES ('239', '19', 'Oğuzlar(Karaören)');
INSERT INTO districts
 VALUES ('240', '19', 'Ortaköy');
INSERT INTO districts
 VALUES ('241', '19', 'Osmancık');
INSERT INTO districts
 VALUES ('242', '19', 'Sungurlu');
INSERT INTO districts
 VALUES ('243', '19', 'Uğurludağ');
INSERT INTO districts
 VALUES ('244', '20', 'Acıpayam');
INSERT INTO districts
 VALUES ('245', '20', 'Akköy');
INSERT INTO districts
 VALUES ('246', '20', 'Babadağ');
INSERT INTO districts
 VALUES ('247', '20', 'Baklan');
INSERT INTO districts
 VALUES ('248', '20', 'Bekilli');
INSERT INTO districts
 VALUES ('249', '20', 'Beyağaç');
INSERT INTO districts
 VALUES ('250', '20', 'Bozkurt');
INSERT INTO districts
 VALUES ('251', '20', 'Buldan');
INSERT INTO districts
 VALUES ('252', '20', 'Çal');
INSERT INTO districts
 VALUES ('253', '20', 'Çameli');
INSERT INTO districts
 VALUES ('254', '20', 'Çardak');
INSERT INTO districts
 VALUES ('255', '20', 'Çivril');
INSERT INTO districts
 VALUES ('256', '20', 'Denizli');
INSERT INTO districts
 VALUES ('257', '20', 'Güney');
INSERT INTO districts
 VALUES ('258', '20', 'Honaz');
INSERT INTO districts
 VALUES ('259', '20', 'Kale');
INSERT INTO districts
 VALUES ('260', '20', 'Sarayköy');
INSERT INTO districts
 VALUES ('261', '20', 'Serinhisar');
INSERT INTO districts
 VALUES ('262', '20', 'Tavas');
INSERT INTO districts
 VALUES ('263', '21', 'Bağlar');
INSERT INTO districts
 VALUES ('264', '21', 'Bismil');
INSERT INTO districts
 VALUES ('265', '21', 'Çermik');
INSERT INTO districts
 VALUES ('266', '21', 'Çınar');
INSERT INTO districts
 VALUES ('267', '21', 'Çüngüş');
INSERT INTO districts
 VALUES ('268', '21', 'Dicle');
INSERT INTO districts
 VALUES ('269', '21', 'Eğil');
INSERT INTO districts
 VALUES ('270', '21', 'Ergani');
INSERT INTO districts
 VALUES ('271', '21', 'Hani');
INSERT INTO districts
 VALUES ('272', '21', 'Hazro');
INSERT INTO districts
 VALUES ('273', '21', 'Kayapınar');
INSERT INTO districts
 VALUES ('274', '21', 'Kocaköy');
INSERT INTO districts
 VALUES ('275', '21', 'Kulp');
INSERT INTO districts
 VALUES ('276', '21', 'Lice');
INSERT INTO districts
 VALUES ('277', '21', 'Silvan');
INSERT INTO districts
 VALUES ('278', '21', 'Sur');
INSERT INTO districts
 VALUES ('279', '21', 'Yenişehir');
INSERT INTO districts
 VALUES ('280', '22', 'Edirne');
INSERT INTO districts
 VALUES ('281', '22', 'Enez');
INSERT INTO districts
 VALUES ('282', '22', 'Havsa');
INSERT INTO districts
 VALUES ('283', '22', 'İpsala');
INSERT INTO districts
 VALUES ('284', '22', 'Keşan');
INSERT INTO districts
 VALUES ('285', '22', 'Lalapaşa');
INSERT INTO districts
 VALUES ('286', '22', 'Meriç');
INSERT INTO districts
 VALUES ('287', '22', 'Süleoğlu(Süloğlu)');
INSERT INTO districts
 VALUES ('288', '22', 'Uzunköprü');
INSERT INTO districts
 VALUES ('289', '23', 'Ağın');
INSERT INTO districts
 VALUES ('290', '23', 'Alacakaya');
INSERT INTO districts
 VALUES ('291', '23', 'Arıcak');
INSERT INTO districts
 VALUES ('292', '23', 'Baskil');
INSERT INTO districts
 VALUES ('293', '23', 'Elazığ');
INSERT INTO districts
 VALUES ('294', '23', 'Karakoçan');
INSERT INTO districts
 VALUES ('295', '23', 'Keban');
INSERT INTO districts
 VALUES ('296', '23', 'Kovancılar');
INSERT INTO districts
 VALUES ('297', '23', 'Maden');
INSERT INTO districts
 VALUES ('298', '23', 'Palu');
INSERT INTO districts
 VALUES ('299', '23', 'Sivrice');
INSERT INTO districts
 VALUES ('300', '24', 'Çayırlı');
INSERT INTO districts
 VALUES ('301', '24', 'Erzincan');
INSERT INTO districts
 VALUES ('302', '24', 'İliç(Ilıç)');
INSERT INTO districts
 VALUES ('303', '24', 'Kemah');
INSERT INTO districts
 VALUES ('304', '24', 'Kemaliye');
INSERT INTO districts
 VALUES ('305', '24', 'Otlukbeli');
INSERT INTO districts
 VALUES ('306', '24', 'Refahiye');
INSERT INTO districts
 VALUES ('307', '24', 'Tercan');
INSERT INTO districts
 VALUES ('308', '24', 'Üzümlü');
INSERT INTO districts
 VALUES ('309', '25', 'Aşkale');
INSERT INTO districts
 VALUES ('310', '25', 'Aziziye(Ilıca)');
INSERT INTO districts
 VALUES ('311', '25', 'Çat');
INSERT INTO districts
 VALUES ('312', '25', 'Hınıs');
INSERT INTO districts
 VALUES ('313', '25', 'Horasan');
INSERT INTO districts
 VALUES ('314', '25', 'İspir');
INSERT INTO districts
 VALUES ('315', '25', 'Karaçoban');
INSERT INTO districts
 VALUES ('316', '25', 'Karayazı');
INSERT INTO districts
 VALUES ('317', '25', 'Köprüköy');
INSERT INTO districts
 VALUES ('318', '25', 'Narman');
INSERT INTO districts
 VALUES ('319', '25', 'Oltu');
INSERT INTO districts
 VALUES ('320', '25', 'Olur');
INSERT INTO districts
 VALUES ('321', '25', 'Palandöken');
INSERT INTO districts
 VALUES ('322', '25', 'Pasinler');
INSERT INTO districts
 VALUES ('323', '25', 'Pazaryolu');
INSERT INTO districts
 VALUES ('324', '25', 'Şenkaya');
INSERT INTO districts
 VALUES ('325', '25', 'Tekman');
INSERT INTO districts
 VALUES ('326', '25', 'Tortum');
INSERT INTO districts
 VALUES ('327', '25', 'Uzundere');
INSERT INTO districts
 VALUES ('328', '25', 'Yakutiye');
INSERT INTO districts
 VALUES ('329', '26', 'Alpu');
INSERT INTO districts
 VALUES ('330', '26', 'Beylikova');
INSERT INTO districts
 VALUES ('331', '26', 'Çifteler');
INSERT INTO districts
 VALUES ('332', '26', 'Günyüzü');
INSERT INTO districts
 VALUES ('333', '26', 'Han');
INSERT INTO districts
 VALUES ('334', '26', 'İnönü');
INSERT INTO districts
 VALUES ('335', '26', 'Mahmudiye');
INSERT INTO districts
 VALUES ('336', '26', 'Mihalgazi');
INSERT INTO districts
 VALUES ('337', '26', 'Mihalıçcık');
INSERT INTO districts
 VALUES ('338', '26', 'Odunpazarı');
INSERT INTO districts
 VALUES ('339', '26', 'Sarıcakaya');
INSERT INTO districts
 VALUES ('340', '26', 'Seyitgazi');
INSERT INTO districts
 VALUES ('341', '26', 'Sivrihisar');
INSERT INTO districts
 VALUES ('342', '26', 'Tepebaşı');
INSERT INTO districts
 VALUES ('343', '27', 'Araban');
INSERT INTO districts
 VALUES ('344', '27', 'İslahiye');
INSERT INTO districts
 VALUES ('345', '27', 'Karkamış');
INSERT INTO districts
 VALUES ('346', '27', 'Nizip');
INSERT INTO districts
 VALUES ('347', '27', 'Nurdağı');
INSERT INTO districts
 VALUES ('348', '27', 'Oğuzeli');
INSERT INTO districts
 VALUES ('349', '27', 'Şahinbey');
INSERT INTO districts
 VALUES ('350', '27', 'Şehitkamil');
INSERT INTO districts
 VALUES ('351', '27', 'Yavuzeli');
INSERT INTO districts
 VALUES ('352', '28', 'Alucra');
INSERT INTO districts
 VALUES ('353', '28', 'Bulancak');
INSERT INTO districts
 VALUES ('354', '28', 'Çamoluk');
INSERT INTO districts
 VALUES ('355', '28', 'Çanakçı');
INSERT INTO districts
 VALUES ('356', '28', 'Dereli');
INSERT INTO districts
 VALUES ('357', '28', 'Doğankent');
INSERT INTO districts
 VALUES ('358', '28', 'Espiye');
INSERT INTO districts
 VALUES ('359', '28', 'Eynesil');
INSERT INTO districts
 VALUES ('360', '28', 'Giresun');
INSERT INTO districts
 VALUES ('361', '28', 'Görele');
INSERT INTO districts
 VALUES ('362', '28', 'Güce');
INSERT INTO districts
 VALUES ('363', '28', 'Keşap');
INSERT INTO districts
 VALUES ('364', '28', 'Piraziz');
INSERT INTO districts
 VALUES ('365', '28', 'Şebinkarahisar');
INSERT INTO districts
 VALUES ('366', '28', 'Tirebolu');
INSERT INTO districts
 VALUES ('367', '28', 'Yağlıdere');
INSERT INTO districts
 VALUES ('368', '29', 'Gümüşhane');
INSERT INTO districts
 VALUES ('369', '29', 'Kelkit');
INSERT INTO districts
 VALUES ('370', '29', 'Köse');
INSERT INTO districts
 VALUES ('371', '29', 'Kürtün');
INSERT INTO districts
 VALUES ('372', '29', 'Şiran');
INSERT INTO districts
 VALUES ('373', '29', 'Torul');
INSERT INTO districts
 VALUES ('374', '30', 'Çukurca');
INSERT INTO districts
 VALUES ('375', '30', 'Hakkari');
INSERT INTO districts
 VALUES ('376', '30', 'Şemdinli');
INSERT INTO districts
 VALUES ('377', '30', 'Yüksekova');
INSERT INTO districts
 VALUES ('378', '31', 'Altınözü');
INSERT INTO districts
 VALUES ('379', '31', 'Antakya');
INSERT INTO districts
 VALUES ('380', '31', 'Belen');
INSERT INTO districts
 VALUES ('381', '31', 'Dörtyol');
INSERT INTO districts
 VALUES ('382', '31', 'Erzin');
INSERT INTO districts
 VALUES ('383', '31', 'Hassa');
INSERT INTO districts
 VALUES ('384', '31', 'İskenderun');
INSERT INTO districts
 VALUES ('385', '31', 'Kırıkhan');
INSERT INTO districts
 VALUES ('386', '31', 'Kumlu');
INSERT INTO districts
 VALUES ('387', '31', 'Reyhanlı');
INSERT INTO districts
 VALUES ('388', '31', 'Samandağ');
INSERT INTO districts
 VALUES ('389', '31', 'Yayladağı');
INSERT INTO districts
 VALUES ('390', '32', 'Aksu');
INSERT INTO districts
 VALUES ('391', '32', 'Atabey');
INSERT INTO districts
 VALUES ('392', '32', 'Eğridir(Eğirdir)');
INSERT INTO districts
 VALUES ('393', '32', 'Gelendost');
INSERT INTO districts
 VALUES ('394', '32', 'Gönen');
INSERT INTO districts
 VALUES ('395', '32', 'Isparta');
INSERT INTO districts
 VALUES ('396', '32', 'Keçiborlu');
INSERT INTO districts
 VALUES ('397', '32', 'Senirkent');
INSERT INTO districts
 VALUES ('398', '32', 'Sütçüler');
INSERT INTO districts
 VALUES ('399', '32', 'Şarkikaraağaç');
INSERT INTO districts
 VALUES ('400', '32', 'Uluborlu');
INSERT INTO districts
 VALUES ('401', '32', 'Yalvaç');
INSERT INTO districts
 VALUES ('402', '32', 'Yenişarbademli');
INSERT INTO districts
 VALUES ('403', '33', 'Akdeniz');
INSERT INTO districts
 VALUES ('404', '33', 'Anamur');
INSERT INTO districts
 VALUES ('405', '33', 'Aydıncık');
INSERT INTO districts
 VALUES ('406', '33', 'Bozyazı');
INSERT INTO districts
 VALUES ('407', '33', 'Çamlıyayla');
INSERT INTO districts
 VALUES ('408', '33', 'Erdemli');
INSERT INTO districts
 VALUES ('409', '33', 'Gülnar (Gülpınar)');
INSERT INTO districts
 VALUES ('410', '33', 'Mezitli');
INSERT INTO districts
 VALUES ('411', '33', 'Mut');
INSERT INTO districts
 VALUES ('412', '33', 'Silifke');
INSERT INTO districts
 VALUES ('413', '33', 'Tarsus');
INSERT INTO districts
 VALUES ('414', '33', 'Toroslar');
INSERT INTO districts
 VALUES ('415', '33', 'Yenişehir');
INSERT INTO districts
 VALUES ('416', '34', 'Adalar');
INSERT INTO districts
 VALUES ('417', '34', 'Arnavutköy');
INSERT INTO districts
 VALUES ('418', '34', 'Ataşehir');
INSERT INTO districts
 VALUES ('419', '34', 'Avcılar');
INSERT INTO districts
 VALUES ('420', '34', 'Bağcılar');
INSERT INTO districts
 VALUES ('421', '34', 'Bahçelievler');
INSERT INTO districts
 VALUES ('422', '34', 'Bakırköy');
INSERT INTO districts
 VALUES ('423', '34', 'Başakşehir');
INSERT INTO districts
 VALUES ('424', '34', 'Bayrampaşa');
INSERT INTO districts
 VALUES ('425', '34', 'Beşiktaş');
INSERT INTO districts
 VALUES ('426', '34', 'Beykoz');
INSERT INTO districts
 VALUES ('427', '34', 'Beylikdüzü');
INSERT INTO districts
 VALUES ('428', '34', 'Beyoğlu');
INSERT INTO districts
 VALUES ('429', '34', 'Büyükçekmece');
INSERT INTO districts
 VALUES ('430', '34', 'Çatalca');
INSERT INTO districts
 VALUES ('431', '34', 'Çekmeköy');
INSERT INTO districts
 VALUES ('432', '34', 'Esenler');
INSERT INTO districts
 VALUES ('433', '34', 'Esenyurt');
INSERT INTO districts
 VALUES ('434', '34', 'Eyüp');
INSERT INTO districts
 VALUES ('435', '34', 'Fatih');
INSERT INTO districts
 VALUES ('436', '34', 'Gaziosmanpaşa');
INSERT INTO districts
 VALUES ('437', '34', 'Güngören');
INSERT INTO districts
 VALUES ('438', '34', 'Kadıköy');
INSERT INTO districts
 VALUES ('439', '34', 'Kağıthane');
INSERT INTO districts
 VALUES ('440', '34', 'Kartal');
INSERT INTO districts
 VALUES ('441', '34', 'Küçükçekmece');
INSERT INTO districts
 VALUES ('442', '34', 'Maltepe');
INSERT INTO districts
 VALUES ('443', '34', 'Pendik');
INSERT INTO districts
 VALUES ('444', '34', 'Sancaktepe');
INSERT INTO districts
 VALUES ('445', '34', 'Sarıyer');
INSERT INTO districts
 VALUES ('446', '34', 'Silivri');
INSERT INTO districts
 VALUES ('447', '34', 'Sultanbeyli');
INSERT INTO districts
 VALUES ('448', '34', 'Sultangazi');
INSERT INTO districts
 VALUES ('449', '34', 'Şile');
INSERT INTO districts
 VALUES ('450', '34', 'Şişli');
INSERT INTO districts
 VALUES ('451', '34', 'Tuzla');
INSERT INTO districts
 VALUES ('452', '34', 'Ümraniye');
INSERT INTO districts
 VALUES ('453', '34', 'Üsküdar');
INSERT INTO districts
 VALUES ('454', '34', 'Zeytinburnu');
INSERT INTO districts
 VALUES ('455', '35', 'Aliağa');
INSERT INTO districts
 VALUES ('456', '35', 'Balçova');
INSERT INTO districts
 VALUES ('457', '35', 'Bayındır');
INSERT INTO districts
 VALUES ('458', '35', 'Bayraklı');
INSERT INTO districts
 VALUES ('459', '35', 'Bergama');
INSERT INTO districts
 VALUES ('460', '35', 'Beydağ');
INSERT INTO districts
 VALUES ('461', '35', 'Bornova');
INSERT INTO districts
 VALUES ('462', '35', 'Buca');
INSERT INTO districts
 VALUES ('463', '35', 'Cumaovası(Menderes)');
INSERT INTO districts
 VALUES ('464', '35', 'Çeşme');
INSERT INTO districts
 VALUES ('465', '35', 'Çiğli');
INSERT INTO districts
 VALUES ('466', '35', 'Dikili');
INSERT INTO districts
 VALUES ('467', '35', 'Foça');
INSERT INTO districts
 VALUES ('468', '35', 'Gaziemir');
INSERT INTO districts
 VALUES ('469', '35', 'Güzelbahçe');
INSERT INTO districts
 VALUES ('470', '35', 'Karabağlar');
INSERT INTO districts
 VALUES ('471', '35', 'Karaburun');
INSERT INTO districts
 VALUES ('472', '35', 'Karşıyaka');
INSERT INTO districts
 VALUES ('473', '35', 'Kemalpaşa');
INSERT INTO districts
 VALUES ('474', '35', 'Kınık');
INSERT INTO districts
 VALUES ('475', '35', 'Kiraz');
INSERT INTO districts
 VALUES ('476', '35', 'Konak');
INSERT INTO districts
 VALUES ('477', '35', 'Menemen');
INSERT INTO districts
 VALUES ('478', '35', 'Narlıdere');
INSERT INTO districts
 VALUES ('479', '35', 'Ödemiş');
INSERT INTO districts
 VALUES ('480', '35', 'Seferihisar');
INSERT INTO districts
 VALUES ('481', '35', 'Selçuk');
INSERT INTO districts
 VALUES ('482', '35', 'Tire');
INSERT INTO districts
 VALUES ('483', '35', 'Torbalı');
INSERT INTO districts
 VALUES ('484', '35', 'Urla');
INSERT INTO districts
 VALUES ('485', '36', 'Akyaka');
INSERT INTO districts
 VALUES ('486', '36', 'Arpaçay');
INSERT INTO districts
 VALUES ('487', '36', 'Digor');
INSERT INTO districts
 VALUES ('488', '36', 'Kağızman');
INSERT INTO districts
 VALUES ('489', '36', 'Kars');
INSERT INTO districts
 VALUES ('490', '36', 'Sarıkamış');
INSERT INTO districts
 VALUES ('491', '36', 'Selim');
INSERT INTO districts
 VALUES ('492', '36', 'Susuz');
INSERT INTO districts
 VALUES ('493', '37', 'Abana');
INSERT INTO districts
 VALUES ('494', '37', 'Ağlı');
INSERT INTO districts
 VALUES ('495', '37', 'Araç');
INSERT INTO districts
 VALUES ('496', '37', 'Azdavay');
INSERT INTO districts
 VALUES ('497', '37', 'Bozkurt');
INSERT INTO districts
 VALUES ('498', '37', 'Cide');
INSERT INTO districts
 VALUES ('499', '37', 'Çatalzeytin');
INSERT INTO districts
 VALUES ('500', '37', 'Daday');
INSERT INTO districts
 VALUES ('501', '37', 'Devrekani');
INSERT INTO districts
 VALUES ('502', '37', 'Doğanyurt');
INSERT INTO districts
 VALUES ('503', '37', 'Hanönü(Gökçeağaç)');
INSERT INTO districts
 VALUES ('504', '37', 'İhsangazi');
INSERT INTO districts
 VALUES ('505', '37', 'İnebolu');
INSERT INTO districts
 VALUES ('506', '37', 'Kastamonu');
INSERT INTO districts
 VALUES ('507', '37', 'Küre');
INSERT INTO districts
 VALUES ('508', '37', 'Pınarbaşı');
INSERT INTO districts
 VALUES ('509', '37', 'Seydiler');
INSERT INTO districts
 VALUES ('510', '37', 'Şenpazar');
INSERT INTO districts
 VALUES ('511', '37', 'Taşköprü');
INSERT INTO districts
 VALUES ('512', '37', 'Tosya');
INSERT INTO districts
 VALUES ('513', '38', 'Akkışla');
INSERT INTO districts
 VALUES ('514', '38', 'Bünyan');
INSERT INTO districts
 VALUES ('515', '38', 'Develi');
INSERT INTO districts
 VALUES ('516', '38', 'Felahiye');
INSERT INTO districts
 VALUES ('517', '38', 'Hacılar');
INSERT INTO districts
 VALUES ('518', '38', 'İncesu');
INSERT INTO districts
 VALUES ('519', '38', 'Kocasinan');
INSERT INTO districts
 VALUES ('520', '38', 'Melikgazi');
INSERT INTO districts
 VALUES ('521', '38', 'Özvatan(Çukur)');
INSERT INTO districts
 VALUES ('522', '38', 'Pınarbaşı');
INSERT INTO districts
 VALUES ('523', '38', 'Sarıoğlan');
INSERT INTO districts
 VALUES ('524', '38', 'Sarız');
INSERT INTO districts
 VALUES ('525', '38', 'Talas');
INSERT INTO districts
 VALUES ('526', '38', 'Tomarza');
INSERT INTO districts
 VALUES ('527', '38', 'Yahyalı');
INSERT INTO districts
 VALUES ('528', '38', 'Yeşilhisar');
INSERT INTO districts
 VALUES ('529', '39', 'Babaeski');
INSERT INTO districts
 VALUES ('530', '39', 'Demirköy');
INSERT INTO districts
 VALUES ('531', '39', 'Kırklareli');
INSERT INTO districts
 VALUES ('532', '39', 'Kofçaz');
INSERT INTO districts
 VALUES ('533', '39', 'Lüleburgaz');
INSERT INTO districts
 VALUES ('534', '39', 'Pehlivanköy');
INSERT INTO districts
 VALUES ('535', '39', 'Pınarhisar');
INSERT INTO districts
 VALUES ('536', '39', 'Vize');
INSERT INTO districts
 VALUES ('537', '40', 'Akçakent');
INSERT INTO districts
 VALUES ('538', '40', 'Akpınar');
INSERT INTO districts
 VALUES ('539', '40', 'Boztepe');
INSERT INTO districts
 VALUES ('540', '40', 'Çiçekdağı');
INSERT INTO districts
 VALUES ('541', '40', 'Kaman');
INSERT INTO districts
 VALUES ('542', '40', 'Kırşehir');
INSERT INTO districts
 VALUES ('543', '40', 'Mucur');
INSERT INTO districts
 VALUES ('544', '41', 'Başiskele');
INSERT INTO districts
 VALUES ('545', '41', 'Çayırova');
INSERT INTO districts
 VALUES ('546', '41', 'Darıca');
INSERT INTO districts
 VALUES ('547', '41', 'Derince');
INSERT INTO districts
 VALUES ('548', '41', 'Dilovası');
INSERT INTO districts
 VALUES ('549', '41', 'Gebze');
INSERT INTO districts
 VALUES ('550', '41', 'Gölcük');
INSERT INTO districts
 VALUES ('551', '41', 'İzmit');
INSERT INTO districts
 VALUES ('552', '41', 'Kandıra');
INSERT INTO districts
 VALUES ('553', '41', 'Karamürsel');
INSERT INTO districts
 VALUES ('554', '41', 'Kartepe');
INSERT INTO districts
 VALUES ('555', '41', 'Tütünçiftlik');
INSERT INTO districts
 VALUES ('556', '42', 'Ahırlı');
INSERT INTO districts
 VALUES ('557', '42', 'Akören');
INSERT INTO districts
 VALUES ('558', '42', 'Akşehir');
INSERT INTO districts
 VALUES ('559', '42', 'Altınekin');
INSERT INTO districts
 VALUES ('560', '42', 'Beyşehir');
INSERT INTO districts
 VALUES ('561', '42', 'Bozkır');
INSERT INTO districts
 VALUES ('562', '42', 'Cihanbeyli');
INSERT INTO districts
 VALUES ('563', '42', 'Çeltik');
INSERT INTO districts
 VALUES ('564', '42', 'Çumra');
INSERT INTO districts
 VALUES ('565', '42', 'Derbent');
INSERT INTO districts
 VALUES ('566', '42', 'Derebucak');
INSERT INTO districts
 VALUES ('567', '42', 'Doğanhisar');
INSERT INTO districts
 VALUES ('568', '42', 'Emirgazi');
INSERT INTO districts
 VALUES ('569', '42', 'Ereğli');
INSERT INTO districts
 VALUES ('570', '42', 'Güneysınır');
INSERT INTO districts
 VALUES ('571', '42', 'Hadim');
INSERT INTO districts
 VALUES ('572', '42', 'Halkapınar');
INSERT INTO districts
 VALUES ('573', '42', 'Hüyük');
INSERT INTO districts
 VALUES ('574', '42', 'Ilgın');
INSERT INTO districts
 VALUES ('575', '42', 'Kadınhanı');
INSERT INTO districts
 VALUES ('576', '42', 'Karapınar');
INSERT INTO districts
 VALUES ('577', '42', 'Karatay');
INSERT INTO districts
 VALUES ('578', '42', 'Kulu');
INSERT INTO districts
 VALUES ('579', '42', 'Meram');
INSERT INTO districts
 VALUES ('580', '42', 'Sarayönü');
INSERT INTO districts
 VALUES ('581', '42', 'Selçuklu');
INSERT INTO districts
 VALUES ('582', '42', 'Seydişehir');
INSERT INTO districts
 VALUES ('583', '42', 'Taşkent');
INSERT INTO districts
 VALUES ('584', '42', 'Tuzlukçu');
INSERT INTO districts
 VALUES ('585', '42', 'Yalıhüyük');
INSERT INTO districts
 VALUES ('586', '42', 'Yunak');
INSERT INTO districts
 VALUES ('587', '43', 'Altıntaş');
INSERT INTO districts
 VALUES ('588', '43', 'Aslanapa');
INSERT INTO districts
 VALUES ('589', '43', 'Çavdarhisar');
INSERT INTO districts
 VALUES ('590', '43', 'Domaniç');
INSERT INTO districts
 VALUES ('591', '43', 'Dumlupınar');
INSERT INTO districts
 VALUES ('592', '43', 'Emet');
INSERT INTO districts
 VALUES ('593', '43', 'Gediz');
INSERT INTO districts
 VALUES ('594', '43', 'Hisarcık');
INSERT INTO districts
 VALUES ('595', '43', 'Kütahya');
INSERT INTO districts
 VALUES ('596', '43', 'Pazarlar');
INSERT INTO districts
 VALUES ('597', '43', 'Simav');
INSERT INTO districts
 VALUES ('598', '43', 'Şaphane');
INSERT INTO districts
 VALUES ('599', '43', 'Tavşanlı');
INSERT INTO districts
 VALUES ('600', '43', 'Tunçbilek');
INSERT INTO districts
 VALUES ('601', '44', 'Akçadağ');
INSERT INTO districts
 VALUES ('602', '44', 'Arapkir');
INSERT INTO districts
 VALUES ('603', '44', 'Arguvan');
INSERT INTO districts
 VALUES ('604', '44', 'Battalgazi');
INSERT INTO districts
 VALUES ('605', '44', 'Darende');
INSERT INTO districts
 VALUES ('606', '44', 'Doğanşehir');
INSERT INTO districts
 VALUES ('607', '44', 'Doğanyol');
INSERT INTO districts
 VALUES ('608', '44', 'Hekimhan');
INSERT INTO districts
 VALUES ('609', '44', 'Kale');
INSERT INTO districts
 VALUES ('610', '44', 'Kuluncak');
INSERT INTO districts
 VALUES ('611', '44', 'Malatya');
INSERT INTO districts
 VALUES ('612', '44', 'Pötürge');
INSERT INTO districts
 VALUES ('613', '44', 'Yazıhan');
INSERT INTO districts
 VALUES ('614', '44', 'Yeşilyurt');
INSERT INTO districts
 VALUES ('615', '45', 'Ahmetli');
INSERT INTO districts
 VALUES ('616', '45', 'Akhisar');
INSERT INTO districts
 VALUES ('617', '45', 'Alaşehir');
INSERT INTO districts
 VALUES ('618', '45', 'Demirci');
INSERT INTO districts
 VALUES ('619', '45', 'Gölmarmara');
INSERT INTO districts
 VALUES ('620', '45', 'Gördes');
INSERT INTO districts
 VALUES ('621', '45', 'Kırkağaç');
INSERT INTO districts
 VALUES ('622', '45', 'Köprübaşı');
INSERT INTO districts
 VALUES ('623', '45', 'Kula');
INSERT INTO districts
 VALUES ('624', '45', 'Manisa');
INSERT INTO districts
 VALUES ('625', '45', 'Salihli');
INSERT INTO districts
 VALUES ('626', '45', 'Sarıgöl');
INSERT INTO districts
 VALUES ('627', '45', 'Saruhanlı');
INSERT INTO districts
 VALUES ('628', '45', 'Selendi');
INSERT INTO districts
 VALUES ('629', '45', 'Soma');
INSERT INTO districts
 VALUES ('630', '45', 'Turgutlu');
INSERT INTO districts
 VALUES ('631', '46', 'Afşin');
INSERT INTO districts
 VALUES ('632', '46', 'Andırın');
INSERT INTO districts
 VALUES ('633', '46', 'Çağlayancerit');
INSERT INTO districts
 VALUES ('634', '46', 'Ekinözü');
INSERT INTO districts
 VALUES ('635', '46', 'Elbistan');
INSERT INTO districts
 VALUES ('636', '46', 'Göksun');
INSERT INTO districts
 VALUES ('637', '46', 'Kahramanmaraş');
INSERT INTO districts
 VALUES ('638', '46', 'Nurhak');
INSERT INTO districts
 VALUES ('639', '46', 'Pazarcık');
INSERT INTO districts
 VALUES ('640', '46', 'Türkoğlu');
INSERT INTO districts
 VALUES ('641', '47', 'Dargeçit');
INSERT INTO districts
 VALUES ('642', '47', 'Derik');
INSERT INTO districts
 VALUES ('643', '47', 'Kızıltepe');
INSERT INTO districts
 VALUES ('644', '47', 'Mardin');
INSERT INTO districts
 VALUES ('645', '47', 'Mazıdağı');
INSERT INTO districts
 VALUES ('646', '47', 'Midyat(Estel)');
INSERT INTO districts
 VALUES ('647', '47', 'Nusaybin');
INSERT INTO districts
 VALUES ('648', '47', 'Ömerli');
INSERT INTO districts
 VALUES ('649', '47', 'Savur');
INSERT INTO districts
 VALUES ('650', '47', 'Yeşilli');
INSERT INTO districts
 VALUES ('651', '48', 'Bodrum');
INSERT INTO districts
 VALUES ('652', '48', 'Dalaman');
INSERT INTO districts
 VALUES ('653', '48', 'Datça');
INSERT INTO districts
 VALUES ('654', '48', 'Fethiye');
INSERT INTO districts
 VALUES ('655', '48', 'Kavaklıdere');
INSERT INTO districts
 VALUES ('656', '48', 'Köyceğiz');
INSERT INTO districts
 VALUES ('657', '48', 'Marmaris');
INSERT INTO districts
 VALUES ('658', '48', 'Milas');
INSERT INTO districts
 VALUES ('659', '48', 'Muğla');
INSERT INTO districts
 VALUES ('660', '48', 'Ortaca');
INSERT INTO districts
 VALUES ('661', '48', 'Ula');
INSERT INTO districts
 VALUES ('662', '48', 'Yatağan');
INSERT INTO districts
 VALUES ('663', '49', 'Bulanık');
INSERT INTO districts
 VALUES ('664', '49', 'Hasköy');
INSERT INTO districts
 VALUES ('665', '49', 'Korkut');
INSERT INTO districts
 VALUES ('666', '49', 'Malazgirt');
INSERT INTO districts
 VALUES ('667', '49', 'Muş');
INSERT INTO districts
 VALUES ('668', '49', 'Varto');
INSERT INTO districts
 VALUES ('669', '50', 'Acıgöl');
INSERT INTO districts
 VALUES ('670', '50', 'Avanos');
INSERT INTO districts
 VALUES ('671', '50', 'Derinkuyu');
INSERT INTO districts
 VALUES ('672', '50', 'Gülşehir');
INSERT INTO districts
 VALUES ('673', '50', 'Hacıbektaş');
INSERT INTO districts
 VALUES ('674', '50', 'Kozaklı');
INSERT INTO districts
 VALUES ('675', '50', 'Nevşehir');
INSERT INTO districts
 VALUES ('676', '50', 'Ürgüp');
INSERT INTO districts
 VALUES ('677', '51', 'Altunhisar');
INSERT INTO districts
 VALUES ('678', '51', 'Bor');
INSERT INTO districts
 VALUES ('679', '51', 'Çamardı');
INSERT INTO districts
 VALUES ('680', '51', 'Çiftlik(Özyurt)');
INSERT INTO districts
 VALUES ('681', '51', 'Niğde');
INSERT INTO districts
 VALUES ('682', '51', 'Ulukışla');
INSERT INTO districts
 VALUES ('683', '52', 'Akkuş');
INSERT INTO districts
 VALUES ('684', '52', 'Aybastı');
INSERT INTO districts
 VALUES ('685', '52', 'Çamaş');
INSERT INTO districts
 VALUES ('686', '52', 'Çatalpınar');
INSERT INTO districts
 VALUES ('687', '52', 'Çaybaşı');
INSERT INTO districts
 VALUES ('688', '52', 'Fatsa');
INSERT INTO districts
 VALUES ('689', '52', 'Gölköy');
INSERT INTO districts
 VALUES ('690', '52', 'Gülyalı');
INSERT INTO districts
 VALUES ('691', '52', 'Gürgentepe');
INSERT INTO districts
 VALUES ('692', '52', 'İkizce');
INSERT INTO districts
 VALUES ('693', '52', 'Kabataş');
INSERT INTO districts
 VALUES ('694', '52', 'Karadüz(Kabadüz)');
INSERT INTO districts
 VALUES ('695', '52', 'Korgan');
INSERT INTO districts
 VALUES ('696', '52', 'Kumru');
INSERT INTO districts
 VALUES ('697', '52', 'Mesudiye');
INSERT INTO districts
 VALUES ('698', '52', 'Ordu');
INSERT INTO districts
 VALUES ('699', '52', 'Perşembe');
INSERT INTO districts
 VALUES ('700', '52', 'Ulubey');
INSERT INTO districts
 VALUES ('701', '52', 'Ünye');
INSERT INTO districts
 VALUES ('702', '53', 'Ardeşen');
INSERT INTO districts
 VALUES ('703', '53', 'Çamlıhemşin');
INSERT INTO districts
 VALUES ('704', '53', 'Çayeli');
INSERT INTO districts
 VALUES ('705', '53', 'Derepazarı');
INSERT INTO districts
 VALUES ('706', '53', 'Fındıklı');
INSERT INTO districts
 VALUES ('707', '53', 'Güneysu');
INSERT INTO districts
 VALUES ('708', '53', 'Hemşin');
INSERT INTO districts
 VALUES ('709', '53', 'İkizdere');
INSERT INTO districts
 VALUES ('710', '53', 'İyidere');
INSERT INTO districts
 VALUES ('711', '53', 'Kalkandere');
INSERT INTO districts
 VALUES ('712', '53', 'Pazar');
INSERT INTO districts
 VALUES ('713', '53', 'Rize');
INSERT INTO districts
 VALUES ('714', '54', 'Adapazarı');
INSERT INTO districts
 VALUES ('715', '54', 'Akyazı');
INSERT INTO districts
 VALUES ('716', '54', 'Arifiye');
INSERT INTO districts
 VALUES ('717', '54', 'Erenler');
INSERT INTO districts
 VALUES ('718', '54', 'Ferizli');
INSERT INTO districts
 VALUES ('719', '54', 'Geyve');
INSERT INTO districts
 VALUES ('720', '54', 'Hendek');
INSERT INTO districts
 VALUES ('721', '54', 'Karapürçek');
INSERT INTO districts
 VALUES ('722', '54', 'Karasu');
INSERT INTO districts
 VALUES ('723', '54', 'Kaynarca');
INSERT INTO districts
 VALUES ('724', '54', 'Kocaali');
INSERT INTO districts
 VALUES ('725', '54', 'Pamukova');
INSERT INTO districts
 VALUES ('726', '54', 'Sapanca');
INSERT INTO districts
 VALUES ('727', '54', 'Serdivan');
INSERT INTO districts
 VALUES ('728', '54', 'Söğütlü');
INSERT INTO districts
 VALUES ('729', '54', 'Taraklı');
INSERT INTO districts
 VALUES ('730', '55', '19 Mayıs(Ballıca)');
INSERT INTO districts
 VALUES ('731', '55', 'Alaçam');
INSERT INTO districts
 VALUES ('732', '55', 'Asarcık');
INSERT INTO districts
 VALUES ('733', '55', 'Atakum');
INSERT INTO districts
 VALUES ('734', '55', 'Ayvacık');
INSERT INTO districts
 VALUES ('735', '55', 'Bafra');
INSERT INTO districts
 VALUES ('736', '55', 'Canik');
INSERT INTO districts
 VALUES ('737', '55', 'Çarşamba');
INSERT INTO districts
 VALUES ('738', '55', 'Havza');
INSERT INTO districts
 VALUES ('739', '55', 'İlkadım');
INSERT INTO districts
 VALUES ('740', '55', 'Kavak');
INSERT INTO districts
 VALUES ('741', '55', 'Ladik');
INSERT INTO districts
 VALUES ('742', '55', 'Salıpazarı');
INSERT INTO districts
 VALUES ('743', '55', 'Tekkeköy');
INSERT INTO districts
 VALUES ('744', '55', 'Terme');
INSERT INTO districts
 VALUES ('745', '55', 'Vezirköprü');
INSERT INTO districts
 VALUES ('746', '55', 'Yakakent');
INSERT INTO districts
 VALUES ('747', '56', 'Aydınlar');
INSERT INTO districts
 VALUES ('748', '56', 'Baykan');
INSERT INTO districts
 VALUES ('749', '56', 'Eruh');
INSERT INTO districts
 VALUES ('750', '56', 'Kurtalan');
INSERT INTO districts
 VALUES ('751', '56', 'Pervari');
INSERT INTO districts
 VALUES ('752', '56', 'Siirt');
INSERT INTO districts
 VALUES ('753', '56', 'Şirvan');
INSERT INTO districts
 VALUES ('754', '57', 'Ayancık');
INSERT INTO districts
 VALUES ('755', '57', 'Boyabat');
INSERT INTO districts
 VALUES ('756', '57', 'Dikmen');
INSERT INTO districts
 VALUES ('757', '57', 'Durağan');
INSERT INTO districts
 VALUES ('758', '57', 'Erfelek');
INSERT INTO districts
 VALUES ('759', '57', 'Gerze');
INSERT INTO districts
 VALUES ('760', '57', 'Saraydüzü');
INSERT INTO districts
 VALUES ('761', '57', 'Sinop');
INSERT INTO districts
 VALUES ('762', '57', 'Türkeli');
INSERT INTO districts
 VALUES ('763', '58', 'Akıncılar');
INSERT INTO districts
 VALUES ('764', '58', 'Altınyayla');
INSERT INTO districts
 VALUES ('765', '58', 'Divriği');
INSERT INTO districts
 VALUES ('766', '58', 'Doğanşar');
INSERT INTO districts
 VALUES ('767', '58', 'Gemerek');
INSERT INTO districts
 VALUES ('768', '58', 'Gölova');
INSERT INTO districts
 VALUES ('769', '58', 'Gürün');
INSERT INTO districts
 VALUES ('770', '58', 'Hafik');
INSERT INTO districts
 VALUES ('771', '58', 'İmranlı');
INSERT INTO districts
 VALUES ('772', '58', 'Kangal');
INSERT INTO districts
 VALUES ('773', '58', 'Koyulhisar');
INSERT INTO districts
 VALUES ('774', '58', 'Sivas');
INSERT INTO districts
 VALUES ('775', '58', 'Suşehri');
INSERT INTO districts
 VALUES ('776', '58', 'Şarkışla');
INSERT INTO districts
 VALUES ('777', '58', 'Ulaş');
INSERT INTO districts
 VALUES ('778', '58', 'Yıldızeli');
INSERT INTO districts
 VALUES ('779', '58', 'Zara');
INSERT INTO districts
 VALUES ('780', '59', 'Çerkezköy');
INSERT INTO districts
 VALUES ('781', '59', 'Çorlu');
INSERT INTO districts
 VALUES ('782', '59', 'Hayrabolu');
INSERT INTO districts
 VALUES ('783', '59', 'Malkara');
INSERT INTO districts
 VALUES ('784', '59', 'Marmaraereğlisi');
INSERT INTO districts
 VALUES ('785', '59', 'Muratlı');
INSERT INTO districts
 VALUES ('786', '59', 'Saray');
INSERT INTO districts
 VALUES ('787', '59', 'Şarköy');
INSERT INTO districts
 VALUES ('788', '59', 'Tekirdağ');
INSERT INTO districts
 VALUES ('789', '60', 'Almus');
INSERT INTO districts
 VALUES ('790', '60', 'Artova');
INSERT INTO districts
 VALUES ('791', '60', 'Başçiftlik');
INSERT INTO districts
 VALUES ('792', '60', 'Erbaa');
INSERT INTO districts
 VALUES ('793', '60', 'Niksar');
INSERT INTO districts
 VALUES ('794', '60', 'Pazar');
INSERT INTO districts
 VALUES ('795', '60', 'Reşadiye');
INSERT INTO districts
 VALUES ('796', '60', 'Sulusaray');
INSERT INTO districts
 VALUES ('797', '60', 'Tokat');
INSERT INTO districts
 VALUES ('798', '60', 'Turhal');
INSERT INTO districts
 VALUES ('799', '60', 'Yeşilyurt');
INSERT INTO districts
 VALUES ('800', '60', 'Zile');
INSERT INTO districts
 VALUES ('801', '61', 'Akçaabat');
INSERT INTO districts
 VALUES ('802', '61', 'Araklı');
INSERT INTO districts
 VALUES ('803', '61', 'Arsin');
INSERT INTO districts
 VALUES ('804', '61', 'Beşikdüzü');
INSERT INTO districts
 VALUES ('805', '61', 'Çarşıbaşı');
INSERT INTO districts
 VALUES ('806', '61', 'Çaykara');
INSERT INTO districts
 VALUES ('807', '61', 'Dernekpazarı');
INSERT INTO districts
 VALUES ('808', '61', 'Düzköy');
INSERT INTO districts
 VALUES ('809', '61', 'Hayrat');
INSERT INTO districts
 VALUES ('810', '61', 'Köprübaşı');
INSERT INTO districts
 VALUES ('811', '61', 'Maçka');
INSERT INTO districts
 VALUES ('812', '61', 'Of');
INSERT INTO districts
 VALUES ('813', '61', 'Sürmene');
INSERT INTO districts
 VALUES ('814', '61', 'Şalpazarı');
INSERT INTO districts
 VALUES ('815', '61', 'Tonya');
INSERT INTO districts
 VALUES ('816', '61', 'Trabzon');
INSERT INTO districts
 VALUES ('817', '61', 'Vakfıkebir');
INSERT INTO districts
 VALUES ('818', '61', 'Yomra');
INSERT INTO districts
 VALUES ('819', '62', 'Çemişgezek');
INSERT INTO districts
 VALUES ('820', '62', 'Hozat');
INSERT INTO districts
 VALUES ('821', '62', 'Mazgirt');
INSERT INTO districts
 VALUES ('822', '62', 'Nazımiye');
INSERT INTO districts
 VALUES ('823', '62', 'Ovacık');
INSERT INTO districts
 VALUES ('824', '62', 'Pertek');
INSERT INTO districts
 VALUES ('825', '62', 'Pülümür');
INSERT INTO districts
 VALUES ('826', '62', 'Tunceli');
INSERT INTO districts
 VALUES ('827', '63', 'Akçakale');
INSERT INTO districts
 VALUES ('828', '63', 'Birecik');
INSERT INTO districts
 VALUES ('829', '63', 'Bozova');
INSERT INTO districts
 VALUES ('830', '63', 'Ceylanpınar');
INSERT INTO districts
 VALUES ('831', '63', 'Halfeti');
INSERT INTO districts
 VALUES ('832', '63', 'Harran');
INSERT INTO districts
 VALUES ('833', '63', 'Hilvan');
INSERT INTO districts
 VALUES ('834', '63', 'Siverek');
INSERT INTO districts
 VALUES ('835', '63', 'Suruç');
INSERT INTO districts
 VALUES ('836', '63', 'Şanlıurfa');
INSERT INTO districts
 VALUES ('837', '63', 'Viranşehir');
INSERT INTO districts
 VALUES ('838', '64', 'Banaz');
INSERT INTO districts
 VALUES ('839', '64', 'Eşme');
INSERT INTO districts
 VALUES ('840', '64', 'Karahallı');
INSERT INTO districts
 VALUES ('841', '64', 'Sivaslı');
INSERT INTO districts
 VALUES ('842', '64', 'Ulubey');
INSERT INTO districts
 VALUES ('843', '64', 'Uşak');
INSERT INTO districts
 VALUES ('844', '65', 'Bahçesaray');
INSERT INTO districts
 VALUES ('845', '65', 'Başkale');
INSERT INTO districts
 VALUES ('846', '65', 'Çaldıran');
INSERT INTO districts
 VALUES ('847', '65', 'Çatak');
INSERT INTO districts
 VALUES ('848', '65', 'Edremit(Gümüşdere)');
INSERT INTO districts
 VALUES ('849', '65', 'Erciş');
INSERT INTO districts
 VALUES ('850', '65', 'Gevaş');
INSERT INTO districts
 VALUES ('851', '65', 'Gürpınar');
INSERT INTO districts
 VALUES ('852', '65', 'Muradiye');
INSERT INTO districts
 VALUES ('853', '65', 'Özalp');
INSERT INTO districts
 VALUES ('854', '65', 'Saray');
INSERT INTO districts
 VALUES ('855', '65', 'Van');
INSERT INTO districts
 VALUES ('856', '66', 'Akdağmadeni');
INSERT INTO districts
 VALUES ('857', '66', 'Aydıncık');
INSERT INTO districts
 VALUES ('858', '66', 'Boğazlıyan');
INSERT INTO districts
 VALUES ('859', '66', 'Çandır');
INSERT INTO districts
 VALUES ('860', '66', 'Çayıralan');
INSERT INTO districts
 VALUES ('861', '66', 'Çekerek');
INSERT INTO districts
 VALUES ('862', '66', 'Kadışehri');
INSERT INTO districts
 VALUES ('863', '66', 'Saraykent');
INSERT INTO districts
 VALUES ('864', '66', 'Sarıkaya');
INSERT INTO districts
 VALUES ('865', '66', 'Sorgun');
INSERT INTO districts
 VALUES ('866', '66', 'Şefaatli');
INSERT INTO districts
 VALUES ('867', '66', 'Yenifakılı');
INSERT INTO districts
 VALUES ('868', '66', 'Yerköy');
INSERT INTO districts
 VALUES ('869', '66', 'Yozgat');
INSERT INTO districts
 VALUES ('870', '67', 'Alaplı');
INSERT INTO districts
 VALUES ('871', '67', 'Çaycuma');
INSERT INTO districts
 VALUES ('872', '67', 'Devrek');
INSERT INTO districts
 VALUES ('873', '67', 'Gökçebey');
INSERT INTO districts
 VALUES ('874', '67', 'Karadenizereğli');
INSERT INTO districts
 VALUES ('875', '67', 'Zonguldak');
INSERT INTO districts
 VALUES ('876', '68', 'Ağaçören');
INSERT INTO districts
 VALUES ('877', '68', 'Aksaray');
INSERT INTO districts
 VALUES ('878', '68', 'Eskil');
INSERT INTO districts
 VALUES ('879', '68', 'Gülağaç(Ağaçlı)');
INSERT INTO districts
 VALUES ('880', '68', 'Güzelyurt');
INSERT INTO districts
 VALUES ('881', '68', 'Ortaköy');
INSERT INTO districts
 VALUES ('882', '68', 'Sarıyahşi');
INSERT INTO districts
 VALUES ('883', '69', 'Aydıntepe');
INSERT INTO districts
 VALUES ('884', '69', 'Bayburt');
INSERT INTO districts
 VALUES ('885', '69', 'Demirözü');
INSERT INTO districts
 VALUES ('886', '70', 'Ayrancı');
INSERT INTO districts
 VALUES ('887', '70', 'Başyayla');
INSERT INTO districts
 VALUES ('888', '70', 'Ermenek');
INSERT INTO districts
 VALUES ('889', '70', 'Karaman');
INSERT INTO districts
 VALUES ('890', '70', 'Kazımkarabekir');
INSERT INTO districts
 VALUES ('891', '70', 'Sarıveliler');
INSERT INTO districts
 VALUES ('892', '71', 'Bahşili');
INSERT INTO districts
 VALUES ('893', '71', 'Balışeyh');
INSERT INTO districts
 VALUES ('894', '71', 'Çelebi');
INSERT INTO districts
 VALUES ('895', '71', 'Delice');
INSERT INTO districts
 VALUES ('896', '71', 'Karakeçili');
INSERT INTO districts
 VALUES ('897', '71', 'Keskin');
INSERT INTO districts
 VALUES ('898', '71', 'Kırıkkale');
INSERT INTO districts
 VALUES ('899', '71', 'Sulakyurt');
INSERT INTO districts
 VALUES ('900', '71', 'Yahşihan');
INSERT INTO districts
 VALUES ('901', '72', 'Batman');
INSERT INTO districts
 VALUES ('902', '72', 'Beşiri');
INSERT INTO districts
 VALUES ('903', '72', 'Gercüş');
INSERT INTO districts
 VALUES ('904', '72', 'Hasankeyf');
INSERT INTO districts
 VALUES ('905', '72', 'Kozluk');
INSERT INTO districts
 VALUES ('906', '72', 'Sason');
INSERT INTO districts
 VALUES ('907', '73', 'Beytüşşebap');
INSERT INTO districts
 VALUES ('908', '73', 'Cizre');
INSERT INTO districts
 VALUES ('909', '73', 'Güçlükonak');
INSERT INTO districts
 VALUES ('910', '73', 'İdil');
INSERT INTO districts
 VALUES ('911', '73', 'Silopi');
INSERT INTO districts
 VALUES ('912', '73', 'Şırnak');
INSERT INTO districts
 VALUES ('913', '73', 'Uludere');
INSERT INTO districts
 VALUES ('914', '74', 'Amasra');
INSERT INTO districts
 VALUES ('915', '74', 'Bartın');
INSERT INTO districts
 VALUES ('916', '74', 'Kurucaşile');
INSERT INTO districts
 VALUES ('917', '74', 'Ulus');
INSERT INTO districts
 VALUES ('918', '75', 'Ardahan');
INSERT INTO districts
 VALUES ('919', '75', 'Çıldır');
INSERT INTO districts
 VALUES ('920', '75', 'Damal');
INSERT INTO districts
 VALUES ('921', '75', 'Göle');
INSERT INTO districts
 VALUES ('922', '75', 'Hanak');
INSERT INTO districts
 VALUES ('923', '75', 'Posof');
INSERT INTO districts
 VALUES ('924', '76', 'Aralık');
INSERT INTO districts
 VALUES ('925', '76', 'Iğdır');
INSERT INTO districts
 VALUES ('926', '76', 'Karakoyunlu');
INSERT INTO districts
 VALUES ('927', '76', 'Tuzluca');
INSERT INTO districts
 VALUES ('928', '77', 'Altınova');
INSERT INTO districts
 VALUES ('929', '77', 'Armutlu');
INSERT INTO districts
 VALUES ('930', '77', 'Çınarcık');
INSERT INTO districts
 VALUES ('931', '77', 'Çiftlikköy');
INSERT INTO districts
 VALUES ('932', '77', 'Termal');
INSERT INTO districts
 VALUES ('933', '77', 'Yalova');
INSERT INTO districts
 VALUES ('934', '78', 'Eflani');
INSERT INTO districts
 VALUES ('935', '78', 'Eskipazar');
INSERT INTO districts
 VALUES ('936', '78', 'Karabük');
INSERT INTO districts
 VALUES ('937', '78', 'Ovacık');
INSERT INTO districts
 VALUES ('938', '78', 'Safranbolu');
INSERT INTO districts
 VALUES ('939', '78', 'Yenice');
INSERT INTO districts
 VALUES ('940', '79', 'Elbeyli');
INSERT INTO districts
 VALUES ('941', '79', 'Kilis');
INSERT INTO districts
 VALUES ('942', '79', 'Musabeyli');
INSERT INTO districts
 VALUES ('943', '79', 'Polateli');
INSERT INTO districts
 VALUES ('944', '80', 'Bahçe');
INSERT INTO districts
 VALUES ('945', '80', 'Düziçi');
INSERT INTO districts
 VALUES ('946', '80', 'Hasanbeyli');
INSERT INTO districts
 VALUES ('947', '80', 'Kadirli');
INSERT INTO districts
 VALUES ('948', '80', 'Osmaniye');
INSERT INTO districts
 VALUES ('949', '80', 'Sumbas');
INSERT INTO districts
 VALUES ('950', '80', 'Toprakkale');
INSERT INTO districts
 VALUES ('951', '81', 'Akçakoca');
INSERT INTO districts
 VALUES ('952', '81', 'Cumayeri');
INSERT INTO districts
 VALUES ('953', '81', 'Çilimli');
INSERT INTO districts
 VALUES ('954', '81', 'Düzce');
INSERT INTO districts
 VALUES ('955', '81', 'Gölyaka');
INSERT INTO districts
 VALUES ('956', '81', 'Gümüşova');
INSERT INTO districts
 VALUES ('957', '81', 'Kaynaşlı');
INSERT INTO districts
 VALUES ('958', '81', 'Yığılca');


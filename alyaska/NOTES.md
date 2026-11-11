# NOTES — «Что если бы Россия не продала Аляску?» (канал «Другая История»)

Длительность: **10:11** (18330 кадров, 30 fps, 1920×1080).
Сборка: `npm run render` → `out/alyaska.mp4`, затем `scripts/master_audio.sh` (громкость −14 LUFS для YouTube).

## 1. Озвучка
- ElevenLabs, модель `eleven_v4`, голос **«Aleksandr — Documentary Narrator»** (`JMT0QtVym2S8gHCkBqMp`).
  Голос подобран под референс-видео пользователя: из голосов, доступных в рабочем пространстве,
  он ближе всего по высоте (медиана 124 Гц против 122 Гц у референса) и тембру (MFCC cos 0,985).
  **Это не клон голоса из референса** — коннектор ElevenLabs в этой сессии не умеет клонировать голоса.
  Если нужен точный голос из видео, сделайте Instant Voice Clone в ElevenLabs и перегенерируйте 10 файлов
  `public/audio/narration/sNN.mp3` по тексту из `src/data/script.txt` (тайминги — см. п. 2).
- В тексте для синтеза числа записаны словами (чтобы правильно склонялись), в субтитрах — цифрами.
  Разметка: `{1867|тысяча восемьсот шестьдесят седьмом}` в `src/data/script.txt`.
- Озвучка синтетическая → в YouTube отметить «Изменённый или синтетический контент».

## 2. Субтитры
- Словные тайминги: транскрибация ElevenLabs Scribe v1 каждого файла озвучки → `src/data/transcripts_raw.json`.
- `scripts/align.py` сопоставляет распознанные слова со сценарием (100 % слов совпали) → `src/data/captions.json`.
- `scripts/build_timeline.py` строит таймлайн сцен и `out/alyaska.srt` (до 2 строк × 42 символа).
- После замены озвучки: перетранскрибировать → `align.py` → `build_timeline.py`.

## 3. Музыка (нужна атрибуция в описании!)
Все треки — **Kevin MacLeod (incompetech.com), лицензия CC BY 4.0**, без вокала:
| Трек | Где | Ссылка |
|---|---|---|
| Dreams Become Real | сцены 1–4 (реальность) | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500027 |
| Americana | сцены 5–7 (альтернатива) | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1200092 |
| Immersed | сцены 8–11 | https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1600010 |

Сведение: музыка на −22 дБ относительно голоса под речью (голос −20,6 LUFS), +10 дБ в паузах (автоматический ducking
по словным таймингам), плавное нарастание в начале (2 с) и затухание в конце (5 с), кроссфейды 1 с между треками.
Звуки whoosh (переходы) и щелчок (появление фото) синтезированы в ffmpeg (собственные, без лицензии).
Pixabay Music был недоступен из среды (403), поэтому выбран Incompetech.

## 4. Использованные изображения (30 шт.)
Все — Wikimedia Commons, общественное достояние или свободные лицензии. Скачаны стандартные превью 960/1280 px
(оригиналы Wikimedia отдавал с ошибкой 429). Подпись источника — на каждой фото-карточке.
| Файл | Что на фото | Автор | Дата | Лицензия | Сцены | Источник |
|---|---|---|---|---|---|---|
| `alexander2.jpg` | Император Александр II, ок. 1870 | Library of Congress (PPOC), фотограф неизвестен | ок. 1870 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AAlexander_II%2C_Emperor_of_Russia%2C_half-length_portrait%2C_seated%2C_facing_right_LCCN99615678.jpg) |
| `konstantin.jpg` | Вел. кн. Константин Николаевич | Franz Krüger | сер. XIX в. | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AKruger_Franz_-_Portrait_of_Grand_Duke_Konstantin_Nikolayevich.jpeg) |
| `stoeckl.jpg` | Эдуард Стекль, посланник России | Mathew B. Brady | 1855–1865 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AEduard_de_Stoeckl.jpg) |
| `seward.jpg` | Госсекретарь США Уильям Сьюард | Brady's National Photographic Portrait Galleries | 1860–1865 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3APortrait_of_William_H._Seward.jpg) |
| `baranov.jpg` | Александр Баранов | автор неизвестен | до 1819 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3ABaranov_Alexandr.jpg) |
| `treaty.jpg` | Договор об уступке Аляски, 1867 | U.S. National Archives | 1867 | Public domain | s03,s04 | [Commons](https://commons.wikimedia.org/wiki/File%3AThe_Russian_exchange_copy_of_the_Treaty_of_Cession.jpg) |
| `check.jpg` | Чек казначейства США на $7,2 млн, 1868 | U.S. Treasury / National Archives | 1868 | Public domain | s01,s04 | [Commons](https://commons.wikimedia.org/wiki/File%3AAlaska_Purchase_%28hi-res%29.jpg) |
| `leutze.jpg` | «Подписание договора о покупке Аляски». Э. Лойце, 1867 | Emanuel Leutze | 1867 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AAlaska_purchase.jpg) |
| `castlehill.jpg` | Ново-Архангельск. Рисунок А. Постельса, 1827 | Alexander Postels | 1827 | Public domain | s01,s03 | [Commons](https://commons.wikimedia.org/wiki/File%3A1827_illustration_of_Castle_Hill_%28Old_Sitka%2C_Alaska%29_by_Postels.jpg) |
| `sitka1880.jpg` | Собор Св. Михаила, Ситка, 1880-е | Winter Photo Company (публ. A. Badlam) | 1880-е | Public domain | s01,s09 | [Commons](https://commons.wikimedia.org/wiki/File%3ASaint_Michaels%2C_Sitka%2C_1880s.jpg) |
| `sitkawater.jpg` | Ситка: «замок Баранова» и собор, 1880-е | автор неизвестен (Univ. of Washington) | 1880–1894 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AWaterfront_with_Baranof_Castle_at_left_side_and_Saint_Michael%27s_Cathedral_in_center%2C_Sitka%2C_Alaska%2C_1880s-1894_%28AL%2BCA_7381%29.jpg) |
| `racflag.jpg` | Флаг Русско-американской компании, 1806 | автор неизвестен | 1806 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3AFlag_of_the_Russian-American_Company%2C_1806.tiff) |
| `fortross.png` | Форт-Росс. Рисунок О. Дюо-Сийи, 1828 | Auguste Duhaut-Cilly | 1828 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3ADuhaut-Cilly_-_View_of_Fort_Ross_%281828%29.png) |
| `petropavlovsk.jpg` | Оборона Петропавловска, 1854. А. Боголюбов | Алексей Боголюбов | до 1896 | Public domain | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3A%D0%9E%D0%B1%D0%BE%D1%80%D0%BE%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%BF%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D0%B0_%D0%BD%D0%B0_%D0%9A%D0%B0%D0%BC%D1%87%D0%B0%D1%82%D0%BA%D0%B5.jpg) |
| `seaotter.jpg` | Калан (морская выдра), современное фото | Mike Baird | 2007 | CC BY 2.0 | s03 | [Commons](https://commons.wikimedia.org/wiki/File%3ASea-otter-morro-bay_13.jpg) |
| `chilkoot.jpg` | Старатели на перевале Чилкут, 1898. Э. Хегг | Eric A. Hegg | 1898 | Public domain | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3ALine_of_Klondikers_ascending_Chilkoot_Pass%2C_Alaska%2C_1898_%28HEGG_37%29.jpeg) |
| `scales.jpg` | Подъём к перевалу Чилкут, 1898. Э. Хегг | Eric A. Hegg | 1898 | Public domain | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3AKlondikers_at_The_Scales%2C_ascending_the_Chilkoot_Pass%2C_Alaska%2C_1898_%28HEGG_725%29.jpeg) |
| `dawson.jpg` | Доусон, Юкон, 1899. Э. Хегг | Eric A. Hegg | 1899 | Public domain | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3ADawson_City_-_1899.jpg) |
| `anchorage1915.jpg` | Палаточный Анкоридж, июль 1915 | Alberta Pyatt | 1915 | Public domain | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3AAnchorage_Alaska_1_July_1915.jpg) |
| `railroad.jpg` | Строительство Аляскинской железной дороги, 1916 | Phinney S. Hunt | 1916 | Public domain | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3AConstruction_of_second_Alaska_Railroad_bridge_from_Anchorage%2C_Alaska%2C_September_7%2C_1916_%28AL%2BCA_5370%29.jpg) |
| `pipeline.jpg` | Трансаляскинский нефтепровод, 2005 | Luca Galuzzi | 2005 | CC BY-SA 2.5 | s01,s07 | [Commons](https://commons.wikimedia.org/wiki/File%3ATrans-Alaska_Pipeline_System_Luca_Galuzzi_2005.jpg) |
| `pipeline2.jpg` | Нефтепровод на опорах, 2016 | Arthur T. LaBar | 2016 | CC BY 2.0 | s07 | [Commons](https://commons.wikimedia.org/wiki/File%3ATrans-Alaska_Pipeline_segment_1.jpg) |
| `laddfield.png` | Самолёты ленд-лиза на Ладд-Филд, Фэрбанкс | Kate Kennedy Collection | 1945 | Public domain | s08 | [Commons](https://commons.wikimedia.org/wiki/File%3ALend-Lease_ladd_field.png) |
| `diomede.jpg` | Острова Диомида, снимок со спутника, 2000 | NASA/METI/AIST/Japan Space Systems, ASTER Science Team | 2000 | Public domain | s08 | [Commons](https://commons.wikimedia.org/wiki/File%3ADiomede_Islands%2C_Bering_Strait_%28ASTER%29.jpg) |
| `veniaminov.png` | Свт. Иннокентий (Иоанн Вениаминов) | автор неизвестен | 1840–1868 | Public domain | s09 | [Commons](https://commons.wikimedia.org/wiki/File%3AInnocent_of_Alaska.png) |
| `unalaska.jpg` | Церковь Вознесения Господня, Уналашка, 1984 | Jet Lowe (HABS) | 1984 | Public domain | s09 | [Commons](https://commons.wikimedia.org/wiki/File%3AHoly_Ascension_Orthodox_church_%28Unalaska%29.jpg) |
| `unalaskaicon.jpg` | Иконостас церкви Вознесения, Уналашка | Jet Lowe (HABS) | 1984 | Public domain | s09 | [Commons](https://commons.wikimedia.org/wiki/File%3AICONOSTAS_Holy_Ascension_Russian_Orthodox_Church_Unalaska_Island.jpg) |
| `wonderlake.jpg` | Денали и озеро Уандер, 2010 | Denali National Park and Preserve (NPS) | 2010 | Public domain | s09,s10 | [Commons](https://commons.wikimedia.org/wiki/File%3AWonder_Lake_and_Denali.jpg) |
| `chukotka.jpg` | Золотой хребет, Южная Чукотка, 2018 | Al chukotka | 2018 | CC BY-SA 4.0 | s08,s09 | [Commons](https://commons.wikimedia.org/wiki/File%3A%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9_%D1%85%D1%80%D0%B5%D0%B1%D0%B5%D1%82%2C_%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F_%D0%A7%D1%83%D0%BA%D0%BE%D1%82%D0%BA%D0%B0.jpg) |
| `denaliriver.jpg` | Река Савидж, Денали, 2017 | Diego Delso | 2017 | CC BY-SA 4.0 | s10 | [Commons](https://commons.wikimedia.org/wiki/File%3AR%C3%ADo_Savage%2C_Parque_nacional_y_reserva_Denali%2C_Alaska%2C_Estados_Unidos%2C_2017-08-29%2C_DD_95.jpg) |

Не найдено / не использовано:
- Фото или картина церемонии передачи в Ситке 18.10.1867 с проверенной лицензией — не нашлось; показана анимированная карта.
- Портрет Г. Шелихова, фото коренных жителей (алеуты, тлинкиты) — не скачивались из-за лимитов Wikimedia; при желании добавить вручную
  (кандидаты: категории Commons «Aleut people», «Tlingit people», фото Э. Кёртиса — PD).
- Изображения альтернативных событий не существуют: вместо них — векторные карты, графики и макет газеты с пометкой «реконструкция».

## 5. Карты
- Векторные (SVG): d3-geo `geoAzimuthalEqualArea` с центром на Беринговом проливе, данные world-atlas (Natural Earth 1:50m,
  для крупного плана пролива — 1:10m). Границы 2 px, non-scaling-stroke → резкие при любом зуме.
- Аляска вырезана из полигона США (полигоны западнее 129° з. д. и севернее 50° с. ш.).
- **Границы 1867 года — схематично**: используются современные контуры (граница Аляски и Канады окончательно
  определена в 1903 г.). На экране — пометка «схематично» / «схема».
- Маршруты (Беринг–Чириков, Чилкут, нефтепровод, АЛСИБ) — упрощённые ломаные, помечены «схематично».

## 6. Факты и цифры — проверить по источникам
| Утверждение в видео | Источник для проверки |
|---|---|
| Договор подписан 30 марта 1867 (18 марта ст. ст.), цена 7,2 млн долл. | Текст договора, NARA: https://www.archives.gov/milestone-documents/check-for-the-purchase-of-alaska |
| «Меньше двух центов за акр» (~1,9 цента) | Office of the Historian: https://history.state.gov/milestones/1866-1898/alaska-purchase |
| Сенат одобрил договор в апреле 1867 (9 апреля) | там же |
| Передача в Ситке 18 октября 1867 | там же; Википедия «Продажа Аляски» |
| Палата представителей одобрила выплату летом 1868, чек от 1 августа 1868 | NARA, чек казначейства |
| Экспедиция Беринга и Чирикова — 1741 | ru.wikipedia.org/wiki/Вторая_Камчатская_экспедиция |
| Шелихов, Кадьяк — 1784 (Гавань Трёх Святителей) | ru.wikipedia.org/wiki/Шелихов,_Григорий_Иванович |
| РАК учреждена Павлом I в 1799 | ru.wikipedia.org/wiki/Российско-американская_компания |
| Тлинкиты уничтожили крепость на Ситке — 1802; Баранов вернулся — 1804 | ru.wikipedia.org/wiki/Битва_при_Ситке |
| Форт-Росс — 1812 | ru.wikipedia.org/wiki/Форт-Росс |
| Русских в колонии — несколько сотен, не более ~800; ~10 000 коренных жителей под управлением компании | оценки разнятся; см. Р. Пирс, А. Петров «Русская Америка» |
| Оборона Петропавловска — 1854 | ru.wikipedia.org/wiki/Петропавловская_оборона |
| Предложение продажи — вел. кн. Константин Николаевич (1857); особое совещание — декабрь 1866 | ru.wikipedia.org/wiki/Продажа_Аляски |
| Миф об аренде на 99 лет и Екатерине II (умерла 1796) | там же, раздел о мифах |
| Клондайк — 1896, Канада; ~100 000 отправились, 30–40 тыс. дошли | Parks Canada; en.wikipedia.org/wiki/Klondike_Gold_Rush |
| Ном (1899), Фэрбанкс (1902) | en.wikipedia.org/wiki/Nome_Gold_Rush, Fairbanks |
| Прудо-Бей — открытие 1968; нефтепровод ~1287 км, закончен 1977 | alyeska-pipe.com; en.wikipedia.org/wiki/Trans-Alaska_Pipeline_System |
| Доминион Канада — 1867 | en.wikipedia.org/wiki/Canadian_Confederation |
| Интервенция японских и американских войск на Дальнем Востоке — 1918 | ru.wikipedia.org/wiki/Японская_интервенция_в_Сибирь |
| АЛСИБ: ~8000 самолётов (часто называют 7900+) | ru.wikipedia.org/wiki/Алсиб |
| Большой и Малый Диомид — ~3,8 км | ru.wikipedia.org/wiki/Острова_Диомида |
| Собор Св. Михаила (Ситка), церковь Вознесения (Уналашка) | NPS, HABS |
| Иоанн Вениаминов: алеутская письменность (с И. Паньковым), перевод Евангелия от Матфея | ru.wikipedia.org/wiki/Иннокентий_(Вениаминов) |

## 7. Допущения и что заменить вручную
- Голос — подобранный, не клонированный (см. п. 1).
- Цифры по Клондайку и численности населения — округлённые оценки, на экране помечены «оценки разнятся».
- Макет газеты «Ново-Архангельскія Вѣдомости» — вымышленный, подписан «реконструкция · вымышленная газета».
- Три сценария в ветке 1, карта «граница СССР и Канады?» — схемы-предположения, подписаны.
- Цитат исторических лиц в видео нет.
- В YouTube отметить «Изменённый или синтетический контент»: синтетическая озвучка, схематичные карты и вымышленная газета.

## 8. Описание для YouTube

**Заголовок:** Что если бы Россия НЕ продала Аляску? | Другая История

**Описание:**
```
Это альтернативная реконструкция, основанная на исторических фактах.

В 1867 году Россия продала Аляску США за 7,2 млн долларов — меньше двух центов за акр. Была ли это ошибка?
Разбираем, как всё было на самом деле, развенчиваем мифы и проверяем четыре ветки альтернативной истории:
смогла бы Россия удержать Аляску, что стало бы с золотом и нефтью, как изменился бы XX век и судьба людей.

Таймкоды:
0:00 Вступление
0:35 Как это было на самом деле
3:04 Мифы о продаже Аляски
3:59 Точка развилки
4:35 Ветка 1: удержала бы Россия Аляску?
5:51 Ветка 2: золото и нефть
7:11 Ветка 3: XX век
8:22 Ветка 4: люди и культура
9:13 Итог
9:50 Концовка

Важно: альтернативные сценарии — предположения, а не факты. Карты 1867 года схематичны.
Озвучка синтезирована (ElevenLabs).

Музыка:
«Dreams Become Real», «Americana», «Immersed» — Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Изображения (Wikimedia Commons, общественное достояние / свободные лицензии):
— Император Александр II, ок. 1870 — Library of Congress (PPOC), фотограф неизвестен, Public domain: https://commons.wikimedia.org/wiki/File%3AAlexander_II%2C_Emperor_of_Russia%2C_half-length_portrait%2C_seated%2C_facing_right_LCCN99615678.jpg
— Вел. кн. Константин Николаевич — Franz Krüger, Public domain: https://commons.wikimedia.org/wiki/File%3AKruger_Franz_-_Portrait_of_Grand_Duke_Konstantin_Nikolayevich.jpeg
— Эдуард Стекль, посланник России — Mathew B. Brady, Public domain: https://commons.wikimedia.org/wiki/File%3AEduard_de_Stoeckl.jpg
— Госсекретарь США Уильям Сьюард — Brady's National Photographic Portrait Galleries, Public domain: https://commons.wikimedia.org/wiki/File%3APortrait_of_William_H._Seward.jpg
— Александр Баранов — автор неизвестен, Public domain: https://commons.wikimedia.org/wiki/File%3ABaranov_Alexandr.jpg
— Договор об уступке Аляски, 1867 — U.S. National Archives, Public domain: https://commons.wikimedia.org/wiki/File%3AThe_Russian_exchange_copy_of_the_Treaty_of_Cession.jpg
— Чек казначейства США на $7,2 млн, 1868 — U.S. Treasury / National Archives, Public domain: https://commons.wikimedia.org/wiki/File%3AAlaska_Purchase_%28hi-res%29.jpg
— «Подписание договора о покупке Аляски». Э. Лойце, 1867 — Emanuel Leutze, Public domain: https://commons.wikimedia.org/wiki/File%3AAlaska_purchase.jpg
— Ново-Архангельск. Рисунок А. Постельса, 1827 — Alexander Postels, Public domain: https://commons.wikimedia.org/wiki/File%3A1827_illustration_of_Castle_Hill_%28Old_Sitka%2C_Alaska%29_by_Postels.jpg
— Собор Св. Михаила, Ситка, 1880-е — Winter Photo Company (публ. A. Badlam), Public domain: https://commons.wikimedia.org/wiki/File%3ASaint_Michaels%2C_Sitka%2C_1880s.jpg
— Ситка: «замок Баранова» и собор, 1880-е — автор неизвестен (Univ. of Washington), Public domain: https://commons.wikimedia.org/wiki/File%3AWaterfront_with_Baranof_Castle_at_left_side_and_Saint_Michael%27s_Cathedral_in_center%2C_Sitka%2C_Alaska%2C_1880s-1894_%28AL%2BCA_7381%29.jpg
— Флаг Русско-американской компании, 1806 — автор неизвестен, Public domain: https://commons.wikimedia.org/wiki/File%3AFlag_of_the_Russian-American_Company%2C_1806.tiff
— Форт-Росс. Рисунок О. Дюо-Сийи, 1828 — Auguste Duhaut-Cilly, Public domain: https://commons.wikimedia.org/wiki/File%3ADuhaut-Cilly_-_View_of_Fort_Ross_%281828%29.png
— Оборона Петропавловска, 1854. А. Боголюбов — Алексей Боголюбов, Public domain: https://commons.wikimedia.org/wiki/File%3A%D0%9E%D0%B1%D0%BE%D1%80%D0%BE%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%BF%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D0%B0_%D0%BD%D0%B0_%D0%9A%D0%B0%D0%BC%D1%87%D0%B0%D1%82%D0%BA%D0%B5.jpg
— Калан (морская выдра), современное фото — Mike Baird, CC BY 2.0: https://commons.wikimedia.org/wiki/File%3ASea-otter-morro-bay_13.jpg
— Старатели на перевале Чилкут, 1898. Э. Хегг — Eric A. Hegg, Public domain: https://commons.wikimedia.org/wiki/File%3ALine_of_Klondikers_ascending_Chilkoot_Pass%2C_Alaska%2C_1898_%28HEGG_37%29.jpeg
— Подъём к перевалу Чилкут, 1898. Э. Хегг — Eric A. Hegg, Public domain: https://commons.wikimedia.org/wiki/File%3AKlondikers_at_The_Scales%2C_ascending_the_Chilkoot_Pass%2C_Alaska%2C_1898_%28HEGG_725%29.jpeg
— Доусон, Юкон, 1899. Э. Хегг — Eric A. Hegg, Public domain: https://commons.wikimedia.org/wiki/File%3ADawson_City_-_1899.jpg
— Палаточный Анкоридж, июль 1915 — Alberta Pyatt, Public domain: https://commons.wikimedia.org/wiki/File%3AAnchorage_Alaska_1_July_1915.jpg
— Строительство Аляскинской железной дороги, 1916 — Phinney S. Hunt, Public domain: https://commons.wikimedia.org/wiki/File%3AConstruction_of_second_Alaska_Railroad_bridge_from_Anchorage%2C_Alaska%2C_September_7%2C_1916_%28AL%2BCA_5370%29.jpg
— Трансаляскинский нефтепровод, 2005 — Luca Galuzzi, CC BY-SA 2.5: https://commons.wikimedia.org/wiki/File%3ATrans-Alaska_Pipeline_System_Luca_Galuzzi_2005.jpg
— Нефтепровод на опорах, 2016 — Arthur T. LaBar, CC BY 2.0: https://commons.wikimedia.org/wiki/File%3ATrans-Alaska_Pipeline_segment_1.jpg
— Самолёты ленд-лиза на Ладд-Филд, Фэрбанкс — Kate Kennedy Collection, Public domain: https://commons.wikimedia.org/wiki/File%3ALend-Lease_ladd_field.png
— Острова Диомида, снимок со спутника, 2000 — NASA/METI/AIST/Japan Space Systems, ASTER Science Team, Public domain: https://commons.wikimedia.org/wiki/File%3ADiomede_Islands%2C_Bering_Strait_%28ASTER%29.jpg
— Свт. Иннокентий (Иоанн Вениаминов) — автор неизвестен, Public domain: https://commons.wikimedia.org/wiki/File%3AInnocent_of_Alaska.png
— Церковь Вознесения Господня, Уналашка, 1984 — Jet Lowe (HABS), Public domain: https://commons.wikimedia.org/wiki/File%3AHoly_Ascension_Orthodox_church_%28Unalaska%29.jpg
— Иконостас церкви Вознесения, Уналашка — Jet Lowe (HABS), Public domain: https://commons.wikimedia.org/wiki/File%3AICONOSTAS_Holy_Ascension_Russian_Orthodox_Church_Unalaska_Island.jpg
— Денали и озеро Уандер, 2010 — Denali National Park and Preserve (NPS), Public domain: https://commons.wikimedia.org/wiki/File%3AWonder_Lake_and_Denali.jpg
— Золотой хребет, Южная Чукотка, 2018 — Al chukotka, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File%3A%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9_%D1%85%D1%80%D0%B5%D0%B1%D0%B5%D1%82%2C_%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F_%D0%A7%D1%83%D0%BA%D0%BE%D1%82%D0%BA%D0%B0.jpg
— Река Савидж, Денали, 2017 — Diego Delso, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File%3AR%C3%ADo_Savage%2C_Parque_nacional_y_reserva_Denali%2C_Alaska%2C_Estados_Unidos%2C_2017-08-29%2C_DD_95.jpg

Карты: Natural Earth / world-atlas (общественное достояние).

Источники:
— Office of the Historian, U.S. Department of State: Purchase of Alaska, 1867
— National Archives (NARA): Treaty with Russia for the Purchase of Alaska; Check for the Purchase of Alaska
— Википедия: «Продажа Аляски», «Российско-американская компания», «Алсиб»

#Аляска #ДругаяИстория #альтернативнаяистория #история #РусскаяАмерика
```

**Теги:** Аляска, продажа Аляски, Русская Америка, альтернативная история, что если, Другая История, история России,
1867, Александр II, Сьюард, золотая лихорадка, Клондайк, ленд-лиз, Берингов пролив, холодная война

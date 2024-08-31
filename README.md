# EmailImport - приложение для импорта писем

Приложение подключается к почтовому серверу и получает все письма. Если письма ещё нет в базе данных, то оно туда сохраняется и отображается пользователю в веб-интерфейсе, подключаясь по вебсокету.
Для работы приложения, помимо установленных Python и Django, требуются запущенные сервера PostgreSQL и Redis.

### Установка
1. Склонировать репозиторий
```sh
git clone git@github.com:Shecspi/EmailImport.git && cd EmailImport
```
2. Внести изменения в файл настроек settings.py. Необходимо изменить следующие константы:
```sh
DATABASES - настройки сервера PostgreSQL
CHANNEL_LAYERS - настройки сервера Redis
```
3. Установить зависимости
```sh
poetry install
```
4. Сделать миграции
```sh
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```
5. В базе данных в таблицу Email внести один или более email-адресов, с которых нужно получить список писем. Помимо адреса нужно указать пароль и IMAP-сервер.
5. Запустить сервер
```sh
poetry run python manage.py manage.py runserver
```
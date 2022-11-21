# Дипломный проект "Backend-разработка на Node.js"

## Установка и запуск

Скачайте проект и перейдите в папку проекта:

```js
git clone https://github.com/netology-code/ndjs-diplom.git
cd ndjs-diplom
```

Создайте копию файла env, внесите в него переменные окружения:

```js
<!-- prettier-ignore -->
cp .env.example .env
```

Запустите приложение:

```js
docker-compose up -d --build
```

API будет доступен на порте 8080 хоста

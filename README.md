# Users App

Каталог пользователей на Angular 20 и [NG-ZORRO](https://ng.ant.design). Данные — [JSONPlaceholder](https://jsonplaceholder.typicode.com/users).

## Запуск

```bash
npm install
npm start
```

http://localhost:4200/users

## Сборка

```bash
npm run build
```

## Про данные API

Сервер не сохраняет POST/PUT/DELETE. Изменения пишутся в `localStorage` (`users-app-*`). Сброс: очистить Local Storage в DevTools.

## Маршруты

| Путь | Экран |
|------|--------|
| `/users` | Список, поиск, пагинация |
| `/users/new` | Создание |
| `/users/:id` | Карточка |
| `/users/:id/edit` | Редактирование |
# user_app

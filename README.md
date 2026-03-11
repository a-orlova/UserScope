## User Management Dashboard

https://user-dashboard-teal-five.vercel.app/

react-приложение для управления данными пользователей с интерактивной таблицей. пользователи могут просматривать, сортировать, выбирать, добавлять и удалять записи. приложение получает тестовые данные с dummyjson.com (https://dummyjson.com/docs) и сохраняет изменения локально через localStorage

стэк:
- React 18 (функциональные компоненты, хуки)
- CSS (модули, грид, флексбокс)
- Fetch API 
- localStorage

### функции
реализованные:
- таблица пользователей с колонками: имя, фамилия, отчество, возраст, пол, телефон, email, страна, город
- сортировка по клику на заголовок (по возрастанию, по убыванию, без сортировки)
- выбор строк через чекбоксы (индивидуально или сразу все)
- удаление выбранных пользователей (имитация делит-запросов, локальное обновление списка)
- добавление нового пользователя через модальное окно с формой (пост-запрос)
- детальный просмотр информации о пользователе при клике на строку (модальное окно с доп инфой)
- обработка ошибок и состояния загрузки.

в разработке (не задеплоены):
- пагинация
- все изменения сохраняются в localStorage и восстанавливаются после перезагрузки страницы
- drag-and-drop
- фильтрация
- ресайз колонок
- даркмод

<img width="2261" height="1355" alt="image" src="https://github.com/user-attachments/assets/fc53f506-154b-4d38-a4f6-e135fa00f319" />

<img width="1129" height="1022" alt="image" src="https://github.com/user-attachments/assets/b145b331-1c3a-4c5f-adef-77205871da02" />

<img width="2188" height="763" alt="image" src="https://github.com/user-attachments/assets/a2cde723-f110-4834-b3a7-7f9cd192b19d" />

<img width="1096" height="627" alt="image" src="https://github.com/user-attachments/assets/951d6f55-7d98-42e0-908c-5d1f168e18a1" />

<img width="995" height="1124" alt="image" src="https://github.com/user-attachments/assets/89a8074e-4d9b-4e6e-93f0-2e02f57110f7" />



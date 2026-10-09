# RealDeal

**RealDeal** — MVP для проверки подлинности сертификатов через SHA-256 и Solana.

> Докажи, что это настоящее.

Приложение не помещает персональные данные сертификата в блокчейн. Вместо этого оно создаёт SHA-256 отпечаток фиксированного набора полей и записывает его через Memo Program в Solana Devnet.

## Возможности

- выпуск сертификата на странице `/issue`;
- выбор частной или государственной организации;
- проверка сертификата на странице `/verify`;
- страница сертификата `/cert/[id]`;
- QR-код со ссылкой на сертификат;
- запись SHA-256 хэша в Solana Memo;
- подключение Phantom Wallet;
- баланс кошелька в SOL Devnet;
- реальные Devnet-платежи через `SystemProgram.transfer`;
- тестовая Demo Mode без серверного keypair;
- переключение русского и английского языков;
- cookie consent и страницы Privacy, Terms и License;
- анимация процесса `Data → SHA-256 → Memo → Real Deal`.

## Как работает проверка

1. Данные сертификата приводятся к стабильному порядку:
   `id`, `name`, `course`, `date`, `issuer`.
2. Из этого массива вычисляется SHA-256.
3. Хэш записывается в транзакцию Solana через Memo Program.
4. При проверке данные берутся из хранилища и хэш вычисляется повторно.
5. Хэш сравнивается с записью в Solana:
   - совпал — `Real Deal`;
   - не совпал или сертификат отсутствует — `Fake`.

## Технологии

- Next.js 14 App Router;
- React 18;
- TypeScript;
- `@solana/web3.js`;
- Phantom Wallet;
- Solana Devnet;
- Memo Program;
- `qrcode.react`;
- `lucide-react`.

## Запуск локально

Требования:

- Node.js 18.17 или новее;
- npm;
- Phantom Wallet для платежей и Memo-транзакций.

Установите зависимости:

```bash
npm install
```

Создайте `.env.local` на основе `.env.example`:

```bash
copy .env.example .env.local
```

Запустите dev-сервер:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `ISSUER_SECRET_KEY` | Массив байт серверного keypair эмитента. Если не задан, используется Demo Mode. |
| `NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS` | Devnet-адрес, который получает платежи. |
| `NEXT_PUBLIC_ISSUE_PRICE_SOL` | Стоимость выпуска сертификата в SOL. По умолчанию `0.25`. |
| `NEXT_PUBLIC_VERIFY_PRICE_SOL` | Стоимость проверки в SOL. По умолчанию `0.02`. |

Пример:

```env
ISSUER_SECRET_KEY=[...]
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=YourDevnetWalletAddress
NEXT_PUBLIC_ISSUE_PRICE_SOL=0.25
NEXT_PUBLIC_VERIFY_PRICE_SOL=0.02
```

Не добавляйте `.env.local` и секретный keypair в Git.

## Devnet и Phantom

Для тестирования:

1. Установите Phantom.
2. Переключите сеть Phantom на **Devnet**.
3. Получите тестовые SOL через [Solana Faucet](https://faucet.solana.com/).
4. Укажите адрес получателя в `NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS`.
5. Откройте приложение в отдельной вкладке браузера.

Платежи и Memo-транзакции выполняются пользователем через Phantom. Комиссия сети также оплачивается кошельком пользователя.

## Demo Mode

Если `ISSUER_SECRET_KEY` не указан, выпуск не отправляет транзакцию эмитента в Solana, а создаёт явно помеченную demo-подпись. Это удобно для UI-демонстрации, но не является полноценным production-выпуском.

## Проверка проекта

```bash
npm run build
npm run lint
```

## Важные ограничения MVP

- Сейчас хранилище сертификатов — in-memory store. Данные теряются после перезапуска процесса и не подходят для масштабирования на Vercel.
- Перед production необходимо заменить его на Supabase, PostgreSQL или другое постоянное хранилище.
- API выпуска и проверки должен дополнительно проверять подтверждённую платежную транзакцию на сервере.
- Текущие цены в SOL фиксированные. Для коммерческого запуска нужен курс SOL/USD и серверная логика расчёта.
- Сейчас используется Solana Devnet. Для Mainnet нужно отдельно заменить RPC, адреса и провести аудит платежной логики.

## Структура

```text
app/
  page.tsx                 главная страница
  issue/page.tsx           выпуск сертификата
  verify/page.tsx          проверка сертификата
  cert/[id]/page.tsx       страница сертификата
  api/issue                API выпуска
  api/verify/[id]          API проверки
components/
  wallet-provider.tsx      Phantom, баланс и платежи
  language-provider.tsx    RU/EN локализация
  blockchain-visual.tsx    анимация блокчейн-потока
lib/
  solana.ts                SHA-256 и серверная Memo-запись
  db.ts                    текущее хранилище MVP
```

## Лицензия

Условия использования и информация о лицензии доступны в приложении на страницах `/terms` и `/license`.

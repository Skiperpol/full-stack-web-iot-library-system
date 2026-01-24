# Backend IoT Library System - NestJS

Backend API dla systemu bibliotecznego z obsługą kart RFID. Aplikacja umożliwia zarządzanie książkami, użytkownikami oraz wypożyczeniami z integracją urządzeń IoT poprzez protokół MQTT.

## 🚀 Technologie

- **NestJS** - Framework Node.js
- **TypeORM** - ORM do zarządzania bazą danych
- **SQLite** - Baza danych
- **MQTT** - Komunikacja z urządzeniami IoT (czytniki RFID)
- **WebSockets** - Komunikacja w czasie rzeczywistym
- **TypeScript** - Język programowania
- **Docker** - Konteneryzacja

## 📋 Wymagania

- Node.js >= 18.0.0
- npm >= 8.0.0
- Docker i Docker Compose (opcjonalnie, dla MQTT)

## 🔧 Instalacja

1. Sklonuj repozytorium i przejdź do katalogu backendu:
```bash
cd backend_nestjs
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe (opcjonalnie):
Utwórz plik `.env` w katalogu głównym:
```env
PORT=3000
DB_DATABASE=database.sqlite
MQTT_BROKER_URL=mqtt://localhost:1883
```

## 🏃 Uruchomienie

### Tryb deweloperski

```bash
npm run start:dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

### Tryb produkcyjny

```bash
npm run build
npm start
```

### Docker Compose

Aby uruchomić cały stack (backend + MQTT broker):
```bash
docker-compose up -d
```

## 📁 Struktura projektu

```
src/
├── entities/           # Encje TypeORM
│   ├── book.entity.ts
│   ├── client.entity.ts
│   ├── borrow.entity.ts
│   └── card.entity.ts
├── modules/            # Moduły NestJS
│   ├── book/          # Zarządzanie książkami
│   ├── client/        # Zarządzanie użytkownikami
│   ├── borrow/        # Zarządzanie wypożyczeniami
│   ├── card/          # Zarządzanie kartami RFID
│   └── rfid/          # Integracja z czytnikami RFID
├── mqtt/              # Serwis MQTT
├── gateway/           # WebSocket Gateway
├── app.module.ts      # Główny moduł aplikacji
└── main.ts            # Punkt wejścia aplikacji
```

## 🔌 API Endpoints

### Książki (`/books`)

- `GET /books` - Pobierz listę wszystkich książek
- `GET /books/:id` - Pobierz szczegóły książki
- `POST /books` - Utwórz nową książkę
- `PUT /books/:id` - Zaktualizuj książkę
- `DELETE /books/:id` - Usuń książkę

### Użytkownicy (`/clients`)

- `GET /clients` - Pobierz listę wszystkich użytkowników
- `GET /clients/:id` - Pobierz szczegóły użytkownika
- `POST /clients` - Utwórz nowego użytkownika
- `PUT /clients/:id` - Zaktualizuj użytkownika
- `DELETE /clients/:id` - Usuń użytkownika

### Wypożyczenia (`/borrows`)

- `GET /borrows` - Pobierz listę wypożyczeń
- `POST /borrows` - Utwórz nowe wypożyczenie
- `POST /borrows/:id/return` - Zwróć książkę

### RFID (`/rfid`)

- `POST /rfid/scan-client` - Skanuj kartę użytkownika
- `POST /rfid/scan-book` - Skanuj kartę książki
- `POST /rfid/register-client` - Zarejestruj nowego użytkownika z kartą RFID
- `POST /rfid/register-book` - Zarejestruj nową książkę z kartą RFID
- `POST /rfid/return-book` - Zwróć książkę przez skanowanie karty klienta, a następnie karty książki
- `POST /rfid/cancel-scan` - Anuluj aktualne skanowanie

## 🗄️ Baza danych

Aplikacja używa SQLite jako bazy danych. Plik bazy danych (`database.sqlite`) jest automatycznie tworzony przy pierwszym uruchomieniu.

### Automatyczne seedowanie

Przy pierwszym uruchomieniu aplikacja automatycznie tworzy przykładowe dane:
- 3 użytkowników (Alice, Bob, Carol)
- 3 książki (1984, Brave New World, Dune)
- 2 aktywne wypożyczenia

### Encje

- **Book** - Książki z kartami RFID
- **Client** - Użytkownicy biblioteki z kartami RFID
- **Borrow** - Wypożyczenia książek
- **Card** - Karty RFID

## 🔄 Integracja MQTT

Backend komunikuje się z urządzeniami IoT (czytniki RFID) poprzez protokół MQTT. Broker MQTT jest uruchamiany automatycznie przez Docker Compose.

### Tematy MQTT

- `rfid/scan` - Skanowanie kart RFID
- `rfid/register` - Rejestracja nowych kart
- `rfid/cancel` - Anulowanie skanowania

## 🌐 WebSocket Gateway

Aplikacja udostępnia WebSocket Gateway do komunikacji w czasie rzeczywistym z frontendem. Gateway emituje zdarzenia dotyczące operacji RFID.

## 🐳 Docker

### Build obrazu

```bash
docker build -t backend-iot-nestjs .
```

### Uruchomienie z Docker Compose

```bash
docker-compose up -d
```

### Logi

```bash
docker-compose logs -f backend
```

## 🛠️ Development

### Skrypty npm

- `npm run start:dev` - Uruchom w trybie deweloperskim z hot-reload
- `npm run build` - Zbuduj aplikację
- `npm start` - Uruchom w trybie produkcyjnym
- `npm run lint` - Uruchom linter

### Migracje bazy danych

```bash
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
```

## 🔒 CORS

Aplikacja ma włączone CORS dla frontendu działającego na `http://localhost:5173`. W produkcji należy zaktualizować konfigurację CORS w pliku `main.ts`.

## 📝 Uwagi

- Baza danych SQLite jest przechowywana lokalnie w pliku `database.sqlite`
- W trybie deweloperskim TypeORM automatycznie synchronizuje schemat bazy danych (`synchronize: true`)
- W produkcji należy wyłączyć `synchronize` i używać migracji

## 📄 Licencja

Projekt prywatny - część systemu bibliotecznego IoT.

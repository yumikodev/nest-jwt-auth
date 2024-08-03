# NestJS + JWT Authentication

## Description

This is a simple REST API with NestJS and [Json Web Tokens](https://jwt.io) to authentication and authorization.

## Installation

```bash
$ pnpm install
```

## Configuration

Create and `.env` file with your configuration:

```toml
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
```

## Prisma

This project use Prisma ORM with SQLite, you will need to create a migration with the following command.

```bash
$ pnpx prisma migrate dev --name init
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## License

This project is under the [MIT licensed](LICENSE).

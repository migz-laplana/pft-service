# pft-service

## Description

Backend API service for Physical Fitness Test (PFT) app.

## Dependencies

- Node.js 18
- Docker Desktop

## Tech Stack

- NestJS
- Supabase
- Kinde Auth API (M2M)

## Local Setup

1. Make sure to run this before running client apps (i.e. pft-web).
2. Install deps: `npm install`
3. Start local supabase instance -- With docker desktop open, init supabase local instance for the first time with `npx supabase init`
4. Ensure M2M Application is set up in Kinde instance. Learn more at [Kinde docs](https://docs.kinde.com/developer-tools/kinde-api/add-a-m2m-application-for-api-access/)
5. Create `.env` file at root directory and copy contents from `.env.example` file, then supply needed environment variables.
6. Start development server: `npm run start:dev`

### Notes

- after running `npx supabase init` for the first time, can just run `npx supabase start` the next times you need to start supabase local instance
- when done with local supabase instance, recommended to stop with `npx supabase stop`

## Key comamnds

Generate typescript types for supabase schema

```
npm run sb-gen-types
```

## Deployment

- ensure to create migration files before pushing to test/prod environments. Read more in [Supabase Docs](https://supabase.com/docs/guides/cli/managing-environments?queryGroups=environment&environment=production)
- automatic database schema pushing is set up in `.github` folder. Read [Supabase Docs](https://supabase.com/docs/guides/cli/managing-environments?queryGroups=environment&environment=production) for more info.

## Production

Build the application for production:

```bash
npm run build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

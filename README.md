## Clone this repository

```sh
git clone https://github.com/Frustration-Magazine/frustration.git
```

## Install dependencies

```sh
pnpm install --recursive
```

## Inject environment variables

We use [Infisical](https://infisical.com/) to facilitate secret injection, eliminating the need to handle multiple .env files.

[Follow this guide to install Infisical and learn more about it](https://infisical.com/docs/cli/overview)

Ask a project administrator for assistance in setting up local secrets injection.

```sh
infisical login
```

After making the environment variables available through Infisical, you can run any application in the project.

```sh
cd apps/web
pnpm run dev
```

If you want to run it with production build :

```sh
pnpm run start
```

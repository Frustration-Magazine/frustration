## Clone this repository

```sh
git clone https://github.com/Frustration-Magazine/frustration.git
```

## Install dependencies

```sh
pnpm install --recursive
```

or if you need to upgrade dependencies :

```sh
pnpm update --recursive
```

We recommend regularly checking for new versions of each third-party dependency in use and upgrading them according to project needs. Be cautious of new major releases, as they may introduce breaking changes.

You can check for available new versions with this command:

```sh
pnpm outdated --recursive
```

## Inject environment variables

We use [Infisical](https://infisical.com/) to facilitate secret injection, eliminating the need to handle multiple .env files.

[Follow this guide to install Infisical and learn more about it](https://infisical.com/docs/cli/overview)

Ask a project administrator for assistance in setting up local secrets injection.

```sh
infisical login
```

To log in, use the credentials stored in the password manager for the Frustration Google team account.

After making the environment variables available through Infisical, you can run any application in the project.

```sh
cd apps/web
pnpm run dev
```

> [!TIP]
> By default, when applications run locally, they connect to testing or development services. This setup prevents corruption of the production database and allows the use of Stripe test cards for fake payments in the testing environment.
> You may sometimes want to run your application locally while connecting it to the production database or live environment for Stripe. In that case, add `:prod` to the end of the development command, like this: `pnpm run dev:prod`.


If you want to run it with production build :

```sh
pnpm run start
```

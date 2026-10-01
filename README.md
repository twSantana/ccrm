# Influencer Hub

Influencer Hub is a CRM for managing influencers and campaigns, built with React, shadcn-admin-kit, and Supabase.

> **About this repository:** This repository is a copy and customized adaptation of the original project at [leldiss/crm](https://github.com/leldiss/crm). The original project and its authors retain their respective copyrights and license. This copy adds the customizations listed below.

https://github.com/user-attachments/assets/0d7554b5-49ef-41c6-bcc9-a76214fc5c99

This customized application is based on the open-source CRM linked above. The demo at https://marmelab.com/atomic-crm-demo is the upstream Atomic CRM demo, not a hosted version of this copy.

## Features

- 📇 **Organize Contacts**: Keep all your contacts in one easily accessible place.
- ⏰ **Create Tasks & Set Reminders**: Never miss a follow-up or deadline.
- 📝 **Take Notes**: Capture important details and insights effortlessly.
- ✉️ **Capture Emails**: CC the CRM to automatically save communications as notes.
- 📊 **Manage Deals**: Visualize and track your sales pipeline in a Kanban board.
- 🔄 **Import & Export Data**: Easily transfer contacts in and out of the system.
- 🔐 **Control Access**: Log in with Google, Azure, Keycloak, and Auth0.
- 📜 **Track Activity History**: View all interactions in aggregated activity logs.
- 🔗 **Integrate via API**: Connect seamlessly with other systems using our API.
- 🛠️ **Customize Everything**: Add custom fields, change the theme, and replace any component to fit your needs.
- 📣 **Manage Influencers and Campaigns**: Track influencer profiles, campaign performance, owners, and tags.

## Customizations in This Copy

This copy includes the following project-specific changes:

- The Influencer Hub includes influencer and campaign records, campaign stages, investment, sales, commission, ROI, and profit tracking.
- The Contas area stores Instagram handles and login emails; passwords are encrypted server-side and access is limited to administrators.
- Influencers support tags using the CRM tag records and can be assigned to a responsible user. By default, the creator is selected; authenticated users can see all influencers.
- Influencer creation returns to the list after a successful save; owner and tag details are available in influencer forms and views.
- The authentication screen supports public account registration. The first registered account is an administrator; accounts registered afterward are standard users. Signup errors display the message returned by Supabase.
- `supabase/setup.sql` sets up a new, empty Supabase project from the Dashboard SQL Editor. It creates the CRM schema, policies, views, auth triggers, storage bucket, and Influencer Hub tables. **Run it only once on a new project**, not on a database that already has this schema.
- `supabase/migrations/20260930160500_influencer_tags.sql` adds influencer tags to an existing project. Apply this migration to an already-configured Supabase database before using influencer tags.
- `supabase/migrations/20261001130000_social_accounts.sql` adds the protected Instagram accounts table. Edge Function access also requires the `ACCOUNT_ENCRYPTION_KEY` secret described below.

The Supabase secret/service-role key must never be used in the browser or committed to this repository. Configure only the project URL and publishable/anon key as frontend environment variables.

## Installation

To run Influencer Hub locally, you will need the following tools installed on your computer:

- Make
- Node 22 LTS
- Docker (required by Supabase)

Clone this customized copy:

```sh
git clone https://github.com/twSantana/ccrm.git
```

Install dependencies:

```sh
cd ccrm
make install
```

This installs the frontend and backend dependencies, including those needed for a local Supabase instance.

Once your app is configured, start the app locally with the following command:

```sh
make start
```

This starts the Vite dev server, local Supabase API, and a Postgres database (using Docker).

You can then access the app via [http://localhost:5173/](http://localhost:5173/). You will be prompted to create the first user.

If you need debug the backend, you can access the following services: 

- Supabase dashboard: [http://localhost:54323/](http://localhost:54323/)
- REST API: [http://127.0.0.1:54321](http://127.0.0.1:54321)
- Attachments storage: [http://localhost:54323/project/default/storage/buckets/attachments](http://localhost:54323/project/default/storage/buckets/attachments)
- Inbucket email testing service: [http://localhost:54324/](http://localhost:54324/)

## User Documentation

1. [User Management](./doc/src/content/docs/users/user-management.mdx)
2. [Importing And Exporting Data](./doc/src/content/docs/users/import-contacts.mdx)
3. [Inbound Email](./doc/src/content/docs/users/inbound-email.mdx)

## Deploying to Production

1. [Configuring Supabase](./doc/src/content/docs/developers/supabase-configuration.mdx)
2. [Configuring Inbound Email](./doc/src/content/docs/developers/inbound-email-configuration.mdx) *(optional)*
3. [Deployment](./doc/src/content/docs/developers/deploy.mdx)

### Deploying this copy to Vercel

In the Vercel project settings, configure these frontend environment variables for the relevant deployment environments:

```text
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-publishable-or-anon-key>
```

Enable email signups in the Supabase project's Authentication settings. Apply the database setup or migrations to the same Supabase project. Never set a Supabase secret/service-role key as a `VITE_` variable; Vite exposes `VITE_` variables in the browser bundle.

The Instagram accounts feature also requires a server-only encryption key in Supabase Functions secrets. Generate a 32-byte key and configure it on the linked Supabase project; keep a secure backup in a password manager and do not commit it. If this key is lost or changed, saved passwords cannot be decrypted:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
npx supabase secrets set ACCOUNT_ENCRYPTION_KEY="<generated-base64-key>"
```

For local development, put a separately generated key in the ignored `supabase/functions/.env.development` file:

```text
ACCOUNT_ENCRYPTION_KEY=<generated-base64-key>
```

Apply the database migration and deploy the `social-accounts` Edge Function after setting the remote secret. Only administrator accounts can access the Contas area. Profile photos are entered as HTTPS image URLs; Instagram does not expose a reliable public profile-photo lookup by handle alone.

## Customizing Influencer Hub

Influencer Hub is built on the Atomic CRM codebase. Customizing the application requires TypeScript and React programming skills. These upstream guides may help:

1. [Customizing the CRM](./doc/src/content/docs/developers/customizing.mdx)
2. [Creating Migrations](./doc/src/content/docs/developers/migrations.mdx) *(optional)*
3. [Using Fake Rest Data Provider for Development](./doc/src/content/docs/developers/data-providers.mdx) *(optional)*
4. [Architecture Decisions](./doc/src/content/docs/developers/architecture-choices.mdx) *(optional)*

## Testing Changes

This project contains unit tests. Run them with the following command:

```sh
make test
```

You can add your own unit tests powered by Jest anywhere in the `src` directory. The test files should be named `*.test.tsx` or `*.test.ts`.

## Registry

The upstream Atomic CRM components are published as a Shadcn Registry file:
- The `registry.json` file is automatically generated by the `bin/generate-registry.mjs` script as a pre-commit hook.
- The `http://marmelab.com/atomic-crm/r/atomic-crm.json` file is automatically published by the CI/CD pipeline

> [!WARNING]  
> If the `registry.json` misses some changes you made, you MUST update the `bin/generate-registry.mjs` to include those changes.

## License

This project is licensed under the MIT License, courtesy of [Marmelab](https://marmelab.com). See the [LICENSE.md](./LICENSE.md) file for details.

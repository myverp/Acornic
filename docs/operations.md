# Production operations

This guide covers the hosted Acornic Supabase project and Vercel deployment.
It never belongs in an automated workflow: backups contain user data and restore
commands can overwrite production.

## Monitoring

- Vercel Web Analytics collects anonymous visitor data after each deployment.
  Review the **Analytics** tab in the Acornic Vercel project.
- Inspect production application errors in the Vercel project's **Logs** tab.
  Failed deck, card, review, and account-creation actions write a structured,
  non-sensitive event there. The app does not log Supabase secrets or passwords.
- The `Production uptime` GitHub Actions workflow checks the public landing
  page and anonymous dashboard redirect every six hours. Run it manually from
  the repository's **Actions** tab after a release or incident. A failed run is
  the uptime alert; enable GitHub Actions notifications in the account settings
  if you want an email or web notification.

## Backup

The current Supabase Free plan has no downloadable automated database backups
or point-in-time recovery. Before every production migration and at a regular
cadence, create a logical database dump and store it encrypted outside this
repository:

```powershell
$backupPath = Join-Path $env:USERPROFILE "Acornic-backups\\acornic-$(Get-Date -Format yyyyMMdd-HHmmss).sql"
npx supabase db dump --linked --file $backupPath
```

Verify the command completed and that the backup file has a non-zero size. The
dump contains private learning data, so do not commit it, upload it to a public
location, or paste it into a ticket. The database dump does not include Storage
objects; Acornic does not currently use Storage. If Storage is introduced, add
a separate object-export procedure before relying on this guide.

## Restore

1. Stop write activity by temporarily rolling back the Vercel deployment.
2. Confirm the exact incident time, the chosen backup file, and the data-loss
   window with the project owner.
3. Restore only through the Supabase Dashboard's database tools or an approved
   `psql` procedure targeting the hosted project. This is destructive and must
   not be run without that confirmation.
4. Reapply any migrations made after the backup with `npx supabase db push`.
5. Run `npx supabase migration list --linked`, then the remote database lint
   and RLS tests. Finally, manually run the `Production uptime` workflow.

The Free plan has no point-in-time restore. A more precise or provider-managed
restore requires a paid Supabase plan and explicit approval; it is not part of
the current setup.

## Rollback

### Application rollback (Vercel)

1. Identify the last healthy production deployment in Vercel's **Deployments**
   tab.
2. Promote it with `npx vercel rollback <deployment-url> --scope romans-projects-dedca1a7`.
3. Run the `Production uptime` workflow and inspect Vercel Logs.
4. Revert the corresponding Git commit and push the corrective commit so the
   repository matches the live deployment.

### Database rollback (Supabase)

Migrations are append-only. For a non-destructive schema mistake, add a new
forward migration that restores the intended schema, then validate it locally
before pushing it. Do not delete or rewrite an applied migration. For accidental
data loss or a destructive migration, use the approved restore procedure above
after confirming the exact backup and impact.

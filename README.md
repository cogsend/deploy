# CogSend 1.15.0-rc.1, ready to deploy

This repository is [CogSend](https://github.com/cogsend/cogsend), a self-hosted social scheduler, prebuilt for one click. It is regenerated on every release; the source, issues and pull requests live in [cogsend/cogsend](https://github.com/cogsend/cogsend).

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cogsend/deploy)

## Deploying

1. Press the button and sign in to Cloudflare. Your account needs R2 enabled, which asks for a payment method even on the free tier.
2. When the form asks for `APP_ENCRYPTION_KEY`, generate one at [cogsend.com/key](https://cogsend.com/key/) and save a copy.
3. Open the Worker's URL when the build finishes, enter the same key, and create your account.

The full guide is at [cogsend.com/docs/deploy](https://cogsend.com/docs/deploy/).

## Updating

**Through GitHub (no Cloudflare token).** In CogSend, **Settings → Instance** links to this repository's **Update CogSend** Action. The first time, it opens GitHub with the Action's file filled in: commit it (the Deploy button cannot copy workflow files). Then run the Action: it checks the release's signature against every file, commits the release, and Workers Builds deploys it. Leave Workers Builds connected.

**From Settings, with a Cloudflare API token.** Also works, and does not change this repository. While Workers Builds is connected, a push to the older copy here is refused by its deploy script, so nothing rolls back by accident.

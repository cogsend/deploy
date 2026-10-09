# CogSend 1.13.0, ready to deploy

This repository is [CogSend](https://github.com/cogsend/cogsend), a self-hosted social scheduler, prebuilt for one click. It is regenerated on every release; the source, issues and pull requests live in [cogsend/cogsend](https://github.com/cogsend/cogsend).

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cogsend/deploy)

## Deploying

1. Press the button and sign in to Cloudflare. Your account needs R2 enabled, which asks for a payment method even on the free tier.
2. When the form asks for `APP_ENCRYPTION_KEY`, generate one at [cogsend.com/key](https://cogsend.com/key/) and save a copy.
3. Open the Worker's URL when the build finishes, enter the same key, and create your account.

The full guide is at [cogsend.com/docs/deploy](https://cogsend.com/docs/deploy/).

## Updating

Update from **Settings → Instance** in CogSend itself. Afterwards, disconnect this copy from Workers Builds (Workers & Pages → your Worker → Settings → Builds → Disconnect): while it is connected, a push to it would try to deploy the older release it holds, which its deploy script refuses.

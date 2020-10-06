# CM with Jenkins Runtime Action

## Config

### `.env`

```bash
# This file must not be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=

## additionally, put in all additional parameters
## Jenkins endpoint to call
JENKINS_WEBHOOK_URL=

## Adobe authentication info
ORGANIZATION_ID=
TECHNICAL_ACCOUNT_EMAIL=
CLIENT_ID=
CLIENT_SECRET=
META_SCOPE=
PRIVATE_KEY=
```

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

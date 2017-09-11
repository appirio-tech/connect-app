# Start tc-message-service

Follow ``tc-message-service/local/README.md`` to setup the Discourse and tc-message-service locally.

- Note the Discourse has some strict validation constraints and we can loose them for dev (For example by default Discourse has **mailinator.com** email domain in blacklist, but we'll use some test users which have **mailinator.com** email addresses).

```shell
# Disable the email domain blacklist by setting an empty string
curl -X PUT 'http://talk.topcoder-dev.com:3002/admin/site_settings/email_domains_blacklist?api_key=<api_key>&api_username=system' -H 'content-type: application/x-www-form-urlencoded' -d email_domains_blacklist=''

# Refer to tc-message-service/local/README.md for more commands to configure Discourse
......
```



- Note the jwt token got from accounts.topcoder-dev.com cannot be verified locally (not knowing its secret key), so we'll use a loose auth strategy which just decodes the token without verfiying its signature. Start the tc-message-server by prepending *TC_MESSAGE_SERVICE_AUTH_LOOSE=true*:

```shell
TC_MESSAGE_SERVICE_AUTH_LOOSE=true npm run start:dev
```

The message service will be started at 8001 port.



# Configure reference lookup

Login to postgres either by install psql locally, or entering the postgres docker container:

```shell
psql messages coder -h local.topcoder-dev.com
```

And execute the following statement:

```sql
INSERT INTO "referenceLookups" (reference, endpoint, "createdAt", "updatedAt") VALUES ('project', 'https://api.topcoder-dev.com/v4/projects/{id}', now(), now());
```



# Start connect-app

```shell
CONNECT_MESSAGE_API_URL=http://localhost:8001 npm start
```

The connect app will be started at 3000 port.
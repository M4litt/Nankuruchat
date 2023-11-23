# Nankuruback
by Kali <{@}>

### How to run:

 - Place "nkc-db-schema.sql" (or a different schema save) and "compose.yml" in the same directory.
 - In "directory/secrets/", create and define:
    - db_password.txt
    - jwt_secret.txt
 - Log in to GHRC with docker CLI
 - Run

        docker compose up

### Status:
- CDN-stable: **Merged**

### DONE
- User
    - get all
    - get by id
    - add [DEPRECATED - USE REGISTER]
    - delete
    - patch
    - register
    - login

- Server
    - get all
    - get by id
    - add 
    - delete 
    - patch 
    - get channels
    - get channel by id
    - add channel
    - get messages from channel
    - add message to channel
    - patch message
    - patch channel
    - delete message
    - delete channel
    - get users
    - get user by id
    - add user
    - remove user

- Channel
    - get all
    - get by id
    - add
    - delete
    - patch
    - get messages
    - get message by id
    - add message
    - patch message
    - delete message

- Message
    - get all
    - get by id
    - add
    - delete
    - patch


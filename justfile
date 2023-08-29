
[private]
list:
    @just --list

# run server tests
test:
    cd server && python3 -m unittest

# start the server
server:
    python3 server/main.py

# start the client
client:
    cd web-client && npm run start

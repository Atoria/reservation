Setup Configuration
===========================
Generate `config.json` from `example.config.json` in config directory.


Run project
-------------
Run `npm install`. To run migrations execute command `npm run migrate`. After this all migrations will be set.
To create initial user execute following command `node console/registerUser [firsname] [lastname] [email] [password]`. 
Returned token should be passed in Headers `Authentication: Bearer [token]`. Lastly execute `npm run start` to start project

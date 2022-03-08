Setup Configuration
===========================
Generate `config.json` from `example.config.json` in config directory.


Run project
-------------
Run `npm install`. To run migrations execute command `npm run migrate`. After this all migrations will be set.
To create initial user execute following command `node console/registerUser [firsname] [lastname] [email] [password]`. 
Returned token should be passed in Headers `Authentication: Bearer [token]`. Lastly execute `npm run start` to start project



Endpoints
===========================

GET
-------------
`/reservation` - Fetching reserved data

POST
-------------
`/reservation` - Reserving tickets

**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `ticket_ids` | required | array  | List of ticked IDs which should be reserved                                                                   |

`/payment` - Making payment for reservation

**Parameters**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `reservation_id` | required | integer  | ID of reservation                                                                   |




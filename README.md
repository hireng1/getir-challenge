## How to run the app:

1.  Copy the included `config.js.sample` to `config.js` with the connection string, name of the database and port (if required, otherwise the app runs on 3050)

2. Install node modules by running `npm install`

3. To run the app, use `npm start`

4. To run the test cases, use `npm test`

## API:

**Request**


Route: `/`
Method: `POST`
Body:

```json
{
  "startDate": "2016-11-22",
  "endDate": "2021-11-22",
  "minCount": 2500,
  "maxCount": 3000
}
```

**Response**

Status: `200`

```json
{
  "code": 0,
  "msg": "Success",
  "records": [
    {
        "key": "ibfRLaFT",
        "createdAt": "2016-12-25T16:43:27.909Z",
        "totalCount": 2892
    },
  ]
}
```


# Request bodies

Field names are exactly as the backend expects. Send JSON with `Content-Type: application/json`.
For updates, send the full object including its ID. Fetch the record first and change
only what the user asked.

## Parcel (create / update)
```json
{
  "parcelId": 0,
  "senderName": "string",
  "receiverName": "string",
  "destinationAddress": "string",
  "destinationPincode": "string",
  "parcelStatus": "string",
  "createdDate": "string (copy format from an existing parcel)",
  "customerId": 0,
  "totalPayment": 0.0,
  "routeId": 0
}
```
`parcelId` is assigned by the database on create; include it only on update.
`destinationPincode` drives clustering in the optimizer, so make sure it is set.

## Customer
```json
{ "customerId": 0, "firstName": "", "lastName": "", "phone": "", "email": "", "address": "", "password": "" }
```

## Employee
```json
{ "empId": 0, "firstName": "", "lastName": "", "email": "", "phone": "", "role": "", "department": "", "managerName": "" }
```

## Route
```json
{
  "routeId": 0, "name": "", "description": "", "pincode": "",
  "startLocation": "", "endLocation": "",
  "distance": 0.0, "totalDistance": 0.0, "estimatedTime": 0
}
```

## Tracking event
```json
{ "trackId": 0, "parcelId": 0, "empId": 0, "location": "", "status": "", "approvalStatus": "", "notes": "" }
```

## Delete bodies
| Entity | Body |
|---|---|
| parcel | `{"parcelId": 0}` |
| customer | `{"customerId": 0}` |
| employee | `{"empId": 0}` |
| route | `{"routeId": 0}` |
| tracking | `{"trackId": 0}` |

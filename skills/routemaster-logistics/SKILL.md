

# RouteMaster Logistics

RouteMaster is a delivery-operations system: customers send **parcels**, parcels are
assigned to **routes**, **employees** handle them, and **tracking** records log each
status change. This skill tells you how to operate it through the RouteMaster gateway
(a TypeScript/Express server that proxies the Spring Boot API and handles the JWT).



## Before you start

1. Ask the user for the gateway base URL. Default for local dev: `http://localhost:3002`.
   Never guess a production URL.
2. Check it is up: `GET {BASE}/health`. If it fails, tell the user the gateway or the
   Spring backend (default port 8081) is not running. Do not retry in a loop.
3. Log in once per session: `POST {BASE}/api/auth/login` with `{"email","password"}`.
   The gateway stores the token itself, so later calls need no Authorization header.
   Ask the user for credentials. Never invent, store, or echo them back.

## How to work

- Every response uses an envelope: success returns `{success: true, data, message}`,
  failure returns `{success: false, error}`. Read `error` and report it plainly.
- List endpoints are paged: `?pageNumber=0&size=10`. Page 0 is the first page. If the
  user asks for "all", loop over pages until a page returns fewer rows than `size`.
- Update and delete endpoints take the entity ID **in the JSON body**, not the URL.
- Dates are strings in the format the backend returns. Copy the format from an
  existing record before creating one.

## Safety rules

- **Confirm before any DELETE.** State exactly which record (ID and name or tracking
  number) will be removed and wait for a yes.
- **Confirm before bulk changes** (more than one create/update/delete in a row).
- Customers, employees and tracking notes contain personal data (names, phones,
  addresses). Show only the fields the user asked for. Do not paste whole records
  into summaries.
- The optimizer reads all parcels and routes. It reports assignments; treat its output
  as a suggestion and do not write assignments back unless the user asks.

## Common tasks

| User asks | Do this |
|---|---|
| "Where is parcel X?" | `GET /api/track` (page through), filter by `parcelId`, report the latest `location` + `status` |
| "What's delayed?" | `GET /api/parcel/delayed` |
| "Parcels from last month" | `GET /api/parcel/last-month` |
| "All parcels for customer N" | `GET /api/parcel/customer/N` |
| "How is the business doing?" | `GET /dashboard/customercount`, `/parcelscount`, `/parcelpayment`, `/parcelroutecount` |
| "Which route is overloaded?" | `GET /dashboard/parcelroutecount`, then `GET /api/route` for capacity context |
| "Create a parcel" | Collect required fields (see reference/schemas.md), confirm, `POST /api/parcel/create` |
| "Mark parcel delivered" | `POST /api/track/create` with a new tracking event, and `PUT /api/parcel/update` with the new `parcelStatus` |
| "Optimize routes" | See below |

### Route optimization

1. `GET /api/optimizer/health` first. If it is not healthy, stop and report why.
2. Run `GET /api/optimizer/optimize-clustering` (groups parcels by destination
   pincode) or `GET /api/optimizer/optimize-routes` (flood-fill assignment).
3. Summarise: parcels assigned vs unassigned, per-route load and utilization,
   total distance, execution time. Call out unassigned parcels and routes over 90%
   utilization, since these are what the user acts on.
4. If the optimizer returns an authorization error, tell the user: some optimizer
   endpoints may require the logged-in session. Re-run login and retry once.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Not authenticated. Please login first." | Gateway restarted and lost its token. Log in again. |
| 401 from an endpoint | Token expired (24h default). Log in again. |
| Connection refused | Gateway (3002) or Spring backend (8081) is down. |
| Empty list | Page past the end, or no data yet. Check `pageNumber`. |

Full endpoint list: `reference/endpoints.md`. Request bodies: `reference/schemas.md`.

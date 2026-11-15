# RouteMaster gateway endpoints

Base URL: ask the user (local default `http://localhost:3002`).
"Auth" means a prior `POST /api/auth/login` in this session.

## Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/login | no | body `{email, password}` |
| POST | /api/auth/register | no | all of email, password, firstName, lastName, phone, address required |
| POST | /api/logout | no | clears the gateway's stored token |
| GET | /health | no | gateway status |

## Parcels
| Method | Path | Auth |
|---|---|---|
| POST | /api/parcel/create | yes |
| GET | /api/parcel/?pageNumber=0&size=10 | yes |
| GET | /api/parcel/my-parcels | yes |
| GET | /api/parcel/customer/:customerId | yes |
| GET | /api/parcel/last-month | yes |
| GET | /api/parcel/delayed | yes |
| PUT | /api/parcel/update | yes |
| DELETE | /api/parcel/delete | yes (body `{parcelId}`) |

## Customers
| Method | Path | Auth |
|---|---|---|
| GET | /api/customer/me | yes |
| POST | /api/customer/create | yes |
| GET | /api/customer/ | yes |
| PUT | /api/customer/update | yes |
| DELETE | /api/customer/delete | yes (body `{customerId}`) |

## Employees
| Method | Path | Auth |
|---|---|---|
| POST | /api/employee/create | yes |
| GET | /api/employee/ | yes |
| PUT | /api/employee/update | yes |
| DELETE | /api/employee/delete | yes (body `{empId}`) |

## Routes
| Method | Path | Auth |
|---|---|---|
| POST | /api/route/create | yes |
| GET | /api/route/ | yes |
| PUT | /api/route/update | yes |
| DELETE | /api/route/delete | yes (body `{routeId}`) |

## Tracking
| Method | Path | Auth |
|---|---|---|
| POST | /api/track/create | yes |
| GET | /api/track/ | yes |
| PUT | /api/track/update | yes |
| DELETE | /api/track/delete | yes (body `{trackId}`) |

## Dashboard (public)
| Method | Path | Returns |
|---|---|---|
| GET | /dashboard/customercount | total customers |
| GET | /dashboard/parcelscount | total parcels |
| GET | /dashboard/parcelpayment | total payment amount |
| GET | /dashboard/parcelroutecount | parcels per route |

## Optimizer
| Method | Path | Notes |
|---|---|---|
| GET | /api/optimizer/health | public, run first |
| GET | /api/optimizer/diagnostics | data and config checks |
| GET | /api/optimizer/optimize-routes | flood-fill assignment |
| GET | /api/optimizer/optimize-clustering | cluster by destination pincode |
| GET | /api/optimizer/stats | optimizer statistics |

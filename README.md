# IDI Motors

The customer website for IDI Motors in Lusaka, Zambia. Inventory, contact details,
exchange rates, enquiries, appointments, sell / swap (trade-in) requests and customer
conversations are connected to the [dealer portal](../idimotors-portal).

## Development

Use Node.js 20.9 or later. Install dependencies with `npm ci`, then run
`npm run dev` to open the website at http://localhost:3000.

Start the dealer portal at http://localhost:3001. Set
`NEXT_PUBLIC_IDI_PORTAL_URL` to its public URL (used by the browser) and,
optionally, `NEXT_IDI_PORTAL_URL` to a different server-only URL. Both default to
http://localhost:3001. For local work, put them in `.env.local`, which overrides
`.env`. The portal's `CLIENT_ORIGINS` must allow the website origin for browser requests.

## Sell or swap your car

`/sell` (also `/sell?type=Swap&vehicle=<slug>`) lets customers offer their car to
IDI Motors, or swap it for a car in stock and top up the difference. Customers add
up to 12 photos, which are downscaled in the browser and uploaded to the portal's
`/api/public/uploads`. The request is then sent to `/api/public/trade-ins`. Staff
review it under **Sell & swap requests** in the portal, and the customer gets a
private conversation link.

The portal's dealership settings supply contact details, currency and rates.
Existing installations can update their saved dealership name in
**Settings**; the default name for a new installation is **IDI Motors**.
If the portal is unavailable, the website shows an unavailable state for inventory
and an explicit error for failed form submissions.

## Linkdrive branding

The shared header and footer use the supplied logo at
`public/linkdrive_logo.jpg`. Brand colors are defined in `app/globals.css`:
blue (`#1769c2`), navy (`#1d2b41`), and cool gray, with light blue accents
on dark backgrounds. Browser and installed-app branding use the same logo
and blue theme color.

## Validation and production

- `npm run lint`: lint application source.
- `npm run typecheck`: check TypeScript (run `npx next typegen` first after
  changing routes so generated route types are current).
- `npm run build`: create the production build.
- `npm start`: serve the production build.

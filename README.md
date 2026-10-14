# Kazuni Nina

React + Node.js storefront for handmade kazuni, with English, German, and Croatian interfaces and EUR pricing. Customers do not create accounts. Only the seller signs in.

## Development

Requires Node.js 24 (uses built-in SQLite).

```sh
npm ci
# Inject a unique password of at least 16 characters; never commit it.
export ADMIN_PASSWORD='your-unique-long-password'
export APP_ORIGIN=http://localhost:5173
npm run dev
```

Open the frontend on port 5173. The admin link opens `/admin`. The repository starts with no invented inventory. Sign in, upload pictures and add listings, then add pickup and delivery appointments in Availability. Times are entered and displayed in the browser's local timezone and stored as UTC. Uploaded images must be under 8 MB; the server decodes, strips metadata, resizes, and re-encodes them as WebP.

`npm test` exercises reservation, capacity, and transactional guarantees. `npm run build` creates the React production bundle. `npm start` serves both the built website and API on port 3001.

## Workflow

- Listings have a name, description, picture, EUR price, and availability. Hide listings to remove them from the public catalog. Existing names, descriptions, and prices can be edited. Auction starting prices cannot change once a bid exists.
- Auctions require a future closing time. Bids must meet the starting price and exceed the highest bid. Bidders supply a name and phone number; these are only exposed to the authenticated admin. The seller reviews bids and contacts the winner manually. No automatic auction payment or winner reservation is implemented.
- Purchase requests require a name, phone, and an available appointment with a location and date. Delivery also requires an address. A successful request reserves the unique listing immediately and consumes an appointment place. The seller confirms, completes, or cancels the order. Cancellation releases inventory and capacity.
- There is no online payment processing, SMS service, or email service. An order is a request, not a paid purchase. Phone contact is the current fulfillment workflow.
- The language selector translates the interface. Listing names/descriptions and server validation messages remain in the language entered by the seller / English respectively. Multilingual listing content can be entered in the description.

## Production requirements

Use HTTPS with a reverse proxy, `NODE_ENV=production`, `APP_ORIGIN` set to the exact public HTTPS origin, and a strong `ADMIN_PASSWORD` supplied securely by the host. There is no default admin password; admin login is disabled without one. Environment variables are not loaded automatically from `.env`; use the hosting platform or Node's `--env-file` option with a protected local file.

Set `DATA_DIR` to a persistent writable directory. Back up the SQLite database and uploaded images together (use SQLite's backup facilities for a live database). A fresh data directory gives an empty shop. Keep private customer records only as long as needed and establish a retention/privacy policy with the seller before accepting real customers. Add the seller's real business details, privacy notice, and applicable selling terms before launch.

Sessions are random, stored as SHA-256 digests in SQLite, expire after 8 hours, and use HttpOnly + SameSite=Strict cookies (Secure in production). Browser writes require a matching Origin, preventing cross-site form submissions. APIs use rate limiting, server-side validation, parameterized SQL, and Helmet headers. Only authenticated admin routes can read customer records or write inventory/calendar data. Image uploads are authenticated, size/pixel limited and decoded rather than trusting file extensions. SQLite transactions prevent double reservation and overbooking. No credentials are sent to the frontend or written to source files.

The application assumes one Node process and one persistent SQLite database. Do not run multiple independent instances with separate databases. Rate limits are per-process and reset on restart. If adding a reverse proxy, configure Express `trust proxy` only for the known proxy network so client IPs and rate limits remain correct; do not blindly trust forwarded headers. External penetration testing and deployment hardening have not been performed.

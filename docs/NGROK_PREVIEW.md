# Share the local website with ngrok

Recorded: 2026-10-28. This is a temporary preview, separate from the proposed Render deployment. Use synthetic enquiries; demo mode does not prevent form submissions from being stored.

## Install and connect your account

In PowerShell on the computer running this project:

```powershell
winget install ngrok -s msstore
```

Open a new PowerShell window after installation. Copy your authtoken from the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken) and run this locally, replacing the placeholder:

```powershell
ngrok config add-authtoken "YOUR_AUTHTOKEN"
```

Do not put the token in project files or paste it into chat. ngrok stores it in its own local configuration.

For this workspace session, a signed standalone copy is also available at `.test-data/ngrok-preview/ngrok.exe` (version 3.39.13, valid ngrok, Inc. signature). Use `& .\.test-data\ngrok-preview\ngrok.exe` in place of `ngrok` if the Store alias is unavailable. The user has configured their account token locally; no token was shared in chat or project documentation.

## Match the website origin

Find your Development Domain on the dashboard's [Domains page](https://dashboard.ngrok.com/domains). In this project's ignored root `.env`, set its full HTTPS URL, without a trailing slash:

```dotenv
WEB_URL=https://coy-unentangled-sherell.ngrok-free.dev
CMS_URL=http://127.0.0.1:3000
DEMO_MODE=true
```

Leave the existing server secrets intact. The supplied domain is configured in the ignored root `.env`. Rebuild the website and restart the preview when WEB_URL changes; the origin allowlist is compiled. Do not start a competing server on the same ports.

The shared preview serves the **compiled applications**, rather than Vite's development file server. A local check found that Vite's workspace file routes could serve the development database and backend source; those routes return 404 on the compiled public server. The staff backend remains local. For a future manual build/start, run from the repository root:

```powershell
$env:WEB_URL = 'https://coy-unentangled-sherell.ngrok-free.dev'
npm.cmd run build
node scripts/next.mjs start apps/cms --hostname 127.0.0.1 --port 3000
```

In another terminal, start the compiled website:

```powershell
$env:HOST = '127.0.0.1'
$env:PORT = '4321'
node --env-file=.env apps/web/dist/server/entry.mjs
```

The assistant has already started both compiled servers in the background for this session; do not rerun these starts while they are active. Their temporary manager and PID files are under ignored `.test-data/ngrok-preview/`.

The website runs on `http://127.0.0.1:4321`; staff sign-in remains at `http://127.0.0.1:3000/admin/login`. Astro's exact WEB_URL allowlist and enquiry origin checks remain enabled. Default HTTPS ports use URL's canonical empty port; forcing the string `443` prevents Astro from recognising a normal HTTPS host. Regression checks cover default HTTP/HTTPS and explicit ports. With a tunnel origin configured, submit fictional forms through that HTTPS URL rather than localhost.

## Open the tunnel

In a separate PowerShell window:

```powershell
& .\.test-data\ngrok-preview\ngrok.exe http http://127.0.0.1:4321 --url https://coy-unentangled-sherell.ngrok-free.dev --inspect=false
```

Share the HTTPS Forwarding URL that ngrok prints. It must match WEB_URL; if it differs, update WEB_URL, rebuild and restart the preview before testing the form. This uses the endpoint command supplied by the user, changing its upstream port from 8080 to the actual website port 4321.

Expose port 4321 only. Payload stays on local port 3000; the public website calls it server-side. The command disables local HTTP request inspection. Use fictional data regardless.

Keep the computer, server and tunnel running. Ctrl+C in the ngrok terminal closes the tunnel; Ctrl+C in the manually started server terminal stops the preview.

## Checks and limits

Check the forwarding URL on another network, open a service/training page, load photographs, and submit an incomplete synthetic support form. It should show validation feedback rather than an origin/host error. The local server can be verified before account setup; the public tunnel cannot be verified until ngrok is installed and authenticated.

Session verification: both production builds passed, with the website rebuilt after the HTTPS default-port correction. Four origin regression tests passed. A local compiled-server probe confirmed page responses, local staff sign-in, matching HTTPS-origin form validation (400 for an incomplete request), rejection of a foreign origin (403), and 404 responses for workspace-file routes, staff sign-in and private API paths on the public website port. No records were created by that probe. The account configuration validates locally. Automatic approval review rejected launching the ngrok process with "blocked by policy" and no further reason; no public tunnel or public-browser result is claimed. The user can run the exact command above locally.

Primary sources checked on 2026-10-28: [Windows installation](https://ngrok.com/download/windows), [ngrok localhost quickstart](https://ngrok.com/docs/share-localhost/quickstart), and [CLI reference](https://ngrok.com/docs/gateway/agent/cli). No authentication token is included in this document.

## Tunnel started — 2026-11-02

Following the user's request to run ngrok, both compiled applications were started locally and the configured ngrok agent connected successfully at [the public preview](https://coy-unentangled-sherell.ngrok-free.dev), forwarding to `127.0.0.1:4321`. Payload remains on local port 3000. This successful launch supersedes the earlier session's inability to start the tunnel; it does not change the historical approval-review result.

Public HTTPS checks returned 200 for Home, Services, Sacred Therapy, support and the official logo. An incomplete synthetic form returned validation status 400, a foreign origin was rejected with 403, and staff/private/source paths returned 404 through the public website. No records were created. Checks supplied `ngrok-skip-browser-warning: 1` to reach the application directly; ordinary visitors may first see ngrok's browser warning. Request inspection remains disabled. The server and agent must remain running on this computer; this is a temporary preview, not a production deployment or approval for real intake.

A public Chromium browser check at 1440px/390px verified the light header, continuous vines, decoded hero photographs/local fonts, a working package-prefilled enquiry link, no horizontal overflow on the checked phone page and no browser script errors. No records were created. Its screenshot is under ignored `.test-data/ngrok-preview/verified-2026-11-02/`. This uses browser emulation on the current machine; physical-device and independent-network testing were not performed.

Later on 2026-11-02, the C34/C35 floral-kit and page-motion build replaced the earlier background composition. The compiled preview was restarted while retaining the same tunnel. Public Chromium checks passed on Home (motes), Safe baby care (butterflies) and Letters of Hope (seeds), including functional Pause/Resume controls. A first navigation timed out; the completed follow-up succeeded. The current verification record and screenshot locations are in [the README](../README.md#checks-and-builds). The backend remains local, request inspection stays disabled and no real intake or payment provider was used.

C36 subsequently reverted that entire kit experiment at the user's request. The rebuilt preview now serves the pre-kit flowing vines and light surfaces through the same tunnel. Public Chromium checks on Home, Sacred Therapy and Safe baby care confirmed the restored background and absence of kit frames, spots and particle controls, without script errors or created records. The C34/C35 browser results above describe the reverted experiment, not the current design.

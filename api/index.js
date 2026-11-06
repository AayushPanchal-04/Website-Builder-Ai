import app from "../server/app.js"

// Vercel parses the request body by default, which would break the Stripe
// webhook (it needs the raw body to verify the signature). Let Express do it.
export const config = {
    api: { bodyParser: false },
}

export default function handler(req, res) {
    // Vercel forwards the original request path, but normalise just in case so
    // the Express router always matches its "/api/..." routes.
    if (!req.url.startsWith("/api")) {
        req.url = "/api" + (req.url === "/" ? "" : req.url)
    }

    return app(req, res)
}

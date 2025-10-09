import rateLimit from "express-rate-limit"

export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable deprecated headers
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again later'
    }
})

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 20,
    skip: (req) => req.method === 'POST'
})

export const refreshRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        error: 'too many requsts',
        message: 'Too many token refresh attempts'
    }

})


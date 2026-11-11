/**
 * In-memory rate limiter using a fixed-window counter.
 * NOTE: Suitable for single-instance deployments. For multi-instance,
 * replace with Redis or Upstash.
 *
 * Usage:
 *   const limiter = rateLimit({ interval: 15 * 60 * 1000, maxRequests: 5 });
 *   const { success } = limiter.check(identifier);
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

interface RateLimitOptions {
	interval: number; // milliseconds
	maxRequests: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
	const now = Date.now();
	const keys = Array.from(store.keys());
	for (const key of keys) {
		const entry = store.get(key);
		if (entry && now > entry.resetTime) {
			store.delete(key);
		}
	}
}, 60_000);

export function rateLimit({ interval, maxRequests }: RateLimitOptions) {
	return {
		/**
		 * Check if the identifier has exceeded the rate limit.
		 * Returns { success: true } if allowed, { success: false, retryAfter } if not.
		 */
		check(identifier: string): { success: boolean; retryAfter?: number } {
			const now = Date.now();
			const entry = store.get(identifier);

			if (!entry || now > entry.resetTime) {
				store.set(identifier, { count: 1, resetTime: now + interval });
				return { success: true };
			}

			if (entry.count >= maxRequests) {
				return {
					success: false,
					retryAfter: Math.ceil((entry.resetTime - now) / 1000),
				};
			}

			entry.count++;
			return { success: true };
		},

		/**
		 * Reset the counter for an identifier (e.g., after successful auth).
		 */
		reset(identifier: string): void {
			store.delete(identifier);
		},
	};
}

/**
 * Pre-configured rate limiters for common use cases.
 */

/** 5 attempts per 15 minutes — for OTP verification, password reset, login */
export const authLimiter = rateLimit({
	interval: 15 * 60 * 1000,
	maxRequests: 5,
});

/** 3 attempts per hour — for password reset requests */
export const passwordResetLimiter = rateLimit({
	interval: 60 * 60 * 1000,
	maxRequests: 3,
});

/** 10 attempts per 15 minutes — for general API calls */
export const apiLimiter = rateLimit({
	interval: 15 * 60 * 1000,
	maxRequests: 10,
});

/**
 * Get a rate-limit identifier from the request.
 * Uses X-Forwarded-For header (Vercel), falls back to "unknown".
 */
export function getRateLimitId(request: Request, userId?: string): string {
	if (userId) return `user:${userId}`;
	const forwarded = request.headers.get("x-forwarded-for");
	const ip = forwarded?.split(",")[0]?.trim() || "unknown";
	return `ip:${ip}`;
}

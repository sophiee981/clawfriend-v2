/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const getLatestCommit = () => {
    try {
        const rev = fs.readFileSync('.git/HEAD').toString().trim();
        let buildId;

        if (rev.indexOf(':') === -1) {
            buildId = rev;
        } else {
            buildId = fs
                .readFileSync(`.git/${rev.substring(5)}`)
                .toString()
                .trim();
        }

        return buildId.substring(0, 8);
    } catch (error) {
        console.warn('Could not get git commit hash, falling back to timestamp')
        return Date.now().toString()
    }
};

module.exports = {
    output: "standalone",
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: true,
    },
    env: {
        buildId: getLatestCommit(),
    },
    async headers() {
        const enableCloudflareCache =
          process.env.NEXT_PUBLIC_ENABLE_CLOUDFLARE_CACHE === "true";
        const isProduction = process.env.NODE_ENV === "production";
    
        const securityHeaders = isProduction
          ? [
              {
                source: "/:path*",
                headers: [
                  {
                    key: "X-DNS-Prefetch-Control",
                    value: "on",
                  },
                  {
                    key: "Strict-Transport-Security",
                    value: "max-age=63072000; includeSubDomains; preload",
                  },
                  {
                    key: "X-Frame-Options",
                    value: "SAMEORIGIN",
                  },
                  {
                    key: "X-Content-Type-Options",
                    value: "nosniff",
                  },
                  {
                    key: "X-XSS-Protection",
                    value: "1; mode=block",
                  },
                  {
                    key: "Referrer-Policy",
                    value: "strict-origin-when-cross-origin",
                  },
                  {
                    key: "Permissions-Policy",
                    value: "camera=(), microphone=(), geolocation=()",
                  },
                ],
              },
            ]
          : [];
    
        if (!enableCloudflareCache) {
          return securityHeaders;
        }
    
        return [
          ...securityHeaders,
          {
            // Cache static assets (images, fonts, etc.)
            source: "/images/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // Cache icons
            source: "/icons/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // Cache static charting library files
            source: "/static/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // Cache Next.js static files
            source: "/_next/static/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // Cache Next.js image optimization
            source: "/_next/image/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
          {
            // No cache for robots.txt and sitemap.xml
            source: "/:file(robots.txt|sitemap.xml)",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=3600, must-revalidate",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=3600, must-revalidate",
              },
            ],
          },
          {
            // Cache XSL stylesheets for sitemap
            source: "/:file(sitemap.xsl|sitemap-pages.xsl)",
            headers: [
              {
                key: "Content-Type",
                value: "application/xml",
              },
              {
                key: "Cache-Control",
                value: "public, max-age=86400, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=86400, immutable",
              },
            ],
          },
          {
            // Cache favicon
            source: "/favicon.ico",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=86400, immutable",
              },
              {
                key: "CDN-Cache-Control",
                value: "public, max-age=86400, immutable",
              },
            ],
          },
          {
            // Default cache for HTML pages only (exclude static files and data requests)
            source:
              "/((?!images|icons|static|_next|favicon.ico|robots.txt|sitemap|.xsl).*)",
            headers: [
              {
                key: "CDN-Cache-Control",
                value:
                  "public, max-age=10, stale-while-revalidate=86400, stale-if-error=3600",
              },
            ],
          }
        ];
      },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
}

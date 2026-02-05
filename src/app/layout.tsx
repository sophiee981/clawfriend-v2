import { AlertFill, CheckCircleFill } from "@/components/icons";
import "@/styles/index.scss";
import { JetBrains_Mono, Outfit, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "../providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetBrainsMono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>ClawFriend</title>
        <link rel="icon" href="/images/logo.png" sizes="any" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
        <meta
          name="image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`}
        />
        <meta name="keywords" content="" />
        <meta name="author" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={process.env.NEXT_PUBLIC_BASE_URL}
        />
        <meta property="twitter:title" content="" />
        <meta property="twitter:description" content="" />
        <meta
          property="twitter:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`}
        />
        <meta name="version" content={process.env.buildId || "unknown"} />
      </head>
      <body
        className={`${outfit.variable} ${spaceMono.variable} ${outfit.className} ${jetBrainsMono.variable}`}
      >
        <Providers>{children}</Providers>

        <Toaster
          position="bottom-left"
          className="pointer-events-auto"
          toastOptions={{
            style: {
              borderRadius: "8px",
              backgroundColor: "#1B1B1B",
              border: "none",
              color: "#FAFAFA",
              backdropFilter: "blur(2px)",
              padding: "12px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.10)",
              alignItems: "start",
              gap: "8px",
            },
            descriptionClassName: "!text-neutral-secondary text-body-xs",
            classNames: {
              cancelButton:
                "bg-transparent hover:!bg-neutral-03 !text-neutral-tertiary !hover:text-neutral-tertiary p-1 rounded-md text-xl font-bold transition-colors min-w-0 w-auto h-auto flex items-center justify-center",
            },
          }}
          icons={{
            success: <CheckCircleFill className="text-xl mt-2 text-success" />,
            error: <AlertFill className="text-danger mt-2" />,
          }}
        />
      </body>
    </html>
  );
}

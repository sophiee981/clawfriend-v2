import { AlertFill, CheckCircle } from "@/components/icons";
import MainLayout from "@/components/layout/MainLayout";
import "@/styles/index.scss";
import { Funnel_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "../providers";

const funnelSans = Funnel_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <title></title>
        <link rel="icon" href="/images/favicon.png" sizes="any" />
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
      <body className={funnelSans.className}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "16px",
              border: "none",
              backgroundColor: "#27272B",
              color: "#F8F8F9",
              backdropFilter: "blur(2px)",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.10)",
              alignItems: "start",
              gap: "8px",
            },
            descriptionClassName: "!text-text-neutral-secondary",
            classNames: {
              cancelButton:
                "bg-transparent hover:!bg-bg-neutral-3 !text-text-neutral-tertiary !hover:text-text-neutral-tertiary p-1 rounded-md text-xl font-bold transition-colors min-w-0 w-auto h-auto flex items-center justify-center",
            },
          }}
          icons={{
            success: <CheckCircle className="text-xl mt-2" />,
            error: <AlertFill className="text-danger mt-2" />,
          }}
        />
      </body>
    </html>
  );
}

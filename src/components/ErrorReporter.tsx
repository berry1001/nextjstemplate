"use client";

import "@/app/globals.css";
import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReporterProps = {
  /*  ⎯⎯ props are only provided on the global-error page ⎯⎯ */
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorReporter({ error, reset }: ReporterProps) {
  /* ─ instrumentation shared by every route ─ */
  const lastOverlayMsg = useRef("");
  const pollRef = useRef<NodeJS.Timeout>();
  const [isCopied, setIsCopied] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    const inIframe = window.parent !== window;
    if (!inIframe) return;

    const send = (payload: unknown) => window.parent.postMessage(payload, "*");

    const onError = (e: ErrorEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          source: "window.onerror",
        },
        timestamp: Date.now(),
      });

    const onReject = (e: PromiseRejectionEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.reason?.message ?? String(e.reason),
          stack: e.reason?.stack,
          source: "unhandledrejection",
        },
        timestamp: Date.now(),
      });

    const pollOverlay = () => {
      const overlay = document.querySelector("[data-nextjs-dialog-overlay]");
      const node =
        overlay?.querySelector(
          "h1, h2, .error-message, [data-nextjs-dialog-body]",
        ) ?? null;
      const txt = node?.textContent ?? node?.innerHTML ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: { message: txt, source: "nextjs-dev-overlay" },
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = setInterval(pollOverlay, 1000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      pollRef.current && clearInterval(pollRef.current);
    };
  }, []);

  /* ─ extra postMessage when on the global-error route ─ */
  useEffect(() => {
    if (!error) return;
    window.parent.postMessage(
      {
        type: "global-error-reset",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
      "*",
    );
  }, [error]);

  /* ─ ordinary pages render nothing ─ */
  if (!error) return null;

  const getDisplayMessage = () => {
    const errorName = error.name || "Error";
    let message = error.message;
    if (!message.startsWith(errorName)) {
      message = `${errorName}: ${message}`;
    }
    return message;
  };

  const getFullErrorMessage = () => {
    const errorName = error.name || "Error";
    let message = error.message;
    if (!message.startsWith(errorName)) {
      message = `${errorName}: ${message}`;
    }
    if (error.stack) {
      message += `\n\n${error.stack}`;
    }
    if (error.digest) {
      message += `\n\nDigest: ${error.digest}`;
    }
    return message;
  };

  const handleCopyError = async () => {
    try {
      await navigator.clipboard.writeText(getFullErrorMessage());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error message:", err);
    }
  };

  const handleFixWithPastel = () => {
    setIsFixing(true);
    window.parent.postMessage(
      {
        type: "FIX_WITH_PASTEL",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
      },
      "*",
    );
  };

  /* ─ global-error UI ─ */
  return (
    <html>
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-8 overflow-hidden">
        <div className="w-full max-w-3xl space-y-4">
          {/* Header row with title and Fix button */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold animate-orange-text-shimmer">
              Runtime error
            </h1>
            <Button
              onClick={handleFixWithPastel}
              className="bg-muted hover:bg-muted/80 font-medium rounded-md gap-2 cursor-pointer"
              size="default"
              disabled={isFixing}
            >
              <img
                src="/favicon.png"
                alt="Pastel"
                width={16}
                height={16}
              />
              <span className="animate-theme-text-shimmer">
                {isFixing ? "Pastel is fixing..." : "Fix with Pastel"}
              </span>
            </Button>
          </div>

          {/* Error message bubble */}
          <div className="bg-muted/50 border border-border rounded-lg px-4 py-3">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
              {getDisplayMessage()}
            </pre>
          </div>

          {/* Copy button */}
          <div className="flex justify-start -mt-2">
            <Button
              onClick={handleCopyError}
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
            >
              {isCopied ? (
                <svg
                  aria-hidden="true"
                  width="16px"
                  height="16px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground"
                >
                  <path
                    d="M5 12.75L10 19L19 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <CopyIcon className="text-foreground" size={16} />
              )}
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

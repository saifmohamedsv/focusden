import { signIn } from "@/lib/auth/config";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg, #1a1a14)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "360px",
          width: "100%",
          padding: "0 24px",
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Lora, Georgia, serif",
              fontSize: "3rem",
              fontWeight: "700",
              color: "var(--color-accent, #c8a84b)",
              margin: "0 0 8px 0",
              lineHeight: "1",
              letterSpacing: "-0.02em",
            }}
          >
            FocusDen
          </h1>
          <p
            style={{
              color: "var(--color-fg-muted, #9a9a80)",
              fontSize: "0.9rem",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            Your calm corner for deep work
          </p>
        </div>

        {/* Google sign-in button */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#fff",
              color: "#3c4043",
              border: "1px solid #dadce0",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "box-shadow 0.15s ease",
            }}
          >
            {/* Google "G" SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
              />
              <path
                fill="#34A853"
                d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
              />
              <path
                fill="#FBBC05"
                d="M11.68 28.18A13.88 13.88 0 0 1 10.8 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A23.93 23.93 0 0 0 .06 24c0 3.86.92 7.51 2.56 10.75l7.06-5.48-.0-.09z"
              />
              <path
                fill="#EA4335"
                d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7C13.42 14.62 18.27 10.75 24 10.75z"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Bottom subtitle */}
        <p
          style={{
            color: "var(--color-fg-dim, #666655)",
            fontSize: "0.78rem",
            margin: "0",
            textAlign: "center",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Focus, Flow, Feel Good
        </p>
      </div>
    </div>
  );
}

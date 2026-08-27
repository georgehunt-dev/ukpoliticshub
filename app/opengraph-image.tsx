import { ImageResponse } from "next/og";

/**
 * The card shown when the site is shared on social media or in messages.
 * Built at request time from the same brand elements as the site itself.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ukpoliticshub. UK politics from both sides, sourced and dated";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f1e8",
          padding: "64px 72px",
          fontFamily: "Times New Roman, serif",
        }}
      >
        {/* Mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="84" height="84" viewBox="-50 -50 100 100">
            <circle cx="0" cy="0" r="47" fill="#fbf9f4" stroke="#0f1f38" strokeWidth="4" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="#0f1f38" strokeWidth="1.5" opacity="0.55" />
            <g stroke="#0f1f38" strokeWidth="2" opacity="0.16" strokeLinecap="round">
              <path d="M-27 -27L27 27M27 -27L-27 27" />
            </g>
            <g stroke="#7a1c2b" strokeWidth="11" strokeLinecap="round">
              <path d="M-19 -19L19 19" />
              <path d="M19 -19L-19 19" />
            </g>
          </svg>
          {/* One text run, not two spans: the renderer inserts a space between
              flex children, which split the wordmark into "ukpolitics hub". */}
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "#0f1f38" }}>
            ukpoliticshub
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, lineHeight: 1.03, color: "#0f1f38", maxWidth: 980 }}>
            UK politics from both sides, sourced, dated and checkable.
          </div>
          <div style={{ fontSize: 30, color: "#3b4a63", maxWidth: 900 }}>
            Polls · Channel crossings · Threat levels · Elections · The papers, left and right
          </div>
        </div>

        {/* Rule + disclaimer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "3px solid #b08a3e",
            paddingTop: 22,
            fontSize: 24,
            color: "#3b4a63",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Not endorsed by any political party</span>
          <span>ukpoliticshub.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

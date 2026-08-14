import { ImageResponse } from "next/og";

/** Favicon: the ballot-cross roundel, drawn large enough to survive 32px. */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf9f4",
          borderRadius: "50%",
          border: "2px solid #0f1f38",
        }}
      >
        <svg viewBox="-50 -50 100 100" width="26" height="26">
          <g stroke="#7a1c2b" strokeWidth="16" strokeLinecap="round">
            <path d="M-22 -22L22 22" />
            <path d="M22 -22L-22 22" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}

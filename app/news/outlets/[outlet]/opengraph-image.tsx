import { ImageResponse } from "next/og";
import { outletById, outlets } from "@/data/news";
import { withArticle } from "@/lib/outlet-coverage";
import { leanOf, LEAN_LABEL } from "@/lib/subjects";

/**
 * The card shown when an outlet page is shared.
 *
 * Every one of these pages used to share the site-wide card — same picture,
 * same title, fifteen times — so a link to the Daily Mail page and a link to
 * the Guardian page looked identical in a message. This gives each its own,
 * carrying the one thing the page is about: where the masthead sits.
 *
 * It also gives the page a large image of its own that we host, which the
 * page's structured data can point at. The only other images on these pages
 * are publishers' feed thumbnails, which are theirs rather than ours.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return outlets.map((outlet) => ({ outlet: outlet.id }));
}

/**
 * One image per outlet, so `generateImageMetadata` is not the tool — that is
 * for returning several images from one route, and each of those needs its own
 * id. The params flow to the default export on their own.
 */
export const alt = "Where this masthead sits on the left–right scale";

const PAPER = "#f5f1e8";
const INK = "#0f1f38";
const OXBLOOD = "#7a1c2b";
const GOLD = "#b08a3e";

export default async function OutletCard({
  params,
}: {
  params: Promise<{ outlet: string }>;
}) {
  const { outlet: id } = await params;
  const outlet = outletById[id];
  const name = outlet?.name ?? "ukpoliticshub";
  const bias = outlet?.bias ?? 0;
  const lean = leanOf(bias);
  const label = lean === "centre" ? "Centre-ground" : LEAN_LABEL[lean];
  /** −10 to +10 mapped across the rule. */
  const at = ((bias + 10) / 20) * 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "60px 68px",
          fontFamily: "Times New Roman, serif",
          color: INK,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6b7689",
            }}
          >
            ukpoliticshub · masthead
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              border: `3px solid ${INK}`,
              background: "#fbf9f4",
              padding: "18px 30px",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {name}
          </div>

          <div style={{ display: "flex", marginTop: 34, fontSize: 46, lineHeight: 1.15 }}>
            Is {withArticle(name)} left or right?
          </div>

          <div style={{ display: "flex", marginTop: 14, fontSize: 40, color: OXBLOOD, fontWeight: 700 }}>
            {label} · {bias > 0 ? "+" : ""}
            {bias}
          </div>
        </div>

        {/* The scale, with this masthead marked. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", position: "relative", height: 46, alignItems: "center" }}>
            <div style={{ display: "flex", width: "100%", height: 3, background: "rgba(15,31,56,0.35)" }} />
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "50%",
                top: 8,
                width: 3,
                height: 30,
                background: GOLD,
              }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: `${at}%`,
                top: 6,
                marginLeft: -17,
                width: 34,
                height: 34,
                background: OXBLOOD,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6b7689",
              marginTop: 6,
            }}
          >
            <div style={{ display: "flex" }}>Left −10</div>
            <div style={{ display: "flex" }}>Centre</div>
            <div style={{ display: "flex" }}>Right +10</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

import { NextRequest, NextResponse } from "next/server";
import { leadPool } from "@/lib/roundRobin";

const WA_MESSAGE =
  "Hi Dreamlab saya mengetahui dari Google saya ingin konsultasi untuk brand saya, apakah bisa dibantu?";

export async function GET(request: NextRequest) {
  const campaign =
    request.nextUrl.searchParams.get("campaign") ?? "google";

  const existingCs = request.cookies.get("dreamlab_cs")?.value;
  const validIds = ["cs1", "cs2", "cs3"];

  if (existingCs && validIds.includes(existingCs)) {
    const existing = leadPool.getAgent(existingCs);
    if (existing) {
      const phone = leadPool.normalizePhoneNumber(existing.number);
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`;

      console.log(
        JSON.stringify({
          level: "lead_sticky",
          campaign,
          cs: { id: existing.id, name: existing.name },
          phone: existing.number,
          from_cookie: true,
          timestamp: new Date().toISOString(),
        })
      );

      return NextResponse.redirect(waUrl);
    }
  }

  const { agent, phone } = leadPool.next();
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`;

  console.log(
    JSON.stringify({
      level: "lead_fresh",
      campaign,
      cs: { id: agent.id, name: agent.name },
      phone: agent.number,
      from_cookie: false,
      timestamp: new Date().toISOString(),
    })
  );

  const response = NextResponse.redirect(waUrl);
  response.cookies.set("dreamlab_cs", agent.id, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

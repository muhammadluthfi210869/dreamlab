import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/roundRobin";

const WA_MESSAGE =
  "Halo Dreamlab, saya lihat iklan di meta ads dan ingin konsultasi buat brand saya. Bisa dibantu?";

export async function GET(request: NextRequest) {
  const { agent, phone } = pool.next();

  const campaign =
    request.nextUrl.searchParams.get("campaign") ?? "metaads";

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`;

  console.log(
    JSON.stringify({
      level: "lead",
      campaign,
      cs: { id: agent.id, name: agent.name },
      phone: agent.number,
      timestamp: new Date().toISOString(),
    })
  );

  return NextResponse.redirect(waUrl);
}

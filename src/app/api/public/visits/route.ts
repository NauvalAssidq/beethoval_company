import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || 
               headersList.get("x-real-ip") || 
               "Unknown";
               
    const userAgent = headersList.get("user-agent") || "Unknown";

    let locationData = {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
    };

    if (ip !== "Unknown" && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const res = await fetch(`http://ip-api.com/json/${ip}`);
        if (res.ok) {
          const geo = await res.json();
          if (geo.status === "success") {
            locationData = {
              country: geo.country,
              city: geo.city,
              region: geo.regionName,
            };
          }
        }
      } catch (e) {
      }
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const visit = {
      ip,
      userAgent,
      ...locationData,
      createdAt: new Date(),
    };

    await db.collection("visits").insertOne(visit);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

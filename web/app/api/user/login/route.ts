import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const backendBase = process.env.BACKEND_URL
    if (!backendBase) {
      return new Response(
        JSON.stringify({ error: "BACKEND_URL not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const body = await req.json().catch(() => ({}))
    const res = await fetch(new URL("/user/login", backendBase), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const contentType = res.headers.get("content-type") || "application/json"
    const responseBody = contentType.includes("application/json")
      ? await res.json().catch(() => ({ success: res.ok }))
      : await res.text()

    return new Response(
      typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody),
      { status: res.status, headers: { "Content-Type": contentType } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to reach backend" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    )
  }
}




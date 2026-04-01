import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = await params; // ["17", "d94075e..."]
  const { search } = new URL(request.url); // ?expires=...&signature=...

  // Just forward slug and query to the client-side page
  const path = encodeURIComponent(slug.join("/"));
  return NextResponse.redirect(
    new URL(
      `/auth/email-verification?path=${path}${search ? "&" + search.slice(1) : ""}`,
      request.url,
    ),
  );
}

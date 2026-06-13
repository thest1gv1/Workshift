export async function POST(req: Request) {
  const { key } = await req.json()
  
  if (key === process.env.AUTH_KEY) {
    return Response.json({ ok: true })
  }
  
  return Response.json({ ok: false }, { status: 401 })
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import dbConnect from "@/utils/db";
import { Account } from "@/models/Account";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const account = await Account.create({
      userId,
      ...body,
    });

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const accounts = await Account.find({ userId });
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

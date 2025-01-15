import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import dbConnect from "@/utils/db";
import { Category } from "@/models/Category";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const category = await Category.create({
      userId,
      ...body,
    });

    return NextResponse.json(category);
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
    const categories = await Category.find({ userId });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

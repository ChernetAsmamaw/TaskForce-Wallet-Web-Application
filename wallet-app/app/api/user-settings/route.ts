import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import UserSettings from "@/models/UserSettings";
import dbConnect from "@/utils/db";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userSettings = await UserSettings.findOne({
      userId: user.id,
    });

    if (!userSettings) {
      userSettings = await UserSettings.create({
        userId: user.id,
        currency: "USD",
      });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("User settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const userSettings = await UserSettings.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Update user settings error:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import auth from "@clerk/nextjs";
import dbConnect from "@/utils/db";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const transaction = await Transaction.create({
      userId,
      ...body,
    });

    // Update account balance
    const account = await Account.findById(body.accountId);
    if (body.type === "expense") {
      account.balance -= body.amount;
    } else {
      account.balance += body.amount;
    }
    await account.save();

    // Check budget alerts
    await checkBudgetAlerts(userId, body.categoryId, body.amount);

    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const categoryId = searchParams.get("categoryId");
    const accountId = searchParams.get("accountId");

    let query: any = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (categoryId) query.categoryId = categoryId;
    if (accountId) query.accountId = accountId;

    const transactions = await Transaction.find(query)
      .populate("categoryId")
      .populate("accountId")
      .sort({ date: -1 });

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

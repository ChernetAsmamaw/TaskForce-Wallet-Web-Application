import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import Budget from "@/models/Budget";
import dbConnect from "@/utils/db";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let query = { userId: user.id };

    // If month and year are provided, add date filtering
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);
      query = {
        ...query,
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      };
    }

    const budgets = await Budget.find(query)
      .populate({
        path: "accountId",
        select: "_id name type",
      })
      .lean();

    console.log("Found budgets:", budgets);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Create new budget with proper field mapping
    const budgetData = {
      userId: user.id,
      name: body.name,
      amount: Number(body.maxAmount), // Convert maxAmount to amount
      currentAmount: 0,
      period: body.period || "monthly",
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      accountId: new mongoose.Types.ObjectId(body.accountId),
    };

    // Create and populate in two steps
    const budget = await Budget.create(budgetData);
    const populatedBudget = await Budget.findById(budget._id).populate({
      path: "accountId",
      select: "_id name type",
    });

    return NextResponse.json(populatedBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
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
    const updateData = {
      ...body,
      accountId: new mongoose.Types.ObjectId(body.accountId),
    };

    const budget = await Budget.findOneAndUpdate(
      { _id: body._id, userId: user.id },
      updateData,
      { new: true }
    )
    .populate({
      path: "accountId",
      select: "_id name type",
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const budget = await Budget.findOneAndDelete({
      _id: body._id,
      userId: user.id,
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}

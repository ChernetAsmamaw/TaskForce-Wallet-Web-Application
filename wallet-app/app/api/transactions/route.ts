import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/utils/db";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Build query object
    const query: any = { userId: user.id };

    // Transaction type filter
    const type = searchParams.get("type");
    if (type && type !== "all") {
      query.type = type;
    }

    // Category filter
    const categoryName = searchParams.get("category.name");
    if (categoryName) {
      query["category.name"] = categoryName;
    }

    // Account filter
    const accountId = searchParams.get("accountId");
    if (accountId && accountId !== "all-accounts") {
      query.accountId = new mongoose.Types.ObjectId(accountId);
    }

    // Budget filter
    const budgetId = searchParams.get("budgetId");
    if (budgetId) {
      query.budgetId = new mongoose.Types.ObjectId(budgetId);
    }

    // Date range filter
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    console.log("Query:", query); // For debugging

    // Execute query with population and sorting
    const transactions = await Transaction.find(query)
      .populate("accountId", "name type")
      .populate("budgetId", "name amount currentAmount")
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error in transactions GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let session = null;
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Start a session for the transaction
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the transaction within the session
      const transaction = await Transaction.create(
        [
          {
            ...body,
            userId: user.id,
            category: {
              ...body.category,
              type: body.type,
            },
          },
        ],
        { session }
      );

      // If this transaction is associated with a budget, update the budget's currentAmount
      if (body.budgetId) {
        const budget = await mongoose
          .model("Budget")
          .findById(body.budgetId)
          .session(session);
        if (budget) {
          const amountChange =
            body.type === "expense" ? body.amount : -body.amount;
          budget.currentAmount = (budget.currentAmount || 0) + amountChange;
          await budget.save({ session });
        }
      }

      // Update account balance
      if (body.accountId) {
        const account = await mongoose
          .model("Account")
          .findById(body.accountId)
          .session(session);
        if (account) {
          const balanceChange =
            body.type === "income" ? body.amount : -body.amount;
          account.balance = (account.balance || 0) + balanceChange;
          await account.save({ session });
        }
      }

      // Commit the transaction
      await session.commitTransaction();

      // Fetch the populated transaction
      const populatedTransaction = await Transaction.findById(
        transaction[0]._id
      )
        .populate("accountId", "name type")
        .populate("budgetId", "name amount currentAmount");

      return NextResponse.json(populatedTransaction);
    } catch (error) {
      // Rollback the transaction on error
      if (session) {
        await session.abortTransaction();
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in transactions POST:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

export async function DELETE(request: Request) {
  let session = null;
  try {
    await dbConnect();
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Start a session for the transaction
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the transaction first
      const transaction = await Transaction.findOne({
        _id: body._id,
        userId: user.id,
      }).session(session);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Revert budget currentAmount if applicable
      if (transaction.budgetId) {
        const budget = await mongoose
          .model("Budget")
          .findById(transaction.budgetId)
          .session(session);
        if (budget) {
          const amountChange =
            transaction.type === "expense"
              ? -transaction.amount
              : transaction.amount;
          budget.currentAmount = (budget.currentAmount || 0) + amountChange;
          await budget.save({ session });
        }
      }

      // Revert account balance
      if (transaction.accountId) {
        const account = await mongoose
          .model("Account")
          .findById(transaction.accountId)
          .session(session);
        if (account) {
          const balanceChange =
            transaction.type === "income"
              ? -transaction.amount
              : transaction.amount;
          account.balance = (account.balance || 0) + balanceChange;
          await account.save({ session });
        }
      }

      // Delete the transaction
      await transaction.deleteOne({ session });

      // Commit the transaction
      await session.commitTransaction();
      return NextResponse.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in transactions DELETE:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

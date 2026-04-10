import { ExpenseMutationResponse } from "@/interfaces/expense";
import {
  StatusCode,
  StatusText,
} from "@/interfaces/Standered/standeredResponse";
import { getViewerContext } from "@/lib/auth";
import { createExpenseForUser } from "@/lib/expense-service";
import { expenseBodyValidation } from "@/zod/authValidation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ExpenseMutationResponse>> {
  try {
    const viewer = await getViewerContext();

    if (!viewer.authenticated || !viewer.userId) {
      return NextResponse.json(
        {
          success: false,
          status: StatusCode.UNAUTHORIZED,
          error: StatusText.UNAUTHORIZED,
          message: "Create an account to save and manage expenses.",
        },
        {
          status: StatusCode.UNAUTHORIZED,
        },
      );
    }

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          status: StatusCode.BAD_REQUEST,
          error: StatusText.BAD_REQUEST,
          message: "Request body is missing.",
        },
        {
          status: StatusCode.BAD_REQUEST,
        },
      );
    }

    const parsedBody = expenseBodyValidation.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          status: StatusCode.BAD_REQUEST,
          error: StatusText.BAD_REQUEST,
          message:
            parsedBody.error.issues[0]?.message || "Invalid expense payload.",
        },
        {
          status: StatusCode.BAD_REQUEST,
        },
      );
    }

    const expense = await createExpenseForUser(viewer.userId, parsedBody.data);

    return NextResponse.json(
      {
        success: true,
        status: StatusCode.CREATED,
        message: "Expense added successfully.",
        data: {
          expense,
        },
      },
      {
        status: StatusCode.CREATED,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: StatusText.INTERNAL_SERVER_ERROR,
        message: "Unable to save this expense.",
      },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

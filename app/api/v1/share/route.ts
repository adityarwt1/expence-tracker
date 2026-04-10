import { ShareResponse } from "@/interfaces/expense";
import {
  StatusCode,
  StatusText,
} from "@/interfaces/Standered/standeredResponse";
import { getViewerContext } from "@/lib/auth";
import {
  buildSharePayload,
  getExpensesForViewer,
} from "@/lib/expense-service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ShareResponse>> {
  try {
    const viewer = await getViewerContext();
    const expenses = await getExpensesForViewer(viewer.userId);
    const viewerState = {
      authenticated: viewer.authenticated,
      email: viewer.email,
      source: viewer.source,
    };

    return NextResponse.json(
      {
        success: true,
        status: StatusCode.OK,
        data: buildSharePayload(viewerState, expenses),
      },
      {
        status: StatusCode.OK,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: StatusText.INTERNAL_SERVER_ERROR,
        message: "Unable to load share preview.",
      },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

import { ReportsResponse } from "@/interfaces/expense";
import {
  StatusCode,
  StatusText,
} from "@/interfaces/Standered/standeredResponse";
import { getViewerContext } from "@/lib/auth";
import {
  buildReportsPayload,
  getExpensesForViewer,
} from "@/lib/expense-service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<ReportsResponse>> {
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
        data: buildReportsPayload(viewerState, expenses),
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
        message: "Unable to load reports.",
      },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

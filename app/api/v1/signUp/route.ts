import { SignUpResponse } from "@/interfaces/auth/auth";
import {
  StatusCode,
  StatusText,
} from "@/interfaces/Standered/standeredResponse";
import { signAuthToken, setAuthCookie } from "@/lib/auth";
import { createStarterExpenses } from "@/lib/expense-service";
import { mongoconnect } from "@/lib/mongodb";
import User from "@/mongoose/User";
import { signUpBodyValidation } from "@/zod/authValidation";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<SignUpResponse>> {
  try {
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

    const parsedBody = signUpBodyValidation.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          status: StatusCode.BAD_REQUEST,
          error: StatusText.BAD_REQUEST,
          message:
            parsedBody.error.issues[0]?.message || "Invalid signup details.",
        },
        {
          status: StatusCode.BAD_REQUEST,
        },
      );
    }

    await mongoconnect();

    const existingUser = await User.findOne({
      email: parsedBody.data.email,
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          status: StatusCode.CONFLICT,
          error: StatusText.CONFLICT,
          message: "An account with this email already exists.",
        },
        {
          status: StatusCode.CONFLICT,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(parsedBody.data.password, 12);

    const user = await User.create({
      email: parsedBody.data.email,
      password: hashedPassword,
    });

    await createStarterExpenses(String(user._id));

    const token = signAuthToken({
      _id: String(user._id),
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        status: StatusCode.CREATED,
        message: "Account created successfully.",
        data: {
          token,
          email: user.email,
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
        message: "Unable to create your account right now.",
      },
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

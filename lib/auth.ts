import { TokenInterface } from "@/interfaces/Token/token";
import { ViewerState } from "@/interfaces/expense";
import { mongoconnect } from "@/lib/mongodb";
import User from "@/mongoose/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface ViewerContext extends ViewerState {
  userId: string | null;
}

const AUTH_COOKIE =
  process.env.COOKIE_NAME?.replaceAll('"', "") || "expenseTrackerToken";
const JWT_SECRET = process.env.JWT_SECRET;

const fallbackViewer: ViewerContext = {
  userId: null,
  authenticated: false,
  email: null,
  source: "demo",
};

export const signAuthToken = (payload: TokenInterface) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const verifyAuthToken = (token: string): TokenInterface | null => {
  if (!JWT_SECRET) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as TokenInterface;
  } catch {
    return null;
  }
};

export const getViewerContext = async (): Promise<ViewerContext> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return fallbackViewer;
  }

  const payload = verifyAuthToken(token);

  if (!payload?._id) {
    return fallbackViewer;
  }

  await mongoconnect();
  const user = await User.findById(payload._id).lean();

  if (!user) {
    return fallbackViewer;
  }

  return {
    userId: String(user._id),
    authenticated: true,
    email: user.email,
    source: "account",
  };
};

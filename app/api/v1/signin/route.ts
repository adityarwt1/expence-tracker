import { SignInResponse } from "@/interfaces/auth/auth";
import { StatusCode, StatusText } from "@/interfaces/Standered/standeredResponse";
import { signInbodyValidation } from "@/zod/authValidation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) :Promise<NextResponse<SignInResponse>> {
    const cookie = await cookies()
    try {
        const body  = await req.json()

        if(!body){
            return NextResponse.json({
                status:StatusCode.BAD_REQUEST,
                success:false,
                error:StatusText.BAD_REQUEST,
                message:"Body not provided properly!"
            })
        }

        const isValidRequestBody = signInbodyValidation.safeParse(body)

        if(!isValidRequestBody.success){
            return NextResponse.json({
                status:StatusCode.BAD_REQUEST,
                success:false,
                error:StatusText.BAD_REQUEST
            })
        }

        
    } catch (error) {
        
    }
    
}
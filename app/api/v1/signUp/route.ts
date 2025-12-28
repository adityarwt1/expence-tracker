import { SignUpResponse } from "@/interfaces/auth/auth";
import { StatusCode, StatusText } from "@/interfaces/Standered/standeredResponse";
import { mongoconnect } from "@/lib/mongodb";
import User from "@/mongoose/User";
import { signInbodyValidation } from "@/zod/authValidation";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import { TokenInterface } from "@/interfaces/Token/token";

export async function POST(req:NextRequest) :Promise<NextResponse<SignUpResponse>> {
    const cookie = await cookies()
    try {
        const body  = await req.json()

        if(!body){
            return NextResponse.json({
                status:StatusCode.BAD_REQUEST,
                success:false,
                error:StatusText.BAD_REQUEST,
                message:"Body not provided properly!"
            },{
                status:StatusCode.BAD_REQUEST
            })
        }

        const isValidRequestBody = signInbodyValidation.safeParse(body)

        if(!isValidRequestBody.success){
            return NextResponse.json({
                status:StatusCode.BAD_REQUEST,
                success:false,
                error:StatusText.BAD_REQUEST
            },{
                status:StatusCode.BAD_REQUEST
            })
        }

        const isConnected = await mongoconnect()

        if(!isConnected){
            return NextResponse.json({
                status:StatusCode.INTERNAL_SERVER_ERROR,
                success:false,
                error:StatusText.INTERNAL_SERVER_ERROR,
                message:"Failed to connet databse"
            },{
                status:StatusCode.INTERNAL_SERVER_ERROR
            })
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)

        if(!hashedPassword){
            return NextResponse.json({
                status:StatusCode.INTERNAL_SERVER_ERROR,
                success:false,
                error:StatusText.INTERNAL_SERVER_ERROR
            },{
                status:StatusCode.INTERNAL_SERVER_ERROR
            })
        }
        let user;

        try {
            user =   new User({...body, password:hashedPassword}) 
            await user.save()
        } catch (error) {
            return NextResponse.json({
                status:StatusCode.INTERNAL_SERVER_ERROR,
                success:false,
                error:StatusText.INTERNAL_SERVER_ERROR
            },{
                status:StatusCode.INTERNAL_SERVER_ERROR
            })
        }

        const tokenPayload :TokenInterface= {
            _id: user._id
        }
        let token;
        try {
        token = jwt.sign(tokenPayload , process.env.JWT_SECRET as string)
        } catch (error) {
            return NextResponse.json({
                status:StatusCode.INTERNAL_SERVER_ERROR,
                success:false,
                error:StatusText.INTERNAL_SERVER_ERROR,
                message:"Failed to create token"
            })
        }

        cookie.set(process.env.COOKIE_NAME as string , token)

        return NextResponse.json({
            status:StatusCode.CREATED,
            token,
            success:true,
        })
    } catch (error) {
        console.log(error)
        return  NextResponse.json({
            status:StatusCode.INTERNAL_SERVER_ERROR,
            success:false,
            error:StatusText.INTERNAL_SERVER_ERROR,
            message:(error as Error).message
        })
    }
    
}
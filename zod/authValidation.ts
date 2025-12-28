import z from "zod"

export const signInbodyValidation  = z.object({
    email:z.email("email is not valid!"),
    password:z.string().min(6, {error:"Please provide password atleast more than 6 length!"})
})
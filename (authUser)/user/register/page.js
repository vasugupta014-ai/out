'use client'
import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
      <>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
          <div className="space-y-2 text-center">
            <h1 className="font-medium text-3xl">Create your account</h1>
            <p className="text-muted-foreground text-sm">Please enter your details to register.</p>
          </div>
          <div className="space-y-4">
            <form onSubmit={submitForm} className="gap-4">
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input id="name"
                    type="text"
                    value={name}
                    className="block mt-1 w-full"
                    onChange={event => setName(event.target.value)}
                    required
                    autoFocus placeholder="John Doe" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full"
                    onChange={event => setEmail(event.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        placeholder="••••••••"
                        onChange={event => setPassword(event.target.value)} 
                        required 
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full"
                        placeholder="••••••••"
                        onChange={event =>
                            setPasswordConfirmation(event.target.value)
                        } 
                        required 
                      />
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit">Create Account</Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>

        <div className="absolute top-5 flex w-full justify-end px-10">
          <div className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link prefetch={false} className="text-foreground" href="login">
              Login
            </Link>
          </div>
        </div>

        <div className="absolute bottom-5 flex w-full justify-between px-10">
          <div className="text-sm">{APP_CONFIG.copyright}</div>
          <div className="flex items-center gap-1 text-sm">
            <Globe className="size-4 text-muted-foreground" />
            ENG
          </div>
        </div>
      </>
    )
}

export default Page

// export default function RegisterV2() {
//   return (
//     <>
//       <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
//         <div className="space-y-2 text-center">
//           <h1 className="font-medium text-3xl">Create your account</h1>
//           <p className="text-muted-foreground text-sm">Please enter your details to register.</p>
//         </div>
//         <div className="space-y-4">
//           {/* <RegisterForm /> */}
//         </div>
//       </div>

//       <div className="absolute top-5 flex w-full justify-end px-10">
//         <div className="text-muted-foreground text-sm">
//           Already have an account?{" "}
//           <Link prefetch={false} className="text-foreground" href="login">
//             Login
//           </Link>
//         </div>
//       </div>

//       <div className="absolute bottom-5 flex w-full justify-between px-10">
//         <div className="text-sm">{APP_CONFIG.copyright}</div>
//         <div className="flex items-center gap-1 text-sm">
//           <Globe className="size-4 text-muted-foreground" />
//           ENG
//         </div>
//       </div>
//     </>
//   );
// }

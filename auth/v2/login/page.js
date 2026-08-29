'use client'
import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginV2 = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <>
        
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
                <div className="space-y-2 text-center">
                <h1 className="font-medium text-3xl">Login to your account</h1>
                <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
                </div>
                <div className="space-y-4">
                    <form onSubmit={submitForm} className="flex flex-col gap-4">
                        <FieldGroup className="gap-4">
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    className="block mt-1 w-full"
                                    onChange={event => setEmail(event.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    autoFocus
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                                </div>
                                <Input id="password"
                                type="password"
                                value={password}
                                className="block mt-1 w-full"
                                onChange={event => setPassword(event.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password" />
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    onChange={event =>
                                        setShouldRemember(event.target.checked)
                                    }
                                />
                                <FieldContent>
                                    <FieldLabel htmlFor="remember_me" className="font-normal">
                                        Remember Me
                                    </FieldLabel>
                                </FieldContent>
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </div>
        
            <div className="absolute top-5 flex w-full justify-end px-10">
                <div className="text-muted-foreground text-sm">
                Don&apos;t have an account?{" "}
                <Link prefetch={false} className="text-foreground" href="register">
                    Register
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

export default LoginV2

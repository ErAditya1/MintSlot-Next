'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/api';
import Image from 'next/image';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [resendCode, setResendCode] = useState(false)

  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmitting(true)
      const username = params.username;
      const response = await api.post<ApiResponse>(`/api/v1/users/verify-code`, {
        username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'success',
      });

      router.replace('/sign-in');
    } catch (error) {
      setIsSubmitting(false)
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resendCodeHandler = async () => {
    if (resendCode) return
    try {
      setResendCode(true)
      const username = params.username;
      const response = await api.patch<ApiResponse>(`/api/v1/users/verify-code`, {
        username,
      });
      if(response.status === 200) {
        toast({
          title: 'Verify Code Success',
          description: response.data.message,
          variant:'success',
        })
      }
    } catch (error) {
      setTimeout(() => {
        setIsSubmitting(false)
      },1000)
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Resend Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setResendCode(false)
    }finally{() => {
      setResendCode(false)
    }}
  }


  return (
    <div className="flex justify-center items-center min-h-dvh ">
      <div className="w-full max-w-md p-8 space-y-8 flex items-center flex-col bg-card border-2 text-card-foreground rounded-lg shadow-md">
        <div className="text-center flex justify-center flex-col items-center">
          <div className='w-20 h-20 rounded-full border-2 flex justify-center items-center'>
            <Image
              src='/logo.jpg'
              alt="Mint Slot logo"
              width={120}
              height={120}
              className=" w-full h-full rounded-full p-2 hidden dark:block"
            />
            <Image
              src='/logo.jpg'
              alt="Mint Slot logo"
              width={120}
              height={120}
              className=" w-full h-full rounded-full p-2 block dark:hidden"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-card-foreground  tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </form>
        </Form>
        {
          !resendCode && <p className='cursor-pointer text-blue-700 float-righ select-nonet'onClick={resendCodeHandler}>Resend Code👆</p>
        }
      </div>
    </div>
  );
}

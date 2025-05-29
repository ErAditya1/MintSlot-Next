'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { Suspense } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { resetSchema } from '@/schemas/signInSchema';
import { useState } from 'react';
import { EyeIcon, EyeOff, Loader2 } from 'lucide-react';
import api from '@/api';
import { ApiResponse } from '@/types/ApiResponse';
import { AxiosError } from 'axios';
import Image from 'next/image';
import BottomGradient from '@/components/BottomGradient';

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get the query parameter 'token'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      password1: '',
    },
  });


  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    setIsSubmitting(true);

    try {

      const res = await api.post('/v1/users/reset-password', { password: data.password, password1: data.password1, resetToken: token });

      if (res) {
        toast({
          title: 'Success',
          description: res.data.message,
          variant: 'success',
        });
        router.replace('/sign-in')
      }
      setIsSubmitting(false);


    } catch (error) {

      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;


      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    
      <div className="flex justify-center items-center min-h-dvh ">
        <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground  border-2 rounded-lg shadow-md">
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

            <h1 className="text-4xl font-extrabold text-foreground tracking-tight lg:text-5xl mb-6">
              Reset Pasword
            </h1>
            <p className="mb-4">Sign in to continue your secret conversations</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password1"
                control={form.control}
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel> Confirm Password</FormLabel>
                    <Input type={showPassword ? "text" : 'password'} {...field} />
                    <span className="text-gray-400 hover:text-gray-600 cursor-pointer absolute right-2 bottom-2" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <EyeIcon />}
                    </span>

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
                  'Save Password'

                )}
                <BottomGradient />
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not a member yet?
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
   

  );
}

export default function Reset() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>

  );
};

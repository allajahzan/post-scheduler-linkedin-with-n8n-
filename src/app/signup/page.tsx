'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSignup, useUser } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  telegram_chat_id: z.string().min(1, 'Telegram Chat ID is required'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const signup = useSignup();
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (user && !isLoading) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const onSubmit = (data: SignupFormValues) => {
    signup.mutate(data);
  };

  if (isLoading || user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-2">
            <Send className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Sign up to start scheduling your Telegram posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telegram Chat ID</label>
              <Input placeholder="e.g. 123456789" {...register('telegram_chat_id')} />
              <p className="text-xs text-muted-foreground">
                To find your Chat ID, search for <span className="font-semibold text-foreground">@userinfobot</span> on Telegram and tap Start.
              </p>
              {errors.telegram_chat_id && <p className="text-xs text-destructive">{errors.telegram_chat_id.message}</p>}
            </div>
            <Button type="submit" className="w-full mt-2" disabled={signup.isPending}>
              {signup.isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

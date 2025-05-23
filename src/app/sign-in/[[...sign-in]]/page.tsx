"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof emailSchema>;

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function validateEmailDomain(email: string): Promise<boolean> {
    try {
      // For simplicity, we'll just check if the domain is allowed directly in the client
      // This is a temporary solution until we fix the API endpoint issues
      const domain = email.split("@")[1]?.toLowerCase();
      if (!domain) return false;
      
      const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com", "company.com"];
      return allowedDomains.includes(domain);
    } catch (error) {
      console.error("Error validating email domain:", error);
      toast.error("Failed to validate email domain");
      return false;
    }
  }

  async function onSubmit(data: FormValues) {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      // First validate the email domain
      const isValidDomain = await validateEmailDomain(data.email);
      if (!isValidDomain) {
        setIsLoading(false);
        return;
      }

      // Start the magic link authentication process
      await signIn.create({
        strategy: "email_link",
        identifier: data.email,
        redirectUrl: `${window.location.origin}/verify-email`,
      });

      // If we get here, the magic link was sent successfully
      setMagicLinkSent(true);
      toast.success("Magic link sent! Check your email inbox.");
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            {magicLinkSent
              ? "Check your email for the magic link"
              : "Enter your email to receive a magic link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!magicLinkSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Magic Link"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <p className="text-center text-sm text-muted-foreground">
                We've sent a magic link to your email. Click the link to sign in.
              </p>
              <Button
                variant="outline"
                onClick={() => setMagicLinkSent(false)}
                className="w-full"
              >
                Use a different email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

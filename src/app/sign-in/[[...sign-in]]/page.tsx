"use client";

import { useState, useEffect } from "react";
import { useSignIn, useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ALLOWED_DOMAINS } from "~/lib/auth/allowed-domains";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type FormValues = z.infer<typeof emailSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [emailForSignUp, setEmailForSignUp] = useState("");
  
  // Ha a felhasználó már be van jelentkezve, átirányítjuk a főoldalra
  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  // Ha az email cím változik a regisztrációs űrlapban, frissítjük azt
  useEffect(() => {
    if (emailForSignUp) {
      signUpForm.setValue("email", emailForSignUp);
    }
  }, [emailForSignUp, signUpForm]);

  async function validateEmailDomain(email: string): Promise<boolean> {
    try {
      // For simplicity, we'll just check if the domain is allowed directly in the client
      const domain = email.split("@")[1]?.toLowerCase();
      if (!domain) {
        toast.error("Please enter a valid email address");
        return false;
      }
      
      if (!ALLOWED_DOMAINS.includes(domain)) {
        toast.error(`Email domain ${domain} is not allowed`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error validating email domain:", error);
      toast.error("Error validating email domain");
      return false;
    }
  }

  async function onSignUpSubmit(data: SignUpFormValues) {
    if (!isSignUpLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // Létrehozzuk a felhasználót a Clerk signUp API-jával
      await signUp?.create({
        emailAddress: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      // Küldünk verifikciós emailt a signUp-on keresztül
      await signUp?.prepareEmailAddressVerification({
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/verify-email`,
      });
      
      // Jelezzük a felhasználónak, hogy a regisztráció folyamatban van
      setMagicLinkSent(true);
      setShowSignUpForm(false);
      toast.success("Verification email sent! Please check your inbox to complete registration.");
    } catch (error) {
      console.error("Error creating user account:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: FormValues) {
    if (!isSignInLoaded || !isSignUpLoaded) {
      return;
    }

    setIsLoading(true);

    try {
      // Validate email domain
      const isValid = await validateEmailDomain(data.email);
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Try to sign in with magic link
      try {
        await signIn?.create({
          strategy: "email_link",
          identifier: data.email,
          redirectUrl: `${window.location.origin}/verify-email`,
        });
        
        // Ha ide eljutunk, akkor a magic link elküldése sikeres volt
        setMagicLinkSent(true);
        toast.success("Magic link sent! Check your email inbox.");
      } catch (error) {
        // Ha a felhasználó még nem létezik, kérjük el a kereszt- és vezetéknevet
        if (error instanceof Error && error.message.includes("Couldn't find your account")) {
          console.log("User not found, showing sign up form...");
          setEmailForSignUp(data.email);
          setShowSignUpForm(true);
          setIsLoading(false);
          return;
        } else {
          // Ha más hiba történt, dobjuk tovább
          console.error("Error during sign in:", error);
          toast.error("An error occurred during sign in. Please try again.");
          throw error;
        }
      }
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
        <CardHeader>
          <CardTitle>{showSignUpForm ? "Create Account" : "Sign In"}</CardTitle>
          <CardDescription>
            {showSignUpForm 
              ? "Complete your account information" 
              : "Enter your email address to receive a magic link"}
          </CardDescription>
        </CardHeader>

        {magicLinkSent ? (
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a magic link to your email address
                </p>
              </div>
            </div>
          </CardContent>
        ) : showSignUpForm ? (
          <CardContent>
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={true} // Email is already set and cannot be changed
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          type="text"
                          autoCapitalize="words"
                          autoComplete="given-name"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          type="text"
                          autoCapitalize="words"
                          autoComplete="family-name"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* CAPTCHA elem a Clerk számára a regisztrációs űrlapon is */}
                <div 
                  id="clerk-captcha" 
                  className="mt-4" 
                  data-cl-theme="dark" 
                  data-cl-size="flexible"
                ></div>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    disabled={isLoading}
                    onClick={() => setShowSignUpForm(false)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        ) : (
          <CardContent>
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
                          placeholder="Enter your email address"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      {/* CAPTCHA elem a Clerk számára - sötét témával és rugalmas mérettel */}
                      <div 
                        id="clerk-captcha" 
                        className="mt-4" 
                        data-cl-theme="dark" 
                        data-cl-size="flexible"
                      ></div>
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
          </CardContent>
        )}
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

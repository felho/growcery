"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, setActive } = useSignIn();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!isLoaded) return;

    async function verifySignIn() {
      try {
        // Get the verification status and session from the URL
        const status = searchParams.get("__clerk_status");
        const sessionId = searchParams.get("__clerk_created_session");
        
        // Log the URL parameters to help with debugging
        console.log("URL parameters:", Object.fromEntries(searchParams.entries()));
        
        if (status === "verified" && sessionId) {
          // If we have a verified status and session ID, we can consider the verification successful
          setVerificationStatus("success");
          toast.success("Successfully signed in!");
          
          // Set the active session if needed
          if (setActive) {
            try {
              await setActive({ session: sessionId });
            } catch (error) {
              console.error("Error setting active session:", error);
              // Even if this fails, we'll still consider the verification successful
              // since Clerk has already created the session
            }
          }
          
          // Redirect to the home page after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setVerificationStatus("error");
          setErrorMessage("Verification failed. Please try signing in again.");
          toast.error("Verification failed. Please try signing in again.");
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setVerificationStatus("error");
        setErrorMessage("An error occurred during verification. Please try again.");
        toast.error("An error occurred during verification. Please try again.");
      }
    }

    verifySignIn();
  }, [isLoaded, searchParams, setActive, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            {verificationStatus === "loading"
              ? "Verifying your email..."
              : verificationStatus === "success"
              ? "Email verified successfully!"
              : "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-4">
          {verificationStatus === "loading" ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : verificationStatus === "success" ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                You have been successfully signed in. Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">{errorMessage}</p>
              <Button onClick={() => router.push("/sign-in")}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

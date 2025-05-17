"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { submitWhaleApplication, checkApplicationStatus } from "@/actions/whale-application";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { WalletButton } from "@/components/wallet/wallet-button";
import { CheckCircle, AlertCircle, Clock, Ban, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  strategies: z.object({
    defi: z.boolean().optional(),
    nft: z.boolean().optional(),
    yield: z.boolean().optional(),
    staking: z.boolean().optional(),
    dao: z.boolean().optional(),
    meme: z.boolean().optional(),
  }),
  monetizationModel: z.enum(["public", "paid"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplyPage() {
  const { publicKey, connected } = useWallet();
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<{
    status: string | null;
    message: string;
    submittedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
  } | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    status?: string | null;
  } | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      twitter: "",
      telegram: "",
      strategies: {
        defi: false,
        nft: false,
        yield: false,
        staking: false,
        dao: false,
        meme: false,
      },
      monetizationModel: "public",
    },
  });

  // Check application status when wallet connects
  useEffect(() => {
    async function checkStatus() {
      if (connected && publicKey) {
        setChecking(true);
        try {
          const status = await checkApplicationStatus(publicKey.toString());
          setApplicationStatus(status);
        } catch (error) {
          console.error("Error checking application status:", error);
        } finally {
          setChecking(false);
        }
      } else {
        setApplicationStatus(null);
      }
    }

    checkStatus();
  }, [connected, publicKey]);

  // Handle form submission
  async function handleSubmit(values: FormValues) {
    if (!publicKey) return;

    // Don't allow submission if there's a pending application
    if (applicationStatus?.status === "pending") {
      setSubmitResult({
        success: false,
        message: applicationStatus.message,
        status: "pending",
      });
      return;
    }

    // Don't allow submission if already approved
    if (applicationStatus?.status === "approved") {
      setSubmitResult({
        success: false,
        message: applicationStatus.message,
        status: "approved",
      });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitWhaleApplication({
        ...values,
        walletAddress: publicKey.toString(),
      });

      setSubmitResult(result);

      // Update application status after submission
      if (result.success) {
        setApplicationStatus({
          status: result.status || null,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error submitting whale application:", error);
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Render application status message
  function renderApplicationStatus() {
    if (!applicationStatus) return null;

    if (applicationStatus.status === "pending") {
      return (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 text-yellow-900">
          <Clock className="h-5 w-5 text-yellow-500" />
          <AlertTitle>Application Pending</AlertTitle>
          <AlertDescription>
            {applicationStatus.message}
            {applicationStatus.submittedAt && <p className="mt-2 text-sm">Submitted on: {new Date(applicationStatus.submittedAt).toLocaleDateString()}</p>}
          </AlertDescription>
        </Alert>
      );
    } else if (applicationStatus.status === "approved") {
      return (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-900">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle>Application Approved</AlertTitle>
          <AlertDescription>
            {applicationStatus.message}
            {applicationStatus.approvedAt && <p className="mt-2 text-sm">Approved on: {new Date(applicationStatus.approvedAt).toLocaleDateString()}</p>}
          </AlertDescription>
        </Alert>
      );
    } else if (applicationStatus.status === "rejected") {
      return (
        <Alert className="mb-6 border-red-500 bg-red-50 text-red-900">
          <Ban className="h-5 w-5 text-red-500" />
          <AlertTitle>Application Rejected</AlertTitle>
          <AlertDescription>
            {applicationStatus.message}
            {applicationStatus.rejectedAt && <p className="mt-2 text-sm">Rejected on: {new Date(applicationStatus.rejectedAt).toLocaleDateString()}</p>}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Apply to Become a Whale</h1>
        <p className="mt-4 text-muted-foreground">Join our exclusive network of Solana whales and share your insights with the community</p>
      </div>

      {renderApplicationStatus()}

      {submitResult && !applicationStatus && (
        <Alert className={`mb-6 ${submitResult.success ? "border-green-500 bg-green-50 text-green-900" : "border-red-500 bg-red-50 text-red-900"}`}>
          {submitResult.success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
          <AlertTitle>{submitResult.success ? "Success!" : "Error"}</AlertTitle>
          <AlertDescription>{submitResult.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Whale Application</CardTitle>
          <CardDescription>Fill out this form to apply for whale status. Your application will be reviewed by our team.</CardDescription>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-center text-muted-foreground">Please connect your wallet to apply</p>
              <WalletButton />
            </div>
          ) : checking ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-center text-muted-foreground">Checking application status...</p>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : applicationStatus?.status === "pending" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 text-center">
                <h3 className="text-xl font-semibold text-yellow-600">Application Under Review</h3>
                <p className="mt-2 text-muted-foreground">Your application is currently being reviewed by our team. We'll notify you once a decision has been made.</p>
                {applicationStatus.submittedAt && <p className="mt-4 text-sm text-muted-foreground">Submitted on: {new Date(applicationStatus.submittedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          ) : applicationStatus?.status === "approved" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 text-center">
                <h3 className="text-xl font-semibold text-green-600">Application Approved</h3>
                <p className="mt-2 text-muted-foreground">Congratulations! Your wallet has been approved as a whale. You can now access all whale features.</p>
                {applicationStatus.approvedAt && <p className="mt-4 text-sm text-muted-foreground">Approved on: {new Date(applicationStatus.approvedAt).toLocaleDateString()}</p>}
              </div>
              <Button className="mt-4" asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Profile Information</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your display name" {...field} />
                            </FormControl>
                            <FormDescription>This is how you'll appear to other users</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about your experience in crypto" className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>Share your background, expertise, and investment philosophy</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Social Media</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telegram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telegram</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Investment Strategies</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="strategies.defi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.defi" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.defi">DeFi</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strategies.nft"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.nft" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.nft">NFTs</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strategies.yield"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.yield" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.yield">Yield Farming</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strategies.staking"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.staking" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.staking">Staking</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strategies.dao"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.dao" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.dao">DAOs</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strategies.meme"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} id="strategies.meme" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="strategies.meme">Meme Coins</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Monetization Model</h3>
                    <FormField
                      control={form.control}
                      name="monetizationModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="public" id="public" />
                                </FormControl>
                                <Label htmlFor="public">Public - Share insights with everyone</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="paid" id="paid" />
                                </FormControl>
                                <Label htmlFor="paid">Paid - Premium insights for subscribers</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting || applicationStatus?.status === "pending" || applicationStatus?.status === "approved"}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            By submitting this application, you agree to our Terms of Service and Privacy Policy. Your wallet address will be used to verify your on-chain activity.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import CurrencyComboBox from "@/components/CurrencyComboBox";

const OnboardingPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-white dark:from-black dark:to-black">
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-6 text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
            <Wallet className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome,{" "}
            <span className="text-amber-600 dark:text-amber-400">
              {user.firstName}!
            </span>
          </h1>
          <p className="text-xl text-black dark:text-white">
            Let&apos;s personalize your financial experience
          </p>
          <div className="h-1 w-20 bg-amber-600 dark:bg-amber-400 mx-auto rounded-full" />
        </div>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              Choose Your Currency
            </CardTitle>
            <CardDescription className="text-base text-black dark:text-white">
              Select the primary currency for your transactions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <CurrencyComboBox />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <Link href="/" className="block">
                <Button className="w-full h-12 text-lg font-semibold group bg-amber-600 hover:bg-slate-900 text-white">
                  Take me to my wallet
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-center text-black dark:text-white">
                You can adjust these settings anytime from your profile
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Logo className="h-8 w-auto opacity-75 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

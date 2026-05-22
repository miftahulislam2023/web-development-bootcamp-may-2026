import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { statsData, featuresData, howItWorksData, testimonialsData } from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mt-20">
      <HeroSection />

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold">What BudgeTX does for you</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl font-bold">Three steps to get started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold">
              <AnimatedGradientText>
                What people are saying
              </AnimatedGradientText>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((t, i) => (
              <Card key={i} className={`p-6 border-l-4 ${t.borderColor}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.initials}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 dark:bg-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to give it a try?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            No credit card. No setup fees. Just you and your money.
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>No credit card required</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
}

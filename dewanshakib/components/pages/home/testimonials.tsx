"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "Khorcha helped me understand where my money goes. The radar chart is genius—it shows my spending patterns at a glance!",
    name: "Rahul Sharma",
    role: "Software Engineer",
    initials: "RS",
  },
  {
    quote:
      "Finally, a simple expense tracker that doesn't overwhelm. I can record transactions in seconds and check my monthly history easily.",
    name: "Priya Patel",
    role: "Marketing Manager",
    initials: "PP",
  },
  {
    quote:
      "The categories feature is a game-changer. I created custom categories for all my expenses and now I know exactly where to cut back.",
    name: "Amit Kumar",
    role: "Freelancer",
    initials: "AK",
  },
  {
    quote:
      "I love the dark mode and the clean interface. Tracking my daily expenses has become a habit, not a chore.",
    name: "Sneha Gupta",
    role: "Designer",
    initials: "SG",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Budget-Conscious Users
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have taken control of their finances with Khorcha.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/60 backdrop-blur"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-foreground italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
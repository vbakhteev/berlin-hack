"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PageProps = { params: Promise<{ token: string }> };

export default function FormPage({ params }: PageProps) {
  const { token } = use(params);

  return (
    <main className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-lg">
        <div className="py-6">
          <h1 className="text-xl font-bold">Complete your claim</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your invoice and any receipts to finalise your claim.
          </p>
        </div>

        <Card className="mb-4">
          <CardContent className="py-4 px-4 space-y-4">
            <div>
              <Label htmlFor="invoice">Invoice or receipt</Label>
              <Input id="invoice" type="file" accept=".pdf,.jpg,.png" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="total">Invoice total (EUR)</Label>
              <Input id="total" type="number" placeholder="0.00" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="notes">Additional notes</Label>
              <Input id="notes" placeholder="Anything else to add?" className="mt-1.5" />
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full h-14">
          Submit claim
        </Button>
      </div>
    </main>
  );
}

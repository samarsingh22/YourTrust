"use client"

import { useState } from "react"
import { Sparkles, Check, AlertCircle, Loader2, X, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateInstallmentPlans, InstallmentPlan } from "@/app/actions/generate-installment-plan"
import { cn } from "@/lib/utils"

interface InstallmentPlanGeneratorProps {
  amount: number
  currency?: string
  dueDate: string
  borrowerName: string
  agreementId: string
  userRole: 'lender' | 'borrower'
  userId?: string
  planStatus?: 'pending' | 'accepted' | 'declined' | null
  existingPlan?: InstallmentPlan | null
  onPlanConfirmed?: (plan: InstallmentPlan, planIndex: number) => void
  onReviewComplete?: () => void
}

export function InstallmentPlanGenerator({
  amount,
  currency = "INR",
  dueDate,
  borrowerName,
  agreementId,
  userRole,
  userId,
  planStatus = null,
  existingPlan = null,
  onPlanConfirmed,
  onReviewComplete,
}: InstallmentPlanGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<InstallmentPlan[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && userRole === 'borrower' && plans.length === 0 && !loading && !planStatus) {
      fetchPlans()
    }
  }

  const fetchPlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await generateInstallmentPlans(amount, currency, dueDate, borrowerName)
      if (result.error) {
        setError(result.error)
      } else if (result.plans) {
        setPlans(result.plans)
      }
    } catch (e) {
      setError("An unexpected error occurred while generating plans.")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (index: number) => {
    setSelectedPlanIndex(index)
  }

  const handleConfirmPlan = async () => {
    if (selectedPlanIndex === null) return
    setSubmitting(true)
    try {
      const plan = plans[selectedPlanIndex]
      const res = await fetch(`/api/agreements/${agreementId}/save-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planIndex: selectedPlanIndex,
          planName: plan.planName,
          installments: plan.installments,
          status: 'pending',
        }),
      })
      if (res.ok) {
        if (onPlanConfirmed) onPlanConfirmed(plan, selectedPlanIndex)
        setIsOpen(false)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save plan")
      }
    } catch {
      setError("Failed to save plan")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReview = async (decision: 'accepted' | 'declined') => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/agreements/${agreementId}/review-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, decision }),
      })
      if (res.ok) {
        setIsOpen(false)
        if (onReviewComplete) onReviewComplete()
      } else {
        const data = await res.json()
        setError(data.error || `Failed to ${decision} plan`)
      }
    } catch {
      setError(`Failed to ${decision} plan`)
    } finally {
      setSubmitting(false)
    }
  }

  // --- Lender: view existing pending plan ---
  if (userRole === 'lender') {
    const lenderPlan = existingPlan
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 bg-transparent border-primary/30 text-primary hover:bg-primary/10 transition-all hover:border-primary/50"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Review Installment Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base">Installment Request</DialogTitle>
                <DialogDescription className="truncate text-xs">
                  {borrowerName} requested this repayment plan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 p-3 pt-1">
            {!lenderPlan ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-muted-foreground">No installment plan request yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{lenderPlan.planName}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {(lenderPlan as any).durationMonths || Math.ceil(lenderPlan.installments.length / 4)} Months
                  </Badge>
                </div>
                <CardDescription className="text-xs">{lenderPlan.description}</CardDescription>

                <ScrollArea className="max-h-[220px] w-full">
                  <div className="space-y-1 pr-1">
                    {lenderPlan.installments.map((inst: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="h-5 w-5 rounded-full bg-background flex items-center justify-center border border-border text-[9px] text-muted-foreground font-mono shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-[11px] font-medium">
                            {new Date(inst.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span className="font-semibold text-primary shrink-0 text-[11px]">
                          {currency === "INR" ? "₹" : currency} {inst.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="px-3 py-1.5 bg-muted/30 rounded border border-border">
                  <div className="flex justify-between items-center font-semibold text-xs">
                    <span>Total</span>
                    <span>{currency === "INR" ? "₹" : currency} {lenderPlan.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {lenderPlan && (
            <div className="p-3 pt-1 border-t border-border shrink-0 flex gap-2">
              <Button
                onClick={() => handleReview('declined')}
                disabled={submitting}
                variant="outline"
                className="flex-1 h-10 text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <ThumbsDown className="mr-1 h-4 w-4" />
                {submitting ? "Processing..." : "Decline"}
              </Button>
              <Button
                onClick={() => handleReview('accepted')}
                disabled={submitting}
                className="flex-1 h-10 text-sm"
              >
                <ThumbsUp className="mr-1 h-4 w-4" />
                {submitting ? "Processing..." : "Accept"}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 pt-0 shrink-0">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  // --- Borrower: generate and select a plan ---
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 bg-transparent border-primary/30 text-primary hover:bg-primary/10 transition-all hover:border-primary/50"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Installment Plan with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1100px] max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base">AI Installment Planner</DialogTitle>
              <DialogDescription className="truncate text-xs">
                Smart repayment schedules tailored for {borrowerName}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 p-3 pt-1">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
                <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
              </div>
              <p className="text-muted-foreground text-sm animate-pulse">
                Analyzing financial context & generating plans...
              </p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-base font-semibold text-destructive">Generation Failed</h3>
              <p className="text-muted-foreground text-sm max-w-md">{error}</p>
              <Button onClick={fetchPlans} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full overflow-y-auto pr-1">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={cn(
                    "flex flex-col border cursor-pointer relative group",
                    selectedPlanIndex === index ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onClick={() => handleSelectPlan(index)}
                >
                  {selectedPlanIndex === index && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold rounded-es z-20">
                      SELECTED
                    </div>
                  )}
                  <CardHeader className="p-3 pb-2 bg-muted/30">
                    <div className="flex justify-between items-center gap-1">
                      <span className="font-semibold text-sm truncate">{plan.planName}</span>
                      <Badge variant={index === 0 ? "destructive" : index === 1 ? "default" : "secondary"} className="shrink-0 text-[10px] px-1.5 py-0">
                        {(plan as any).durationMonths || Math.ceil(plan.installments.length / 4)}M
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs min-h-[30px]">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                    <ScrollArea className="flex-1 min-h-[120px] max-h-[180px] w-full px-3 py-1">
                      <div className="space-y-1">
                        {plan.installments.map((inst: any, i: number) => (
                          <div key={i} className="flex justify-between items-center gap-1 p-1.5 rounded bg-secondary/20">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="h-5 w-5 rounded-full bg-background flex items-center justify-center border border-border text-[9px] text-muted-foreground font-mono shrink-0">
                                {i + 1}
                              </div>
                              <div className="min-w-0 leading-tight">
                                <span className="text-[11px] font-medium">
                                  {new Date(inst.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                {inst.note && <span className="block text-[9px] text-muted-foreground truncate">{inst.note}</span>}
                              </div>
                            </div>
                            <span className="font-semibold text-primary shrink-0 text-[11px]">
                              {currency === "INR" ? "₹" : currency} {inst.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="px-3 py-1.5 bg-muted/30 border-t border-border">
                      <div className="flex justify-between items-center font-semibold text-xs">
                        <span>Total</span>
                        <span>{currency === "INR" ? "₹" : currency} {plan.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-1">
                    <Button
                      className={cn("w-full text-xs h-8", selectedPlanIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                      variant={selectedPlanIndex === index ? "default" : "secondary"}
                      size="sm"
                    >
                      {selectedPlanIndex === index ? (
                        <><Check className="mr-1 h-3 w-3" /> Selected</>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        {!loading && !error && selectedPlanIndex !== null && (
          <div className="p-3 pt-1 border-t border-border shrink-0">
            <Button
              onClick={handleConfirmPlan}
              disabled={submitting}
              className="w-full h-10 text-sm font-semibold gap-1"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Check className="h-4 w-4" /> Confirm Plan & Request</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

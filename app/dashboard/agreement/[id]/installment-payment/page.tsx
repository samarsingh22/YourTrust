"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface InstallmentData {
  date: string
  amount: number
  note?: string
  proofUploaded: boolean
  proofUrl?: string
  proofFileName?: string
  uploadedAt?: string
}

export default function InstallmentPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = use(params)
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [agreement, setAgreement] = useState<any>(null)
  const [installments, setInstallments] = useState<InstallmentData[]>([])
  const [payingIndex, setPayingIndex] = useState<number | null>(null)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [allDone, setAllDone] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Check if redirected from pay page after marking an installment
  const markedIndex = searchParams.get("marked")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid)
        await fetchAgreement(user.uid)
      } else {
        router.push("/auth/signin")
      }
    })
    return () => unsubscribe()
  }, [router, id])

  // When marked param changes (redirect from pay page), refetch
  useEffect(() => {
    if (markedIndex && currentUserId) {
      fetchAgreement(currentUserId)
    }
  }, [markedIndex])

  const fetchAgreement = async (uid?: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/agreements/${id}`)
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Error", description: "Agreement not found.", variant: "destructive" })
        router.push("/dashboard")
        return
      }
      const agg = data.agreement
      setAgreement(agg)

      const plan = agg.selectedInstallmentPlan
      if (!plan || plan.status !== "accepted") {
        toast({ title: "No Plan", description: "No accepted installment plan found.", variant: "destructive" })
        router.push(`/dashboard/agreement/${id}`)
        return
      }

      setInstallments(plan.installments)
      const allPaid = plan.installments.every((inst: InstallmentData) => inst.proofUploaded)
      setAllDone(allPaid)
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const isBorrower = agreement?.borrowerId === currentUserId
  const isLender = agreement?.lenderId === currentUserId

  // "Direct Pay & Close" — redirect to pay page with installment index
  const handleDirectPay = (index: number) => {
    router.push(`/dashboard/agreement/${id}/pay?installment=${index}`)
  }

  // "Upload & Close" — upload file now, mark installment now
  const handleUploadPay = async (index: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploadingIndex(index)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

        const payRes = await fetch(`/api/agreements/${id}/pay-installment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            installmentIndex: index,
            paymentMethod: "upload",
            fileName: uploadData.fileName,
            fileUrl: uploadData.fileUrl,
          }),
        })
        const payData = await payRes.json()
        if (!payRes.ok) throw new Error(payData.error)

        toast({
          title: `Installment ${index + 1} Paid`,
          description: "Payment proof uploaded and installment marked as paid.",
        })

        await fetchAgreement()
      } catch (err: any) {
        toast({ title: "Failed", description: err.message, variant: "destructive" })
      } finally {
        setUploadingIndex(null)
      }
    }
    input.click()
  }

  const formatCurrency = (amount: number) =>
    "₹" + amount.toLocaleString("en-IN")

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Loading installment plan...</p>
        </div>
      </div>
    )
  }

  const totalPaid = installments.filter((i) => i.proofUploaded).length
  const totalCount = installments.length

  return (
    <div className="mx-auto max-w-xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={`/dashboard/agreement/${id}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Installment Payments</h1>
          <p className="text-sm text-muted-foreground">
            {isBorrower ? `Pay each installment to ${agreement?.lenderName}` : `${agreement?.borrowerName}'s repayment plan`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{totalPaid} of {totalCount} paid</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (totalPaid / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Installment boxes */}
      <div className="space-y-4 mb-6">
        {installments.map((inst, idx) => {
          const isPaid = inst.proofUploaded
          const isPaying = payingIndex === idx
          const isUploading = uploadingIndex === idx

          return (
            <div
              key={idx}
              className={`rounded-xl border p-5 transition-all ${
                isPaid
                  ? "border-green-200 bg-green-50/50"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isPaid
                      ? "bg-green-500 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {isPaid ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Installment {idx + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(inst.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(inst.amount)}</p>
                  {isPaid && (
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1 justify-end">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </p>
                  )}
                </div>
              </div>

              {/* Actions — only borrower can pay */}
              {isBorrower && !isPaid && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleDirectPay(idx)}
                    disabled={isPaying || isUploading}
                    className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPaying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Banknote className="mr-2 h-4 w-4" />
                    )}
                    Direct Pay & Close
                  </Button>
                  <Button
                    onClick={() => handleUploadPay(idx)}
                    disabled={isPaying || isUploading}
                    variant="outline"
                    className="h-12 border-primary text-primary hover:bg-primary/10"
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload & Close
                  </Button>
                </div>
              )}

              {/* Lender sees status only */}
              {isLender && (
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              )}

              {/* Uploaded proof info */}
              {isPaid && inst.proofFileName && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-100/50 px-3 py-2 text-xs text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Proof: {inst.proofFileName}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* All done state */}
      {allDone && (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-green-700 text-lg mb-1">All Installments Paid!</h3>
          <p className="text-sm text-green-600 mb-4">
            You have completed all {totalCount} installments. The lender will be notified to verify and confirm receipt.
          </p>
          <Button
            onClick={() => router.push(`/dashboard/agreement/${id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Return to Agreement
          </Button>
        </div>
      )}

      {!allDone && (
        <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Use "Direct Pay & Close" to pay through the payment page and upload proof, or use "Upload & Close" to upload proof directly. When done, click "Save Changes" to return to the agreement.
          </p>
        </div>
      )}
    </div>
  )
}

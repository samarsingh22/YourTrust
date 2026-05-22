"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface Agreement {
  _id: string
  borrowerName: string
  lenderName: string
  amount: number
  purpose?: string
  dueDate: string
  status: string
  witnessApproved: boolean
  witnessEmail?: string
  dealType?: string
}

const statusBadge: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-primary/20 text-primary" },
  pending_witness: { label: "Pending Witness", color: "bg-orange/20 text-orange" },
  reviewing: { label: "Reviewing", color: "bg-chart-3/20 text-chart-3" },
  settled: { label: "Settled", color: "bg-muted text-muted-foreground" },
  overdue: { label: "Overdue", color: "bg-red-500/20 text-red-500" },
}

export default function WitnessPage() {
  const router = useRouter()
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchWitnessAgreements(user.email || "")
      } else {
        router.push("/auth/signin")
      }
    })
    return () => unsubscribe()
  }, [router])

  const fetchWitnessAgreements = async (email: string) => {
    try {
      setLoading(true)
      // Use witnessEmail param to get agreements where user is witness
      const res = await fetch(`/api/agreements?witnessEmail=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (res.ok) {
        setAgreements(data.agreements || [])
      }
    } catch (err) {
      console.error("Error", err)
    } finally {
      setLoading(false)
    }
  }

  const daysUntilDue = (d: string) =>
    Math.ceil((new Date(d).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const pendingCount = agreements.filter((a) => !a.witnessApproved).length

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Witness Agreements</h1>
          <p className="text-sm text-muted-foreground">
            Agreements where you are the witness
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 text-chart-3 mb-1">
          <Eye className="h-5 w-5" />
          <span className="text-sm font-medium text-muted-foreground">Pending Approval</span>
        </div>
        <div className="text-3xl font-bold text-chart-3">
          {pendingCount}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {agreements.length} total witness agreements
        </div>
        {pendingCount > 0 && (
          <p className="text-xs text-chart-3 font-medium mt-2">
            You have {pendingCount} agreement{pendingCount > 1 ? "s" : ""} awaiting your approval
          </p>
        )}
      </div>

      {/* Agreements list */}
      <div className="space-y-3">
        {agreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border bg-card">
            <Eye className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No Witness Agreements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven&apos;t been added as a witness to any agreement yet
            </p>
            <Link href="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          agreements.map((agreement) => {
            const dueDays = daysUntilDue(agreement.dueDate)
            const badge = statusBadge[agreement.status] || statusBadge.active

            return (
              <Link
                key={agreement._id}
                href={`/dashboard/agreement/${agreement._id}`}
                className="block rounded-xl border border-border bg-card p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                      agreement.witnessApproved
                        ? "bg-green-100 text-green-600"
                        : "bg-chart-3/20 text-chart-3"
                    }`}>
                      {initials(agreement.borrowerName)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{agreement.borrowerName} ↔ {agreement.lenderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {agreement.purpose || (agreement.dealType === 'asset' ? 'Asset Lending' : 'Money Lending')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{agreement.amount.toLocaleString()}</p>
                    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {agreement.witnessApproved ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-chart-3" />
                    )}
                    <span>
                      {agreement.witnessApproved
                        ? "Approved by you"
                        : "Awaiting your approval"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

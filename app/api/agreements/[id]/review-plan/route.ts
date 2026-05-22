import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agreement from '@/models/Agreement';

// POST - Lender accepts or declines an installment plan request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { userId, decision } = body;

    if (!userId || !decision || !['accepted', 'declined'].includes(decision)) {
      return NextResponse.json(
        { error: 'userId and decision (accepted|declined) are required' },
        { status: 400 }
      );
    }

    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    if (userId !== agreement.lenderId) {
      return NextResponse.json({ error: 'Only the lender can review the plan' }, { status: 403 });
    }

    if (!agreement.selectedInstallmentPlan) {
      return NextResponse.json({ error: 'No installment plan to review' }, { status: 400 });
    }

    agreement.selectedInstallmentPlan.status = decision;
    agreement.markModified('selectedInstallmentPlan');
    await agreement.save();

    return NextResponse.json(
      {
        message: `Plan ${decision} successfully`,
        status: decision,
        agreement,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Review Plan Error:', error);
    return NextResponse.json(
      { error: 'Failed to review plan', details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agreement from '@/models/Agreement';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { installmentIndex, paymentMethod, fileName, fileUrl, utrNumber } = body;

    if (installmentIndex === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: 'installmentIndex and paymentMethod are required' },
        { status: 400 }
      );
    }

    if (!['direct', 'upload'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'paymentMethod must be "direct" or "upload"' },
        { status: 400 }
      );
    }

    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const plan = agreement.selectedInstallmentPlan;
    if (!plan || plan.status !== 'accepted') {
      return NextResponse.json(
        { error: 'No accepted installment plan found' },
        { status: 400 }
      );
    }

    if (installmentIndex < 0 || installmentIndex >= plan.installments.length) {
      return NextResponse.json(
        { error: 'Invalid installment index' },
        { status: 400 }
      );
    }

    const installment = plan.installments[installmentIndex];
    installment.proofUploaded = true;
    installment.uploadedAt = new Date();

    if (paymentMethod === 'upload') {
      if (fileName) installment.proofFileName = fileName;
      if (fileUrl) installment.proofUrl = fileUrl;
    }

    const allPaid = plan.installments.every((inst: any) => inst.proofUploaded);

    if (allPaid && agreement.status !== 'reviewing' && agreement.status !== 'settled') {
      agreement.status = 'reviewing';

      // Copy the last uploaded proof to the agreement's borrowerProof for the gallery
      if (paymentMethod === 'upload' && fileUrl) {
        agreement.borrowerProof = {
          fileName: fileName || `Installment ${Number(installmentIndex) + 1} proof`,
          fileUrl: fileUrl,
          uploadedAt: new Date(),
        };
      }

      if (!agreement.timeline) agreement.timeline = [];
      const utrNote = utrNumber ? ` (UTR: ${utrNumber})` : '';
      agreement.timeline.push({
        event: `All ${plan.installments.length} installments paid${utrNote} — awaiting lender confirmation`,
        date: new Date(),
        completed: true,
      });
    }

    agreement.markModified('selectedInstallmentPlan');
    await agreement.save();

    return NextResponse.json(
      {
        message: `Installment ${installmentIndex + 1} marked as paid`,
        allInstallmentsPaid: allPaid,
        agreement,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Pay Installment Error:', error);
    return NextResponse.json(
      { error: 'Failed to pay installment', details: error.message },
      { status: 500 }
    );
  }
}

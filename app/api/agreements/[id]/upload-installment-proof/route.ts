import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agreement from '@/models/Agreement';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const installmentIndex = parseInt(formData.get('installmentIndex') as string);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (isNaN(installmentIndex)) {
      return NextResponse.json(
        { error: 'Invalid installment index' },
        { status: 400 }
      );
    }

    const agreement = await Agreement.findById(id);

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      );
    }

    if (!agreement.selectedInstallmentPlan) {
      return NextResponse.json(
        { error: 'No installment plan selected. Please select a plan first.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const result = await uploadToCloudinary(buffer, `installments/${id}`, originalName);

    const proofUrl = result.secure_url;

    if (agreement.selectedInstallmentPlan.installments[installmentIndex]) {
      agreement.selectedInstallmentPlan.installments[installmentIndex].proofUploaded = true;
      agreement.selectedInstallmentPlan.installments[installmentIndex].proofUrl = proofUrl;
      agreement.selectedInstallmentPlan.installments[installmentIndex].proofFileName = file.name;
      agreement.selectedInstallmentPlan.installments[installmentIndex].uploadedAt = new Date();

      agreement.markModified('selectedInstallmentPlan');

      await agreement.save();

      return NextResponse.json(
        {
          message: 'Proof uploaded successfully',
          proofUrl,
          fileName: file.name,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid installment index' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Upload Proof Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload proof', details: error.message },
      { status: 500 }
    );
  }
}

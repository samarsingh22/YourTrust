import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agreement from '@/models/Agreement';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { sendEmail, emailTemplates } from '@/lib/email';
import { sendNotification } from '@/lib/firebase-admin';
import { analyzeTrustScoreWithHistory } from '@/lib/near-ai';

// GET all agreements for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const witnessEmail = searchParams.get('witnessEmail');

    if (!userId && !witnessEmail) {
      return NextResponse.json(
        { error: 'Missing userId or witnessEmail parameter' },
        { status: 400 }
      );
    }

    const orConditions: any[] = [];

    if (userId) {
      orConditions.push(
        { lenderId: userId },
        { borrowerId: userId },
      );
    }

    if (witnessEmail) {
      orConditions.push({ witnessEmail });
    }

    // Find agreements where user is lender, borrower, or witness
    const agreements = await Agreement.find({
      $or: orConditions,
    }).sort({ createdAt: -1 });

    // Filter to only include agreements where user is actually involved
    const userAgreements = agreements.filter(agreement => {
      if (userId && (agreement.lenderId === userId || agreement.borrowerId === userId)) return true;
      if (witnessEmail && agreement.witnessEmail === witnessEmail) return true;
      return false;
    });

    return NextResponse.json({ agreements: userAgreements }, { status: 200 });
  } catch (error: any) {
    console.error('Get Agreements Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreements', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new agreement
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      lenderId,
      lenderName,
      lenderEmail,
      borrowerName,
      borrowerEmail,
      borrowerPhone,
      dealType = 'money',
      amount,
      purpose,
      dueDate,
      bufferDays,
      witnessName,
      witnessEmail,
      witnessPhone,
      proofFile,
      assetName,
      assetCategory,
      assetCondition,
      estimatedValue,
      instructions,
      assetPhotos,
    } = body;

    if (!lenderId || !lenderName || !lenderEmail || !borrowerName || !borrowerEmail || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (dealType === 'money' && !amount) {
      return NextResponse.json(
        { error: 'Amount is required for money lending' },
        { status: 400 }
      );
    }

    if (dealType === 'asset' && !assetName) {
      return NextResponse.json(
        { error: 'Asset name is required for asset lending' },
        { status: 400 }
      );
    }

    // VALIDATION: Check if borrower exists in the database
    const borrowerUser = await User.findOne({ email: borrowerEmail });
    if (!borrowerUser) {
      return NextResponse.json(
        {
          error: 'Borrower not found',
          message: `${borrowerEmail} is not registered on YourTrust. They must create an account first.`
        },
        { status: 404 }
      );
    }

    // VALIDATION: Check if witness exists in the database (if provided)
    if (witnessEmail) {
      const witnessUser = await User.findOne({ email: witnessEmail });
      if (!witnessUser) {
        return NextResponse.json(
          {
            error: 'Witness not found',
            message: `${witnessEmail} is not registered on YourTrust. They must create an account first.`
          },
          { status: 404 }
        );
      }
    }

    // Create timeline
    const isMoney = dealType === 'money'
    const timeline = [
      { event: 'Agreement Created', date: new Date(), completed: true },
      { event: 'Witness Approved', date: witnessEmail ? null : new Date(), completed: !witnessEmail },
      { event: isMoney ? 'Money Sent' : 'Asset Delivered', date: isMoney ? new Date() : (proofFile ? new Date() : null), completed: isMoney ? true : !!proofFile },
      { event: isMoney ? 'Payment Received' : 'Asset Returned', date: null, completed: false },
    ];

    // Create agreement (without AI analysis - will be updated after parallel ops)
    const agreementData: any = {
      lenderId,
      lenderName,
      lenderEmail,
      borrowerId: borrowerUser.uid,
      borrowerName,
      borrowerEmail,
      borrowerPhone,
      dealType,
      amount: amount || 0,
      purpose,
      dueDate: new Date(dueDate),
      type: 'lent',
      status: witnessEmail ? 'pending_witness' : 'active',
      bufferDays: bufferDays || 3,
      witnessName,
      witnessEmail,
      witnessPhone,
      witnessApproved: !witnessEmail,
      lenderProof: proofFile ? {
        fileName: proofFile.fileName,
        fileUrl: proofFile.fileUrl,
        uploadedAt: new Date(),
      } : undefined,
    }

    if (dealType === 'asset') {
      agreementData.assetName = assetName || '';
      agreementData.assetCategory = assetCategory || '';
      agreementData.assetCondition = assetCondition || '';
      agreementData.estimatedValue = estimatedValue || amount || 0;
      agreementData.instructions = instructions || '';
      agreementData.assetPhotos = assetPhotos || [];
    }

    agreementData.timeline = timeline;
    agreementData.aiMessages = [
      {
        role: 'system',
        content: 'YourTrust AI Mediator is ready to help with this agreement.',
        timestamp: new Date(),
      },
    ];

    const agreement = await Agreement.create(agreementData);

    const displayValue = dealType === 'asset' ? (estimatedValue || amount || 0) : amount;

    // Update user stats + create notifications in parallel (fast DB ops)
    await Promise.all([
      User.findOneAndUpdate({ uid: lenderId }, { $inc: { totalLent: displayValue, agreementCount: 1 } }),
      User.findOneAndUpdate({ uid: borrowerUser.uid }, { $inc: { totalBorrowed: displayValue, agreementCount: 1 } }),
      Notification.create({
        userId: lenderId,
        type: 'agreement_created',
        title: dealType === 'asset' ? 'Asset Agreement Created' : 'Agreement Created',
        description: dealType === 'asset'
          ? `You created an asset agreement with ${borrowerName} for ${assetName || 'item'}`
          : `You created an agreement with ${borrowerName} for ₹${amount}`,
        agreementId: agreement._id.toString(),
      }),
      Notification.create({
        userId: borrowerUser.uid,
        type: 'agreement_created',
        title: dealType === 'asset' ? 'New Asset Agreement' : 'New Lending Agreement',
        description: dealType === 'asset'
          ? `${lenderName} created an asset agreement with you for ${assetName || 'item'}`
          : `${lenderName} created a lending agreement with you for ₹${amount}`,
        agreementId: agreement._id.toString(),
      }),
    ]);

    // Run slow independent operations in parallel: AI analysis, emails, push notification
    const borrowerEmailTemplate = emailTemplates.agreementRequest(lenderName, borrowerName, displayValue, dueDate, agreement._id.toString());
    const witnessEmailTemplate = witnessEmail && witnessName
      ? emailTemplates.witnessApprovalRequest(lenderName, borrowerName, witnessName, agreement._id.toString())
      : null;

    const [aiResult] = await Promise.allSettled([
      analyzeTrustScoreWithHistory(amount, borrowerName, borrowerUser.uid, borrowerEmail, purpose || 'Not specified', dueDate, lenderName, lenderId, lenderEmail),
      sendEmail({ to: borrowerEmail, subject: borrowerEmailTemplate.subject, html: borrowerEmailTemplate.html }),
      witnessEmailTemplate ? sendEmail({ to: witnessEmail, subject: witnessEmailTemplate.subject, html: witnessEmailTemplate.html }) : Promise.resolve(),
      borrowerUser.fcmToken ? sendNotification(borrowerUser.fcmToken, "New Lending Agreement", `${lenderName} created a lending agreement with you for ₹${amount}`) : Promise.resolve(),
    ]);

    // If AI analysis completed, update agreement with results
    if (aiResult.status === 'fulfilled' && aiResult.value) {
      console.log('[NEAR AI] Trust analysis result:', aiResult.value);
      const analysis = aiResult.value;
      await Agreement.findByIdAndUpdate(agreement._id, {
        aiAnalysis: analysis,
        borrowerCreditReport: analysis.borrowerCreditReport || { totalAgreements: 0, onTimeRate: 100, lateCount: 0, totalAmount: 0, avgAmount: 0 },
        lenderCreditReport: analysis.lenderCreditReport || { totalAgreements: 0, avgAmount: 0, totalAmount: 0 },
      });
    } else if (aiResult.status === 'rejected') {
      console.error('[NEAR AI] Trust analysis failed:', aiResult.reason?.message);
    }

    return NextResponse.json(
      { message: 'Agreement created successfully', agreement },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Agreement Error:', error);
    return NextResponse.json(
      { error: 'Failed to create agreement', details: error.message },
      { status: 500 }
    );
  }
}

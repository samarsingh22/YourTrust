import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agreement from '@/models/Agreement';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const nearAI = new OpenAI({
  apiKey: process.env.NEAR_AI_API_KEY,
  baseURL: process.env.NEAR_AI_BASE_URL || 'https://cloud-api.near.ai/v1',
});

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

type AiSource = 'near_ai' | 'gemini' | 'fallback';

function formatTimeline(timeline: any[]): string {
  if (!timeline || timeline.length === 0) return '  No timeline events yet.';
  return timeline
    .map((t: any) => {
      const date = t.date ? new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
      return `  - ${t.event} (${date}) ${t.completed ? '✅' : '⏳'}`;
    })
    .join('\n');
}

function formatConversationHistory(messages: any[]): string {
  if (!messages || messages.length === 0) return '  No previous conversation.';
  const recent = messages.slice(-20);
  return recent
    .map((m: any) => {
      const role = m.role === 'user' ? 'User' : m.role === 'ai' ? 'AI' : 'System';
      const content = m.content.replace(/^\[(BORROWER|LENDER)\]\s*/, '');
      return `  ${role}: ${content}`;
    })
    .join('\n');
}

function buildAgreementContext(agreement: any): string {
  const dueDate = new Date(agreement.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const totalBufferDays = agreement.bufferDays || 3;
  const extensionEvents = (agreement.timeline || []).filter((t: any) =>
    t.event?.toLowerCase().includes('extended')
  );
  let usedBufferDays = 0;
  extensionEvents.forEach((event: any) => {
    const match = event.event.match(/extended.*?(\d+)/i);
    if (match) usedBufferDays += parseInt(match[1]);
  });
  const remainingBufferDays = Math.max(0, totalBufferDays - usedBufferDays);

  const plan = agreement.selectedInstallmentPlan;
  const installmentInfo = plan
    ? `${plan.planName} (${plan.status}) — ${plan.installments.length} installments, total ₹${plan.installments.reduce((s: number, i: any) => s + i.amount, 0).toLocaleString()}`
    : 'None selected';

  const report = agreement.borrowerCreditReport;
  const creditInfo = report
    ? `${report.totalAgreements} past agreements, ${report.onTimeRate}% on-time rate, ${report.lateCount} late, avg ₹${report.avgAmount.toLocaleString()}`
    : 'No credit history available';

  return `
=== AGREEMENT DATA ===
ID: ${agreement._id}
Amount: ₹${(agreement.amount || 0).toLocaleString()}
Purpose: ${agreement.purpose || 'N/A'}
Deal Type: ${agreement.dealType || 'money'}
Status: ${agreement.status}
Created: ${new Date(agreement.createdDate || agreement.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Due Date: ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Days Until Due: ${daysUntilDue}
Borrower: ${agreement.borrowerName}
Lender: ${agreement.lenderName}
Trust Score: ${agreement.trustScore || 80}/100
Buffer Days: ${remainingBufferDays} remaining out of ${totalBufferDays}
Witness: ${agreement.witnessName || 'None'} ${agreement.witnessApproved ? '(Approved ✅)' : '(Pending ⏳)'}
Installment Plan: ${installmentInfo}
Borrower Credit Report: ${creditInfo}
Asset Details: ${agreement.dealType === 'asset' ? `${agreement.assetName || 'N/A'} (${agreement.assetCategory || 'N/A'}, Condition: ${agreement.assetCondition || 'N/A'})` : 'N/A'}

Timeline:
${formatTimeline(agreement.timeline || [])}`;
}

function buildSystemPrompt(agreementContext: string, conversationHistory: string, userRole: string, userName: string): string {
  return `You are an AI negotiation assistant for YourTrust, a peer-to-peer lending platform. Your job is to help users with their lending agreements — answer questions, explain terms, and take actions when requested.

You have access to the COMPLETE agreement data below. Only answer questions based on this data — never make up information.

${agreementContext}

=== CONVERSATION HISTORY ===
${conversationHistory}

=== CURRENT USER ===
Role: ${userRole}
Name: ${userName}

=== INSTRUCTIONS ===
1. Answer questions naturally and concisely using ONLY the agreement data provided above.
2. If the borrower asks to EXTEND the deadline, respond with action "extend_deadline" and include actionDetails with the new due date and days to extend.
3. If the user asks about something NOT related to this agreement, politely redirect them.
4. Be warm, conversational, and empathetic — this is about personal lending between friends/family.
5. Use Indian Rupee format (₹) for all amounts.

Respond with a JSON object in this exact format:
{
  "message": "your natural language response here",
  "action": "none" | "extend_deadline",
  "actionDetails": {
    "newDueDate": "YYYY-MM-DD",
    "daysExtended": number
  }
}

Only include actionDetails if action is "extend_deadline". Otherwise omit it.`;
}

function parseJsonFromAi(text: string): any {
  if (!text) return null;

  let clean = text.trim();

  const codeMatch = clean.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (codeMatch) clean = codeMatch[1].trim();

  const jsonStart = clean.indexOf('{');
  const jsonEnd = clean.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    clean = clean.slice(jsonStart, jsonEnd + 1);
  }

  try {
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

async function callNearAi(prompt: string): Promise<string | null> {
  if (!process.env.NEAR_AI_API_KEY) return null;

  try {
    const response = await nearAI.chat.completions.create({
      model: 'anthropic/claude-sonnet-4-5',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    return response.choices?.[0]?.message?.content?.trim() || null;
  } catch (error: any) {
    console.log('⚠️ NEAR AI failed:', error.message);
    return null;
  }
}

async function callGemini(prompt: string): Promise<string | null> {
  if (!genAI) return null;

  const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (error: any) {
      console.log(`⚠️ Gemini ${modelName} failed:`, error.message);
    }
  }

  return null;
}

function buildFallbackResponse(
  message: string,
  agreement: any,
  userRole: string,
  remainingBufferDays: number,
  usedBufferDays: number,
  totalBufferDays: number,
): { response: any; requestedDays: number } {
  const msg = message.toLowerCase();
  let requestedDays = 0;

  const dayPatterns = [
    /(\d+)\s*days?/i,
    /extend.*?(\d+)/i,
    /(\d+).*?days?/i,
    /by\s*(\d+)/i,
    /^(\d+)$/,
  ];
  for (const pattern of dayPatterns) {
    const match = message.match(pattern);
    if (match) {
      requestedDays = parseInt(match[1]);
      break;
    }
  }

  const isExtensionRequest = msg.includes('extend') || msg.includes('more time') || msg.includes('deadline') || msg.includes('postpone') || msg.includes('delay');

  if (isExtensionRequest && userRole === 'borrower' && requestedDays > 0) {
    if (remainingBufferDays === 0) {
      return {
        response: {
          message: `I'm sorry, but you've already used all ${totalBufferDays} buffer days. I cannot extend the deadline further. However, I can help you create an installment payment plan to make it easier to pay.`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    if (requestedDays <= remainingBufferDays) {
      const newDate = new Date(agreement.dueDate);
      newDate.setDate(newDate.getDate() + requestedDays);
      return {
        response: {
          message: `Perfect! I've extended your deadline by ${requestedDays} day${requestedDays > 1 ? 's' : ''} to ${newDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. You now have ${remainingBufferDays - requestedDays} buffer day${remainingBufferDays - requestedDays !== 1 ? 's' : ''} remaining.`,
          action: 'extend_deadline',
          actionDetails: {
            newDueDate: newDate.toISOString().split('T')[0],
            daysExtended: requestedDays,
          },
        },
        requestedDays,
      };
    }
    return {
      response: {
        message: `You only have ${remainingBufferDays} buffer day${remainingBufferDays !== 1 ? 's' : ''} remaining (used ${usedBufferDays} of ${totalBufferDays}). I can extend by ${remainingBufferDays} day${remainingBufferDays !== 1 ? 's' : ''} if that helps?`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (isExtensionRequest && userRole === 'borrower') {
    if (remainingBufferDays === 0) {
      return {
        response: {
          message: `You've used all ${totalBufferDays} buffer days. No more extensions possible. Consider an installment plan instead — go back to the agreement page and click "Generate Installment Plan".`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    return {
      response: {
        message: `I can extend your deadline! You have ${remainingBufferDays} buffer day${remainingBufferDays !== 1 ? 's' : ''} remaining. How many days would you like to extend? (e.g., "extend by 2 days")`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (isExtensionRequest && userRole === 'lender') {
    return {
      response: {
        message: `Only ${agreement.borrowerName} (the borrower) can request deadline extensions. As the lender, I can provide insights about the borrower's payment history and reliability. Would you like to know more?`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('due date') || msg.includes('when') || msg.includes('deadline')) {
    const dueDate = new Date(agreement.dueDate);
    const today = new Date();
    const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      response: {
        message: `The due date for this agreement is ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. That's ${daysLeft > 0 ? `${daysLeft} days from now` : daysLeft === 0 ? 'today' : `${Math.abs(daysLeft)} days overdue`}.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('amount') || msg.includes('how much') || msg.includes('owe') || msg.includes('owed') || msg.includes('total')) {
    return {
      response: {
        message: `The agreement amount is ₹${(agreement.amount || 0).toLocaleString()}. ${agreement.purpose ? `Purpose: ${agreement.purpose}.` : ''}`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('status')) {
    const statusLabels: Record<string, string> = {
      active: 'Active — in progress',
      pending_witness: 'Awaiting witness approval',
      reviewing: 'Under review — lender is verifying payment proofs',
      settled: 'Settled — fully paid and closed',
      overdue: 'Overdue — past the due date',
    };
    return {
      response: {
        message: `Current status: ${statusLabels[agreement.status] || agreement.status}.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('lender') || msg.includes('who lent') || msg.includes('who gave')) {
    return {
      response: {
        message: `${agreement.lenderName} is the lender. They lent ₹${(agreement.amount || 0).toLocaleString()} to ${agreement.borrowerName}.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('borrower') || msg.includes('who borrowed') || msg.includes('who took')) {
    return {
      response: {
        message: `${agreement.borrowerName} is the borrower. They borrowed ₹${(agreement.amount || 0).toLocaleString()} from ${agreement.lenderName}.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('trust score') || msg.includes('trust')) {
    return {
      response: {
        message: `${agreement.borrowerName}'s trust score is ${agreement.trustScore || 80}/100. ${(agreement.trustScore || 80) >= 70 ? 'That\'s a solid score — indicates reliable behavior.' : 'There\'s room for improvement — on-time payments will help increase it.'}`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('installment') || msg.includes('emi') || msg.includes('plan')) {
    const plan = agreement.selectedInstallmentPlan;
    if (plan) {
      return {
        response: {
          message: `You have an installment plan: "${plan.planName}" (${plan.status}). It has ${plan.installments.length} installments totaling ₹${plan.installments.reduce((s: number, i: any) => s + i.amount, 0).toLocaleString()}. ${plan.status === 'accepted' ? 'You can pay installments from the agreement page.' : 'The plan is awaiting lender approval.'}`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    return {
      response: {
        message: `No installment plan selected yet. You can create one from the agreement page by clicking "Generate Installment Plan". This breaks the ₹${(agreement.amount || 0).toLocaleString()} into smaller, manageable payments.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('buffer') || msg.includes('extension') || msg.includes('extra time') || msg.includes('grace')) {
    return {
      response: {
        message: `You have ${remainingBufferDays} buffer day${remainingBufferDays !== 1 ? 's' : ''} remaining out of ${totalBufferDays}. ${usedBufferDays > 0 ? `You've already used ${usedBufferDays}.` : 'None used yet.'} As a borrower, you can use these to extend the due date. Just ask me!`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('purpose') || msg.includes('reason') || msg.includes('why')) {
    return {
      response: {
        message: agreement.purpose
          ? `The purpose of this agreement is: ${agreement.purpose}.`
          : 'No specific purpose was recorded for this agreement.',
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('witness')) {
    if (agreement.witnessName) {
      return {
        response: {
          message: `${agreement.witnessName} is the witness. They have ${agreement.witnessApproved ? 'approved ✅' : 'not yet approved ⏳'} the agreement.`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    return {
      response: {
        message: 'No witness was added to this agreement.',
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('timeline') || msg.includes('history') || msg.includes('log')) {
    const timeline = agreement.timeline || [];
    if (timeline.length === 0) {
      return {
        response: {
          message: 'No timeline events recorded yet.',
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    const events = timeline
      .map((t: any) => `• ${t.event}${t.date ? ` (${new Date(t.date).toLocaleDateString()})` : ''} ${t.completed ? '✅' : '⏳'}`)
      .join('\n');
    return {
      response: {
        message: `Here's the timeline so far:\n${events}`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('credit') || msg.includes('on time') || msg.includes('late') || msg.includes('payment history') || msg.includes('reliable')) {
    const report = agreement.borrowerCreditReport;
    if (report) {
      return {
        response: {
          message: `${agreement.borrowerName}'s credit report: ${report.totalAgreements} past agreements, ${report.onTimeRate}% on-time rate, ${report.lateCount} late payment${report.lateCount !== 1 ? 's' : ''}. Average amount: ₹${report.avgAmount.toLocaleString()}.${report.onTimeRate >= 80 ? ' Good track record!' : ' Room for improvement.'}`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    return {
      response: {
        message: `No credit history available for ${agreement.borrowerName}. This appears to be their first agreement.`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('asset') || msg.includes('item') || msg.includes('thing') || msg.includes('laptop') || msg.includes('phone')) {
    if (agreement.dealType === 'asset') {
      return {
        response: {
          message: `This is an asset lending agreement for: ${agreement.assetName || 'N/A'} (${agreement.assetCategory || 'N/A'}, condition: ${agreement.assetCondition || 'N/A'}). Estimated value: ₹${(agreement.estimatedValue || 0).toLocaleString()}.`,
          action: 'none',
        },
        requestedDays: 0,
      };
    }
    return {
      response: {
        message: 'This is a money lending agreement, not an asset deal.',
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  if (msg.includes('all') || msg.includes('everything') || msg.includes('summary') || msg.includes('overview')) {
    const dueDate = new Date(agreement.dueDate);
    return {
      response: {
        message: `Here's a full summary:\n• Amount: ₹${(agreement.amount || 0).toLocaleString()} ${agreement.purpose ? `(${agreement.purpose})` : ''}\n• Between: ${agreement.lenderName} → ${agreement.borrowerName}\n• Status: ${agreement.status}\n• Due: ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n• Trust Score: ${agreement.trustScore || 80}/100\n• Buffer Left: ${remainingBufferDays}/${totalBufferDays} days\n• Witness: ${agreement.witnessName || 'None'} ${agreement.witnessApproved ? '✅' : '⏳'}`,
        action: 'none',
      },
      requestedDays: 0,
    };
  }

  return {
    response: {
      message: `Hi! I'm your AI assistant for this agreement. I can help with:\n\n📋 Agreement details — amount, dates, status, parties\n📅 Due date & extensions — check or extend using buffer days\n📊 Trust score & credit history\n📈 Installment plans\n👁 Witness info\n📜 Timeline of events\n\nWhat would you like to know?`,
      action: 'none',
    },
    requestedDays: 0,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    const isBorrower = userId === agreement.borrowerId;
    const isLender = userId === agreement.lenderId;
    const userRole = isBorrower ? 'borrower' : isLender ? 'lender' : 'unknown';

    if (userRole === 'unknown') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userName = isBorrower ? agreement.borrowerName : agreement.lenderName;

    agreement.aiMessages.push({
      role: 'user',
      content: `[${userRole.toUpperCase()}] ${message}`,
      timestamp: new Date(),
    });

    const startTime = Date.now();
    let aiResponse: any = null;
    let aiSource: AiSource = 'fallback';

    const agreementContext = buildAgreementContext(agreement);
    const conversationHistory = formatConversationHistory(agreement.aiMessages.slice(0, -1));
    const systemPrompt = buildSystemPrompt(agreementContext, conversationHistory, userRole, userName);
    const fullPrompt = `${systemPrompt}\n\nUser (${userRole}): ${message}`;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 User Role: ${userRole} (${userName})`);
    console.log(`💬 Message: ${message}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let parsedJson: any = null;

    const nearAiText = await callNearAi(fullPrompt);
    if (nearAiText) {
      parsedJson = parseJsonFromAi(nearAiText);
      if (parsedJson?.message) {
        aiResponse = parsedJson;
        aiSource = 'near_ai';
        console.log('✅ NEAR AI response received');
      }
    }

    if (!aiResponse) {
      console.log('⚠️ NEAR AI failed, trying Gemini...');
      const geminiText = await callGemini(fullPrompt);
      if (geminiText) {
        parsedJson = parseJsonFromAi(geminiText);
        if (parsedJson?.message) {
          aiResponse = parsedJson;
          aiSource = 'gemini';
          console.log('✅ Gemini response received');
        }
      }
    }

    if (!aiResponse) {
      console.log('⚠️ Both AI providers failed, using smart fallback...');

      const totalBufferDays = agreement.bufferDays || 3;
      const extensionEvents = (agreement.timeline || []).filter((t: any) =>
        t.event?.toLowerCase().includes('extended')
      );
      let usedBufferDays = 0;
      extensionEvents.forEach((event: any) => {
        const match = event.event.match(/extended.*?(\d+)/i);
        if (match) usedBufferDays += parseInt(match[1]);
      });
      const remainingBufferDays = Math.max(0, totalBufferDays - usedBufferDays);

      const fallback = buildFallbackResponse(message, agreement, userRole, remainingBufferDays, usedBufferDays, totalBufferDays);
      aiResponse = fallback.response;
      console.log('✅ Fallback response used');
    }

    const displayMessage = aiResponse.message || "I'm here to help! What would you like to know about this agreement?";

    agreement.aiMessages.push({
      role: 'ai',
      content: displayMessage,
      timestamp: new Date(),
    });

    let actionResult = null;
    if (aiResponse.action === 'extend_deadline' && aiResponse.actionDetails?.newDueDate) {
      const newDueDate = new Date(aiResponse.actionDetails.newDueDate);
      const daysExtended = aiResponse.actionDetails.daysExtended || 1;

      agreement.dueDate = newDueDate;

      const terminalIdx = agreement.timeline.findIndex(
        (t: any) => t.event === 'Payment Received' || t.event === 'Asset Returned'
      );
      const extensionEvent = {
        event: `Due date extended by ${daysExtended} day${daysExtended > 1 ? 's' : ''} to ${newDueDate.toLocaleDateString()} by ${agreement.borrowerName}`,
        date: new Date(),
        completed: true,
      };
      if (terminalIdx !== -1) {
        agreement.timeline.splice(terminalIdx, 0, extensionEvent);
      } else {
        agreement.timeline.push(extensionEvent);
      }

      const totalBufferDays = agreement.bufferDays || 3;
      const usedSoFar = (agreement.timeline || []).filter((t: any) =>
        t.event?.toLowerCase().includes('extended')
      ).length;
      const remaining = Math.max(0, totalBufferDays - usedSoFar);

      actionResult = {
        success: true,
        action: 'deadline_extended',
        newDueDate: newDueDate.toISOString(),
        daysExtended,
        remainingBufferDays: remaining,
        message: `✅ Deadline extended by ${daysExtended} day${daysExtended > 1 ? 's' : ''}! New due date: ${newDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        shouldClose: true,
      };

      agreement.aiMessages.push({
        role: 'system',
        content: `✅ Deadline extended by ${daysExtended} day${daysExtended > 1 ? 's' : ''}. New due date: ${newDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
        timestamp: new Date(),
      });
    }

    agreement.markModified('timeline');
    await agreement.save();

    const processingTime = Date.now() - startTime;

    console.log(`✅ Response generated (${aiSource}) in ${processingTime}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const sourceLabels: Record<AiSource, string> = {
      near_ai: 'NEAR AI (Claude Sonnet 4.5)',
      gemini: 'Gemini',
      fallback: 'Built-in Assistant',
    };

    return NextResponse.json({
      success: true,
      aiMessage: displayMessage,
      action: aiResponse.action || 'none',
      actionResult,
      aiSource,
      sourceLabel: sourceLabels[aiSource],
      processingTime,
      agreement: {
        id: agreement._id,
        dueDate: agreement.dueDate,
      },
    });
  } catch (error: any) {
    console.error('[AI Negotiation] Error:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to process',
        details: error.message,
        fallback: true,
        aiMessage: "I'm having trouble right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const agreement = await Agreement.findById(id);
    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    if (userId !== agreement.borrowerId && userId !== agreement.lenderId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const dueDate = new Date(agreement.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const totalBufferDays = agreement.bufferDays || 3;
    const extensionEvents = (agreement.timeline || []).filter((t: any) =>
      t.event?.toLowerCase().includes('extended')
    );
    let usedBufferDays = 0;
    extensionEvents.forEach((event: any) => {
      const match = event.event.match(/extended.*?(\d+)/i);
      if (match) usedBufferDays += parseInt(match[1]);
    });

    return NextResponse.json({
      success: true,
      messages: agreement.aiMessages,
      agreementContext: {
        amount: agreement.amount,
        purpose: agreement.purpose,
        dealType: agreement.dealType,
        dueDate: agreement.dueDate,
        status: agreement.status,
        bufferDays: agreement.bufferDays,
        remainingBufferDays: Math.max(0, totalBufferDays - usedBufferDays),
        borrowerName: agreement.borrowerName,
        lenderName: agreement.lenderName,
        trustScore: agreement.trustScore,
        hasInstallmentPlan: !!agreement.selectedInstallmentPlan,
        installmentPlanStatus: agreement.selectedInstallmentPlan?.status || null,
        witnessName: agreement.witnessName,
        witnessApproved: agreement.witnessApproved,
        daysUntilDue,
        borrowerId: agreement.borrowerId,
        lenderId: agreement.lenderId,
      },
    });
  } catch (error: any) {
    console.error('[AI Negotiation] Get Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation', details: error.message },
      { status: 500 }
    );
  }
}

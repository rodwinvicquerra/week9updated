import { NextRequest, NextResponse } from 'next/server';
import { portfolioContext } from '@/lib/portfolio-context';
import Groq from 'groq-sdk';
import {
  createRateLimiter,
  sanitizeChatMessage,
  detectSuspiciousPatterns,
  validateApiRequest,
  logSuspiciousInput,
  logApiAbuse,
  getClientIp,
  getSecureHeaders,
  // 🔒 Ultra-hardened security functions
  validateMessageSecurity,
  validateAiResponse,
} from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // Validate API request
    const validation = await validateApiRequest(req, {
      allowedMethods: ['POST'],
      requireContentType: true,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403, headers: getSecureHeaders() }
      );
    }

    // Apply rate limiting
    const rateLimiter = createRateLimiter('chat');
    const rateLimitResult = await rateLimiter(req);
    if (rateLimitResult) {
      return rateLimitResult; // Returns 429 with proper headers
    }

    const ip = getClientIp(req);
    const { messages } = await req.json();

    // 🔒 FEATURE #15: API Parameter Validation
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400, headers: getSecureHeaders() }
      );
    }
    
    // Validate that all messages have only 'user' or 'assistant' roles (prevent 'system' role injection)
    const hasInvalidRole = messages.some(msg => 
      msg.role && !['user', 'assistant'].includes(msg.role)
    );
    
    if (hasInvalidRole) {
      logSuspiciousInput(ip, '/api/chat', 'Attempted to inject system role');
      return NextResponse.json(
        { error: 'Invalid message role' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Sanitize and validate user messages with ULTRA-HARDENED SECURITY
    const sanitizedMessages = messages.map((msg) => {
      if (msg.role === 'user' && msg.content) {
        // 🔒 LAYER 1: Ultra-hardened security validation (links, prompt injection)
        const securityValidation = validateMessageSecurity(msg.content);
        if (!securityValidation.valid) {
          logSuspiciousInput(
            ip,
            '/api/chat',
            `${securityValidation.threat}: ${securityValidation.reason}`
          );
          // Instead of throwing, return a refusal message
          return {
            ...msg,
            role: 'assistant',
            content: "Sorry, I can't do that."
          };
        }

        // 🔒 LAYER 2: Original suspicious pattern detection
        const suspiciousCheck = detectSuspiciousPatterns(msg.content);
        if (suspiciousCheck.isSuspicious) {
          logSuspiciousInput(ip, '/api/chat', suspiciousCheck.reason || 'Unknown');
          // Instead of throwing, return a refusal message
          return {
            ...msg,
            role: 'assistant',
            content: "Sorry, I can't do that."
          };
        }

        // 🔒 LAYER 3: Sanitize the message
        return {
          ...msg,
          content: sanitizeChatMessage(msg.content),
        };
      }
      return msg;
    });

    // Check for abuse (too many tokens)
    const totalLength = sanitizedMessages.reduce(
      (acc, msg) => acc + (msg.content?.length || 0),
      0
    );
    if (totalLength > 10000) {
      logApiAbuse(ip, '/api/chat', 'Excessive message length');
      return NextResponse.json(
        { error: 'Message too long' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Prepare messages with system context
    const chatMessages = [
      {
        role: 'system',
        content: portfolioContext,
      },
      ...sanitizedMessages,
    ];

    // Check if we're on Vercel (production) or localhost  
    const groqApiKey = process.env.GROQ_API_KEY; // Reading from GROQ_API_KEY
    const isVercel = process.env.VERCEL === '1';
    const useGroq = isVercel && groqApiKey;

    if (useGroq) {
      // Use Groq for Vercel deployment (FREE!)
      console.log('Using Groq API on Vercel');
      
      try {
        const groq = new Groq({
          apiKey: groqApiKey,
        });

        console.log('Groq client created, calling API...');
        
        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant', // Updated model
          messages: chatMessages as any,
          temperature: 0.7,
          max_tokens: 300,
        });

        console.log('Groq API response received');
        const assistantMessage = completion.choices[0]?.message?.content;

        if (!assistantMessage) {
          console.error('No message in response:', completion);
          return NextResponse.json(
            { error: 'No response from AI' },
            { status: 500 }
          );
        }

        // 🔒 FEATURE #11: Validate AI response before sending
        const responseValidation = validateAiResponse(assistantMessage);
        if (!responseValidation.valid) {
          console.warn('AI response failed validation:', responseValidation.reason);
          logSuspiciousInput(ip, '/api/chat', `Response validation failed: ${responseValidation.reason}`);
          // Return safe fallback response
          return NextResponse.json({
            message: "I'm here to discuss Rodwin's portfolio and projects only. What would you like to know about his work?"
          }, { headers: getSecureHeaders() });
        }

        return NextResponse.json({
          message: assistantMessage,
        }, { headers: getSecureHeaders() });
      } catch (error: any) {
        console.error('Groq error:', error);
        return NextResponse.json(
          { error: `AI Error: ${error?.message || 'Unknown error'}` },
          { status: 500, headers: getSecureHeaders() }
        );
      }
    } else {
      // Use Ollama for local development
      console.log('Using Ollama for localhost');
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: chatMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 500,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ollama API error:', errorData);
        return NextResponse.json(
          { 
            error: 'Ollama is not running. Please start Ollama or deploy to Vercel with Groq API key.' 
          },
          { status: response.status, headers: getSecureHeaders() }
        );
      }

      const data = await response.json();
      const assistantMessage = data.message?.content;

      if (!assistantMessage) {
        return NextResponse.json(
          { error: 'No response from AI' },
          { status: 500, headers: getSecureHeaders() }
        );
      }

      // 🔒 FEATURE #11: Validate AI response before sending
      const responseValidation = validateAiResponse(assistantMessage);
      if (!responseValidation.valid) {
        console.warn('AI response failed validation:', responseValidation.reason);
        logSuspiciousInput(ip, '/api/chat', `Response validation failed: ${responseValidation.reason}`);
        // Return safe fallback response
        return NextResponse.json({
          message: "I'm here to discuss Rodwin's portfolio and projects only. What would you like to know about his work?"
        }, { headers: getSecureHeaders() });
      }

      return NextResponse.json({
        message: assistantMessage,
      }, { headers: getSecureHeaders() });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

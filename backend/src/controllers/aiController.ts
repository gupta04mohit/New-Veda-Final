import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const chatWithVeda = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sessionId, image } = req.body;
    const userId = (req as any).user?.id;

    let userContext = {};
    let chatHistory = [];
    if (userId) {
      // Fetch Profile & Dosha
      const profile = await prisma.profile.findUnique({ where: { userId } });
      const dosha = await prisma.doshaAssessment.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
      
      // Fetch recent history
      const recentLogs = await prisma.wellnessLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 7
      });
      const recentReports = await prisma.medicalReport.findMany({
        where: { userId },
        orderBy: { reportDate: 'desc' },
        take: 3
      });

      userContext = {
        profile,
        dosha,
        recentLogs,
        recentReports
      };

      if (sessionId) {
        // Fetch recent chat history
        chatHistory = await prisma.chatHistory.findMany({
          where: { userId, sessionId },
          orderBy: { createdAt: 'asc' },
          take: 20
        });

        // Save user message
        await prisma.chatHistory.create({
          data: {
            userId,
            sessionId,
            role: 'USER',
            message: image ? `[Attached Image] ${message}` : message
          }
        });
      }
    }

    console.log("Backend: Forwarding request to AI Microservice with Context and History");
    
    // Call the external AI Microservice running on port 5001
    const aiResponse = await fetch('http://localhost:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, image, context: userContext, chatHistory })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Service returned ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    
    if (userId && sessionId && data.response) {
      await prisma.chatHistory.create({
        data: {
          userId,
          sessionId,
          role: 'AI',
          message: data.response
        }
      });
    }

    res.json(data);

  } catch (error) {
    console.error("AI Chat Forwarding Error:", error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};


import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add or Update Wellness Log
export const addWellnessLog = async (req: Request, res: Response): Promise<void> => {
  try {
    // Expecting userId from auth middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { waterIntake, sleepHours, meditationMins, exerciseMins, mood, stressLevel } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    const log = await prisma.wellnessLog.upsert({
      where: {
        userId_date: {
          userId,
          date
        }
      },
      update: {
        waterIntake,
        sleepHours,
        meditationMins,
        exerciseMins,
        mood,
        stressLevel
      },
      create: {
        userId,
        date,
        waterIntake,
        sleepHours,
        meditationMins,
        exerciseMins,
        mood,
        stressLevel
      }
    });

    res.status(200).json(log);
  } catch (error) {
    console.error('Error adding wellness log:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch Health History
export const getHealthHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const logs = await prisma.wellnessLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    });

    const reports = await prisma.medicalReport.findMany({
      where: { userId },
      orderBy: { reportDate: 'desc' }
    });

    res.status(200).json({ logs, reports });
  } catch (error) {
    console.error('Error fetching health history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Calculate Daily Habit Score
export const getDailyHabitScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get today's log
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const log = await prisma.wellnessLog.findUnique({
      where: { userId_date: { userId, date } }
    });

    if (!log) {
      res.status(200).json({ score: 0, message: "No log for today yet" });
      return;
    }

    // Basic scoring logic out of 100
    let score = 0;
    
    // Sleep (Target: 7-8 hours) -> 30 points
    if (log.sleepHours >= 7 && log.sleepHours <= 9) score += 30;
    else if (log.sleepHours >= 5) score += 15;

    // Water (Target: ~2.5L) -> 30 points
    if (log.waterIntake >= 2.5) score += 30;
    else if (log.waterIntake >= 1.5) score += 15;

    // Exercise & Meditation -> 40 points (20 each)
    if (log.exerciseMins >= 30) score += 20;
    else if (log.exerciseMins > 0) score += 10;
    
    if (log.meditationMins >= 15) score += 20;
    else if (log.meditationMins > 0) score += 10;

    res.status(200).json({ score, log });
  } catch (error) {
    console.error('Error calculating habit score:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Upload Medical Report (Mock extraction for now)
export const uploadMedicalReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { reportType, extractedData, aiInterpretation, ayurvedicRec } = req.body;

    const report = await prisma.medicalReport.create({
      data: {
        userId,
        reportType,
        extractedData: JSON.stringify(extractedData),
        aiInterpretation,
        ayurvedicRec,
        reportDate: new Date()
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error uploading medical report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

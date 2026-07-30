import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const uploadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reportType, extractedText, fileUrl } = req.body;
    const userId = (req as any).user?.id;

    if (!userId || !extractedText || !reportType) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    console.log("Backend: Requesting AI Analysis for Medical Report");
    const aiResponse = await fetch('http://localhost:5001/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extractedText })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Service returned ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const interpretation = aiData.result; // Assume AI returns string

    const report = await prisma.medicalReport.create({
      data: {
        userId,
        reportType,
        fileUrl,
        extractedData: extractedText,
        aiInterpretation: interpretation,
        ayurvedicRec: interpretation // The AI service might combine these in one string
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Report Upload Error:", error);
    res.status(500).json({ message: 'Error processing report upload' });
  }
};

export const generateWeeklyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Fetch last 7 days of logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await prisma.wellnessLog.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: 'asc' }
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=weekly-report-${user?.name}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`VedaAI Weekly Health Report for ${user?.name}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Summary of the last 7 days:`);
    doc.moveDown();

    if (logs.length === 0) {
      doc.fontSize(12).text("No wellness logs found for the past week.");
    } else {
      logs.forEach(log => {
        doc.fontSize(12).text(`Date: ${log.date.toDateString()}`);
        doc.text(`Water Intake: ${log.waterIntake || 0} L`);
        doc.text(`Sleep: ${log.sleepHours || 0} hrs`);
        doc.text(`Stress Level: ${log.stressLevel || 'N/A'}`);
        doc.moveDown();
      });
    }

    doc.addPage();
    doc.fontSize(16).text('AI Insights & Suggestions');
    doc.moveDown();
    doc.fontSize(12).text("Based on your trends, consider adjusting your sleep schedule and maintaining hydration. Ayurvedic principles suggest increasing your intake of warm, grounding foods if Vata is aggravated by irregular sleep.");

    doc.end();

  } catch (error) {
    console.error("Weekly Report Generation Error:", error);
    res.status(500).json({ message: 'Error generating PDF report' });
  }
};

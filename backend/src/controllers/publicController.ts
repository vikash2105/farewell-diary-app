import { Request, Response } from "express";
import { db } from "../db";
import { testimonials, donations } from "../db/schema";
import { desc, eq } from "drizzle-orm";

const sanitize = (input = "") =>
  input
    .replace(/[<>"'/]/g, "")
    .trim()
    .slice(0, 500);

export const getTestimonials = async (_req: Request, res: Response) => {
  const data = await db
    .select({
      id: testimonials.id,
      name: testimonials.name,
      message: testimonials.message,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.isApproved, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(20);

  res.json({ success: true, data });
};

export const submitTestimonial = async (req: Request, res: Response) => {
  const { name, message } = req.body;

  if (!name || !message) {
    res.status(400).json({ success: false, message: "Invalid input" });
    return;
  }

  const [created] = await db
    .insert(testimonials)
    .values({
      userId: req.user?.id ?? null,
      name: sanitize(name),
      message: sanitize(message),
      isApproved: false,
    })
    .returning();

  res.status(201).json({
    success: true,
    message: "Submitted for review",
    data: created,
  });
};

export const getDonations = async (_req: Request, res: Response) => {
  const data = await db
    .select({
      id: donations.id,
      displayName: donations.displayName,
      amount: donations.amount,
      message: donations.message,
      createdAt: donations.createdAt,
    })
    .from(donations)
    .where(eq(donations.isPublic, true))
    .orderBy(desc(donations.createdAt))
    .limit(50);

  res.json({ success: true, data });
};

export const recordDonation = async (req: Request, res: Response) => {
  const { displayName, amount } = req.body;
  if (!displayName || !amount) {
    res.status(400).json({ success: false, message: "Invalid donation" });
    return;
  }

  const [donation] = await db
    .insert(donations)
    .values({
      userId: req.user?.id ?? null,
      displayName: sanitize(displayName),
      amount,
      message: sanitize(req.body.message),
      isAnonymous: !!req.body.isAnonymous,
      isPublic: req.body.isPublic !== false,
      paymentProvider: req.body.paymentProvider ?? null,
      transactionId: req.body.transactionId ?? null,
    })
    .returning();

  res.status(201).json({ success: true, data: donation });
};

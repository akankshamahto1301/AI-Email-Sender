import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, body } = await request.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "Recipients are required" },
        { status: 400 }
      );
    }

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    // Check if email credentials are configured
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      return NextResponse.json(
        {
          error:
            "Email configuration not set up. Please configure EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.",
        },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to each recipient
    const emailPromises = recipients.map((recipient: string) => {
      return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        html: body.replace(/\n/g, "<br>"),
        text: body,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      message: `Email sent successfully to ${recipients.length} recipient(s)`,
      recipients: recipients.length,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please check your email configuration." },
      { status: 500 }
    );
  }
}

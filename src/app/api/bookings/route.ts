import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, contact, email, category, package: pkg, message } = body;

    if (!name || !businessName || !contact) {
      return NextResponse.json(
        { error: "Missing required fields: name, businessName, and contact are required." },
        { status: 400 }
      );
    }

    const bookingData = {
      name,
      businessName,
      contact, // WhatsApp / Phone
      email: email || null,
      category: category || pkg || null,
      message: message || null,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Firebase Firestore (if config is set up)
    let firestoreSaved = false;
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      try {
        await addDoc(collection(db, "bookings"), bookingData);
        firestoreSaved = true;
      } catch (err) {
        console.error("Firestore Save Error:", err);
      }
    } else {
      console.warn("Firebase not configured. Skipping Firestore database save.");
    }

    // 2. Send Emails via SMTP / Nodemailer (if config is set up)
    let emailAlertSent = false;
    let clientConfirmSent = false;
    
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER; // admin@madco.in
    const smtpPass = process.env.SMTP_PASSWORD; // App Password

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const isSecure = smtpPort === "465" || (!smtpPort && smtpHost.includes("gmail"));
        const transporter = nodemailer.createTransport({
          pool: true, // Reuse the same SMTP connection for multiple emails
          host: smtpHost,
          port: parseInt(smtpPort || "465"),
          secure: isSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            // Bypasses intermediate cert warnings that cause handshake failures in serverless runtimes
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000, // 10 seconds timeout
          socketTimeout: 10000,
        });

        // A. Admin Alert Email HTML
        const adminEmailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #222; background-color: #0c0c0c; color: #ffffff; border-radius: 12px;">
            <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 20px;">
              <h2 style="color: #ff3e3e; margin: 0; font-size: 24px; letter-spacing: 1px; font-family: monospace;">// NEW STRATEGY AUDIT BOOKED</h2>
            </div>
            
            <p style="font-size: 15px; color: #b0b0b0; line-height: 1.6;">You have a new spatial marketing audit request from your website:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; border-bottom: 1px solid #222; width: 140px; font-family: monospace;">CLIENT NAME:</td>
                <td style="padding: 10px; color: #fff; border-bottom: 1px solid #222; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; border-bottom: 1px solid #222; font-family: monospace;">BUSINESS:</td>
                <td style="padding: 10px; color: #fff; border-bottom: 1px solid #222; font-weight: bold;">${businessName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; border-bottom: 1px solid #222; font-family: monospace;">WHATSAPP:</td>
                <td style="padding: 10px; color: #00aaff; border-bottom: 1px solid #222; font-weight: bold;">
                  <a href="https://wa.me/${contact.replace(/[^0-9]/g, "")}" style="color: #00aaff; text-decoration: none;">${contact}</a>
                </td>
              </tr>
              ${email ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; border-bottom: 1px solid #222; font-family: monospace;">EMAIL:</td>
                <td style="padding: 10px; color: #fff; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #fff; text-decoration: none;">${email}</a></td>
              </tr>` : ""}
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; border-bottom: 1px solid #222; font-family: monospace;">PLAN/SERVICE:</td>
                <td style="padding: 10px; color: #ff3e3e; border-bottom: 1px solid #222; text-transform: uppercase; font-family: monospace;">${category || pkg || "General Inquiry"}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #888; vertical-align: top; border-bottom: 1px solid #222; font-family: monospace;">SPACE NOTES:</td>
                <td style="padding: 10px; color: #e0e0e0; line-height: 1.5; border-bottom: 1px solid #222; white-space: pre-wrap;">${message}</td>
              </tr>` : ""}
            </table>

            <div style="border-top: 1px solid #222; padding-top: 20px; font-size: 11px; color: #666; font-family: monospace; text-align: center;">
              MAD.CO STUDIO AUTOMATED DISPATCH • ${new Date().toLocaleString()}
            </div>
          </div>
        `;

        const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

        // Send alert to admin (you)
        await transporter.sendMail({
          from: `"MAD.CO Booking System" <${smtpUser}>`,
          to: adminEmail,
          subject: `🚨 New Audit Request: ${businessName} (${name})`,
          html: adminEmailHtml,
        });
        emailAlertSent = true;

        // B. Client Confirmation Email HTML (if email is provided)
        if (email) {
          const clientEmailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; background-color: #ffffff; color: #111827; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="text-align: center; border-bottom: 2px solid #ff3e3e; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">MAD.CO <span style="color: #ff3e3e;">STUDIO</span></h1>
                <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-family: monospace; letter-spacing: 2px; color: #6b7280;">Spatial Marketing &amp; Media</p>
              </div>

              <h2 style="font-size: 18px; margin-top: 0; font-weight: 800;">Hey ${name},</h2>
              
              <p style="font-size: 14px; line-height: 1.6; color: #374151;">
                We have successfully received your request for a **Spatial Audit &amp; Strategy Session** for <strong>${businessName}</strong>. 
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #374151;">
                Our lead strategist is currently researching your Google Maps listing, coordinates, and local competitors in Mangalore. We will prepare your custom blueprint and reach out to you via WhatsApp shortly at <strong>${contact}</strong>.
              </p>

              <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
                <h4 style="margin: 0 0 8px 0; text-transform: uppercase; font-family: monospace; letter-spacing: 1px; color: #ff3e3e;">Audit Summary</h4>
                <div style="margin-bottom: 4px;"><strong>Business:</strong> ${businessName}</div>
                <div style="margin-bottom: 4px;"><strong>Service Selection:</strong> ${category || pkg || "General Inquiry"}</div>
                ${message ? `<div><strong>Notes Provided:</strong> ${message}</div>` : ""}
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #374151;">
                To speed things up or send additional photos/floor plans of your store, feel free to jump directly into our WhatsApp chat:
              </p>

              <div style="text-align: center; margin: 25px 0;">
                <a href="https://wa.me/918762640420?text=Hi%20Mad.co%20Studio%2C%20my%20name%20is%20${encodeURIComponent(name)}%20from%20${encodeURIComponent(businessName)}.%20I%20just%20booked%20my%20spatial%20audit." 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; font-weight: bold; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 13px;">
                  Connect via WhatsApp
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

              <p style="font-size: 12px; color: #6b7280; line-height: 1.5; text-align: center;">
                Need to make changes to your booking? Simply reply to this email or write to us at <a href="mailto:${adminEmail}" style="color: #2563eb; text-decoration: none;">${adminEmail}</a>.
              </p>
              
              <div style="font-size: 10px; color: #9ca3af; text-align: center; margin-top: 15px; font-family: monospace;">
                © ${new Date().getFullYear()} MAD.CO STUDIO. ALL RIGHTS RESERVED.
              </div>
            </div>
          `;

          try {
            await transporter.sendMail({
              from: `"MAD.CO Studio" <${smtpUser}>`,
              to: email,
              subject: `📋 Booking Confirmed: Spatial Strategy Audit for ${businessName}`,
              html: clientEmailHtml,
            });
            clientConfirmSent = true;
          } catch (clientEmailErr) {
            console.error("Client confirmation email delivery failed:", clientEmailErr);
          }
        }
      } catch (err) {
        console.error("SMTP Email Error:", err);
      }
    } else {
      console.warn("SMTP settings are not configured in environment variables. Skipping email alerts.");
    }

    // 3. Append to Google Sheets via Webhook (if URL is set up)
    let sheetSynced = false;
    const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhook) {
      try {
        const response = await fetch(sheetsWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            businessName,
            contact,
            email: email || "N/A",
            category: category || pkg || "General Inquiry",
            message: message || "None",
            timestamp: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          sheetSynced = true;
        } else {
          console.error("Google Sheets Webhook responded with status:", response.status);
        }
      } catch (err) {
        console.error("Google Sheets Webhook Sync Error:", err);
      }
    } else {
      console.warn("Google Sheets Webhook URL not configured. Skipping sheet backup.");
    }

    return NextResponse.json({
      success: true,
      firestoreSaved,
      emailAlertSent,
      clientConfirmSent,
      sheetSynced,
    });
  } catch (error) {
    console.error("Booking handler error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

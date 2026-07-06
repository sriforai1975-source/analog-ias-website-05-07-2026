import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const NOTIFY_EMAIL = "ias.analog@gmail.com";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid request body" }, { status: 400 });
        }

        const parsed = submissionSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid input" },
            { status: 400 },
          );
        }

        const { name, email, phone, subject, message } = parsed.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: inserted, error } = await supabaseAdmin
          .from("contact_submissions")
          .insert({
            name,
            email,
            phone: phone || null,
            subject: subject || null,
            message,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Failed to save contact submission:", error);
          return Response.json({ error: "Could not save your message." }, { status: 500 });
        }

        // Attempt email notification (only works once a sender domain is verified).
        try {
          await sendNotificationEmail({ name, email, phone, subject, message });
        } catch (e) {
          // Never fail the submission because of email; it is stored regardless.
          console.error("Contact notification email failed:", e);
        }

        return Response.json({ ok: true, id: inserted.id });
      },
    },
  },
});

async function sendNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const senderDomain = process.env.SENDER_DOMAIN;
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (!senderDomain || !lovableApiKey) {
    // Email infrastructure not configured yet — skip silently.
    return;
  }

  const html = `
    <h2>New contact submission — ANALOG IAS ACADEMY</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
  `;

  await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableApiKey}`,
    },
    body: JSON.stringify({
      from: `ANALOG IAS ACADEMY <notify@${senderDomain}>`,
      to: ["ias.analog@gmail.com"],
      reply_to: data.email,
      subject: `New enquiry: ${data.subject || data.name}`,
      html,
    }),
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional().or(z.literal("")),
  // Client timestamp (ms) of when the form was rendered.
  renderedAt: z.number().optional(),
});

// Reject submissions that look like spam. Returns a reason or null.
function spamReason(data: {
  message: string;
  name: string;
  renderedAt?: number;
}): string | null {
  // Too many links is a strong spam signal for a contact enquiry.
  const linkCount = (data.message.match(/https?:\/\/|www\./gi) ?? []).length;
  if (linkCount >= 3) return "too_many_links";

  // Submitted implausibly fast after the form rendered (likely a bot).
  if (typeof data.renderedAt === "number") {
    const elapsed = Date.now() - data.renderedAt;
    if (elapsed >= 0 && elapsed < 2500) return "too_fast";
  }

  // Common spam keywords.
  const haystack = `${data.name} ${data.message}`.toLowerCase();
  const banned = ["viagra", "casino", "crypto pump", "seo services", "bitcoin", "loan offer"];
  if (banned.some((w) => haystack.includes(w))) return "banned_keyword";

  return null;
}

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

        const { name, email, phone, subject, message, company, renderedAt } = parsed.data;

        // Honeypot tripped — silently accept so bots don't retry, but don't store.
        if (company) {
          return Response.json({ ok: true });
        }

        const reason = spamReason({ name, message, renderedAt });
        if (reason) {
          console.warn("Rejected spam contact submission:", reason);
          return Response.json(
            { error: "Your message looks like spam. Please remove links or rephrase and try again." },
            { status: 422 },
          );
        }

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

        return Response.json({ ok: true, id: inserted.id });
      },
    },
  },
});

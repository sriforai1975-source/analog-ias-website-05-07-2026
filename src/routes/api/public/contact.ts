import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

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

        return Response.json({ ok: true, id: inserted.id });
      },
    },
  },
});

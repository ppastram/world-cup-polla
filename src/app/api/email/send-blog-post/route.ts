import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get all user emails (paginate with perPage: 1000)
    const emails: string[] = [];
    let page = 1;
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) {
        console.error("Error listing users:", error);
        break;
      }
      for (const user of data.users) {
        if (user.email) {
          emails.push(user.email);
        }
      }
      if (data.users.length < 1000) break;
      page++;
    }

    console.log(`[send-blog-post] Found ${emails.length} users to email`);

    if (emails.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0 });
    }

    // Build HTML email matching the dark theme
    const contentHtml = content
      .split("\n")
      .map((line: string) => `<p style="color:#e0e0e0;font-size:14px;margin:0 0 8px;line-height:1.6;">${line || "&nbsp;"}</p>`)
      .join("");

    const html = `
    <div style="background:#0d0d1a;padding:32px;font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4a843;margin:0;">⚽ Ampolla Mundialista 2026</h1>
        <p style="color:#888;font-size:14px;margin:8px 0 0;">Nueva novedad</p>
      </div>

      <div style="background:#1a1a2e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#ffffff;margin:0 0 16px;">${title}</h2>
        ${contentHtml}
      </div>

      <div style="text-align:center;padding:16px;color:#555;font-size:11px;">
        <p>Este correo fue enviado desde Ampolla Mundialista 2026.</p>
      </div>
    </div>`;

    const resend = getResend();
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: "Ampolla Mundialista <noreply@ampollamundialista.com>",
          to: email,
          subject: `📰 ${title} - Ampolla Mundialista 2026`,
          html,
        });

        if (emailError) {
          console.error(`Failed to send to ${email}:`, emailError);
          failed++;
        } else {
          sent++;
        }
      } catch (err) {
        console.error(`Error sending to ${email}:`, err);
        failed++;
      }

      // 1-second delay between sends to respect Resend rate limits
      if (emails.indexOf(email) < emails.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({ sent, failed });
  } catch (err) {
    console.error("Blog post email API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

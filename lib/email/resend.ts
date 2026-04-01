import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendAdminInviteEmail(input: {
  to: string;
  businessName: string;
  inviteUrl: string;
}) {
  const resend = getResendClient();

  if (!resend) {
    return { success: false, reason: "missing_resend_api_key" as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "no-reply@laprospect.com";

  await resend.emails.send({
    from,
    to: input.to,
    subject: `Invitacion a ${input.businessName} en La Prospect`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; color: #111111;">
        <h1 style="font-size: 24px;">Te han invitado a La Prospect</h1>
        <p>Ahora puedes gestionar el negocio <strong>${input.businessName}</strong>.</p>
        <p>
          <a href="${input.inviteUrl}" style="display:inline-block;padding:12px 18px;background:#1f7a64;color:#ffffff;border-radius:10px;text-decoration:none;">
            Aceptar invitacion
          </a>
        </p>
      </div>
    `
  });

  return { success: true as const };
}

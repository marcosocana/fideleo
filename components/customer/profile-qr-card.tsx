import Image from "next/image";
import QRCode from "qrcode";

import { encodeCustomerQrToken } from "@/lib/loyalty/qr";

export async function ProfileQrCard({
  userId,
  businessId
}: {
  userId: string;
  businessId: string;
}) {
  const token = encodeCustomerQrToken({ userId, businessId });
  const qrDataUrl = await QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#163B33",
      light: "#F7F2E8"
    }
  });

  return (
    <section className="card-surface mt-5 p-6">
      <p className="text-sm text-muted">QR personal</p>
      <div className="mt-4 flex flex-col items-center gap-4 rounded-[28px] bg-[#f7f2e8] p-5">
        <Image alt="QR del perfil de cliente" className="rounded-2xl" height={220} src={qrDataUrl} width={220} />
        <div className="text-center">
          <p className="font-medium">Muéstralo al camarero para sumar puntos</p>
          <p className="mt-1 text-sm text-muted">
            El negocio leerá tu perfil y calculará automáticamente los puntos a partir del importe.
          </p>
        </div>
      </div>
    </section>
  );
}

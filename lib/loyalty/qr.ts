const QR_PREFIX = "laprospect:qr:v1";

export function encodeCustomerQrToken({ userId, businessId }: { userId: string; businessId: string }) {
  return `${QR_PREFIX}:${businessId}:${userId}`;
}

export function decodeCustomerQrToken(token: string) {
  const [prefixA, prefixB, prefixC, version, businessId, userId] = token.split(":");

  if (`${prefixA}:${prefixB}:${prefixC}:${version}` !== QR_PREFIX || !businessId || !userId) {
    return null;
  }

  return { businessId, userId };
}

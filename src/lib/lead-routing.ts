export function buildWhatsAppUrl(phone: string, message: string) {
  const encodedMessage = encodeURIComponent(message);

  let cleaned = (phone ?? '').replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.slice(1);
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);

  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}

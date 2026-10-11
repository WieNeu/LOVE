const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phonePattern = /(\+?\d[\d\s().-]{7,}\d)/;
const addressPattern = /(straße|str\.|weg|platz|allee|dorf|straße\s+\d+|[A-Z][a-z]+\s+\d{1,5})/i;

export function moderateText({
  title,
  content,
  anonymousName
}: {
  title: string;
  content: string;
  anonymousName?: string;
}) {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  const reasons: string[] = [];

  if (emailPattern.test(content) || emailPattern.test(title)) {
    reasons.push('E-Mail-Adresse erkannt');
  }

  if (phonePattern.test(content) || phonePattern.test(title)) {
    reasons.push('Telefonnummer erkannt');
  }

  if (addressPattern.test(content) || addressPattern.test(title)) {
    reasons.push('Adresse erkannt');
  }

  if (/(?:\b(?:spam|ads|advertising|buy now|click here)\b)/i.test(content)) {
    reasons.push('Verdächtiger Spam-Inhalt');
  }

  if (/(?:\b(?:you are a idiot|du bist dumm|idiot|arsch|hure|scheiße)\b)/i.test(content)) {
    reasons.push('Beleidigende Sprache');
  }

  if (/(?:\b(?:kill|hurt|destroy|attack)\b)/i.test(content)) {
    reasons.push('Verletzungs-/Gewalt-Formulierungen');
  }

  if (/(?:\b(?:nazi|hass|slur)\b)/i.test(content)) {
    reasons.push('Hassrede oder extremistische Sprechweise');
  }

  if (anonymousName && /(?:\b(?:max|mustermann|mueller|schmidt|meier|frau|herr)\b)/i.test(anonymousName)) {
    reasons.push('Verdächtiger realer Name');
  }

  if (lowerTitle.includes('http') || lowerContent.includes('http')) {
    reasons.push('Links/Spam erkannt');
  }

  const isSafe = reasons.length === 0;

  return {
    status: isSafe ? 'APPROVED' : 'FLAGGED',
    reasons,
    isSafe
  };
}

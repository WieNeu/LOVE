import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Liebeskummer', slug: 'liebeskummer', icon: '❤️' },
    { name: 'Trennung', slug: 'trennung', icon: '💔' },
    { name: 'Erste Liebe', slug: 'erste-liebe', icon: '💕' },
    { name: 'Unerwiderte Liebe', slug: 'unerwiderte-liebe', icon: '🥀' },
    { name: 'Dating', slug: 'dating', icon: '💬' },
    { name: 'Beziehung', slug: 'beziehung', icon: '❤️' },
    { name: 'Fremdgehen', slug: 'fremdgehen', icon: '💔' },
    { name: 'Ex-Partner', slug: 'ex-partner', icon: '👋' },
    { name: 'Freundschaft & Liebe', slug: 'freundschaft-liebe', icon: '🫶' },
    { name: 'Happy End', slug: 'happy-end', icon: '✨' },
    { name: 'Sonstiges', slug: 'sonstiges', icon: '🌙' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@love.example' },
    update: {},
    create: {
      email: 'admin@love.example',
      passwordHash: adminPassword,
      publicName: 'Herzwart',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  const categoriesList = await prisma.category.findMany();

  const stories = [
    {
      anonymousName: 'Herzsucher23',
      title: 'Ich habe drei Jahre auf sie gewartet.',
      content:
        'Manchmal merkt man erst viel zu spät, dass man den wichtigsten Menschen bereits verloren hat. Ich war so lange in einem Gefühl hängen geblieben, das vielleicht nie wirklich da war. Ich habe jeden kleinen Blick, jede Nachricht, jede Ausrede in mein Herz gelegt und mich selbst davon überzeugt, dass es irgendwann noch zu uns passt. Aber das war kein Liebesroman. Es war nur eine lange Sehnsucht, die mir die Luft nahm. Ich bin heute nicht mehr wütend, nur traurig. Und ein bisschen müde.\n\nManchmal glaube ich, dass wir uns nicht wegen der Person verlieren, sondern wegen der Geschichten, die wir uns selbst erzählen, um nicht loszulassen. Heute bin ich endlich bereit, das zu sehen.' ,
      category: categoriesList.find((category) => category.slug === 'liebeskummer')!,
      contentWarning: null,
      publishedAt: new Date(),
      isDemo: true,
      moderationStatus: 'APPROVED'
    },
    {
      anonymousName: 'Nachtschat',
      title: 'Wir haben uns auseinandergelebt, ohne es zu merken.',
      content:
        'Ich dachte, wir sind einfach nur müde. Misstrauisch. Durch den Alltag. Dann kam das erste Schweigen, das nicht mehr nur ein Schweigen war. Es war ein Abstand. Ein aufgestautes Ding zwischen uns, das kaum noch Worte brauchte.\n\nWir haben über alles geredet, außer über das, was wirklich kaputt war. Ich glaube, Trennung fühlt sich manchmal an wie ein langsames Entschlafen. Nicht laut, nicht dramatisch, sondern einfach nur so unmerklich, dass man erst später merkt: Wir sind nicht mehr wir.\n\nIch habe gelernt, dass Liebe nicht immer daran festmacht, ob man sich liebt. Manchmal ist sie nur eine Erinnerung an etwas, das man schon verloren hat.' ,
      category: categoriesList.find((category) => category.slug === 'trennung')!,
      contentWarning: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isDemo: true,
      moderationStatus: 'APPROVED'
    },
    {
      anonymousName: 'BriefeAnDieZeit',
      title: 'Ich dachte, meine erste Liebe wäre meine letzte.',
      content:
        'Ich war fünfzehn, als ich zum ersten Mal das Gefühl hatte, dass meine Brust nicht mehr normal arbeitet. Alles war anders. Das Lachen, die Musik, die Nächte, die trotzdem immer zu kurz waren. Ich habe mir in der Schule Notizen über ihn gemacht, nur weil ich dachte, wenn ich etwas aufschreibe, kann ich es besser aushalten.\n\nAber irgendwann kam der Moment, in dem wir nicht mehr dieselbe Welt waren. Und ich musste merken: Man kann jemandem mit jedem Atemzug lieben und trotzdem loslassen müssen.\n\nHeute bin ich dankbar für diese Liebe, obwohl sie mich verändert hat. Sie hat mich nicht gerettet, aber sie hat mich gelehrt, was Leidenschaft wirklich ist.' ,
      category: categoriesList.find((category) => category.slug === 'erste-liebe')!,
      contentWarning: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      isDemo: true,
      moderationStatus: 'APPROVED'
    },
    {
      anonymousName: 'UnbekanntZuerst',
      title: 'Ich war zu stolz, um zu fragen, ob ich ihr wichtig bin.',
      content:
        'Wenn man jemanden liebt, den man nicht haben kann, schmeckt alles komisch. Jeder Gedanke fühlt sich wie ein kleiner Schwindel an. Ich habe mich an ihre Nähe gehalten, wie an ein Versprechen, das nie wirklich gegeben wurde.\n\nIch habe mich gefragt, ob ich zu viel gewesen bin, ob ich zu wenig war, ob ich einfach nur der falsche Mensch in dem falschen Moment war. Vielleicht war es beides.\n\nManchmal muss man nicht alles verstehen, um zu wissen, dass man verletzt wurde. Ich bin immer noch nicht sicher, ob ich wirklich aufgehört habe, sie zu lieben oder nur aufgehört habe, zu hoffen.' ,
      category: categoriesList.find((category) => category.slug === 'unerwiderte-liebe')!,
      contentWarning: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      isDemo: true,
      moderationStatus: 'APPROVED'
    },
    {
      anonymousName: 'EinfachIch',
      title: 'Manchmal reicht ein neues Match, damit man wieder glaubt.',
      content:
        'Ich dachte, Dating sei nur ein paar Dates, ein paar flüchtige Gespräche und ein paar Unschärfen. Dann traf ich jemanden, der nicht nur nett war, sondern wirklich zuhören konnte. Ich hatte vergessen, wie gut sich das anfühlt.\n\nWir haben uns viel erzählt. Über Zweifel, über Exen, darüber, wie schwer es manchmal ist, jemandem zu vertrauen, wenn man bereits verletzt wurde.\n\nIch bin nicht mehr dort, wo ich vor ein paar Monaten war. Vielleicht ist das ja schon ein kleiner Anfang. Oder einfach nur eine Erinnerung daran, dass man irgendwann wieder offen für das Richtige sein kann.' ,
      category: categoriesList.find((category) => category.slug === 'dating')!,
      contentWarning: null,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      isDemo: true,
      moderationStatus: 'APPROVED'
    }
  ];

  for (const story of stories) {
    await prisma.story.upsert({
      where: {
        id: `demo-${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      },
      update: {},
      create: {
        id: `demo-${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        anonymousName: story.anonymousName,
        title: story.title,
        content: story.content,
        categoryId: story.category.id,
        contentWarning: story.contentWarning,
        publishedAt: story.publishedAt,
        isDemo: true,
        moderationStatus: story.moderationStatus,
        likesCount: Math.floor(Math.random() * 120) + 25,
        commentsCount: Math.floor(Math.random() * 20) + 5,
        viewsCount: Math.floor(Math.random() * 500) + 100
      }
    });
  }

  console.log('Seed complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EVENTS = [
  {
    title: "React & Next.js Atölyesi",
    description:
      "Modern full-stack geliştirme için React 19 ve Next.js App Router ile uygulamalı atölye. Proje tabanlı öğrenme.",
    location: "B Blok 201 — Yazılım Lab",
    category: "Teknoloji",
    coverKey: "aurora",
    days: 7,
    quota: 40,
  },
  {
    title: "Kariyer Sohbetleri: STAJ 101",
    description:
      "Sektör profesyonelleriyle staj başvurusu, CV ve mülakat hazırlığı üzerine panel ve networking.",
    location: "Konferans Salonu A",
    category: "Kariyer",
    coverKey: "ocean",
    days: 10,
    quota: 120,
  },
  {
    title: "Kampüs Koşusu — Bahar Kupası",
    description: "5K ve 10K parkur seçenekleriyle üniversite bahar koşusu. Madalya ve sürpriz ödüller.",
    location: "Stadyum & Yeşil Alan",
    category: "Spor",
    coverKey: "lime",
    days: 12,
    quota: 200,
  },
  {
    title: "Akustik Gecesi",
    description: "Öğrenci topluluklarından canlı performanslar. Oturma düzeni sınırlı — erken kayıt önerilir.",
    location: "Kültür Merkezi",
    category: "Sanat",
    coverKey: "sunset",
    days: 14,
    quota: 80,
  },
  {
    title: "Yapay Zeka 101 Semineri",
    description: "LLM, prompt engineering ve etik AI konularında giriş seviyesi seminer.",
    location: "Mühendislik Fakültesi 104",
    category: "Teknoloji",
    coverKey: "midnight",
    days: 16,
    quota: 90,
  },
  {
    title: "Fotoğrafçılık Workshop",
    description: "Kompozisyon, ışık ve mobil fotoğrafçılık. Katılımcılar mini sergi ile kapanış yapar.",
    location: "Güzel Sanatlar Atölye",
    category: "Atölye",
    coverKey: "coral",
    days: 18,
    quota: 25,
  },
  {
    title: "Girişimcilik Bootcamp",
    description: "Fikirden MVP'ye 48 saatlik yoğun program. Mentorluk ve pitch günü dahil.",
    location: "İnovasyon Merkezi",
    category: "Kariyer",
    coverKey: "grape",
    days: 21,
    quota: 50,
  },
  {
    title: "Board Game Gecesi",
    description: "Strateji ve kooperatif oyunlarla sosyalleşme gecesi. Yiyecek ikramı var.",
    location: "Öğrenci Merkezi — Oyun Odası",
    category: "Sosyal",
    coverKey: "forest",
    days: 23,
    quota: 60,
  },
  {
    title: "Veri Bilimi Hack Night",
    description: "Python, pandas ve görselleştirme ile gece boyu hackathon. Takımlar 3 kişilik.",
    location: "B Blok 105",
    category: "Teknoloji",
    coverKey: "ocean",
    days: 25,
    quota: 36,
  },
  {
    title: "Sürdürülebilirlik Zirvesi",
    description: "Yeşil kampüs, geri dönüşüm ve iklim okuryazarlığı panelleri.",
    location: "Çevre Kulübü Etkinlik Alanı",
    category: "Sosyal",
    coverKey: "forest",
    days: 28,
    quota: 100,
  },
  {
    title: "Seramik Atölyesi",
    description: "Çamur şekillendirme ve sır teknikleri. Malzeme kulüp tarafından sağlanır.",
    location: "El Sanatları Stüdyosu",
    category: "Atölye",
    coverKey: "sunset",
    days: 30,
    quota: 18,
  },
  {
    title: "Dans & Ritim Workshop",
    description: "Beginner friendly dans workshop. Rahat kıyafet ve su şişesi getirin.",
    location: "Spor Salonu — Studio 2",
    category: "Sanat",
    coverKey: "coral",
    days: 35,
    quota: 45,
  },
];

async function main() {
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.club.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      name: "Sistem Yöneticisi",
      email: "admin@uni.edu",
      passwordHash,
      role: "ADMIN",
    },
  });

  const president = await prisma.user.create({
    data: {
      name: "Ayşe Yılmaz",
      email: "president@uni.edu",
      passwordHash,
      role: "CLUB_PRESIDENT",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Mehmet Demir",
      email: "student@uni.edu",
      passwordHash,
      role: "STUDENT",
      student: {
        create: { studentNo: "2024001001", department: "Yazılım Mühendisliği" },
      },
    },
    include: { student: true },
  });

  const club = await prisma.club.create({
    data: {
      name: "Yazılım & İnovasyon Kulübü",
      description: "Teknoloji, kariyer ve sosyal etkinlikler düzenleyen aktif öğrenci kulübü.",
      presidentUserId: president.id,
    },
  });

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  await prisma.event.create({
    data: {
      clubId: club.id,
      title: "Geçmiş Etkinlik (Test)",
      description: "Kayıt testi için geçmiş tarihli etkinlik.",
      location: "A Blok 101",
      category: "Teknoloji",
      coverKey: "midnight",
      startTime: pastDate,
      quota: 20,
    },
  });

  const fullDate = new Date();
  fullDate.setDate(fullDate.getDate() + 40);

  const fullEvent = await prisma.event.create({
    data: {
      clubId: club.id,
      title: "Dolu Kontenjan — Pop-up Store",
      description: "Kontenjan testi için tek kişilik demo etkinlik.",
      location: "Kampüs Meydanı",
      category: "Sosyal",
      coverKey: "grape",
      startTime: fullDate,
      quota: 1,
    },
  });

  const createdEvents = [];
  for (const e of EVENTS) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + e.days);
    const ev = await prisma.event.create({
      data: {
        clubId: club.id,
        title: e.title,
        description: e.description,
        location: e.location,
        category: e.category,
        coverKey: e.coverKey,
        startTime,
        quota: e.quota,
      },
    });
    createdEvents.push(ev);
  }

  const otherStudent = await prisma.user.create({
    data: {
      name: "Zeynep Kaya",
      email: "student2@uni.edu",
      passwordHash,
      role: "STUDENT",
      student: {
        create: { studentNo: "2024001002", department: "Bilgisayar Mühendisliği" },
      },
    },
    include: { student: true },
  });

  await prisma.enrollment.create({
    data: {
      eventId: fullEvent.id,
      studentId: otherStudent.student!.id,
      status: "ACTIVE",
    },
  });

  await prisma.enrollment.create({
    data: {
      eventId: createdEvents[0].id,
      studentId: student.student!.id,
      status: "ACTIVE",
    },
  });

  await prisma.favorite.create({
    data: {
      studentId: student.student!.id,
      eventId: createdEvents[1].id,
    },
  });
  await prisma.favorite.create({
    data: {
      studentId: student.student!.id,
      eventId: createdEvents[3].id,
    },
  });

  await prisma.announcement.createMany({
    data: [
      {
        clubId: club.id,
        title: "Bahar dönemi etkinlik takvimi yayında",
        content:
          "12+ yeni etkinlik listelendi. Favorilerinize ekleyerek takip edebilir, kontenjan dolmadan kayıt olabilirsiniz.",
      },
      {
        clubId: club.id,
        title: "Hack Night takımları açıldı",
        content: "Veri Bilimi Hack Night için 3 kişilik takım kayıtları başladı.",
      },
    ],
  });

  console.log("Seed tamamlandı — 12+ aktif etkinlik.");
  console.log("Demo: student@uni.edu / president@uni.edu / admin@uni.edu — şifre: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

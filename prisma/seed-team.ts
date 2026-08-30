import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add 4 BOD members
  const bodMembers = [
    {
      name: "Dr. Rajitha Y",
      slug: "dr-rajitha-y",
      category: "BOD",
      roleEn: "President & Founder",
      bioEn: "Dr. Rajitha Y is a visionary leader with over 20 years of experience in the medical field. He founded the organization with a mission to bring compassionate care to everyone.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      order: 1,
    },
    {
      name: "Dr. Ruvan Ekanayaka",
      slug: "dr-ruvan-ekanayaka",
      category: "BOD",
      roleEn: "Vice President",
      bioEn: "Dr. Ruvan Ekanayaka is a renowned specialist who has dedicated his life to improving healthcare accessibility. He oversees all major medical initiatives.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
      order: 2,
    },
    {
      name: "Prof. Anura P",
      slug: "prof-anura-p",
      category: "BOD",
      roleEn: "Chief Medical Officer",
      bioEn: "With an extensive background in public health, Prof. Anura leads our clinical strategies and ensures the highest standards of care across all our centers.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
      order: 3,
    },
    {
      name: "Ms. Kumudini W",
      slug: "ms-kumudini-w",
      category: "BOD",
      roleEn: "Director of Operations",
      bioEn: "Ms. Kumudini manages the daily operations of the organization, bringing her vast experience in hospital management and logistics to the team.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      order: 4,
    }
  ];

  // Add 4 Staff members
  const staffMembers = [
    {
      name: "Sarah Jenkins",
      slug: "sarah-jenkins",
      category: "STAFF",
      roleEn: "Head Nurse",
      bioEn: "Sarah has been a dedicated nurse for over a decade. She leads our nursing staff with unparalleled empathy and professionalism.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
      order: 1,
    },
    {
      name: "Michael Chen",
      slug: "michael-chen",
      category: "STAFF",
      roleEn: "Project Coordinator",
      bioEn: "Michael handles community outreach and manages our field projects, ensuring that help reaches those who need it the most.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
      order: 2,
    },
    {
      name: "Amila Perera",
      slug: "amila-perera",
      category: "STAFF",
      roleEn: "Clinical Psychologist",
      bioEn: "Amila provides essential mental health support to our patients, focusing on holistic recovery and well-being.",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop",
      order: 3,
    },
    {
      name: "Nethmi Silva",
      slug: "nethmi-silva",
      category: "STAFF",
      roleEn: "Administrative Assistant",
      bioEn: "Nethmi is the welcoming face at our main office, coordinating schedules, managing inquiries, and supporting the entire staff.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
      order: 4,
    }
  ];

  const allMembers = [...bodMembers, ...staffMembers];

  console.log("Seeding team members...");
  for (const member of allMembers) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

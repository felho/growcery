import "dotenv/config";
import { db } from "../../db";
import { compMatrixAreas } from "../schema/tables/comp-matrix-areas";
import { compMatrixCompetencies } from "../schema/tables/comp-matrix-competencies";
import { compMatrixLevels } from "../schema/tables/comp-matrix-levels";
import { compMatrixDefinitions } from "../schema/tables/comp-matrix-definitions";

async function seed() {
  await db.insert(compMatrixLevels).values([
    {
      id: 1,
      compMatrixId: 1,
      numericLevel: 1,
      jobTitle: "Associate Engineer",
      persona: "Apprentice",
      roleSummary:
        "Passionate newcomer who is committed to high quality and learning with guidance. Focused on solving problems and growing professionally.",
      areaOfImpact: "task",
    },
    {
      id: 2,
      compMatrixId: 1,
      numericLevel: 2,
      jobTitle: "Engineer",
      persona: "Journeyman",
      roleSummary:
        "Self-sufficient developer with a focus on consistent delivery and expanding their area of expertise.",
      areaOfImpact: "story/epic",
    },
    {
      id: 3,
      compMatrixId: 1,
      numericLevel: 3,
      jobTitle: "Senior Engineer",
      persona: "Craftsman",
      roleSummary:
        "Highly skilled developer, fully capable of working independently but also pairing with team mates to offer guidance. A role model for other engineers on the team, embodies our engineering culture and values. Focuses on delivering value via product increments, rather than solving problems with engineering.",
      areaOfImpact: "engineering team/discipline",
    },
    {
      id: 4,
      compMatrixId: 1,
      numericLevel: 4,
      jobTitle: "Staff Engineer",
      persona: "Booster",
      roleSummary:
        'A true master of their craft, adept at designing complex systems with stability, scalability, and security in mind. Keeps an eye on "the big picture" and other teams\' work. Has a firm grasp on the system\'s overall architecture and assists with technical discussions and decisions. Boosts their team\'s impact by actively looking for ways to reduce complexity, enabling them to achieve big results with the least possible effort.\n\nHow to recognize:\nWhen plucked from a team and put into another, the other team suddenly "grows wings" and starts to soar.',
      areaOfImpact: "whole (product) team",
    },
    {
      id: 5,
      compMatrixId: 1,
      numericLevel: 5,
      jobTitle: "Senior Staff Engineer",
      persona: "Multiplier",
      roleSummary:
        "A cross-team strategist, enabling the next level of scalability and productivity for several teams. Plays an architectural role in cross-team projects and drives long-term technology changes involving multiple teams. Shapes overall system architecture, identifies and drives system-level improvements. Provides guidance in technical debates. Multiplies the impact of teams.\n\nHow to recognize:\nThey're the ones pairing with developers from other teams, leading guilds, organizing coding dojos, etc.",
      areaOfImpact: "several teams",
    },
    {
      id: 6,
      compMatrixId: 1,
      numericLevel: 6,
      jobTitle: "Principal Engineer",
      persona: "Visionary",
      roleSummary:
        "A beacon of experience and expertise, enabling business innovation through setting the company-wide technology direction for years to come. Architects entire systems, introduces policies and processes that boost organizational productivity. Leads internal conversations on technology direction and strategy. Serves as a role model and mentor for all engineers, fostering growth and development.\n\nHow to recognize:\nThey're the ones organizing company-wide knowledge sharing events (e.g. TDD workshop, coding dojos, Hackathon), writing RFCs about new technologies, creating POCs using new tools and services, etc.",
      areaOfImpact: "company-wide (mainly SX but can be Byborg as well)",
    },
  ]);

  await db.insert(compMatrixAreas).values([
    {
      id: 1,
      compMatrixId: 1,
      title: "Craftsmanship",
      shortDescription: "Craftsmanship",
    },
    {
      id: 2,
      compMatrixId: 1,
      title: "Collaboration",
      shortDescription: "Collaboration",
    },
    {
      id: 3,
      compMatrixId: 1,
      title: "Leadership",
      shortDescription: "Leadership",
    },
    {
      id: 4,
      compMatrixId: 1,
      title: "Impact",
      shortDescription: "Impact",
    },
  ]);

  await db.insert(compMatrixCompetencies).values([
    // export const compMatrixCompetencies = createTable("comp-matrix-competencies", {
    //   id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    //   compMatrixAreaId: bigint({ mode: "number" })
    //     .notNull()
    //     .references(() => compMatrixAreas.id),
    //   title: varchar({ length: 100 }).notNull(),
    //   calculationWeight: smallint(),
    //   sortOrder: smallint().notNull(),
    // });

    // Craftsmanship (areaId: 1)
    {
      id: 1,
      compMatrixAreaId: 1,
      title: "Coding & Testing",
      calculationWeight: 1,
      sortOrder: 1,
    },
    {
      id: 2,
      compMatrixAreaId: 1,
      title: "Software Design",
      calculationWeight: 1,
      sortOrder: 2,
    },
    {
      id: 3,
      compMatrixAreaId: 1,
      title: "Architecture",
      calculationWeight: 1,
      sortOrder: 3,
    },
    {
      id: 4,
      compMatrixAreaId: 1,
      title: "Security & Operability (#DevSecOps)",
      calculationWeight: 1,
      sortOrder: 4,
    },
    {
      id: 5,
      compMatrixAreaId: 1,
      title: "Tools & Technology",
      calculationWeight: 1,
      sortOrder: 5,
    },

    // Collaboration (areaId: 2)
    {
      id: 6,
      compMatrixAreaId: 2,
      title: "Communication",
      calculationWeight: 1,
      sortOrder: 1,
    },
    {
      id: 7,
      compMatrixAreaId: 2,
      title: "Teamwork",
      calculationWeight: 1,
      sortOrder: 2,
    },
    {
      id: 8,
      compMatrixAreaId: 2,
      title: "Feedback",
      calculationWeight: 1,
      sortOrder: 3,
    },
    {
      id: 9,
      compMatrixAreaId: 2,
      title: "Knowledge Sharing",
      calculationWeight: 1,
      sortOrder: 4,
    },

    // Leadership (areaId: 3)
    {
      id: 10,
      compMatrixAreaId: 3,
      title: "Mentoring",
      calculationWeight: 1,
      sortOrder: 1,
    },
    {
      id: 11,
      compMatrixAreaId: 3,
      title: "Ownership",
      calculationWeight: 1,
      sortOrder: 2,
    },
    {
      id: 12,
      compMatrixAreaId: 3,
      title: "Judgment",
      calculationWeight: 1,
      sortOrder: 3,
    },

    // Impact (areaId: 4)
    {
      id: 13,
      compMatrixAreaId: 4,
      title: "Delivery",
      calculationWeight: 1,
      sortOrder: 1,
    },
    {
      id: 14,
      compMatrixAreaId: 4,
      title: "Product Thinking",
      calculationWeight: 1,
      sortOrder: 2,
    },
    {
      id: 15,
      compMatrixAreaId: 4,
      title: "Project Management",
      calculationWeight: 1,
      sortOrder: 3,
    },
  ]);

  await db.insert(compMatrixDefinitions).values([
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 1,
      definition:
        "Writes software with testability, readability, edge cases, and errors in mind. Writes unit tests, sometimes with help from more senior engineers. Seeks guidance on how to improve the quality of their code.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 2,
      definition:
        "Consistently writes code that is easy to read, understand and test. Writes all necessary tests to assure the quality of their code. Recognizes and eliminates code smells with confidence using refactoring techniques. Consistently follows agreed-upon best practices.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 3,
      definition:
        "Consistently writes clean, self-documenting and correct code (as described in Bob Martin's book: Clean Code) in both production and test domains. Helps to define coding and testing best practices and conventions for the project. Is an expert at all levels of testing, from unit to end-to-end.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 4,
      definition:
        "Considers source code a form of communication. Writes code to articulate a problem and its solution for future developers, via Simple Design, Clean Code and self documenting test cases, using Test Driven Development. Fosters a culture of collective ownership and quality in and across teams.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 5,
      definition: "",
      inheritsPreviousLevel: true,
    },
    {
      compMatrixCompetencyId: 1,
      compMatrixLevelId: 6,
      definition: "",
      inheritsPreviousLevel: true,
    },

    // Software Design
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 1,
      definition:
        "Understands basic design principles (SOLID, ...) and is familiar with most commonly used design patterns. Designs solutions on the class/method level. Focuses on honing their design skills and knowledge.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 2,
      definition:
        "Understands and can confidently apply design principles and patterns in everyday work. Designs solutions involving multiple components (classes, groups of classes) within a service mostly without guidance. Participates in design discussions.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 3,
      definition:
        "Understands the trade-offs of applying design principles and patterns to a problem and can confidently make the right decision when it comes to balancing this trade-off. Designs complex (not complicated!) solutions within a single service independently. Leads design discussions and investigations. Regularly reads and comments RFCs, coming from within or outside their team.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 4,
      definition:
        "Architects solutions involving multiple services, taking into consideration stability, scalability, operability, security, code quality, maintainability, performance, etc.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 5,
      definition:
        "Architects entire systems of services, taking into consideration stability, scalability, operability, security, code quality, maintainability, performance, etc.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 2,
      compMatrixLevelId: 6,
      definition:
        "Architects solutions involving the whole system, determining the future direction (service architecture, etc.) of the platform. Keeps an eye on the future, anticipating technology changes and making sure the company stays on the right technological and architectural path to maintain our competitive edge.",
      inheritsPreviousLevel: false,
    },

    // Architecture
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 1,
      definition:
        "Is aware of the overall system architecture of the product and is able to gain context within their team’s domain with help from more senior engineers.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 2,
      definition:
        "Understands their team’s domain at a high level and can gather sufficient context to work productively in it.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 3,
      definition:
        "Is an expert in their team’s domain and understands its place within the overall system architecture, including data flows between adjacent domains. Can confidently advise changes in architecture in their domain.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 4,
      definition:
        "Is an expert in their team’s domain and understands (in detail) the overall system architecture, including the breadth of services, how they interact, and data flows between systems. Can confidently make decisions regarding changes in their domain.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 5,
      definition:
        "Has expertise in a set of related teams’ domains, including the breadth of services, how they interact, and data flows between systems. Can confidently make decisions regarding the architecture of these related domains.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 3,
      compMatrixLevelId: 6,
      definition:
        "Has expertise in the entire organization’s architecture, including all domains, their business contexts, and how these domains interact with each other. Can confidently make decisions regarding overall system architecture.",
      inheritsPreviousLevel: false,
    },

    // Security & Operability
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 1,
      definition:
        "Begins to learn the importance of security, operability (scalability, observability, etc.). Familiarizes themselves with company standards for each aspect.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 2,
      definition:
        "Understands the importance of security and operability in engineering. Applies company standards and seeks guidance from more senior engineers on decisions with potential security or operability implications.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 3,
      definition:
        "Approaches all engineering work (from design to implementation) with security and operability in mind. Enforces security standards and operability best practices in their team. Proactively looks for potential issues both when working with code or providing peer reviews.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 4,
      definition:
        "Security and operability is second nature when it comes to any engineering activity. Helps their team adopt new standards or refine their current ones. Keeps an eye out for existing (or missing) solutions that might become a roadblock in the future and actively works on preempting these problems. Fosters a DevSecOps-first mindset within their own team, and leads by example.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 5,
      definition:
        "Proactively works with the security and DevOps teams, as well as their own team, to refine their team’s approach to security and operability based on the organization’s strategies. Keeps an eye out for existing (or missing) solutions that might become a roadblock in the future and actively works on preempting these problems. Fosters a DevSecOps-first mindset within their own team, and leads by example.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 4,
      compMatrixLevelId: 6,
      definition: "",
      inheritsPreviousLevel: true,
    },

    // Tools & Technology
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 1,
      definition:
        "Focuses on learning existing tools and technologies used by the team.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 2,
      definition:
        "Is comfortable with using all the tools and technologies used by the team.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 3,
      definition:
        "Is proficient with and understands the pros and cons of all the technologies used by the team. A master of their developer toolchain (e.g. IDE of choice) which is reflected in their productivity.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 4,
      definition:
        "Is a go-to expert in at least one of the technologies used in the team. Has experience in evaluating, introducing, or evolving team-wide tooling or technologies. Looks for opportunities to improve their team’s toolchain and development processes. Regularly leads retrospectives and improvement initiatives, and suggests new tools or technologies that could solve the problem.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 5,
      definition:
        "Is familiar with the technology stack of several teams and has expertise in evaluating, introducing, or evolving organization-wide tooling or technologies. Looks for opportunities to improve organizational toolchains and development processes. Regularly leads retrospectives and improvement initiatives and suggests new tools or technologies that could solve the problem.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 5,
      compMatrixLevelId: 6,
      definition:
        "Leads conversations and investigations about the direction of major areas of the technology stack, drives wide-team consensus to the adoption of this direction.",
      inheritsPreviousLevel: false,
    },
  ]);

  await db.insert(compMatrixDefinitions).values([
    {
      compMatrixCompetencyId: 6, // Communication
      compMatrixLevelId: 1, // E1
      definition:
        "Listens actively and participates constructively in meetings and other channels, asking clarifying questions. Shares their opinion in an easy to understand and kind manner. Communicates openly and honestly. Gives or shares credit where it is due.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 6,
      compMatrixLevelId: 2, // E2
      definition:
        "Communicates assumptions and gets clarification on tasks up front to minimize the need for rework. Proactively shares their opinion and actively takes part in discussions, solving problems in connection with their area regarding both technology and product. Actively seeks out and listens to others’ perspectives.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 6,
      compMatrixLevelId: 3,
      definition:
        "Communicates effectively across functions; is able to work well with Product, Design, etc. as necessary. Articulates complex technical concepts to various audiences, including non-technical stakeholders. Actively listens to others and makes sure they are understood.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 6,
      compMatrixLevelId: 4,
      definition:
        "Communicates effectively with a diverse team and supports decision making across functions. Fosters a culture of clear, effective and audience-oriented communication on their team, making sure that conflicts are promptly resolved and teammates actively listen to others and are understood. Pays attention to nonverbal communication.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 6,
      compMatrixLevelId: 5,
      definition:
        "Communicates effectively across multiple teams. Supports strategic decision making by creating multi-team synchronization points (when needed) and guiding debates, making sure that every participant is listened to and understood. Communicates decisions clearly across functions.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 6,
      compMatrixLevelId: 6,
      definition:
        "Communicates effectively with upper management in a clear, concise and audience-oriented manner. Is recognized and acknowledged by upper management as someone they can communicate with. Supports decision making on an organizational level.",
      inheritsPreviousLevel: false,
    },

    {
      compMatrixCompetencyId: 7, // Teamwork
      compMatrixLevelId: 1,
      definition:
        "Works together with teammates (pairing, etc.) to deliver on product commitments. Actively participates in team ceremonies (planning sessions, estimations, retrospectives, demos, and so on).",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 7,
      compMatrixLevelId: 2,
      definition:
        "Pairs with other developers to deliver on commitments and share knowledge. Supports the team by promptly reviewing pending PRs.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 7,
      compMatrixLevelId: 3,
      definition:
        "Pairs with other developers to unblock them, help overcome obstacles and share knowledge. Participates in product discoveries and cross-team efforts. Facilitates team ceremonies (standup, planning, retrospective), if need be.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 7,
      compMatrixLevelId: 4,
      definition:
        "Regularly pairs with developers from other disciplines (FE/BE) in their team and also reviews PRs for all of these disciplines. Supports their team by facilitating team ceremonies and actively participating in product discoveries to come up with better team planning. Supports the team by planning stories/epics.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 7,
      compMatrixLevelId: 5,
      definition:
        "Regularly pairs with developers from other teams. Drives technical debates and discussions between teams or across disciplines.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 7,
      compMatrixLevelId: 6,
      definition:
        "Champions a culture of collaboration at the organizational level. Consistently works across the organization to enable teams to support each other.",
      inheritsPreviousLevel: false,
    },

    {
      compMatrixCompetencyId: 8, // Feedback
      compMatrixLevelId: 1,
      definition:
        "Actively seeks out feedback from their teammates and lead, accepts feedback graciously and uses feedback they receive as a tool for growth.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 8,
      compMatrixLevelId: 2,
      definition:
        "Solicits feedback from others and is eager to find ways to improve. Gives helpful, timely and actionable feedback to team members.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 8,
      compMatrixLevelId: 3,
      definition:
        "Gives constructive feedback to their team using existing feedback loops (e.g. team retrospective). Fosters a culture of continuous improvement by encouraging open and honest feedback among team members.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 8,
      compMatrixLevelId: 4,
      definition:
        "Gives constructive feedback on projects, colleagues and processes even outside their core area. Leads and facilitates feedback processes across multiple teams, ensuring alignment and fostering a culture of continuous improvement.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 8,
      compMatrixLevelId: 5,
      definition:
        "Identifies missing feedback loops on a company level and creates new ones as necessary (e.g. feedback on security as a company standard for making sure our services stay up to date with security standards). Is comfortable with providing feedback to the leadership team.",
      inheritsPreviousLevel: false,
    },

    {
      compMatrixCompetencyId: 9, // Knowledge Sharing
      compMatrixLevelId: 1,
      definition: "Shares knowledge within their immediate team.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 9,
      compMatrixLevelId: 2,
      definition:
        "Shares knowledge within their team and proactively contributes to the team’s documentation. Seeks out opportunities to share their knowledge.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 9,
      compMatrixLevelId: 3,
      definition:
        "Shares knowledge within their team and their technical discipline (FE/BE) and proactively contributes to the documentation of both. Seeks out and creates opportunities to share their knowledge and encourages others to do the same.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 9,
      compMatrixLevelId: 4,
      definition:
        "Leads cross-team knowledge sharing initiatives (e.g. guilds) and guides these initiatives to success. Proactively identifies the need for shared documentation and documents knowledge sharing standards.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 9,
      compMatrixLevelId: 5,
      definition:
        "Leads organization-wide knowledge sharing initiatives (e.g. TDD workshop, or PHP guild within Byborg), influences the knowledge sharing standards within the organization.",
      inheritsPreviousLevel: false,
    },
  ]);
  await db.insert(compMatrixDefinitions).values([
    // Mentoring
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 1,
      definition:
        "Seeks out mentorship and pairing opportunities to learn and grow.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 2,
      definition:
        "Pairs with both junior and more senior colleagues to keep learning, while passing on already acquired experience.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 3,
      definition:
        "Mentors engineers in their field to fill knowledge gaps (both on the personal and the product team level) via pairing, design and code reviews, etc.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 4,
      definition:
        "Provides input to team leads on colleagues’ growth plan and career development. Mentors members of other teams as needed.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 5,
      definition:
        "Guides strategic debates, regularly writes and comments on RFCs. Fosters a culture of mentoring across teams by seeking out mentoring opportunities for themselves and others, and supports others in their growth as mentors.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 10,
      compMatrixLevelId: 6,
      definition:
        "Organizes knowledge sharing sessions, guilds, workshops, etc. Seen as a role model and (potential) mentor to every technical member of the organization.",
      inheritsPreviousLevel: false,
    },

    // Ownership
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 1,
      definition:
        "Takes ownership of assigned tasks and completes them with guidance.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 2,
      definition:
        "Takes ownership of stories/epics they work on, ensuring quality of work and maximizing business impact (where possible).",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 3,
      definition:
        "Owns their own impact; feels personally responsible for creating as much value for our users and company as they can and demonstrates this behavior actively by contributing to product discussions, discoveries, etc. as well as the technical solution.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 4,
      definition:
        "Takes ownership of the technical roadmap for their team (e.g. improvement efforts, etc.). Takes responsibility for decisions on their team by helping their teammates make and stand by key product and organizational goals, backing decisions and impact.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 5,
      definition:
        "Drives and takes ownership of cross team improvement efforts and strategic initiatives (e.g. introducing new technologies, tools, etc.) Takes responsibility for the impact of these efforts.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 11,
      compMatrixLevelId: 6,
      definition:
        "Owns and shapes the technical direction of the entire organization and takes responsibility for their business outcomes. Fosters a culture of ownership throughout the organization.",
      inheritsPreviousLevel: false,
    },

    // Judgment
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 1,
      definition:
        "Asks for guidance on the tasks they’re working on. Asks for help promptly when stuck. Makes decisions on a smaller scale, regarding technical solution to a particular problem.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 2,
      definition:
        "Makes technical decisions independently, but recognizes when a problem is beyond their skill and seeks experience; knows when and who to ask for help.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 3,
      definition:
        "Can judge when a solution is “good enough” for the product and doesn’t waste time optimizing needlessly. When needed, can gauge whether a decision will enable us in the short run or block development in the long run.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 4,
      definition:
        "Provides sound and reliable judgment on complex projects, balances business goals, short-term and long-term impact, product and technical constraints.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 5,
      definition:
        "Influences strategic decisions pertaining to more than just a single area of the product (e.g. technical or business roadmap). Contributes to organizational standards for technical judgment (e.g. incident handling in a product area). Leads in crisis decision-making.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 12,
      compMatrixLevelId: 6,
      definition:
        "Sets organizational standards for technical judgment, leads in crisis decision-making (incident handling across the organization, etc.)",
      inheritsPreviousLevel: false,
    },
  ]);
  await db.insert(compMatrixDefinitions).values([
    // Delivery
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 1,
      definition:
        "Requires frequent guidance and doesn’t have significant impact on the team’s delivery in the short term.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 2,
      definition:
        "Consistently delivers a significant amount of work with minimal guidance.\n\nWhen not present (e.g. on vacation), the team’s delivery is affected, i.e. they can ship less features/story points.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 3,
      definition:
        "Consistently delivers a substantial amount of work and helps other teammates.\n\nWhen not present (e.g. on vacation), the team’s delivery is significantly affected, meaning they can ship much less and either cannot tackle more complex problems or risk delivering sub-optimal solutions to these problems (unless another, more senior, engineer is present).",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 4,
      definition:
        "Regularly delivers a substantial amount of work but also focuses on guiding and mentoring less senior team members (e.g. through pairing sessions). Keeps the team focused and on task. Has a huge impact on the team’s overall performance.\n\nWhen not present (e.g. on vacation), the individual performance of the developers (as well as the team as a whole) is affected, processes seem less effective and some complex problems are beyond the team’s reach to solve.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 5,
      definition:
        "Regularly plays the architect role in bigger projects and is able to drive cross-team projects to successful delivery. Consistently reduces the complexity of projects, services, and processes in order to get more done with less work. Has an impact on several teams’ performance.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 13,
      compMatrixLevelId: 6,
      definition:
        "Drives company-wide technological or process changes/improvements that might involve a long-term (i.e. months or years) commitment. Has an impact on the whole engineering organization’s overall performance.",
      inheritsPreviousLevel: false,
    },

    // Product Thinking
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 1,
      definition: "Understands the basic utility of the product.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 2,
      definition:
        "Understands their team’s product area of focus, its corresponding value streams and how it all fits into the overall business. Sometimes makes suggestions for improvements.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 3,
      definition:
        "Thoroughly understands the business model and its success metrics in relation to their current product focus area. Keeps measurability at the forefront of planning. Participates in the discovery process. Sometimes participates in roadmap feedback with the product team. Looks for opportunities to simplify without hurting the customer’s experience.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 4,
      definition:
        "Evaluates and creates new product opportunities based on the product focus area and needs of the team. Regularly participates in roadmap feedback and product discovery meetings. Keeps an eye on the product cost (are we building the right thing?) and how the team might get more positive outcomes with the same effort.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 5,
      definition:
        "Recognizes product opportunities and differentiators in relation to the competition. Helps creating and refining roadmaps across teams based on technical strategy and constraints. Helps to define and create new product capabilities by changing technical strategy or constraints.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 14,
      compMatrixLevelId: 6,
      definition: "",
      inheritsPreviousLevel: true,
    },

    // Project Management
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 1,
      definition:
        "Understands the value of breaking down work into smaller tasks to enable estimation, continuous integration and incremental delivery.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 2,
      definition:
        "Ensures that tasks are appropriately sized for the stage they’re being worked on. Identifies and creates missing tasks. Collaborates with other engineers also working on the same story but different task.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 3,
      definition:
        "Drives development (from a project management point of view) within their team (BE or FE), from discovery and ideation to shipping the product. Is highly proficient in breaking down projects into actionable tasks/stories/subtasks, etc.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 4,
      definition:
        "Drives the delivery of projects. Evaluates the size and complexity of the product feature/problem area. Creates roadmaps and milestones based on time cost (are we building the thing right?) and how their team might reach the delivery target most efficiently.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 5,
      definition:
        "Drives cross-team projects, from business idea to delivery. Helps break down these projects into smaller milestones that can be delivered iteratively. Focuses on failing fast, eliminating (or mitigating) risk by creating quick POCs where necessary, writing early RFCs to get community feedback, etc.",
      inheritsPreviousLevel: false,
    },
    {
      compMatrixCompetencyId: 15,
      compMatrixLevelId: 6,
      definition:
        "Drives company-wide projects (involving non-engineering teams), from business idea to delivery, broken down and delivered in smaller milestones, iteratively.",
      inheritsPreviousLevel: false,
    },
  ]);
}

seed()
  .then(() => {
    console.log("✅ Seed successful");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  });

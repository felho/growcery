export type Rating = "Inexperienced" | "Novice" | "Intermediate" | "Proficient";

export interface CompetencyItem {
  id: string;
  name: string;
  employeeRating: Rating;
  managerRating: Rating;
  employeeNote: string;
  managerNote: string;
  definition?: string;
  levelDefinitions?: Record<string, string>; // Specific definitions per level
}

export interface CompetencyCategory {
  id: string;
  category: string;
  description?: string;
  items: CompetencyItem[];
}

export interface OrgUnit {
  id: string;
  name: string;
  description?: string;
  functionId: string; // Reference to the parent function
}

export interface Function {
  id: string;
  name: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  orgUnitId: string; // Organization unit the employee belongs to
}

export interface CompetencyMatrix {
  levels: string[];
  ratingOptions: Rating[];
  ratingDescriptions: Record<Rating, string>;
  ratingColors: Record<Rating, string>;
  competencies: CompetencyCategory[];
}

// Define the experience levels
export const experienceLevels = [
  "Engineer (E1)",
  "Engineer (E2)",
  "Senior Engineer (E3)",
  "Staff Engineer (E4)",
  "Senior Staff Engineer (E5)",
  "Principal Engineer (E6)",
];

// Exportable rating descriptions
export const ratingDescriptions: Record<Rating, string> = {
  Inexperienced: "Little to no experience with this competency",
  Novice: "Basic understanding but needs guidance",
  Intermediate: "Can work independently with occasional guidance",
  Proficient: "Deep understanding and can mentor others",
};

// Exportable rating colors
export const ratingColors: Record<Rating, string> = {
  Inexperienced: "bg-destructive/60",
  Novice: "bg-blue-300/80",
  Intermediate: "bg-blue-600/80",
  Proficient: "bg-primary/80",
};

// Helper function to get color for rating in heatmap view
export const getRatingColor = (rating: Rating): string => {
  return ratingColors[rating] || "bg-muted";
};

// Mock functions (departments) data
export const mockFunctions: Function[] = [
  {
    id: "f1",
    name: "Engineering",
    description: "Software Engineering Department",
  },
  { id: "f2", name: "Product", description: "Product Management Department" },
  { id: "f3", name: "Design", description: "UI/UX Design Department" },
  { id: "f4", name: "QA", description: "Quality Assurance Department" },
];

// Mock org units data
export const mockOrgUnits: OrgUnit[] = [
  {
    id: "ou1",
    name: "Frontend Team",
    description: "Frontend Development",
    functionId: "f1",
  },
  {
    id: "ou2",
    name: "Backend Team",
    description: "Backend Development",
    functionId: "f1",
  },
  {
    id: "ou3",
    name: "Mobile Team",
    description: "Mobile Development",
    functionId: "f1",
  },
  {
    id: "ou4",
    name: "Monetization Team",
    description: "Revenue Products",
    functionId: "f2",
  },
  {
    id: "ou5",
    name: "Growth Team",
    description: "User Growth Products",
    functionId: "f2",
  },
  {
    id: "ou6",
    name: "UI Team",
    description: "User Interface Design",
    functionId: "f3",
  },
  {
    id: "ou7",
    name: "UX Research",
    description: "User Experience Research",
    functionId: "f3",
  },
  {
    id: "ou8",
    name: "Manual QA",
    description: "Manual Testing",
    functionId: "f4",
  },
  {
    id: "ou9",
    name: "Automation QA",
    description: "Test Automation",
    functionId: "f4",
  },
];

// Mock employees data
export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Jane Cooper",
    position: "Software Engineer",
    orgUnitId: "ou1",
  },
  {
    id: "2",
    name: "John Smith",
    position: "Senior Engineer",
    orgUnitId: "ou1",
  },
  {
    id: "3",
    name: "Alex Johnson",
    position: "Staff Engineer",
    orgUnitId: "ou2",
  },
  {
    id: "4",
    name: "Maria Garcia",
    position: "Senior Staff Engineer",
    orgUnitId: "ou2",
  },
  {
    id: "5",
    name: "James Wilson",
    position: "Principal Engineer",
    orgUnitId: "ou3",
  },
  {
    id: "6",
    name: "Sarah Lee",
    position: "Software Engineer",
    orgUnitId: "ou3",
  },
  {
    id: "7",
    name: "Robert Chen",
    position: "Product Manager",
    orgUnitId: "ou4",
  },
  {
    id: "8",
    name: "Emma Davis",
    position: "Senior Product Manager",
    orgUnitId: "ou4",
  },
  {
    id: "9",
    name: "Michael Brown",
    position: "Product Designer",
    orgUnitId: "ou6",
  },
  { id: "10", name: "Lisa Wang", position: "UX Researcher", orgUnitId: "ou7" },
  { id: "11", name: "David Kim", position: "QA Engineer", orgUnitId: "ou8" },
  {
    id: "12",
    name: "Jennifer Taylor",
    position: "Automation Engineer",
    orgUnitId: "ou9",
  },
];

// Mock data for the competency matrix
export const mockCompetencyData: CompetencyMatrix = {
  levels: experienceLevels,
  ratingOptions: ["Inexperienced", "Novice", "Intermediate", "Proficient"],
  ratingDescriptions: {
    Inexperienced: "Little to no experience with this competency",
    Novice: "Basic understanding but needs guidance",
    Intermediate: "Can work independently with occasional guidance",
    Proficient: "Deep understanding and can mentor others",
  },
  ratingColors: {
    Inexperienced: "bg-destructive/60",
    Novice: "bg-blue-300/80",
    Intermediate: "bg-blue-600/80",
    Proficient: "bg-primary/80",
  },
  competencies: [
    {
      id: "craft",
      category: "Craftsmanship",
      description: "Technical skills and software engineering practices",
      items: [
        {
          id: "craft-1",
          name: "Coding & Testing",
          employeeRating: "Intermediate",
          managerRating: "Proficient",
          employeeNote: "Good understanding of testing principles.",
          managerNote: "Consistently writes clean and testable code.",
          definition:
            "Ability to write clean, maintainable code and implement comprehensive testing strategies.",
          levelDefinitions: {
            "Engineer (E1)":
              "Writes working code with guidance and creates basic unit tests.",
            "Engineer (E2)":
              "Writes clean code independently and implements proper test coverage.",
            "Senior Engineer (E3)":
              "Creates maintainable code and comprehensive test suites.",
            "Staff Engineer (E4)":
              "Sets testing standards and mentors others on code quality.",
            "Senior Staff Engineer (E5)":
              "Drives org-wide code quality initiatives.",
            "Principal Engineer (E6)":
              "Defines engineering excellence practices across the company.",
          },
        },
        {
          id: "craft-2",
          name: "Software Design",
          employeeRating: "Novice",
          managerRating: "Intermediate",
          employeeNote: "Needs more experience with design patterns.",
          managerNote: "Shows potential, needs more practice.",
          definition:
            "Knowledge of software design principles, patterns, and practices to build robust systems.",
          levelDefinitions: {
            "Engineer (E1)":
              "Follows existing designs and patterns with guidance.",
            "Engineer (E2)": "Applies common design patterns appropriately.",
            "Senior Engineer (E3)":
              "Creates effective designs for complex features.",
            "Staff Engineer (E4)":
              "Architects large systems using optimal patterns.",
            "Senior Staff Engineer (E5)":
              "Creates architecture frameworks for multiple teams.",
            "Principal Engineer (E6)":
              "Designs systems that scale across the organization.",
          },
        },
        {
          id: "craft-3",
          name: "Architecture",
          employeeRating: "Inexperienced",
          managerRating: "Novice",
          employeeNote: "Unfamiliar with architectural concepts.",
          managerNote: "Learning the basics.",
          definition:
            "Understanding of system architecture, components, and their interactions at scale.",
          levelDefinitions: {
            "Engineer (E1)":
              "Understands the architecture of their assigned area.",
            "Engineer (E2)":
              "Makes appropriate architectural decisions for features.",
            "Senior Engineer (E3)":
              "Contributes to architecture decisions for the team.",
            "Staff Engineer (E4)":
              "Leads architecture design for significant systems.",
            "Senior Staff Engineer (E5)":
              "Architects cross-team and cross-domain solutions.",
            "Principal Engineer (E6)":
              "Defines strategic technical architecture directions.",
          },
        },
        {
          id: "craft-4",
          name: "Security & Operability (#DevSecOps)",
          employeeRating: "Novice",
          managerRating: "Intermediate",
          employeeNote: "Aware of security best practices.",
          managerNote: "Implementing security measures effectively.",
          definition:
            "Knowledge of security principles, operational practices, and DevOps methodologies.",
          levelDefinitions: {
            "Engineer (E1)": "Follows security guidelines with supervision.",
            "Engineer (E2)":
              "Implements security best practices independently.",
            "Senior Engineer (E3)":
              "Identifies security vulnerabilities proactively.",
            "Staff Engineer (E4)":
              "Defines security practices for complex systems.",
            "Senior Staff Engineer (E5)":
              "Leads security architecture across systems.",
            "Principal Engineer (E6)": "Sets company-wide security standards.",
          },
        },
        {
          id: "craft-5",
          name: "Tools & Technology",
          employeeRating: "Intermediate",
          managerRating: "Proficient",
          employeeNote: "Proficient in using various tools.",
          managerNote: "Excellent knowledge of relevant technologies.",
          definition:
            "Ability to select, learn and effectively use tools and technologies appropriate for the task.",
          levelDefinitions: {
            "Engineer (E1)": "Uses standard team tools effectively.",
            "Engineer (E2)":
              "Explores and suggests new tools for specific needs.",
            "Senior Engineer (E3)":
              "Evaluates and adopts new technologies effectively.",
            "Staff Engineer (E4)":
              "Makes strategic technology recommendations.",
            "Senior Staff Engineer (E5)":
              "Guides technology selection across teams.",
            "Principal Engineer (E6)":
              "Drives technology strategy for the organization.",
          },
        },
      ],
    },
    {
      id: "collab",
      category: "Collaboration",
      description: "Working effectively with others",
      items: [
        {
          id: "collab-1",
          name: "Communication",
          employeeRating: "Proficient",
          managerRating: "Proficient",
          employeeNote: "Excellent communication skills.",
          managerNote: "Communicates effectively with the team.",
          definition:
            "Ability to communicate clearly and effectively with team members and stakeholders.",
          levelDefinitions: {
            "Engineer (E1)": "Communicates status and blockers clearly.",
            "Engineer (E2)": "Articulates technical concepts well to the team.",
            "Senior Engineer (E3)":
              "Tailors communication for different audiences.",
            "Staff Engineer (E4)":
              "Communicates complex topics clearly to various stakeholders.",
            "Senior Staff Engineer (E5)":
              "Influences through communication across the organization.",
            "Principal Engineer (E6)":
              "Represents engineering in high-level business discussions.",
          },
        },
        {
          id: "collab-2",
          name: "Teamwork",
          employeeRating: "Intermediate",
          managerRating: "Proficient",
          employeeNote: "Works well with others.",
          managerNote: "A valuable team player.",
          definition:
            "Ability to work collaboratively with others toward shared goals and contribute to team success.",
          levelDefinitions: {
            "Engineer (E1)": "Contributes positively to team activities.",
            "Engineer (E2)": "Actively supports team members' work.",
            "Senior Engineer (E3)":
              "Facilitates team collaboration and success.",
            "Staff Engineer (E4)": "Builds bridges across different teams.",
            "Senior Staff Engineer (E5)":
              "Fosters collaborative culture across departments.",
            "Principal Engineer (E6)":
              "Creates organizational collaboration frameworks.",
          },
        },
        {
          id: "collab-3",
          name: "Feedback",
          employeeRating: "Novice",
          managerRating: "Intermediate",
          employeeNote: "Needs to improve giving and receiving feedback.",
          managerNote: "Open to feedback and willing to improve.",
          definition:
            "Skill in giving and receiving constructive feedback to foster growth and improvement.",
          levelDefinitions: {
            "Engineer (E1)": "Accepts feedback gracefully.",
            "Engineer (E2)": "Provides constructive peer feedback.",
            "Senior Engineer (E3)":
              "Gives actionable feedback that helps others improve.",
            "Staff Engineer (E4)": "Creates feedback culture within the team.",
            "Senior Staff Engineer (E5)":
              "Mentors others on effective feedback approaches.",
            "Principal Engineer (E6)":
              "Sets standards for feedback culture organization-wide.",
          },
        },
        {
          id: "collab-4",
          name: "Knowledge Sharing",
          employeeRating: "Intermediate",
          managerRating: "Intermediate",
          employeeNote: "Shares knowledge with the team.",
          managerNote: "Actively shares knowledge.",
          definition:
            "Willingness and ability to share expertise and knowledge with team members.",
          levelDefinitions: {
            "Engineer (E1)": "Documents own work effectively.",
            "Engineer (E2)":
              "Actively shares learnings with immediate teammates.",
            "Senior Engineer (E3)":
              "Creates reusable documentation and learning resources.",
            "Staff Engineer (E4)":
              "Presents and teaches complex topics to broader audiences.",
            "Senior Staff Engineer (E5)":
              "Establishes knowledge sharing systems across teams.",
            "Principal Engineer (E6)":
              "Creates engineering learning culture across the organization.",
          },
        },
      ],
    },
    {
      id: "leadership",
      category: "Leadership",
      description: "Guiding and influencing others",
      items: [
        {
          id: "lead-1",
          name: "Mentoring",
          employeeRating: "Inexperienced",
          managerRating: "Novice",
          employeeNote: "Not yet involved in mentoring.",
          managerNote: "Shows interest in mentoring.",
          definition:
            "Ability to guide and support others in their professional development.",
          levelDefinitions: {
            "Engineer (E1)": "Helps onboard newer team members.",
            "Engineer (E2)": "Provides guidance on familiar topics.",
            "Senior Engineer (E3)": "Regularly mentors more junior engineers.",
            "Staff Engineer (E4)": "Develops mentorship programs for teams.",
            "Senior Staff Engineer (E5)":
              "Creates mentoring structures across departments.",
            "Principal Engineer (E6)":
              "Establishes mentoring as a company value.",
          },
        },
        {
          id: "lead-2",
          name: "Ownership",
          employeeRating: "Intermediate",
          managerRating: "Proficient",
          employeeNote: "Takes ownership of tasks.",
          managerNote: "Demonstrates strong ownership.",
          definition:
            "Taking responsibility for work, outcomes, and continuous improvement.",
          levelDefinitions: {
            "Engineer (E1)": "Takes ownership of assigned tasks.",
            "Engineer (E2)": "Owns small features end-to-end.",
            "Senior Engineer (E3)":
              "Takes full ownership of significant projects.",
            "Staff Engineer (E4)":
              "Owns critical systems and technical domains.",
            "Senior Staff Engineer (E5)":
              "Demonstrates ownership of organizational outcomes.",
            "Principal Engineer (E6)":
              "Takes responsibility for company-wide technical strategy.",
          },
        },
        {
          id: "lead-3",
          name: "Judgment",
          employeeRating: "Intermediate",
          managerRating: "Intermediate",
          employeeNote: "Makes sound judgments.",
          managerNote: "Good decision-making skills.",
          definition:
            "Ability to make sound decisions based on analysis, experience, and available information.",
          levelDefinitions: {
            "Engineer (E1)": "Makes appropriate decisions with guidance.",
            "Engineer (E2)": "Makes sound decisions for day-to-day work.",
            "Senior Engineer (E3)":
              "Makes well-reasoned decisions for complex problems.",
            "Staff Engineer (E4)":
              "Makes strategic technical decisions with broad impact.",
            "Senior Staff Engineer (E5)":
              "Makes decisions balancing technical and business needs.",
            "Principal Engineer (E6)":
              "Makes technology decisions affecting company direction.",
          },
        },
      ],
    },
    {
      id: "impact",
      category: "Impact",
      description: "Delivering meaningful results",
      items: [
        {
          id: "impact-1",
          name: "Delivery",
          employeeRating: "Proficient",
          managerRating: "Proficient",
          employeeNote: "Delivers projects on time.",
          managerNote: "Consistently delivers high-quality work.",
          definition:
            "Ability to complete work on time with high quality and deliver valuable solutions.",
          levelDefinitions: {
            "Engineer (E1)": "Completes assigned tasks on time.",
            "Engineer (E2)": "Delivers small features independently.",
            "Senior Engineer (E3)": "Consistently delivers complex projects.",
            "Staff Engineer (E4)":
              "Ensures critical initiatives are delivered successfully.",
            "Senior Staff Engineer (E5)":
              "Drives delivery excellence across multiple teams.",
            "Principal Engineer (E6)":
              "Sets delivery standards for the entire engineering org.",
          },
        },
        {
          id: "impact-2",
          name: "Product Thinking",
          employeeRating: "Intermediate",
          managerRating: "Intermediate",
          employeeNote: "Understands product goals.",
          managerNote: "Good understanding of product vision.",
          definition:
            "Understanding of product development, user needs, and building solutions that provide value.",
          levelDefinitions: {
            "Engineer (E1)": "Understands the purpose of assigned work.",
            "Engineer (E2)": "Considers user needs when implementing features.",
            "Senior Engineer (E3)":
              "Proposes feature improvements based on user needs.",
            "Staff Engineer (E4)":
              "Shapes product direction for technical components.",
            "Senior Staff Engineer (E5)":
              "Influences product strategy significantly.",
            "Principal Engineer (E6)":
              "Aligns technical and product strategies at org level.",
          },
        },
        {
          id: "impact-3",
          name: "Project Management",
          employeeRating: "Novice",
          managerRating: "Intermediate",
          employeeNote: "Needs more experience in project management.",
          managerNote: "Learning project management skills.",
          definition:
            "Skills in planning, executing, and monitoring projects to achieve objectives efficiently.",
          levelDefinitions: {
            "Engineer (E1)": "Tracks and reports on own tasks.",
            "Engineer (E2)": "Plans own work effectively.",
            "Senior Engineer (E3)":
              "Coordinates small team efforts effectively.",
            "Staff Engineer (E4)": "Manages complex multi-faceted projects.",
            "Senior Staff Engineer (E5)":
              "Orchestrates large initiatives across teams.",
            "Principal Engineer (E6)":
              "Plans and executes organization-wide technical initiatives.",
          },
        },
      ],
    },
  ],
};

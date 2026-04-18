export type EmpathyLevel = "unknown" | "low" | "medium" | "high";

export type RationaleItem = {
  id: string;
  title: string;
  summary: string;
  evidence: string;
  counterpoints: string;
  responses: string;
  empathy: EmpathyLevel;
  updatedAt: string;
};

export type ActionItem = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  done: boolean;
};

export type Meeting = {
  id: string;
  date: string;
  location: string;
  attendees: string;
  agenda: string;
  discussion: string;
  decisions: string;
  actions: ActionItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PropertyStatus =
  | "initial"
  | "reviewing"
  | "onhold"
  | "rejected"
  | "selected";

export type DueDiligenceItem = {
  id: string;
  label: string;
  category: string;
  status: "pending" | "ok" | "issue" | "na";
  note: string;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  district: string;
  price: number;
  sizePyeong: number;
  floor: string;
  elevator: boolean;
  parking: string;
  useType: string;
  previousTenant: string;
  fixtures: string;
  pros: string;
  cons: string;
  status: PropertyStatus;
  contact: string;
  link: string;
  dueDiligence: DueDiligenceItem[];
  visits: { id: string; date: string; attendees: string; findings: string }[];
  photos?: string[];
  financingNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type DiscussionStance = "pro" | "con" | "consider";

export type DiscussionArgument = {
  id: string;
  stance: DiscussionStance;
  author: string;
  content: string;
  createdAt: string;
};

export type ResidentialArea = {
  id: string;
  area: string;
  count: number;
};

export type ChurchStatus = {
  asOfDate: string;
  dataSourceNote: string;

  currentSanctuaryPyeong: number;
  educationSpacePyeong: number;
  totalSpacePyeong: number;
  seatCapacity: number;

  depositKRW: number;
  monthlyRent: number;
  monthlyParking: number;
  monthlyManagement: number;
  monthlyUtilities: number;
  monthlyOther: number;
  otherFixedDescription: string;

  monthlyOfferingAvg: number;
  offeringPeriodNote: string;

  registeredMembers: number;
  sundayAttendanceAvg: number;
  activeMembers: number;
  inactiveMembers: number;
  infantsCount: number;
  elementaryCount: number;
  middleHighCount: number;
  youngAdultCount: number;

  ageUnder10: number;
  ageTeens: number;
  ageTwenties: number;
  ageThirties: number;
  ageForties: number;
  ageFifties: number;
  ageSixties: number;
  ageSeventyPlus: number;
  ageUnknown: number;

  householdCount: number;
  multiMemberHouseholdCount: number;

  residentialBreakdown: ResidentialArea[];

  attendanceTrend: string;
  memberGrowthNote: string;
  spaceConstraintNote: string;
  demographicsNote: string;

  updatedAt: string;
};

export type DiscussionStatus = "open" | "converging" | "decided";

export type Discussion = {
  id: string;
  question: string;
  background: string;
  arguments: DiscussionArgument[];
  tentativeConclusion: string;
  status: DiscussionStatus;
  createdAt: string;
  updatedAt: string;
};

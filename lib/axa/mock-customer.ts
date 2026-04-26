export const MOCK_CUSTOMER = {
  firstName: "Max",
  lastName: "Müller",
  fullName: "Max Müller",
  memberSince: 2019,
  policyHolder: true,
};

export type MockPolicy = {
  type: "elektronik" | "haftpflicht" | "hausrat";
  title: string;
  subtitle: string;
  policyNumber: string;
  monthlyEur: number;
  iconKey: "laptop" | "shield" | "home";
  active: true;
};

export const MOCK_POLICIES: MockPolicy[] = [
  {
    type: "elektronik",
    title: "Elektronikversicherung",
    subtitle: "Komplettschutz Plus",
    policyNumber: "AXA-DE-2024-88421",
    monthlyEur: 14.9,
    iconKey: "laptop",
    active: true,
  },
  {
    type: "haftpflicht",
    title: "Privathaftpflicht",
    subtitle: "Premium",
    policyNumber: "AXA-DE-2021-44102",
    monthlyEur: 6.5,
    iconKey: "shield",
    active: true,
  },
  {
    type: "hausrat",
    title: "Hausratversicherung",
    subtitle: "Komfort 50 m²",
    policyNumber: "AXA-DE-2019-77531",
    monthlyEur: 11.2,
    iconKey: "home",
    active: true,
  },
];

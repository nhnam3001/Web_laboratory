export const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "News", to: "/news" },
  {
    label: "Research",
    to: "/research",
    children: [{ label: "Funding", to: "/research/funding" }],
  },
  {
    label: "Member",
    to: "/member/group-leader",
    children: [
      { label: "Group Leader", to: "/member/group-leader" },
      { label: "Alumni", to: "/member/alumni" },
      { label: "Visiting Members", to: "/member/visiting-members" },
    ],
  },
  {
    label: "Publications",
    to: "/publications/international-conference",
    children: [
      { label: "International Conference", to: "/publications/international-conference" },
      { label: "Domestic Conference", to: "/publications/domestic-conference" },
      { label: "Patents", to: "/publications/patents" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export const PUBLICATION_TYPES = [
  { value: "international-conference", label: "International Conference" },
  { value: "domestic-conference", label: "Domestic Conference" },
  { value: "patents", label: "Patents" },
];

export const MEMBER_CATEGORIES = [
  { value: "group-leader", label: "Group Leader" },
  { value: "alumni", label: "Alumni" },
  { value: "visiting", label: "Visiting Member" },
];

import { PUBLICATION_TYPES } from "./content.js";

export const COLLECTION_SCHEMAS = {
  news: {
    label: "News",
    singular: "news post",
    columns: ["imageUrl", "date", "title"],
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "title", label: "Title", type: "text", required: true, full: true },
      { key: "body", label: "Content", type: "textarea", full: true },
      {
        key: "imageUrl",
        label: "Image",
        type: "image",
        wide: true,
        hint: "optional, shown next to the post",
        full: true,
      },
    ],
    defaults: { date: "", title: "", body: "", imageUrl: "" },
  },

  research: {
    label: "Research Areas",
    singular: "research area",
    columns: ["title", "description"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, full: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "order", label: "Display order", type: "text", hint: "Lower numbers appear first" },
    ],
    defaults: { title: "", description: "", order: "" },
  },

  funding: {
    label: "Funding",
    singular: "funding entry",
    columns: ["period", "title", "agency"],
    fields: [
      { key: "period", label: "Period", type: "text", placeholder: "2024 - 2027", required: true },
      { key: "role", label: "Role", type: "text", placeholder: "Principal Investigator" },
      { key: "title", label: "Project title", type: "text", required: true, full: true },
      { key: "agency", label: "Funding agency", type: "text", full: true },
      { key: "order", label: "Display order", type: "text", hint: "Lower numbers appear first" },
    ],
    defaults: { period: "", role: "", title: "", agency: "", order: "" },
  },

  publications: {
    label: "Publications",
    singular: "publication",
    columns: ["year", "title", "type"],
    fields: [
      {
        key: "type",
        label: "Category",
        type: "select",
        options: PUBLICATION_TYPES,
        required: true,
      },
      { key: "year", label: "Year", type: "text", placeholder: "2025", required: true },
      { key: "title", label: "Title", type: "text", required: true, full: true },
      { key: "authors", label: "Authors / Inventors", type: "text", full: true },
      {
        key: "venue",
        label: "Venue / Patent number",
        type: "text",
        full: true,
        placeholder: "Proc. of [Conference Name], [Location]",
      },
      { key: "link", label: "Link (optional)", type: "url", full: true },
    ],
    defaults: {
      type: "international-conference",
      year: "",
      title: "",
      authors: "",
      venue: "",
      link: "",
    },
  },
};

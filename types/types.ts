// ─── Document section types (mirrors the existing DocumentSection interface) ───

export type SectionType = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list' | 'table' | 'image' | 'timeline';

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export interface ListItem {
  no?: number | string;
  content: string;
}

export type ListType = 'disc' | 'number';

// export interface DocumentSectionTranslation {
//   id: string;
//   type: SectionType;
//   content: string | string[] | TableContent;
//   alt?: string;
//   caption?: string;
// }


export interface DocumentSectionTranslation {
  id: string;
  type: SectionType;
  content: string | string[] | ListItem[] | TableContent;
  'list-type'?: ListType;
  alt?: string;
  caption?: string;
}

// ─── Feature item (About page) ───────────────────────────────────────────────

export interface FeatureItem {
  title: string;
  description: string;
}

// ─── Timeline event ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

// ─── Full translation shape ───────────────────────────────────────────────────

export interface Translations {
  meta: {
    title: string;
    description: string;
  };

  header: {
    brand: string;
    nav: {
      home: string;
      about: string;
      timeline: string;
    };
    langLabel: string;
  };

  footer: {
    rights: string;
  };

  home: {
    title: string;
    subtitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    searching: string;
    noResults: string;
  };

  results: {
    title: string;
    found_one: string;
    found_other: string; // use {{count}} placeholder
  };

  about: {
    title: string;
    intro: string;
    visionTitle: string;
    visionBody: string;
    whyTitle: string;
    whyP1: string;
    whyP2: string;
    backgroundTitle: string;
    backgroundP1: string;
    backgroundP2: string;
    backgroundP3: string;
    commissionTitle: string;
    commissionP1: string;
    commissionP2: string;
    languageTitle: string;
    languageBody: string;
    languageItems: string[];
    disclaimerTitle: string;
    disclaimerBody: string;
  };

  timeline: {
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    events: TimelineEvent[];
  };

  document: DocumentSectionTranslation[];
}

// ─── Supported locales ────────────────────────────────────────────────────────

export type Locale = 'en' | 'ne';
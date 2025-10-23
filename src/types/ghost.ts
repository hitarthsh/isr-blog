export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  mobiledoc: string;
  html: string;
  plaintext: string;
  amp: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  custom_template: string | null;
  canonical_url: string | null;
  url: string;
  excerpt: string;
  reading_time: number;
  access: boolean;
  send_email_when_published: boolean;
  email_recipient_filter: string;
  email_subject: string | null;
  frontmatter: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  custom_json: string | null;
  primary_tag: GhostTag | null;
  primary_author: GhostAuthor;
  tags: GhostTag[];
  authors: GhostAuthor[];
  tiers: any[];
  count: {
    clicks: number;
    positive_feedback: number;
    negative_feedback: number;
  };
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image: string | null;
  visibility: string;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  canonical_url: string | null;
  accent_color: string | null;
  url: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  email: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  facebook: string | null;
  twitter: string | null;
  accessibility: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  url: string;
}

export interface GhostSettings {
  title: string;
  description: string;
  logo: string | null;
  icon: string | null;
  accent_color: string | null;
  cover_image: string | null;
  facebook: string | null;
  twitter: string | null;
  lang: string;
  locale: string;
  timezone: string;
  codeinjection_head: string | null;
  codeinjection_foot: string | null;
  navigation: Array<{
    label: string;
    url: string;
  }>;
  secondary_navigation: Array<{
    label: string;
    url: string;
  }>;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  members_support_address: string;
  url: string;
}

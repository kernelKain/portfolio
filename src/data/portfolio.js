export const profile = {
  name: 'Kshitij Jain',
  shortName: 'KJ',
  title: 'Backend Developer',
  status: 'Open to Work',
  availability: 'Available immediately',
  workSetup: 'Remote, onsite, hybrid, or relocation',
  email: 'kshitijjain.dev@gmail.com',
  phone: '(+91) 9672508723',
  phoneCopyValue: '+91 9672508723',
  about: [
    'I am a 2025 graduate of Malaviya National Institute of Technology, Jaipur, with a B.Tech in Metallurgy and Materials Engineering.',
    'My primary backend stack is Java, Spring Boot, and MySQL. I also work with Go and Python, supported by a foundation in data structures, algorithms, operating systems, databases, computer networks, and object-oriented programming.',
    'I am available immediately for full-time roles, internships, freelance work, and open-source collaboration. I am open to remote, onsite, hybrid, and relocation opportunities.',
  ],
}

export const education = {
  institution: 'Malaviya National Institute of Technology (MNIT)',
  campus: 'Jaipur, Rajasthan',
  degree: 'B.Tech in Metallurgy and Materials Engineering',
  period: 'January 2022 — May 2025',
  status: 'Graduated',
}

export const techCategories = [
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Java', icon: 'openjdk' },
      { name: 'Spring', icon: 'spring' },
      { name: 'Spring Boot', icon: 'springboot' },
      { name: 'Hibernate', icon: 'hibernate' },
      { name: 'JUnit', icon: 'junit5' },
      { name: 'Go', icon: 'go' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML', icon: 'html5' },
      { name: 'CSS', icon: 'css' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'SQL', icon: 'database' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Linux', icon: 'linux' },
      { name: 'Bash / Shell', icon: 'gnubash' },
      { name: 'Maven', icon: 'apachemaven' },
      { name: 'Gradle', icon: 'gradle' },
      { name: 'IntelliJ IDEA', icon: 'intellijidea' },
      { name: 'VS Code', icon: 'visualstudiocode' },
    ],
  },
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    skills: [
      { name: 'Data Structures', icon: 'code' },
      { name: 'Algorithms', icon: 'code' },
      { name: 'Operating Systems', icon: 'terminal' },
      { name: 'DBMS', icon: 'database' },
      { name: 'Computer Networks', icon: 'server' },
      { name: 'OOP', icon: 'code' },
    ],
  },
]

export const profiles = [
  { label: 'GitHub', handle: '@kernelKain', href: 'https://github.com/kernelKain', icon: 'github' },
  { label: 'LeetCode', handle: 'kernelKain', href: 'https://leetcode.com/u/kernelKain/', icon: 'leetcode' },
  { label: 'Peerlist', handle: 'kernel_kain', href: 'https://peerlist.io/kernel_kain', icon: 'peerlist' },
  { label: 'LinkedIn', handle: 'kshitij-jain99', href: 'https://www.linkedin.com/in/kshitij-jain99', icon: 'linkedin' },
  { label: 'X', handle: '@kernelKain', href: 'https://x.com/kernelKain', icon: 'x' },
  { label: 'Codeforces', handle: 'kernelKain', href: 'https://codeforces.com/profile/kernelKain', icon: 'codeforces' },
  { label: 'Product Hunt', handle: '@kshitij_jain6', href: 'https://www.producthunt.com/@kshitij_jain6', icon: 'producthunt' },
  { label: 'Dev.to', handle: '@kernelkain', href: 'https://dev.to/kernelkain', icon: 'devdotto' },
  { label: 'Hashnode', handle: '@itskernelkain', href: 'https://hashnode.com/@itskernelkain', icon: 'hashnode' },
  { label: 'Medium', handle: '@kernelKain', href: 'https://medium.com/@kernelKain', icon: 'medium' },
  { label: 'Discord', handle: 'kernelkain', copyValue: 'kernelkain', icon: 'discord' },
]

// Short icon row shown in the footer; the Contact section shows every profile.
const footerProfileLabels = ['GitHub', 'LinkedIn', 'LeetCode', 'Peerlist', 'X']
export const footerProfiles = footerProfileLabels.map((label) => profiles.find((item) => item.label === label))

// Drop the PDF at public/resume.pdf and rebuild (or restart `npm run dev`).
// The download button switches from "Coming soon" to active automatically.
export const resume = {
  path: '/resume.pdf',
  downloadName: 'Kshitij-Jain-Resume.pdf',
}

// Site-wide metadata. Also read by vite.config.js to generate per-route HTML heads and the sitemap.
export const site = {
  name: 'Kshitij Jain',
  title: 'Kshitij Jain — Backend Developer',
  description: 'Kshitij Jain is a backend developer focused on Java, Spring Boot, and MySQL.',
  imagePath: '/og-image.png',
  imageAlt: 'Kshitij Jain — Backend Developer',
}

// Every indexable route. `title` becomes "<title> — Kshitij Jain"; the homepage uses site.title.
export const pages = [
  { path: '/', title: null, description: site.description },
  { path: '/projects', title: 'Projects', description: 'Backend projects by Kshitij Jain, with architecture, API design, and source links.' },
  { path: '/competitive-programming', title: 'Competitive Programming', description: 'Current GitHub, LeetCode, and Codeforces statistics for Kshitij Jain.' },
  { path: '/writing', title: 'Blog', description: 'Articles by Kshitij Jain published on Dev.to, Hashnode, and Medium.' },
]

// Former detail routes whose content now lives only on the homepage.
export const legacyRedirects = [
  { from: '/about', to: '/#about' },
  { from: '/skills', to: '/#tech-stack' },
  { from: '/education', to: '/#education' },
  { from: '/certifications', to: '/#certifications' },
  { from: '/achievements', to: '/#achievements' },
  { from: '/contact', to: '/#contact' },
]

export const projectSlots = Array.from({ length: 6 }, (_, index) => ({
  id: `project-${index + 1}`,
  number: String(index + 1).padStart(2, '0'),
  name: 'Project name',
  description: 'Short project description will be added here.',
  fields: ['Project logo', 'Image or video', 'Live demo', 'GitHub', 'Write-up'],
}))

export const certificationSlots = Array.from({ length: 4 }, (_, index) => ({
  id: `certification-${index + 1}`,
  number: String(index + 1).padStart(2, '0'),
  name: 'Certification name',
  fields: ['Issuer', 'Issue date', 'Credential link'],
}))

export const achievementSlots = Array.from({ length: 3 }, (_, index) => ({
  id: `achievement-${index + 1}`,
  number: String(index + 1).padStart(2, '0'),
  name: 'Achievement title',
  fields: ['Date', 'Description', 'Evidence link'],
}))

// Open-source templates. Replace `value: null` with real counts and fill the slots with
// merged pull requests, issues, and programs as they happen.
export const openSource = {
  pullRequestsUrl: 'https://github.com/search?q=author%3AkernelKain+is%3Apr&type=pullrequests',
  metrics: [
    { id: 'merged', label: 'Merged pull requests', icon: 'gitMerge', value: null },
    { id: 'repos', label: 'Repositories contributed to', icon: 'folder', value: null },
    { id: 'issues', label: 'Issues opened', icon: 'circleDot', value: null },
    { id: 'reviews', label: 'Code reviews', icon: 'eye', value: null },
  ],
  contributions: Array.from({ length: 4 }, (_, index) => ({
    id: `contribution-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
    repository: 'organization/repository',
    title: 'Pull request title',
    summary: 'What changed and why it mattered to the project.',
    type: 'Bug fix · Feature · Docs · Tests',
    fields: ['PR link', 'Linked issue', 'Merged date', 'Lines changed', 'Language', 'Maintainer review'],
  })),
  programs: Array.from({ length: 2 }, (_, index) => ({
    id: `program-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
    name: 'Open-source program',
    fields: ['Program', 'Organization', 'Role', 'Period', 'Verification link'],
  })),
}

export const blogSources = [
  { label: 'Dev.to', href: 'https://dev.to/kernelkain', icon: 'devdotto' },
  { label: 'Hashnode', href: 'https://hashnode.com/@itskernelkain', icon: 'hashnode' },
  { label: 'Medium', href: 'https://medium.com/@kernelKain', icon: 'medium' },
]

// Order must match the section order on the homepage for scroll tracking.
export const homeSections = [
  { id: 'about', label: 'About me' },
  { id: 'tech-stack', label: 'Tech stack' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open source' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

export const comingSoonContent = {
  projects: { label: 'Projects', title: 'Projects coming soon.', description: 'Backend project details will be added here.' },
  writing: { label: 'Writing', title: 'Writing', description: 'Articles from Dev.to, Hashnode, and Medium.' },
  certifications: { label: 'Certifications', title: 'Certifications', description: 'Certification details will be added here.' },
  achievements: { label: 'Achievements', title: 'Achievements', description: 'Additional achievements will be added here.' },
  resume: { label: 'Resume', title: 'Resume coming soon.', description: 'A downloadable resume will be added here.' },
}

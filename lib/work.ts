export type WorkCategory = 'ndis-care' | 'service-businesses' | 'beauty-retail' | 'packaging';
export type WorkFilter = 'all' | WorkCategory;

export type WorkProject = {
  slug: string;
  name: string;
  industry: string;
  category: WorkCategory;
  domain: string;
  url: string;
  image: string;
  description?: string;
  featured?: boolean;
};

export const workFilters: { id: WorkFilter; label: string }[] = [
  { id: 'all', label: 'All projects' },
  { id: 'ndis-care', label: 'NDIS & care' },
  { id: 'service-businesses', label: 'Service businesses' },
  { id: 'beauty-retail', label: 'Beauty & retail' },
  { id: 'packaging', label: 'Packaging' },
];

export const workProjects: WorkProject[] = [
  {
    slug: 'swift-west-cleaners',
    name: 'Swift West Cleaners',
    industry: 'Cleaning services',
    category: 'service-businesses',
    domain: 'swiftwestcleaners.com.au',
    url: 'https://swiftwestcleaners.com.au/',
    image: '/assets/work/swift-west-cleaners.jpg',
  },
  {
    slug: 'hope-with-care',
    name: 'Hope with Care',
    industry: 'NDIS & disability support',
    category: 'ndis-care',
    domain: 'hopewithcare.com.au',
    url: 'https://hopewithcare.com.au/',
    image: '/assets/work/hope-with-care.jpg',
  },
  {
    slug: 'joyful-support-services',
    name: 'Joyful Support Services',
    industry: 'NDIS & disability support',
    category: 'ndis-care',
    domain: 'joyfulsupportservices.com.au',
    url: 'https://joyfulsupportservices.com.au/',
    image: '/assets/work/joyful-support-services.jpg',
  },
  {
    slug: 'westcon-renovations',
    name: 'Westcon Renovations',
    industry: 'Renovation services',
    category: 'service-businesses',
    domain: 'westconrenovations.com.au',
    url: 'https://westconrenovations.com.au/',
    image: '/assets/work/westcon-renovations.jpg',
  },
  {
    slug: 'care-beyond-expectations',
    name: 'Care Beyond Expectations',
    industry: 'NDIS & disability support',
    category: 'ndis-care',
    domain: 'carebeyondexp.com.au',
    url: 'https://carebeyondexp.com.au/',
    image: '/assets/work/care-beyond-expectations.jpg',
  },
  {
    slug: 'jolly-nail-printing',
    name: 'Jolly Nail Printing',
    industry: 'Beauty & technology',
    category: 'beauty-retail',
    domain: 'jollynailprinting.com',
    url: 'https://jollynailprinting.com/',
    image: '/assets/work/jolly-nail-printing.jpg',
  },
  {
    slug: 'deiva-packaging',
    name: 'Deiva Packaging',
    industry: 'Packaging catalogue',
    category: 'packaging',
    domain: 'deivapackaging.com.au',
    url: 'https://deivapackaging.com.au/',
    image: '/assets/work/deiva-packaging.jpg',
    description: 'A clear product catalogue with quick ordering and wholesale enquiries.',
    featured: true,
  },
];

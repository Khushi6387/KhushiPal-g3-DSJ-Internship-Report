
import { IssueCategory, IssueStatus } from './types.js';

export const MOCK_ISSUES = [
  {
    id: '1',
    title: 'Street Light not working in Ward 5',
    description: 'The street light near the primary school has been out for 3 days. It is very dark at night.',
    village: 'Kothur',
    mandal: 'Shamshabad',
    district: 'Rangareddy',
    constituency: 'Rajendranagar',
    category: IssueCategory.ELECTRICITY,
    status: IssueStatus.PENDING,
    submittedAt: '2024-01-20T10:30:00Z',
    imageUrl: 'https://picsum.photos/seed/light/800/600'
  },
  {
    id: '2',
    title: 'Broken Water Pipe',
    description: 'Main supply pipe is leaking near the water tank. Significant water wastage observed.',
    village: 'Narsingi',
    mandal: 'Gandipet',
    district: 'Rangareddy',
    constituency: 'Rajendranagar',
    category: IssueCategory.WATER,
    status: IssueStatus.VERIFIED,
    submittedAt: '2024-01-19T14:20:00Z',
    imageUrl: 'https://picsum.photos/seed/water/800/600'
  },
  {
    id: '3',
    title: 'Garbage accumulation',
    description: 'Waste has not been collected for a week near the community hall.',
    village: 'Kokapet',
    mandal: 'Gandipet',
    district: 'Rangareddy',
    constituency: 'Rajendranagar',
    category: IssueCategory.SANITATION,
    status: IssueStatus.REJECTED,
    submittedAt: '2024-01-18T09:15:00Z',
    rejectionReason: 'Duplicate issue already reported.',
    imageUrl: 'https://picsum.photos/seed/trash/800/600'
  }
];

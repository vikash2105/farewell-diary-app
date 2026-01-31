export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Diary {
  id: string;
  userId: string;
  uniqueLink: string;
  title: string;
  description?: string;
  settings: DiarySettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardDiary {
  id: string;
  title: string;
  description: string | null;
  contributorCount: number;
  totalNotes: number;
  updatedAt: string;
  uniqueLink: string;
}

export interface DiarySettings {
  allowAnonymous?: boolean;
  requireApproval?: boolean;
  theme?: 'default' | 'dark' | 'minimal';
}

export interface FarewellNote {
  id: string;
  diaryId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  fontStyle: 'default' | 'handwriting' | 'serif' | 'cursive';
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiaryDto {
  title: string;
  description?: string;
  settings?: DiarySettings;
}

export interface CreateNoteDto {
  content: string;
  fontStyle?: 'default' | 'handwriting' | 'serif' | 'cursive';
  isAnonymous?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

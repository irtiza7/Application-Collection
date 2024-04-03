export interface TaskDTO {
  id: number | null;
  title: string;
  description: string | null;
  userId: number | null;
  updatedAt: string;
  createdAt: string;
  status: string;
}

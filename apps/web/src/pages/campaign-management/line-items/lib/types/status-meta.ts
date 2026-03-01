export interface IStatusPicklist {
  id: number;
  key: string;
  name: string;
  value: string;
  description?: string;
  type?: string;
  title?: string;
  color?: string;
  positiveMessage?: string;
  negativeMessage?: string;
  promotionStatuses?: string[];
  demotionStatuses?: string[];
}

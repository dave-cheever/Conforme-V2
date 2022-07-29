export interface IGroupQuestion {
  id: string;
  name: string;
  description: string;
  totalQuestion: number;
  questionAnswered: number;
}
export const groupQuestionsByCategory: IGroupQuestion[] = [
  {
    id: '1237812235',
    name: 'Accidents and first aid',
    description: 'Please provide answers for the items below.',
    totalQuestion: 7,
    questionAnswered: 0,
  },
  {
    id: '1237812236',
    name: 'Electrical hazards',
    description: 'Is there any risk of persons receiving an electrical shock from?',
    totalQuestion: 8,
    questionAnswered: 3,
  },
  {
    id: '1237812237',
    name: 'Accidents and first aid',
    description: 'Please provide answers for the items below.',
    totalQuestion: 4,
    questionAnswered: 4,
  },
];
export const groupQuestionsByKLOE: IGroupQuestion[] = [
  {
    id: '1237812231',
    name: 'Accidents and first aid By KLOE',
    description: 'Please provide answers for the items below.',
    totalQuestion: 8,
    questionAnswered: 3,
  },
  {
    id: '1237812232',
    name: 'Electrical hazards By KLOE',
    description: 'Is there any risk of persons receiving an electrical shock from?',
    totalQuestion: 4,
    questionAnswered: 4,
  },
  {
    id: '1237812233',
    name: 'Accidents and first aid By KLOE',
    description: 'Please provide answers for the items below.',
    totalQuestion: 7,
    questionAnswered: 0,
  },
  {
    id: '1237812234',
    name: 'Electrical hazards By KLOE',
    description: 'Is there any risk of persons receiving an electrical shock from?',
    totalQuestion: 4,
    questionAnswered: 4,
  },
];

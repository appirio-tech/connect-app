export interface IProjectData {
  appName: string;
  appDescription: string;
  answers: IAnswers;
  notes: string;
}

export interface ITaasData {
  title: string;
  jobTitle: string;
  numOfPeople: number;
  duration: number;
  description: string;
  email: string;
  answers: IAnswers;
}

export interface IAnswers {
  beforeWeStart: string;
  whatDoYouNeed?: string;
  willYourAppNeedMoreScreen?: string;
  howManyScreens?: string;
  whereShouldAppWork?: string;
  howShouldAppWorks?: string;
  startDate?: string;
  requirement?: string;
}

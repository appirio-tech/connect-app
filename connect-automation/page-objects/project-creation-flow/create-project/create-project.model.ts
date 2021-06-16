export interface IProjectData {
  appName: string;
  appDescription: string;
  answers: IAnswers;
  notes: string;
}

export interface IAnswers {
  beforeWeStart: string;
  whatDoYouNeed: string;
  willYourAppNeedMoreScreen: string;
  howManyScreens: string;
  whereShouldAppWork: string;
  howShouldAppWorks: string;
}

export interface Employee {
  name: string;
  position: string;
  jobTitleCode: number;
  level: string;
  expanded: boolean;
  firstNode?: boolean;
  children?: Employee[];
}

export interface Department {
  name: string;
  color: string;
  bgColor: string;
}
export class Candidate {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    job!: string;
    department!: string;
    company!: string;
    imageUrl!: string;
  }

  export enum CandidateSearchType {
    LASTNAME = 'lastName',
    FIRSTNAME = 'firstName',
    COMPANY = 'company'
  }
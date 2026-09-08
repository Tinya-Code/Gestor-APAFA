export class StudentEntity {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string | null;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class StudentListItem {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string | null;
  parentId: number;
  parentName: string;
}

export class StudentDetail {
  id: number;
  name: string;
  surname: string;
  grade: string;
  section: string | null;
  parentId: number;
  parent: {
    id: number;
    name: string;
    surname: string;
  };
}

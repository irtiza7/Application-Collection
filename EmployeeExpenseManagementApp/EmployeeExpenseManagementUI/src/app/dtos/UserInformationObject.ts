export interface UserInformationObject {
  message: string;
  role: string;
  userId: string;
  userName: string;
  employeeInfo: EmployeeInformationObject;
}

export interface EmployeeInformationObject {
  id: null | number;
  name: string;
  designation: string;
  managerId: null | number;
  aspNetUserId: string;
}

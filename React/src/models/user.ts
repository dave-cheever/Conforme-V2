import { IUser } from "../interfaces/IUser";

type IRoles = "reader" | "systemAdmin" | "user";

class User {
  id: IUser["id"];
  organizationsIds: IUser["organizationsIds"];
  email: IUser["email"];
  firstName: IUser["firstName"];
  lastName: IUser["lastName"];
  displayName: IUser["displayName"];
  jobTitle: IUser["jobTitle"];
  role: IUser["role"];
  image: IUser["image"];
  defaultPage: IUser["defaultPage"];
  metatags: IUser["metatags"];

  constructor({
    id,
    organizationsIds,
    email,
    firstName,
    displayName,
    lastName,
    jobTitle,
    role,
    image,
    defaultPage,
    metatags,
  }: IUser) {
    this.id = id;
    this.organizationsIds = organizationsIds;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.jobTitle = jobTitle;
    this.role = role;
    this.image = image;
    this.defaultPage = defaultPage;
    this.metatags = metatags;
  }

  getFullName() {
    const { firstName, lastName, displayName } = this;
    return firstName && lastName
      ? `${firstName} ${lastName}`
      : `${displayName}`;
  }

  getInitials() {
    const { firstName, lastName } = this;
    return `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
  }

  getJobTitle() {
    const { jobTitle } = this;
    return jobTitle ? `${jobTitle}` : "";
  }

  getRole(): IRoles {
    return this.role;
  }
}

export default User;

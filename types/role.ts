export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface RolesResponse {
  roles: Role[];
  default_role: string;
  timestamp: string;
}

export class CreatePositionDto {
  name: string;
  department_id: number;
  accesses?: {
    screen_id: number;
    permission_id: number;
    scope?: string;
  }[];
}

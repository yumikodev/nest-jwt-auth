import { IsJWT, IsNotEmpty } from "class-validator";

export class RefreshDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}

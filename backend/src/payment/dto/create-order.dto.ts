import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  subscriptionId: number;
}

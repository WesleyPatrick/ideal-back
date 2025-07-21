import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class GetConversationDTO extends PaginatedDTO {
  @ApiProperty({
    description: "ID of the user who will send the message",
    example: "cm75ffwl8009008ju0eqma6vb"
  })
  @IsString()
  @IsNotEmpty()
  fromUserId: string;

  @ApiProperty({
    description: "ID of the user who will receive the message",
    example: "cm75ffiw7000008jr2pcv4scd"
  })
  @IsString()
  @IsNotEmpty()
  toUserId: string;
}

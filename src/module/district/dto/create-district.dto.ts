import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"

export class CreateDistrictDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    @ApiProperty({example: "name"})
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "regionId"})
    @IsUUID()
    regionId: string
}

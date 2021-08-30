import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateStoreDto } from "./create-store.dto";

@InputType()
export class UpdateStoreInputType extends PartialType(CreateStoreDto) {}
//PartialType = return ALL nullable: true
@InputType()
export class UpdateStoreDto{
    @Field(() => Number)
    id: number

    @Field(() => UpdateStoreInputType)
    data: UpdateStoreInputType;
}
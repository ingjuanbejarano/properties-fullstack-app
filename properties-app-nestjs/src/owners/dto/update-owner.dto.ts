import { PartialType } from '@nestjs/swagger';
import { CreateOwnerDto } from './create-owner.dto';

// PartialType makes all properties of CreateOwnerDto optional
// Equivalent to having a separate DTO for updates in .NET
export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {}

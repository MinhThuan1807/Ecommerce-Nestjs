import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { UserType } from "src/shared/models/shared-user.model";

@Injectable()
export class SharedUserRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(uniqueObject: {email: string} | {id: number}): Promise<UserType> {
    return this.prismaService.user.findFirst({
      where: uniqueObject,
    })
  }

}
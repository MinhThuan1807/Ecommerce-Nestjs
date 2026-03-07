import { Injectable } from '@nestjs/common';
import { ROLE, ROLE_NUMBERS } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleIdService {
  private clientRoleId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId;
    }
    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        id: ROLE_NUMBERS.CLIENT,
        name: ROLE.CLIENT,
      },
    })
    this.clientRoleId = role.id;
    return role.id;
  }
}

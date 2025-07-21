import { User } from "@domain/entities/base-user";
import {
  CardModuleResponse,
  CreateAdminUserParams,
  RankingResponse,
  UpdateUserParams,
  UserDetailsResponse,
  UserRepository
} from "@domain/repositories/user";
import { PrismaService } from "@infra/config/prisma";
import { UserMapper } from "@infra/mappers/users-mapper";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTwoLastModules(): Promise<CardModuleResponse[]> {
    const query = await this.prisma.$queryRaw<
      {
        moduleName: string;
        missionsCount: number;
        percentageComplete: number;
        percentageAccurancy: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          m.title AS "moduleName",
          COALESCE(missions_count.count, 0) AS "missionsCount",
          CASE 
            WHEN total_users_with_access.count = 0 THEN 0
            ELSE ROUND((completed_users.count::DECIMAL / total_users_with_access.count::DECIMAL) * 100, 2)
          END AS "percentageComplete",
          CASE 
            WHEN total_activities.count = 0 THEN 0
            ELSE ROUND((correct_activities.count::DECIMAL / total_activities.count::DECIMAL) * 100, 2)
          END AS "percentageAccurancy"
        FROM modules m
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(*) AS count
          FROM missions 
          GROUP BY module_id
        ) missions_count ON m.id = missions_count.module_id
        LEFT JOIN (
          SELECT 
            pa.module_id,
            COUNT(DISTINCT e.user_id) AS count
          FROM profile_accesses pa
          JOIN employees e ON e.profile_id = pa.profile_id
          GROUP BY pa.module_id
        ) total_users_with_access ON m.id = total_users_with_access.module_id
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(DISTINCT user_id) AS count
          FROM user_module_conclusions 
          WHERE finished_at IS NOT NULL
          GROUP BY module_id
        ) completed_users ON m.id = completed_users.module_id
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(*) AS count,
            COUNT(CASE WHEN is_correct = true THEN 1 END) AS correct_count
          FROM activity_attempts 
          GROUP BY module_id
        ) total_activities ON m.id = total_activities.module_id
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(*) AS count
          FROM activity_attempts 
          WHERE is_correct = true
          GROUP BY module_id
        ) correct_activities ON m.id = correct_activities.module_id
        ORDER BY m.id DESC
        LIMIT 2
      `
    );

    return query.map((result) => ({
      moduleName: result.moduleName,
      missionsCount: Number(result.missionsCount),
      percentageAccurancy: Number(result.percentageAccurancy),
      percentageComplete: Number(result.percentageComplete)
    }));
  }

  async findTwoLastModulesByOperatorId(
    operatorId: string
  ): Promise<CardModuleResponse[]> {
    const query = await this.prisma.$queryRaw<
      {
        moduleName: string;
        missionsCount: number;
        percentageComplete: number;
        percentageAccurancy: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          m.title AS "moduleName",
          COALESCE(missions_count.count, 0) AS "missionsCount",
          CASE 
            WHEN total_users_with_access.count = 0 THEN 0
            ELSE ROUND((completed_users.count::DECIMAL / total_users_with_access.count::DECIMAL) * 100, 2)
          END AS "percentageComplete",
          CASE 
            WHEN total_activities.count = 0 THEN 0
            ELSE ROUND((correct_activities.count::DECIMAL / total_activities.count::DECIMAL) * 100, 2)
          END AS "percentageAccurancy"
        FROM modules m
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(*) AS count
          FROM missions 
          GROUP BY module_id
        ) missions_count ON m.id = missions_count.module_id
        LEFT JOIN (
          SELECT 
            pa.module_id,
            COUNT(DISTINCT e.user_id) AS count
          FROM profile_accesses pa
          JOIN employees e ON e.profile_id = pa.profile_id
          JOIN service_providers sp ON e.service_provider_id = sp.id
          WHERE sp.operator_id = ${operatorId}
          GROUP BY pa.module_id
        ) total_users_with_access ON m.id = total_users_with_access.module_id
        LEFT JOIN (
          SELECT 
            umc.module_id,
            COUNT(DISTINCT umc.user_id) AS count
          FROM user_module_conclusions umc
          JOIN employees e ON e.user_id = umc.user_id
          JOIN service_providers sp ON e.service_provider_id = sp.id
          WHERE umc.finished_at IS NOT NULL AND sp.operator_id = ${operatorId}
          GROUP BY umc.module_id
        ) completed_users ON m.id = completed_users.module_id
        LEFT JOIN (
          SELECT 
            aa.module_id,
            COUNT(*) AS count
          FROM activity_attempts aa
          JOIN employees e ON e.user_id = aa.user_id
          JOIN service_providers sp ON e.service_provider_id = sp.id
          WHERE sp.operator_id = ${operatorId}
          GROUP BY aa.module_id
        ) total_activities ON m.id = total_activities.module_id
        LEFT JOIN (
          SELECT 
            aa.module_id,
            COUNT(*) AS count
          FROM activity_attempts aa
          JOIN employees e ON e.user_id = aa.user_id
          JOIN service_providers sp ON e.service_provider_id = sp.id
          WHERE aa.is_correct = true AND sp.operator_id = ${operatorId}
          GROUP BY aa.module_id
        ) correct_activities ON m.id = correct_activities.module_id
        ORDER BY m.id DESC
        LIMIT 2
      `
    );

    return query.map((result) => ({
      moduleName: result.moduleName,
      missionsCount: Number(result.missionsCount),
      percentageAccurancy: Number(result.percentageAccurancy),
      percentageComplete: Number(result.percentageComplete)
    }));
  }

  async findTwoLastModulesByServiceProviderId(
    serviceProviderId: string
  ): Promise<CardModuleResponse[]> {
    const query = await this.prisma.$queryRaw<
      {
        moduleName: string;
        missionsCount: number;
        percentageComplete: number;
        percentageAccurancy: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          m.title AS "moduleName",
          COALESCE(missions_count.count, 0) AS "missionsCount",
          CASE 
            WHEN total_users_with_access.count = 0 THEN 0
            ELSE ROUND((completed_users.count::DECIMAL / total_users_with_access.count::DECIMAL) * 100, 2)
          END AS "percentageComplete",
          CASE 
            WHEN total_activities.count = 0 THEN 0
            ELSE ROUND((correct_activities.count::DECIMAL / total_activities.count::DECIMAL) * 100, 2)
          END AS "percentageAccurancy"
        FROM modules m
        LEFT JOIN (
          SELECT 
            module_id,
            COUNT(*) AS count
          FROM missions 
          GROUP BY module_id
        ) missions_count ON m.id = missions_count.module_id
        LEFT JOIN (
          SELECT 
            pa.module_id,
            COUNT(DISTINCT e.user_id) AS count
          FROM profile_accesses pa
          JOIN employees e ON e.profile_id = pa.profile_id
          WHERE e.service_provider_id = ${serviceProviderId}
          GROUP BY pa.module_id
        ) total_users_with_access ON m.id = total_users_with_access.module_id
        LEFT JOIN (
          SELECT 
            umc.module_id,
            COUNT(DISTINCT umc.user_id) AS count
          FROM user_module_conclusions umc
          JOIN employees e ON e.user_id = umc.user_id
          WHERE umc.finished_at IS NOT NULL AND e.service_provider_id = ${serviceProviderId}
          GROUP BY umc.module_id
        ) completed_users ON m.id = completed_users.module_id
        LEFT JOIN (
          SELECT 
            aa.module_id,
            COUNT(*) AS count
          FROM activity_attempts aa
          JOIN employees e ON e.user_id = aa.user_id
          WHERE e.service_provider_id = ${serviceProviderId}
          GROUP BY aa.module_id
        ) total_activities ON m.id = total_activities.module_id
        LEFT JOIN (
          SELECT 
            aa.module_id,
            COUNT(*) AS count
          FROM activity_attempts aa
          JOIN employees e ON e.user_id = aa.user_id
          WHERE aa.is_correct = true AND e.service_provider_id = ${serviceProviderId}
          GROUP BY aa.module_id
        ) correct_activities ON m.id = correct_activities.module_id
        ORDER BY m.id DESC
        LIMIT 2
      `
    );

    return query.map((result) => ({
      moduleName: result.moduleName,
      missionsCount: Number(result.missionsCount),
      percentageAccurancy: Number(result.percentageAccurancy),
      percentageComplete: Number(result.percentageComplete)
    }));
  }

  async ranking(): Promise<RankingResponse[]> {
    const query = await this.prisma.$queryRaw<
      {
        userId: string;
        userName: string;
        userAvatar: string;
        serviceProviderName: string;
        missionConclusionCount: number;
        userSolecas: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          u.id AS "userId",
          u.name AS "userName",
          u.avatar AS "userAvatar",
          sp_user.name AS "serviceProviderName",
          COUNT(umc.id) AS "missionConclusionCount",
          COALESCE(u.solecas, 0) AS "userSolecas"
        FROM employees e 
        JOIN users u ON e.user_id = u.id
        JOIN service_providers sp ON e.service_provider_id = sp.id
        JOIN users sp_user ON sp.user_id = sp_user.id
        LEFT JOIN user_mission_conclusions umc ON u.id = umc.user_id
        GROUP BY u.id, u.name, u.avatar, sp_user.name, u.solecas
        ORDER BY "missionConclusionCount" DESC, "userSolecas" DESC
        LIMIT 3
      `
    );

    return query.map((result) => ({
      userId: result.userId,
      userName: result.userName,
      userAvatar: result.userAvatar,
      serviceProviderName: result.serviceProviderName,
      missionConclusionCount: Number(result.missionConclusionCount),
      userSolecas: Number(result.userSolecas)
    }));
  }

  async userDetails(userId: string): Promise<UserDetailsResponse> {
    const result = await this.prisma.$queryRaw<
      {
        percentageComplete: number;
        percentageAccurancy: number;
        address: string;
        phone: string;
        email: string;
      }[]
    >(
      Prisma.sql`
        SELECT
          u.address,
          u.phone,
          u.email,
          CASE 
            WHEN total_available_steps = 0 THEN 0
            ELSE ROUND((completed_steps::DECIMAL / total_available_steps::DECIMAL) * 100, 2)
          END AS "percentageComplete",
          CASE 
            WHEN total_activities = 0 THEN 0
            ELSE ROUND((correct_activities::DECIMAL / total_activities::DECIMAL) * 100, 2)
          END AS "percentageAccurancy"
        FROM users u
        JOIN employees e ON u.id = e.user_id
        LEFT JOIN (
          SELECT 
            profile_id,
            COUNT(DISTINCT step_id) AS total_available_steps
          FROM profile_accesses 
          GROUP BY profile_id
        ) pa ON e.profile_id = pa.profile_id
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(DISTINCT step_id) AS completed_steps
          FROM user_step_conclusions 
          GROUP BY user_id
        ) usc ON u.id = usc.user_id
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(*) AS total_activities,
            COUNT(CASE WHEN is_correct = true THEN 1 END) AS correct_activities
          FROM activity_attempts 
          GROUP BY user_id
        ) aa ON u.id = aa.user_id
        WHERE u.id = ${userId}
      `
    );

    return result[0];
  }

  async update(userId: string, params: UpdateUserParams): Promise<User> {
    const { avatar, name } = params;

    const userUpdated = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name,
        avatar
      }
    });

    return UserMapper.toDomain(userUpdated);
  }
  async createAdmin(params: CreateAdminUserParams): Promise<User> {
    const {
      address,
      city,
      cpf,
      email,
      name,
      password,
      phone,
      role,
      state,
      avatar
    } = params;

    const admin = await this.prisma.user.create({
      data: {
        address,
        city,
        cpf,
        email,
        name,
        password,
        phone,
        role,
        state,
        avatar
      }
    });

    return UserMapper.toDomain(admin);
  }

  async changeAvatar(userId: string, newAvatarPath: string): Promise<boolean> {
    const userWithNewAvatar = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: newAvatarPath
      }
    });

    return !!userWithNewAvatar;
  }

  async findAllUsersIdWithoutMe(userId: string): Promise<{ id: string }[]> {
    const usersIds = await this.prisma.user.findMany({
      where: {
        id: {
          not: userId
        }
      },
      select: {
        id: true
      }
    });

    return usersIds;
  }

  async updatedSolecas(
    userId: string,
    newSolecasValue: number
  ): Promise<number> {
    const { solecas } = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        solecas: newSolecasValue
      }
    });

    return Number(solecas);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return UserMapper.toDomain(user);
  }

  async findByCpf(cpf: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cpf }
    });
    return !!user;
  }

  async findByPhone(phone: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { phone }
    });
    return !!user;
  }

  async findByCnpj(cnpj: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cnpj }
    });
    return !!user;
  }

  async createBaseUser(user: User): Promise<User | void> {
    const data = UserMapper.toPersistence(user);
    const createdUser = await this.prisma.user.create({
      data
    });

    return UserMapper.toDomain(createdUser);
  }
}

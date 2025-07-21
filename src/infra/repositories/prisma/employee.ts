import { Injectable } from "@nestjs/common";
import { PrismaService } from "@infra/config/prisma";
import {
  EmployeeRepository,
  CreateEmployeeParams,
  FindAllEmployees,
  FindAllEmployeesReturn,
  FindAllEmployeeNoPaginationByServiceProviderIdResponse,
  UpdateEmployeeParams,
  FindAllByCommunityIdParams,
  FindAllDisciplineByEmployeeIdResponse,
  FindEmployeeProfileResponse,
  CardResponse,
  FindModuleTrailResponse,
  ProgressData,
  FindModuleTrailParams,
  FindDisciplineModulesParams,
  CardResponseWithoutLastAttempt
} from "@domain/repositories/employee";
import { UserMapper } from "@infra/mappers/users-mapper";
import { UserWithEmployee } from "@domain/entities/base-user";
import { PaginatedEntity } from "@domain/entities/pagination";
import { Employee } from "@domain/entities/employee";
import { EmployeeMapper } from "@infra/mappers/employee-mapper";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  private TOTAL_ACTIVITIES_PER_STEP: number = 5;

  constructor(private readonly prisma: PrismaService) {}

  async getUserProgressData(userId: string): Promise<ProgressData> {
    const data = await this.prisma.$queryRaw<
      { totalActivitiesDone: number; totalSteps: number }[]
    >(
      Prisma.sql`
        SELECT 
          COUNT(DISTINCT aa.activity_id) as "totalActivitiesDone",
          COUNT(DISTINCT pa.step_id) as "totalSteps"
        FROM employees e
        JOIN users u ON u.id = e.user_id
        JOIN activity_attempts aa ON aa.user_id = u.id
        JOIN profiles p ON p.id = e.profile_id
        JOIN profile_accesses pa ON pa.profile_id = p.id
        WHERE e.user_id = ${userId}
      `
    );

    return {
      totalActivities:
        Number(data[0].totalSteps) * this.TOTAL_ACTIVITIES_PER_STEP,
      totalActivitiesDone: Number(data[0].totalActivitiesDone)
    };
  }

  async findModuleTrail(
    params: FindModuleTrailParams
  ): Promise<FindModuleTrailResponse> {
    const { moduleId, employeeId } = params;

    const rawResults = await this.prisma.$queryRaw<
      Array<{
        discipline_id: string;
        discipline_name: string;
        module_id: string;
        module_name: string;
        mission_id: string;
        mission_name: string;
        mission_index: number;
        mission_video_url: string | null;
        mission_dialog_activity_id: string | null;
        mission_article_file: string | null;
        step_id: string;
        step_index: number;
        final_test_id: string | null;
        final_test_solecas: number | null;
        test_conclusion_id: string | null;
        activities_correct: number;
        activities_incorrect: number;
        user_step_conclusion_id: string | null;
        user_step_conclusion_finished_at: Date | null;
      }>
    >(Prisma.sql`
    SELECT
      d.id as discipline_id,
      d.title AS discipline_name,
      m.id AS module_id,
      m.title AS module_name,
      ms.id AS mission_id,
      ms.title AS mission_name,
      ms.index AS mission_index,
      ms.initial_video AS mission_video_url,
      ms.dialog_activity_id AS mission_dialog_activity_id,
      ms.article_file AS mission_article_file,
      s.id AS step_id,
      s.index AS step_index,
      ft.id AS final_test_id,
      ft.solecas_amount AS final_test_solecas,
      tc.id AS test_conclusion_id,
      COUNT(aa.id) FILTER (WHERE aa.is_correct = true AND aa.is_daily_mission = false) AS activities_correct,
      COUNT(aa.id) FILTER (WHERE aa.is_correct = false AND aa.is_daily_mission = false) as activities_incorrect,
      usc.id AS user_step_conclusion_id,
      usc.finished_at AS user_step_conclusion_finished_at

    FROM employees e
    INNER JOIN profiles p ON p.id = e.profile_id
    INNER JOIN profile_accesses pa ON pa.profile_id = p.id
    INNER JOIN disciplines d ON d.id = pa.discipline_id
    INNER JOIN modules m ON m.id = pa.module_id
    INNER JOIN missions ms ON ms.id = pa.mission_id
    INNER JOIN steps s ON s.id = pa.step_id
    LEFT JOIN final_tests ft ON ft.mission_id = ms.id
    LEFT JOIN tests_conclusion tc ON tc.final_test_id = ft.id AND tc.employee_id = ${employeeId}
    LEFT JOIN activity_attempts aa ON aa.step_id = s.id AND aa.user_id = e.user_id
    LEFT JOIN user_step_conclusions usc ON usc.step_id = s.id AND usc.user_id = e.user_id

    WHERE e.id = ${employeeId}
      AND pa.module_id = ${moduleId}
      AND pa.mission_id IS NOT NULL
      AND pa.step_id IS NOT NULL

    GROUP BY 
      d.id, d.title, m.id, m.title, ms.id, ms.title, ms.index, 
      ms.initial_video, ms.dialog_activity_id, ms.article_file,
      s.id, s.index, ft.id, tc.id, usc.id

    ORDER BY ms.index, s.index;
  `);

    if (rawResults.length === 0) {
      return {
        disciplineId: "",
        disciplineName: "",
        moduleId: "",
        moduleName: "",
        missions: []
      };
    }

    const firstRow = rawResults[0];
    const missionsMap = new Map<
      string,
      FindModuleTrailResponse["missions"][0]
    >();

    for (const row of rawResults) {
      if (!missionsMap.has(row.mission_id)) {
        missionsMap.set(row.mission_id, {
          missionId: row.mission_id,
          missionIndex: row.mission_index,
          missionName: row.mission_name,
          missionVideoUrl: row.mission_video_url,
          missionDialogActivityId: row.mission_dialog_activity_id,
          missionArticleFile: row.mission_article_file,
          steps: [],
          finalTest: {
            id: row.final_test_id ?? "",
            finalTestSolecas: Number(row.final_test_solecas),
            isComplete: !!row.test_conclusion_id
          }
        });
      }

      const mission = missionsMap.get(row.mission_id)!;

      mission.steps.push({
        stepId: row.step_id,
        stepIndex: row.step_index,
        activitiesCorrect: Number(row.activities_correct),
        activitiesIncorrect: Number(row.activities_incorrect),
        isCompleted: !!row.user_step_conclusion_finished_at
      });
    }

    return {
      disciplineId: firstRow.discipline_id,
      disciplineName: firstRow.discipline_name,
      moduleId: firstRow.module_id,
      moduleName: firstRow.module_name,
      missions: Array.from(missionsMap.values())
    };
  }

  async findDisciplineModules(
    params: FindDisciplineModulesParams
  ): Promise<PaginatedEntity<CardResponseWithoutLastAttempt>> {
    const { disciplineId, employeeId, page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;

    const query = await this.prisma.$queryRaw<
      CardResponseWithoutLastAttempt[]
    >(Prisma.sql`
      WITH employee_data AS (
        SELECT e.id AS employee_id, e.profile_id, e.user_id
        FROM employees e
        WHERE e.id = ${employeeId}
      ),
      module_missions AS (
        SELECT 
          mo.id AS module_id,
          mo.title AS module_name,
          mo.created_at AS module_created_at,
          d.title AS discipline_title,
          COUNT(DISTINCT m.id) AS total_missions
        FROM profile_accesses pa
        JOIN modules mo ON mo.id = pa.module_id
        JOIN missions m ON m.id = pa.mission_id
        JOIN disciplines d ON d.id = pa.discipline_id
        JOIN employee_data ed ON ed.profile_id = pa.profile_id
        WHERE d.id = ${disciplineId}
        GROUP BY mo.id, mo.title, mo.created_at, d.title
      ),
      completed_missions AS (
        SELECT 
          m.module_id,
          COUNT(DISTINCT umc.mission_id) AS completed_missions
        FROM user_mission_conclusions umc
        JOIN missions m ON m.id = umc.mission_id
        JOIN employee_data ed ON ed.user_id = umc.user_id
        GROUP BY m.module_id
      ),
      activity_stats AS (
        SELECT 
          m.module_id,
          COUNT(*) FILTER (WHERE aa.is_correct = true) AS correct_activities,
          COUNT(*) AS total_attempts
        FROM activity_attempts aa
        JOIN missions m ON m.id = aa.mission_id
        JOIN employee_data ed ON ed.user_id = aa.user_id
        GROUP BY m.module_id
      )
      SELECT 
        mm.module_id AS "moduleId",
        mm.discipline_title AS "disciplineTitle",
        mm.module_name AS "moduleName",
        mm.total_missions AS "missionsCount",
        ROUND(
          COALESCE(cm.completed_missions, 0)::decimal / NULLIF(mm.total_missions, 0) * 100, 2
        ) AS "completionPercentage",
        ROUND(
          COALESCE(astats.correct_activities, 0)::decimal / NULLIF(astats.total_attempts, 0) * 100, 2
        ) AS "accuracyPercentage"
      FROM module_missions mm
      LEFT JOIN completed_missions cm ON cm.module_id = mm.module_id
      LEFT JOIN activity_stats astats ON astats.module_id = mm.module_id
      ORDER BY mm.module_created_at ASC
      LIMIT ${pageSize}
      OFFSET ${offset};
    `);

    const totalResult = await this.prisma.$queryRaw<
      { total: number }[]
    >(Prisma.sql`
      WITH employee_data AS (
        SELECT e.id AS employee_id, e.profile_id
        FROM employees e
        WHERE e.id = ${employeeId}
      )
      SELECT COUNT(DISTINCT pa.module_id) AS total
      FROM profile_accesses pa
      JOIN employee_data ed ON ed.profile_id = pa.profile_id
      WHERE pa.discipline_id = ${disciplineId};
    `);

    const data = query.map((moduleCard) => ({
      moduleId: moduleCard.moduleId,
      disciplineTitle: moduleCard.disciplineTitle,
      moduleName: moduleCard.moduleName,
      missionsCount: Number(moduleCard.missionsCount),
      completionPercentage: moduleCard.completionPercentage,
      accuracyPercentage: moduleCard.accuracyPercentage
    }));

    const total = Number(totalResult[0]?.total) ?? 0;
    const lastPage = Math.ceil(total / pageSize);

    return {
      data,
      page,
      lastPage,
      total
    };
  }

  async findThreeLastModules(employeeId: string): Promise<CardResponse[]> {
    const response = await this.prisma.$queryRaw<CardResponse[]>(
      Prisma.sql`
        WITH employee_data AS (
          SELECT e.id AS employee_id, e.profile_id, e.user_id
          FROM employees e
          WHERE e.id = ${employeeId}
        ),
        module_missions AS (
          SELECT 
            mo.id AS module_id,
            mo.title AS module_name,
            mo.created_at AS module_created_at,
            d.title AS discipline_title,
            COUNT(DISTINCT m.id) AS total_missions
          FROM profile_accesses pa
          JOIN modules mo ON mo.id = pa.module_id
          JOIN missions m ON m.id = pa.mission_id
          JOIN disciplines d ON d.id = pa.discipline_id
          JOIN employee_data ed ON ed.profile_id = pa.profile_id
          GROUP BY mo.id, mo.title, mo.created_at, d.title
        ),
        completed_missions AS (
          SELECT 
            m.module_id,
            COUNT(DISTINCT umc.mission_id) AS completed_missions
          FROM user_mission_conclusions umc
          JOIN missions m ON m.id = umc.mission_id
          JOIN employee_data ed ON ed.user_id = umc.user_id
          WHERE umc.finished_at IS NOT NULL
          GROUP BY m.module_id
        ),
        activity_stats AS (
          SELECT 
            m.module_id,
            COUNT(*) FILTER (WHERE aa.is_correct = true) AS correct_activities,
            COUNT(*) AS total_attempts,
            MAX(aa.created_at) AS last_attempt
          FROM activity_attempts aa
          JOIN missions m ON m.id = aa.mission_id
          JOIN employee_data ed ON ed.user_id = aa.user_id
          GROUP BY m.module_id
        )
        SELECT 
          mm.module_id AS "moduleId",
          mm.discipline_title AS "disciplineTitle",
          mm.module_name AS "moduleName",
          mm.total_missions AS "missionsCount",
          ROUND(
            COALESCE(cm.completed_missions, 0)::decimal / NULLIF(mm.total_missions, 0) * 100, 2
          ) AS "completionPercentage",
          ROUND(
            COALESCE(astats.correct_activities, 0)::decimal / NULLIF(astats.total_attempts, 0) * 100, 2
          ) AS "accuracyPercentage",
          astats.last_attempt AS "lastAttempt"
        FROM module_missions mm
        LEFT JOIN completed_missions cm ON cm.module_id = mm.module_id
        LEFT JOIN activity_stats astats ON astats.module_id = mm.module_id
        WHERE astats.last_attempt IS NOT NULL
        ORDER BY astats.last_attempt DESC
        LIMIT 3;
      `
    );

    return response.map((moduleCard) => ({
      moduleId: moduleCard.moduleId,
      disciplineTitle: moduleCard.disciplineTitle,
      moduleName: moduleCard.moduleName,
      missionsCount: Number(moduleCard.missionsCount),
      completionPercentage: moduleCard.completionPercentage,
      accuracyPercentage: moduleCard.accuracyPercentage,
      lastAttempt: moduleCard.lastAttempt
    }));
  }

  async findEmployeeProfile(
    employeeId: string
  ): Promise<FindEmployeeProfileResponse> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId
      },
      select: {
        user: {
          select: {
            name: true,
            cpf: true,
            phone: true,
            email: true,
            avatar: true
          }
        },
        serviceProvider: {
          select: {
            operator: {
              select: {
                user: {
                  select: {
                    name: true,
                    state: true,
                    city: true,
                    address: true,
                    cnpj: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const operatorUser = employee.serviceProvider.operator.user;
    const employeeUser = employee.user;

    return {
      operator: {
        name: operatorUser.name,
        state: operatorUser.state,
        city: operatorUser.city,
        cpnj: operatorUser.cnpj,
        address: operatorUser.address
      },
      employee: {
        name: employeeUser.name,
        cpf: employeeUser.cpf,
        phone: employeeUser.phone,
        email: employee.user.email,
        avatar: employeeUser.avatar
      }
    };
  }

  async findAllDisciplineByEmployeeId(
    employeeId: string
  ): Promise<FindAllDisciplineByEmployeeIdResponse[]> {
    const result = await this.prisma.$queryRaw<
      FindAllDisciplineByEmployeeIdResponse[]
    >(Prisma.sql`
        SELECT DISTINCT
          d.id AS "disciplineId",
          d.title AS "disciplineTitle",
          d.color AS "disciplineColor",
          d.cover_image AS "disciplineCover"
        FROM employees e
        JOIN profiles p ON p.id = e.profile_id
        JOIN profile_accesses a ON a.profile_id = p.id
        JOIN disciplines d ON d.id = a.discipline_id
        WHERE e.id = ${employeeId}
      `);

    return result;
  }

  async findAllByCommunityId(
    params: FindAllByCommunityIdParams
  ): Promise<{ userId: string }[]> {
    const { communityId, fromUserId } = params;

    const employees = await this.prisma.employee.findMany({
      where: {
        communityId,
        userId: {
          not: fromUserId
        }
      },
      select: {
        userId: true
      }
    });

    return employees;
  }

  async findByUserIdWithUser(userId: string): Promise<UserWithEmployee | null> {
    const employeeWithUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
        role: "EMPLOYEE"
      },
      include: {
        employee: true
      }
    });

    if (!employeeWithUser) {
      return null;
    }

    return UserMapper.toDomainWithEmployee(employeeWithUser);
  }

  async update(
    employeeId: string,
    params: UpdateEmployeeParams
  ): Promise<Employee> {
    const {
      avatar,
      cpf,
      email,
      name,
      password,
      phone,
      profileId,
      serviceProviderId
    } = params;

    const employee = await this.prisma.employee.update({
      where: {
        id: employeeId
      },
      data: {
        Profile: profileId ? { connect: { id: profileId } } : undefined,
        serviceProvider: serviceProviderId
          ? { connect: { id: serviceProviderId } }
          : undefined,
        user: {
          update: {
            avatar,
            cpf,
            email,
            password,
            name,
            phone
          }
        }
      }
    });

    return EmployeeMapper.toDomain(employee);
  }

  async findById(employeeId: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId
      }
    });

    if (!employee) {
      return null;
    }

    return EmployeeMapper.toDomain(employee);
  }

  async findAllEmployeeNoPaginationByServiceProviderId(
    serviceProviderId: string
  ): Promise<FindAllEmployeeNoPaginationByServiceProviderIdResponse[]> {
    const employees = await this.prisma.employee.findMany({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      },
      where: {
        serviceProviderId
      }
    });

    const employeesFormatted = employees.map((employee) => {
      return {
        id: employee.id,
        userId: employee.userId,
        name: employee.user.name
      };
    });

    return employeesFormatted;
  }

  async createEmployee(params: CreateEmployeeParams): Promise<void> {
    const {
      name,
      cpf,
      email,
      phone,
      password,
      role,
      state,
      city,
      address,
      profileId,
      cnpj,
      responsible,
      avatar,
      serviceProviderId
    } = params;

    await this.prisma.$transaction(async (tx) => {
      const baseUser = await tx.user.create({
        data: {
          name,
          cpf,
          email,
          phone,
          password,
          role,
          state,
          city,
          address,
          cnpj: cnpj ?? null,
          responsible: responsible ?? null,
          avatar: avatar ?? null
        }
      });

      await tx.employee.create({
        data: {
          userId: baseUser.id,
          profileId,
          serviceProviderId: serviceProviderId ?? null
        }
      });
    });
  }

  async findByIdWithUser(id: string): Promise<UserWithEmployee | null> {
    const employeeWithUser = await this.prisma.user.findFirst({
      where: {
        employee: {
          id: id
        }
      },
      include: {
        employee: true
      }
    });

    if (!employeeWithUser || !employeeWithUser.employee) return null;

    return UserMapper.toDomainWithEmployee(employeeWithUser);
  }

  async findAllPaginated(
    params: FindAllEmployees
  ): Promise<PaginatedEntity<FindAllEmployeesReturn>> {
    const { serviceProviderId, page, pageSize } = params;
    const skip = (page - 1) * pageSize;

    const [employees, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where: { serviceProviderId },
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
              solecas: true
            }
          },
          Profile: {
            select: {
              name: true
            }
          }
        }
      }),
      this.prisma.employee.count({ where: { serviceProviderId } })
    ]);

    return {
      data: employees.map((employee) => ({
        employeeId: employee.id,
        name: employee.user.name,
        profileName: employee.Profile.name,
        avatar: employee.user.avatar,
        solecas: Number(employee.user.solecas)
      })),
      total,
      page,
      lastPage: Math.ceil(total / pageSize)
    };
  }
}

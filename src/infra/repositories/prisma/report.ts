import {
  DefaultReportParams,
  ActiveUsersResponse,
  ReportRepository,
  MissionConclusionResponse,
  SolecasResponse
} from "@domain/repositories/report";
import { PrismaService } from "@infra/config/prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async solecas(params: DefaultReportParams): Promise<SolecasResponse[]> {
    const { operatorId, employeeId, serviceProviderId } = params;

    const query = Prisma.sql`
      SELECT
        ou.name AS "operatorName",
        spu.name AS "serviceProviderName",
        eu.name AS "employeeName",
        COUNT(aa.*) FILTER (WHERE aa.is_correct = true) AS "activitiesHitCount",
        COALESCE(ROUND(AVG(tc.activities_hit)::numeric, 1), 0)::text AS "averageTest",
        COALESCE(eu.solecas, 0) AS "actualSolecasCount",
        COALESCE(SUM(po.solecas_value), 0) AS "totalSolecasSpent"
      FROM employees e
      INNER JOIN users eu ON e.user_id = eu.id
      INNER JOIN service_providers sp ON e.service_provider_id = sp.id
      INNER JOIN users spu ON sp.user_id = spu.id
      INNER JOIN operators o ON sp.operator_id = o.id
      INNER JOIN users ou ON o.user_id = ou.id
      LEFT JOIN activity_attempts aa ON aa.user_id = eu.id
      LEFT JOIN tests_conclusion tc ON tc.employee_id = e.id
      LEFT JOIN prize_orders po ON po.employee_id = e.id
      WHERE 1=1
        ${operatorId ? Prisma.sql`AND o.id = ${operatorId}` : Prisma.empty}
        ${serviceProviderId ? Prisma.sql`AND sp.id = ${serviceProviderId}` : Prisma.empty}
        ${employeeId ? Prisma.sql`AND e.id = ${employeeId}` : Prisma.empty}
      GROUP BY ou.name, spu.name, eu.name, eu.solecas
    `;

    return await this.prisma.$queryRaw<SolecasResponse[]>(query);
  }

  async missionsConclusion(
    params: DefaultReportParams
  ): Promise<MissionConclusionResponse[]> {
    const { operatorId, serviceProviderId, employeeId } = params;

    const query = Prisma.sql`
      WITH conclusions AS (
        SELECT
          umc.mission_id,
          DATE_PART('day', umc.finished_at - umc.started_at) AS duration,
          u.id AS user_id
        FROM user_mission_conclusions umc
        JOIN users u ON u.id = umc.user_id
        JOIN employees e ON e.user_id = u.id
        JOIN service_providers sp ON sp.id = e.service_provider_id
        WHERE umc.finished_at IS NOT NULL
        ${operatorId ? Prisma.sql`AND sp.operator_id = ${operatorId}` : Prisma.empty}
        ${serviceProviderId ? Prisma.sql`AND sp.id = ${serviceProviderId}` : Prisma.empty}
        ${employeeId ? Prisma.sql`AND e.id = ${employeeId}` : Prisma.empty}
      ),
      attempts AS (
        SELECT
          user_id,
          mission_id,
          is_correct
        FROM activity_attempts
      ),
      access AS (
        SELECT
          pa.mission_id,
          COUNT(DISTINCT e.id) AS student_count
        FROM profile_accesses pa
        JOIN profiles p ON p.id = pa.profile_id
        JOIN employees e ON e.profile_id = p.id
        JOIN service_providers sp ON sp.id = e.service_provider_id
        WHERE TRUE
        ${operatorId ? Prisma.sql`AND sp.operator_id = ${operatorId}` : Prisma.empty}
        ${serviceProviderId ? Prisma.sql`AND sp.id = ${serviceProviderId}` : Prisma.empty}
        ${employeeId ? Prisma.sql`AND e.id = ${employeeId}` : Prisma.empty}
        GROUP BY pa.mission_id
      )
      SELECT
        d.title AS "disciplineName",
        m.title AS "moduleName",
        mi.title AS "missionName",
        COALESCE(a.student_count, 0) AS "studentsCount",
        COUNT(c.user_id) AS "conclusionCount",
        ROUND(AVG(c.duration)) AS "averageConclusionTime",
        CONCAT(
          ROUND(
            AVG(
              CASE 
                WHEN att_total.total > 0 THEN (att_total.correct::float / att_total.total) * 100 
                ELSE NULL
              END
            )
          ), '%'
        ) AS "averageAccuracy"
      FROM conclusions c
      JOIN missions mi ON mi.id = c.mission_id
      JOIN modules m ON m.id = mi.module_id
      JOIN disciplines d ON d.id = m.discipline_id
      LEFT JOIN access a ON a.mission_id = c.mission_id
      LEFT JOIN (
        SELECT
          mission_id,
          COUNT(*) AS total,
          SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct
        FROM attempts
        GROUP BY mission_id
      ) att_total ON att_total.mission_id = c.mission_id
      GROUP BY d.title, m.title, mi.title, a.student_count
      ORDER BY d.title, m.title, mi.title
    `;

    return await this.prisma.$queryRaw<MissionConclusionResponse[]>(query);
  }

  async activeUsers(
    params: DefaultReportParams
  ): Promise<ActiveUsersResponse[]> {
    const { operatorId, employeeId, serviceProviderId } = params;

    const employees = await this.prisma.employee.findMany({
      where: {
        ...(employeeId && { id: employeeId }),
        ...(serviceProviderId && { serviceProviderId }),
        ...(operatorId && {
          serviceProvider: {
            operatorId
          }
        }),
        Profile: {
          accesses: {
            some: {}
          }
        }
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            ActivityAttempt: {
              select: { isCorrect: true }
            },
            UserModuleConclusion: {
              select: { id: true }
            },
            UserMissionConclusion: {
              select: { id: true }
            },
            UserDisciplineConclusion: {
              select: { id: true }
            },
            UserAccessLog: {
              orderBy: { accessedAt: "desc" },
              take: 1,
              select: { accessedAt: true }
            }
          }
        },
        serviceProvider: {
          select: {
            user: { select: { name: true } },
            operator: {
              select: {
                user: { select: { name: true } }
              }
            }
          }
        },
        Profile: {
          select: {
            accesses: {
              select: {
                disciplineId: true,
                moduleId: true,
                missionId: true
              }
            }
          }
        }
      }
    });

    return employees.map((employee) => {
      const accesses = employee.Profile.accesses;

      const disciplineIds = new Set(
        accesses.map((a) => a.disciplineId).filter(Boolean)
      );
      const moduleIds = new Set(
        accesses.map((a) => a.moduleId).filter(Boolean)
      );
      const missionIds = new Set(
        accesses.map((a) => a.missionId).filter(Boolean)
      );

      const attempts = employee.user.ActivityAttempt;
      const corrects = attempts.reduce(
        (sum, att) => sum + (att.isCorrect ? 1 : 0),
        0
      );
      const total = attempts.length;
      const accuracy = total ? Math.round((corrects / total) * 100) : 0;

      const lastAccess = employee.user.UserAccessLog[0]?.accessedAt;
      const formattedAccess = lastAccess
        ? new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(lastAccess))
        : "Não acessou a plataforma";

      return {
        operatorName: employee.serviceProvider.operator.user.name,
        serviceProviderName: employee.serviceProvider.user.name,
        employeeName: employee.user.name,
        disciplineCount: disciplineIds.size,
        moduleCount: moduleIds.size,
        missionCount: missionIds.size,
        missionsConclusionCount: employee.user.UserMissionConclusion.length,
        modulesConclusionCount: employee.user.UserModuleConclusion.length,
        disciplinesConclusionCount:
          employee.user.UserDisciplineConclusion.length,
        accuracy: `${accuracy}%`,
        lastAccess: formattedAccess
      };
    });
  }
}

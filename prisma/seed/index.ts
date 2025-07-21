import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const hashedPassword = await hash("SecurePass123!", 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com.br",
        cpf: "12345678900",
        password: hashedPassword,
        phone: "+5511999999999",
        role: "ADMIN",
        state: "SP",
        city: "SP",
        address: "Av. Paulista"
      }
    });

    const operatorUser = await tx.user.create({
      data: {
        name: "Operator User",
        email: "operator@example.com.br",
        cpf: "32165498700",
        password: hashedPassword,
        phone: "+5511988888888",
        role: "OPERATOR",
        state: "SP",
        city: "SP",
        address: "Rua Augusta",
        cnpj: "11.111.111/0001-11",
        responsible: "João"
      }
    });

    const operator = await tx.operator.create({
      data: {
        userId: operatorUser.id
      }
    });

    const serviceProviderUser = await tx.user.create({
      data: {
        name: "SP User",
        email: "sp@example.com.br",
        cpf: "98765432100",
        password: hashedPassword,
        phone: "+5511977777777",
        role: "SERVICE_PROVIDER",
        state: "RJ",
        city: "RJ",
        address: "Rua Laranjeiras",
        cnpj: "22.222.222/0001-22",
        responsible: "Maria"
      }
    });

    const serviceProvider = await tx.serviceProvider.create({
      data: {
        userId: serviceProviderUser.id,
        operatorId: operator.id
      }
    });

    const profile = await tx.profile.create({
      data: {
        name: "Padrão",
        operatorId: operator.id
      }
    });

    const discipline = await tx.discipline.create({
      data: {
        title: "Disciplina A",
        author: "Autor",
        resume: "Resumo",
        coverImage: "cover.jpg",
        color: "#2B95F6"
      }
    });

    const module = await tx.module.create({
      data: {
        title: "Módulo A",
        index: 0,
        disciplineId: discipline.id
      }
    });

    const mission = await tx.mission.create({
      data: {
        title: "Missão A",
        index: 0,
        moduleId: module.id,
        initialVideo: "video.mp4",
        articleFile: "article.pdf",
        color: "#2B95F6"
      }
    });

    const step = await tx.step.create({
      data: {
        title: "Passo 1",
        index: 0,
        missionId: mission.id
      }
    });

    const video = await tx.videoActivity.create({
      data: {
        link: "https://example.com/video.mp4",
        solecasAmount: 10,
        stepPosition: 0,
        stepId: step.id
      }
    });

    const employees = await Promise.all(
      Array.from({ length: 4 }).map(async (_, i) => {
        const user = await tx.user.create({
          data: {
            name: `Employee ${i + 1}`,
            email: `employee${i + 1}@example.com`,
            cpf: `0000000000${i + 1}`,
            password: hashedPassword,
            phone: `+551199999000${i + 1}`,
            role: "EMPLOYEE",
            state: "MG",
            city: "BH",
            address: "Rua Teste"
          }
        });

        const employee = await tx.employee.create({
          data: {
            userId: user.id,
            serviceProviderId: serviceProvider.id,
            profileId: profile.id
          }
        });

        return { user, employee };
      })
    );

    await Promise.all(
      employees.map(({ user }, index) =>
        tx.activityAttempt.create({
          data: {
            userId: user.id,
            activityType: "VIDEO",
            activityId: video.id,
            stepId: step.id,
            moduleId: module.id,
            missionId: mission.id,
            disciplineId: discipline.id,
            isCorrect: index < 2
          }
        })
      )
    );

    const now = new Date();
    const accessDates = [1, 2, 3, 4].map((days) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d;
    });

    await Promise.all(
      employees.map(({ user }, i) =>
        tx.userAccessLog.create({
          data: {
            userId: user.id,
            accessedAt: accessDates[i]
          }
        })
      )
    );

    await Promise.all(
      employees.slice(0, 2).map(({ user }, index) => {
        const daysToFinish = index === 0 ? 3 : 6;

        const finishedAt = new Date();
        const startedAt = new Date();
        startedAt.setDate(finishedAt.getDate() - daysToFinish);

        return tx.userModuleConclusion.create({
          data: {
            userId: user.id,
            startedAt,
            finishedAt,
            moduleId: module.id
          }
        });
      })
    );

    await tx.userModuleConclusion.create({
      data: {
        userId: user.id,
        startedAt: new Date(),
        moduleId: module.id
      }
    });

    await Promise.all(
      employees.slice(0, 2).map(({ user }, index) => {
        const daysToFinish = index === 0 ? 2 : 4;

        const finishedAt = new Date();
        const startedAt = new Date();
        startedAt.setDate(finishedAt.getDate() - daysToFinish);

        return tx.userMissionConclusion.create({
          data: {
            userId: user.id,
            startedAt,
            finishedAt,
            missionId: mission.id
          }
        });
      })
    );

    await tx.userMissionConclusion.create({
      data: {
        userId: user.id,
        startedAt: new Date(),
        missionId: mission.id
      }
    });

    const newServiceProviderUser = await tx.user.create({
      data: {
        name: "SP User 2",
        email: "sp2@example.com.br",
        cpf: "12312312300",
        password: hashedPassword,
        phone: "+5511966666666",
        role: "SERVICE_PROVIDER",
        state: "RS",
        city: "POA",
        address: "Av Ipiranga",
        cnpj: "33.333.333/0001-33",
        responsible: "Carlos"
      }
    });

    const newServiceProvider = await tx.serviceProvider.create({
      data: {
        userId: newServiceProviderUser.id,
        operatorId: operator.id
      }
    });

    const newModule = await tx.module.create({
      data: {
        title: "Módulo B",
        index: 1,
        disciplineId: discipline.id
      }
    });

    const newMission = await tx.mission.create({
      data: {
        title: "Missão B",
        index: 1,
        moduleId: newModule.id,
        initialVideo: "video2.mp4",
        articleFile: "article2.pdf",
        color: "#2B95F6"
      }
    });

    const newStep = await tx.step.create({
      data: {
        title: "Passo 1 - Missão B",
        index: 0,
        missionId: newMission.id
      }
    });

    const newVideo = await tx.videoActivity.create({
      data: {
        link: "https://example.com/video2.mp4",
        solecasAmount: 15,
        stepPosition: 0,
        stepId: newStep.id
      }
    });

    const newEmployees = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        const newUser = await tx.user.create({
          data: {
            name: `Employee B${i + 1}`,
            email: `employeeb${i + 1}@example.com`,
            cpf: `1111111111${i + 1}`,
            password: hashedPassword,
            phone: `+551188888000${i + 1}`,
            role: "EMPLOYEE",
            state: "PR",
            city: "Curitiba",
            address: "Rua Nova"
          }
        });

        const employee = await tx.employee.create({
          data: {
            userId: newUser.id,
            serviceProviderId: newServiceProvider.id,
            profileId: profile.id
          }
        });

        return { user: newUser, employee };
      })
    );

    await Promise.all(
      newEmployees.map(({ user }, index) =>
        tx.activityAttempt.create({
          data: {
            userId: user.id,
            activityType: "VIDEO",
            activityId: newVideo.id,
            stepId: newStep.id,
            moduleId: newModule.id,
            missionId: newMission.id,
            disciplineId: discipline.id,
            isCorrect: index < 3
          }
        })
      )
    );

    const newAccessDates = [5, 6, 7, 8, 9].map((daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d;
    });

    await Promise.all(
      newEmployees.map(({ user }, i) =>
        tx.userAccessLog.create({
          data: {
            userId: user.id,
            accessedAt: newAccessDates[i]
          }
        })
      )
    );

    await Promise.all(
      newEmployees.slice(0, 3).map(({ user }, index) => {
        const daysToFinish = [2, 4, 6];

        const finishedAt = new Date();
        const startedAt = new Date();
        startedAt.setDate(finishedAt.getDate() - daysToFinish[index]);

        return Promise.all([
          tx.userMissionConclusion.create({
            data: {
              userId: user.id,
              startedAt,
              finishedAt,
              missionId: newMission.id
            }
          }),
          tx.userModuleConclusion.create({
            data: {
              userId: user.id,
              startedAt,
              finishedAt,
              moduleId: newModule.id
            }
          })
        ]);
      })
    );

    await Promise.all(
      [...employees.slice(0, 2), ...newEmployees.slice(0, 3)].map(({ user }) =>
        tx.userDisciplineConclusion.create({
          data: {
            userId: user.id,
            disciplineId: discipline.id,
            startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            finishedAt: new Date()
          }
        })
      )
    );

    await tx.profileAccess.create({
      data: {
        profileId: profile.id,
        disciplineId: discipline.id,
        moduleId: module.id,
        missionId: mission.id,
        stepId: step.id
      }
    });

    await tx.profileAccess.create({
      data: {
        profileId: profile.id,
        disciplineId: discipline.id,
        moduleId: newModule.id,
        missionId: newMission.id,
        stepId: newStep.id
      }
    });

    const operatorUserSolecas = await tx.user.create({
      data: {
        name: "Operator User Solecas 1",
        email: "operator-solecas1@example.com.br",
        cpf: "32162198700",
        password: hashedPassword,
        phone: "+5511988884888",
        role: "OPERATOR",
        state: "SP",
        city: "SP",
        address: "Rua Augusta",
        cnpj: "11.111.101/0001-11",
        responsible: "João"
      }
    });

    const operatorSolecas = await tx.operator.create({
      data: {
        userId: operatorUserSolecas.id
      }
    });

    const serviceProviderUserSolecas = await tx.user.create({
      data: {
        name: "SP User Solecas 1",
        email: "spsolecas@example.com.br",
        cpf: "98165412100",
        password: hashedPassword,
        phone: "+5511977757777",
        role: "SERVICE_PROVIDER",
        state: "RJ",
        city: "RJ",
        address: "Rua Laranjeiras",
        cnpj: "22.222.232/0001-22",
        responsible: "Maria"
      }
    });

    const serviceProviderSolecas = await tx.serviceProvider.create({
      data: {
        userId: serviceProviderUserSolecas.id,
        operatorId: operatorSolecas.id
      }
    });

    const userSolecas1 = await tx.user.create({
      data: {
        name: `Employee Solecas 1`,
        email: `employee-solecas1@example.com`,
        cpf: `00000100076`,
        password: hashedPassword,
        phone: `+5511999990021`,
        role: "EMPLOYEE",
        state: "MG",
        solecas: 1000000,
        city: "BH",
        address: "Rua Teste"
      }
    });

    const employeeSolecas1 = await tx.employee.create({
      data: {
        userId: userSolecas1.id,
        serviceProviderId: serviceProviderSolecas.id,
        profileId: profile.id
      }
    });

    const prize = await tx.prize.create({
      data: {
        color: "#00528C",
        description: "Alguma coisa",
        expiryDate: new Date(),
        moneyValue: 12,
        name: "Prize Teste",
        solecasValue: 1000
      }
    });

    await tx.prizeOrder.create({
      data: {
        prizeId: prize.id,
        employeeId: employeeSolecas1.id,
        serviceProviderId: employeeSolecas1.serviceProviderId,
        operatorId: operatorSolecas.id,
        solecasValue: prize.solecasValue,
        solecasRemaining: Number(userSolecas1.solecas) - prize.solecasValue,
        moneyValue: prize.moneyValue
      }
    });

    const operatorUserSolecas2 = await tx.user.create({
      data: {
        name: "Operator User Solecas 2",
        email: "operator-solecas2@example.com.br",
        cpf: "32169198700",
        password: hashedPassword,
        phone: "+5511912814888",
        role: "OPERATOR",
        state: "SP",
        city: "SP",
        address: "Rua Augusta",
        cnpj: "11.111.121/0001-11",
        responsible: "João"
      }
    });

    const operatorSolecas2 = await tx.operator.create({
      data: {
        userId: operatorUserSolecas2.id
      }
    });

    const serviceProviderUserSolecas2 = await tx.user.create({
      data: {
        name: "SP User Solecas 2",
        email: "spsolecas2@example.com.br",
        cpf: "98765482100",
        password: hashedPassword,
        phone: "+5511971757777",
        role: "SERVICE_PROVIDER",
        state: "RJ",
        city: "RJ",
        address: "Rua Laranjeiras",
        cnpj: "22.222.122/0001-22",
        responsible: "Maria"
      }
    });

    const serviceProviderSolecas2 = await tx.serviceProvider.create({
      data: {
        userId: serviceProviderUserSolecas2.id,
        operatorId: operatorSolecas2.id
      }
    });

    const userSolecas2 = await tx.user.create({
      data: {
        name: `Employee Solecas 2`,
        email: `employee-solecas2@example.com`,
        cpf: `00010000076`,
        password: hashedPassword,
        phone: `+5511999690021`,
        role: "EMPLOYEE",
        state: "MG",
        solecas: 1000000,
        city: "BH",
        address: "Rua Teste"
      }
    });

    const employeeSolecas2 = await tx.employee.create({
      data: {
        userId: userSolecas2.id,
        serviceProviderId: serviceProviderSolecas2.id,
        profileId: profile.id
      }
    });

    const prize2 = await tx.prize.create({
      data: {
        color: "#7C3AED",
        description: "Alguma coisa 2",
        expiryDate: new Date(),
        moneyValue: 12,
        name: "Prize Teste",
        solecasValue: 1000
      }
    });

    await tx.prizeOrder.create({
      data: {
        prizeId: prize2.id,
        employeeId: employeeSolecas2.id,
        serviceProviderId: employeeSolecas2.serviceProviderId,
        operatorId: operatorSolecas2.id,
        solecasValue: prize2.solecasValue,
        solecasRemaining: Number(userSolecas2.solecas) - prize2.solecasValue,
        moneyValue: prize2.moneyValue
      }
    });

    const finalTest = await tx.finalTest.create({
      data: {
        solecasAmount: 100,
        missionId: mission.id
      }
    });

    await tx.testConclusion.create({
      data: {
        activitiesHit: 5,
        employeeId: employeeSolecas1.id,
        finalTestId: finalTest.id
      }
    });

    await tx.testConclusion.create({
      data: {
        activitiesHit: 3,
        employeeId: employeeSolecas2.id,
        finalTestId: finalTest.id
      }
    });

    const testModule1 = await tx.module.create({
      data: {
        title: "Módulo Teste Three Missions",
        index: 99,
        disciplineId: discipline.id
      }
    });

    for (let m = 1; m <= 3; m++) {
      const mission = await tx.mission.create({
        data: {
          title: `Missão Teste ${m}`,
          index: m,
          moduleId: testModule1.id,
          color: "#FF9900"
        }
      });

      for (let s = 1; s <= 5; s++) {
        const step = await tx.step.create({
          data: {
            title: `Step ${s} - Missão Teste ${m}`,
            index: s,
            missionId: mission.id
          }
        });

        await tx.profileAccess.create({
          data: {
            profileId: employeeSolecas2.profileId,
            disciplineId: discipline.id,
            moduleId: testModule1.id,
            missionId: mission.id,
            stepId: step.id
          }
        });

        await tx.activityAttempt.create({
          data: {
            userId: userSolecas2.id,
            activityType: "VIDEO",
            activityId: `mock-activity-${m}-${s}`,
            stepId: step.id,
            moduleId: testModule1.id,
            missionId: mission.id,
            disciplineId: discipline.id,
            isCorrect: s % 2 === 0
          }
        });

        if (s <= 3) {
          await tx.userStepConclusion.create({
            data: {
              userId: userSolecas2.id,
              stepId: step.id
            }
          });
        }
      }
    }

    const disciplina = await tx.discipline.create({
      data: {
        title: "Formação WebPrestador",
        author: "Autor",
        resume: "Resumo da formação",
        coverImage: "cover.jpg",
        color: "#123456"
      }
    });

    // 2. MÓDULOS
    const modulo1 = await tx.module.create({
      data: {
        title: "Faturamento",
        index: 0,
        disciplineId: disciplina.id
      }
    });

    const modulo2 = await tx.module.create({
      data: {
        title: "Cobrança",
        index: 1,
        disciplineId: disciplina.id
      }
    });

    // 3. MISSÕES
    const missao1 = await tx.mission.create({
      data: {
        title: "Missão A",
        index: 0,
        moduleId: modulo1.id,
        articleFile: "fileA.pdf",
        initialVideo: "https://video.com/videoA.mp4",
        color: "#2B95F6"
      }
    });

    const dialogForMissao2 = await tx.dialogActivity.create({
      data: {
        solecasAmount: 10,
        stepPosition: 0,
        sentences: {
          create: [
            { person: "SOLINHO", index: 0, text: "Introdução à missão B" },
            { person: "ANA_SECRETARIA", index: 1, text: "Vamos começar!" }
          ]
        }
      }
    });

    const missao2 = await tx.mission.create({
      data: {
        title: "Missão B",
        index: 0,
        moduleId: modulo2.id,
        articleFile: "fileB.pdf",
        dialogActivityId: dialogForMissao2.id,
        color: "#E95F2B"
      }
    });

    // 4. CRIAÇÃO DOS STEPS E ATIVIDADES
    const createStepsWithActivities = async (
      missionId: string,
      stepStartIndex = 0
    ): Promise<void> => {
      for (let i = 0; i < 5; i++) {
        const step = await tx.step.create({
          data: {
            title: `Passo ${stepStartIndex + i}`,
            index: stepStartIndex + i,
            missionId
          }
        });

        await tx.videoActivity.create({
          data: {
            link: `https://example.com/video-${i}.mp4`,
            stepPosition: 4,
            solecasAmount: 10,
            stepId: step.id
          }
        });

        await tx.dialogActivity.create({
          data: {
            solecasAmount: 10,
            stepPosition: 3,
            stepId: step.id,
            sentences: {
              create: [
                { person: "SOLINHO", index: 0, text: "Olá!" },
                { person: "ANA_SECRETARIA", index: 1, text: "Vamos continuar." }
              ]
            }
          }
        });

        await tx.multipleResponseActivity.create({
          data: {
            question: `Pergunta múltipla ${i}`,
            solecasAmount: 10,
            stepPosition: 2,
            stepId: step.id,
            responses: {
              create: [
                { text: "Correta", isCorrect: true },
                { text: "Outra correta", isCorrect: true },
                { text: "Errada", isCorrect: false },
                { text: "Outra Errada", isCorrect: false }
              ]
            }
          }
        });

        await tx.imageActivity.create({
          data: {
            question: `Imagem ${i}`,
            solecasAmount: 10,
            stepPosition: 1,
            stepId: step.id,
            responses: {
              create: [
                {
                  imageFile: "https://picsum.photos/id/1018/800/400",
                  isCorrect: true
                },
                {
                  imageFile: "https://picsum.photos/id/1025/800/400",
                  isCorrect: false
                },
                {
                  imageFile: "https://picsum.photos/id/1027/800/400",
                  isCorrect: false
                },
                {
                  imageFile: "https://picsum.photos/id/1043/800/400",
                  isCorrect: false
                }
              ]
            }
          }
        });

        await tx.trueOrFalseActivity.create({
          data: {
            question: `V/F ${i}: A água é molhada?`,
            solecasAmount: 10,
            stepPosition: 0,
            stepId: step.id,
            items: {
              create: [
                { text: "Sim", isTrue: true },
                { text: "Não", isTrue: false }
              ]
            }
          }
        });
      }
    };

    await createStepsWithActivities(missao1.id, 0);
    await createStepsWithActivities(missao2.id, 0);

    const employeeUser = await tx.user.create({
      data: {
        name: "Funcionário Teste",
        cpf: "00000000000",
        email: "employee@teste.com",
        phone: "51999999999",
        password: "senha123",
        role: "EMPLOYEE",
        state: "RS",
        city: "POA",
        address: "Rua Teste"
      }
    });

    const profileTest = await tx.profile.create({
      data: {
        name: "Perfil de Acesso",
        operatorId: operator.id
      }
    });

    const employeeTrail = await tx.employee.create({
      data: {
        userId: employeeUser.id,
        serviceProviderId: serviceProvider.id,
        profileId: profileTest.id
      }
    });

    const allSteps = await tx.step.findMany({
      where: {
        missionId: { in: [missao1.id, missao2.id] }
      }
    });

    for (const step of allSteps) {
      await tx.profileAccess.create({
        data: {
          profileId: profileTest.id,
          disciplineId: disciplina.id,
          moduleId: step.missionId === missao1.id ? modulo1.id : modulo2.id,
          missionId: step.missionId,
          stepId: step.id
        }
      });
    }

    const [stepA, stepB] = allSteps.slice(0, 2);

    const videoA = await tx.videoActivity.findFirst({
      where: { stepId: stepA.id }
    });
    const dialogA = await tx.dialogActivity.findFirst({
      where: { stepId: stepA.id }
    });
    const multA = await tx.multipleResponseActivity.findFirst({
      where: { stepId: stepA.id }
    });
    const imgA = await tx.imageActivity.findFirst({
      where: { stepId: stepA.id }
    });
    const vfA = await tx.trueOrFalseActivity.findFirst({
      where: { stepId: stepA.id }
    });

    await tx.activityAttempt.createMany({
      data: [
        {
          userId: employeeUser.id,
          activityType: "VIDEO",
          activityId: videoA.id,
          stepId: stepA.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: true
        },
        {
          userId: employeeUser.id,
          activityType: "DIALOG",
          activityId: dialogA.id,
          stepId: stepA.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: true
        },
        {
          userId: employeeUser.id,
          activityType: "MULTIPLE_RESPONSE",
          activityId: multA.id,
          stepId: stepA.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: true
        },
        {
          userId: employeeUser.id,
          activityType: "IMAGE",
          activityId: imgA.id,
          stepId: stepA.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: false
        },
        {
          userId: employeeUser.id,
          activityType: "TRUE_OR_FALSE",
          activityId: vfA.id,
          stepId: stepA.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: false
        }
      ]
    });

    await tx.userStepConclusion.create({
      data: {
        userId: employeeUser.id,
        stepId: stepA.id,
        startedAt: new Date(),
        finishedAt: new Date()
      }
    });

    const videoB = await tx.videoActivity.findFirst({
      where: { stepId: stepB.id }
    });
    const dialogB = await tx.dialogActivity.findFirst({
      where: { stepId: stepB.id }
    });

    await tx.activityAttempt.createMany({
      data: [
        {
          userId: employeeUser.id,
          activityType: "VIDEO",
          activityId: videoB.id,
          stepId: stepB.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: true
        },
        {
          userId: employeeUser.id,
          activityType: "DIALOG",
          activityId: dialogB.id,
          stepId: stepB.id,
          moduleId: modulo1.id,
          missionId: missao1.id,
          disciplineId: disciplina.id,
          isCorrect: true
        }
      ]
    });

    const finalTest1 = await tx.finalTest.create({
      data: {
        missionId: missao1.id,
        solecasAmount: 50
      }
    });

    await tx.finalTest.create({
      data: {
        missionId: missao2.id,
        solecasAmount: 50
      }
    });

    await tx.testConclusion.create({
      data: {
        employeeId: employeeTrail.id,
        finalTestId: finalTest1.id,
        activitiesHit: 7
      }
    });

    const stepWithCompleteSentence = await tx.step.create({
      data: {
        title: "Passo com Complete Sentence",
        index: 5,
        missionId: missao1.id
      }
    });

    await tx.completeSentenceActivity.create({
      data: {
        question: "Complete a frase com a palavra correta.",
        stepPosition: 5,
        solecasAmount: 10,
        stepId: stepWithCompleteSentence.id,
        textParts: ["A água está", "e é essencial para a vida."],
        gaps: {
          create: [
            {
              index: 0,
              options: ["gelada", "quente", "molhada"],
              correct: "molhada"
            }
          ]
        }
      }
    });

    console.log(
      "Seed completa com 2 módulos, 2 missões, 10 steps e 50 atividades."
    );

    const newDiscipline = await tx.discipline.create({
      data: {
        title: "Disciplina Avançada",
        author: "Equipe Técnica",
        resume:
          "Uma disciplina com 4 módulos, cada um com uma missão e um passo de múltiplas atividades.",
        coverImage: "advanced-cover.jpg",
        color: "#FF5733"
      }
    });

    for (let m = 1; m <= 4; m++) {
      const newModule = await tx.module.create({
        data: {
          title: `Módulo ${m} da disciplina avançada`,
          index: m - 1,
          disciplineId: newDiscipline.id
        }
      });

      for (let y = 0; y < 2; y++) {
        const newMission = await tx.mission.create({
          data: {
            title: `Missão ${y} da disciplina avançada do Modulo ${m}`,
            index: y,
            moduleId: newModule.id,
            color: "#3B82F6",
            articleFile: `article${m}.pdf`,
            initialVideo: `https://video.com/module${m}.mp4`
          }
        });

        const newStep = await tx.step.create({
          data: {
            title: `Passo Único - Missão ${y} do Modulo ${m}`,
            index: 0,
            missionId: newMission.id
          }
        });

        for (let i = 0; i < 5; i++) {
          await tx.videoActivity.create({
            data: {
              stepId: newStep.id,
              link: `https://video.com/step${y}-mission${y}-module${m}.mp4`,
              stepPosition: i,
              solecasAmount: 10
            }
          });
        }
      }
    }

    const newProfile = await tx.profile.create({
      data: {
        name: "Perfil Acesso Disciplina Avançada",
        operatorId: operator.id
      }
    });

    const steps = await tx.step.findMany({
      where: {
        mission: {
          module: {
            disciplineId: newDiscipline.id
          }
        }
      },
      include: {
        mission: {
          include: {
            module: true
          }
        }
      }
    });

    for (const step of steps) {
      await tx.profileAccess.create({
        data: {
          profileId: newProfile.id,
          disciplineId: newDiscipline.id,
          moduleId: step.mission.module.id,
          missionId: step.mission.id,
          stepId: step.id
        }
      });
    }

    const employeeUser2 = await tx.user.create({
      data: {
        name: "Funcionário Disciplina Avançada",
        cpf: "00099900000",
        email: "funcionario.avancado@example.com",
        phone: "+5511999991988",
        password: hashedPassword,
        role: "EMPLOYEE",
        state: "SP",
        city: "São Paulo",
        address: "Av. Inovação"
      }
    });

    const employee = await tx.employee.create({
      data: {
        userId: employeeUser2.id,
        profileId: newProfile.id,
        serviceProviderId: serviceProvider.id
      }
    });

    for (let x = 0; x < 4; x++) {
      const missionModulo = await tx.mission.findFirst({
        where: {
          module: {
            disciplineId: newDiscipline.id,
            index: x
          },
          index: 0
        }
      });

      const step2 = await tx.step.findFirst({
        where: {
          missionId: missionModulo.id
        }
      });

      const videoActivities = await tx.videoActivity.findMany({
        where: {
          stepId: step2.id
        },
        orderBy: { stepPosition: "asc" }
      });

      for (let i = 0; i < videoActivities.length; i++) {
        await tx.activityAttempt.create({
          data: {
            userId: employeeUser2.id,
            activityType: "VIDEO",
            activityId: videoActivities[i].id,
            stepId: step2.id,
            moduleId: missionModulo.moduleId,
            missionId: missionModulo.id,
            disciplineId: newDiscipline.id,
            isCorrect: i === 0 // acerta só a primeira
          }
        });
      }

      await tx.userMissionConclusion.create({
        data: {
          userId: employee.userId,
          missionId: missionModulo.id,
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // começou 2 dias atrás
          finishedAt: new Date()
        }
      });
    }

    console.log("✅ Seed finalizada com sucesso!");
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Erro ao rodar seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

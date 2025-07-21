import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import {
  FileStorageAdapter,
  StorageFolderPaths
} from "@domain/adapters/file-storage";
import { EmployeeRepository } from "@domain/repositories/employee";
import { ProfileRepository } from "@domain/repositories/profile";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";
import { UploadFileUseCase } from "@use-cases/file/upload-file";

export interface UpdateEmployeeUseCaseParams {
  serviceProviderId?: string;
  profileId?: string;
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly fileStorage: FileStorageAdapter,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    employeeId: string,
    params: UpdateEmployeeUseCaseParams,
    newAvatar?: Express.Multer.File
  ): Promise<void> {
    const { cpf, email, name, password, phone, profileId, serviceProviderId } =
      params;

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee with this id"
      });
    }

    let employeeProfileId = employee.profileId;

    if (profileId && profileId !== employee.profileId) {
      const profile = await this.profileRepository.findById(profileId);

      if (!profile) {
        return this.exceptionAdapter.notFound({
          message: "Not found a profile with this id"
        });
      }

      employeeProfileId = profileId;
    }

    let employeeServiceProviderId = employee.serviceProviderId;

    if (serviceProviderId && serviceProviderId !== employee.serviceProviderId) {
      const serviceProvider =
        await this.serviceProviderRepository.findById(serviceProviderId);

      if (!serviceProvider) {
        return this.exceptionAdapter.notFound({
          message: "Not found a service provider with this id"
        });
      }

      employeeServiceProviderId = serviceProviderId;
    }

    const user = await this.userRepository.findById(employee.userId);

    if (email && email !== user.email) {
      const userWithThisEmail = await this.userRepository.findByEmail(email);

      if (userWithThisEmail) {
        return this.exceptionAdapter.badRequest({
          message: "Already exists a user with this email"
        });
      }
    }

    if (cpf && cpf !== user.cpf) {
      const userWithThisCpf = await this.userRepository.findByCpf(cpf);

      if (userWithThisCpf) {
        return this.exceptionAdapter.badRequest({
          message: "Already exists a user with this cpf"
        });
      }
    }

    if (phone && phone !== user.phone) {
      const userWithThisPhone = await this.userRepository.findByPhone(phone);

      if (userWithThisPhone) {
        return this.exceptionAdapter.badRequest({
          message: "Already exists a user with this phone"
        });
      }
    }

    let newPassword = user.password;

    if (password) {
      const encryptedNewPassword =
        await this.cryptographyAdapter.generateHash(password);

      newPassword = encryptedNewPassword;
    }

    const isAutomaticAvatar =
      user.avatar?.includes("avatar.iran.liara.run") ?? false;

    let newAvatarPath = null;

    if (newAvatar) {
      if (user.avatar && !isAutomaticAvatar) {
        const deleteOldAvatar = await this.fileStorage.deleteFile(user.avatar);

        if (!deleteOldAvatar) {
          return this.exceptionAdapter.internalServerError({
            message: "Error deleting old avatar"
          });
        }
      }

      newAvatarPath = await this.uploadFileUseCase.upload(
        newAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!newAvatarPath) {
        return this.exceptionAdapter.internalServerError({
          message: "Error upload avatar"
        });
      }
    }

    const updatedEmployee = await this.employeeRepository.update(employeeId, {
      avatar: newAvatarPath ?? user.avatar,
      cpf: cpf ?? user.cpf,
      email: email ?? user.email,
      name: name ?? user.name,
      password: newPassword,
      phone: phone ?? user.phone,
      profileId: employeeProfileId,
      serviceProviderId: employeeServiceProviderId
    });

    if (!updatedEmployee) {
      return this.exceptionAdapter.internalServerError({
        message: "Error to update a employee"
      });
    }
  }
}

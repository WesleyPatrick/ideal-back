import { Injectable } from "@nestjs/common";
import { CryptographyAdapter } from "@domain/adapters/cryptography";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EmployeeRepository } from "@domain/repositories/employee";
import { UserRepository } from "@domain/repositories/user";
import { RoleValue } from "@domain/entities/roles";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { ProfileRepository } from "@domain/repositories/profile";
import { UploadFileUseCase } from "@use-cases/file/upload-file";
import { StorageFolderPaths } from "@domain/adapters/file-storage";

export interface CreateEmployeeUseCaseParams {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  profileId: string;
  state: string;
  city: string;
  address: string;
  serviceProviderId?: string;
}

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async create(
    params: CreateEmployeeUseCaseParams,
    employeeAvatar?: Express.Multer.File
  ): Promise<void> {
    const { email, cpf, phone, password, serviceProviderId, profileId } =
      params;

    const existingUserWithEmail = await this.userRepository.findByEmail(email);

    if (existingUserWithEmail) {
      return this.exceptionsAdapter.badRequest({
        message: "E-mail already registered"
      });
    }

    const existingUserWithCpf = await this.userRepository.findByCpf(cpf);

    if (existingUserWithCpf) {
      return this.exceptionsAdapter.badRequest({
        message: `A user with CPF ${cpf} already exists`
      });
    }

    const existingUserWithPhone = await this.userRepository.findByPhone(phone);

    if (existingUserWithPhone) {
      return this.exceptionsAdapter.badRequest({
        message: `A user with phone ${phone} already exists`
      });
    }

    const serviceProviderExists =
      await this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProviderExists) {
      return this.exceptionsAdapter.badRequest({
        message: `Service Provider with ID ${serviceProviderId} does not exist`
      });
    }

    const profileExists = await this.profileRepository.findById(profileId);

    if (!profileExists) {
      return this.exceptionsAdapter.notFound({
        message: "Not found profile with this id"
      });
    }

    let employeeAvatarUrl = undefined;

    if (employeeAvatar) {
      employeeAvatarUrl = await this.uploadFileUseCase.upload(
        employeeAvatar,
        StorageFolderPaths.AVATAR
      );

      if (!employeeAvatarUrl) {
        return this.exceptionsAdapter.internalServerError({
          message: "Error to upload employee avatar"
        });
      }
    }

    const encryptedPassword =
      await this.cryptographyAdapter.generateHash(password);

    await this.employeeRepository.createEmployee({
      ...params,
      avatar: employeeAvatarUrl,
      role: RoleValue.EMPLOYEE,
      profileId,
      password: encryptedPassword
    });
  }
}

import { DeepPartial } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { iRepoUser, iUser, iUserReturn } from "../../interfaces/user.interface";
import { returnUserSchemaComplete } from "../../schemas/user.schema";


const createUserService = async (userData: iUser): Promise<iUserReturn> => {
  const repoUser: iRepoUser = AppDataSource.getRepository(User);

  const existingUser = await repoUser.findOne({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email já existe", 409);
  }

  const user: User = repoUser.create(userData as DeepPartial<User>);

  await repoUser.save(user);

  const newUser = returnUserSchemaComplete.parse(user);


  return newUser;
};

export default createUserService;

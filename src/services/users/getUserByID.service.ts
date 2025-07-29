import { AppDataSource } from "../../data-source"
import { User } from "../../entities/user.entity"

const getUserByIDService = async (userID: string): Promise<User | null> => {
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOne({
        where: {id: userID}
    })
    return user
}

export default getUserByIDService
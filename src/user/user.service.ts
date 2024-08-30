import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { hash } from 'argon2'
import { AuthDto } from '../auth/dto/auth.dto'
import { truncate } from 'fs-extra'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				// По чему искать. В данном случае по ID
				id
			},
			include: {
				// Что дополнительно отдать.
				stores: true, // В данном случае отдается информация о:
				favorites: true, // 1. Магазинах, 2. Избранных товарах, 3. Заказах
				orders: true
			}
		})

		return user
	}

	async toggleFavorite(productId: string, userId: string) {
		const user = await this.getById(userId)

		const isExists = user.favorites.some(
			product => product.id === productId
		)

		await this.prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					favorites: {
						[isExists ? 'disconnect' : 'connect']: {
							id: productId
						}
					}
				}
			}
		)
		return true
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				stores: true,
				favorites: true,
				orders: true
			}
		})

		return user
	}

	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				name: dto.name,
				email: dto.email,
				password: await hash(dto.password)
			}
		})
	}
}
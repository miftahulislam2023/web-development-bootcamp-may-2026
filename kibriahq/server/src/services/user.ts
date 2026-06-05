import type { UserType } from '../types/user.js';
import { prisma } from "../lib/prisma.js";

export const findAllUsers = async (): Promise<UserType[] | null> => {
	const users = await prisma.user.findMany();
	return users as UserType[];
};

export const findUserById = async (id: number): Promise<UserType | null> => {
	const user = await prisma.user.findUnique({
		where: { id },
	});
	return user as UserType;
};

export const findUserByEmail = async (email: string): Promise<UserType | null> => {
	const user = await prisma.user.findUnique({
		where: { email },
	});
	return user as UserType;
};

export const findByProperty = async (property: string, value: string): Promise<UserType | null> => {
	const user = await prisma.user.findFirst({
		where: { [property]: value } as any,
	});
	return user as UserType;
};

export const createUser = async (data: UserType): Promise<UserType> => {
	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			password: data.password,
			role: data.role,
			color: data.color,
		},
	});

	return user as UserType;
};

export const updateUser = async (id: number, data: Partial<UserType>): Promise<UserType | null> => {
	const user = await prisma.user.update({
		where: { id },
		data: data,
	});
	return user as UserType;
};

export const deleteUser = async (id: number): Promise<UserType | null> => {
	const user = await prisma.user.delete({
		where: { id },
	});
	return user as UserType;
};
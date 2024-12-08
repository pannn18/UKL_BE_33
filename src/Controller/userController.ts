import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { PrismaClient, UserRole } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient({errorFormat: "minimal"})

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {username, email, password,} = req.body

        
        const findEmail = await prisma.user.findFirst({
            where: { email }
        })
        
        if(findEmail) {
            res.status(400).json({
                message: `email sudah terpakai`
            })
            return
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: `USER`
            }
        })

        res.status(200).json({
            message: `User berhasil dibuat`,
            data: newUser
        })
        
        return

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const readUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    OR: [{
                            username: { contains: search },
                        },
                        {
                            email: { contains: search },
                        }],
                    }
                : undefined, // Jika tidak ada `search`, tidak ada kondisi `where`
        });

        res.status(200).json({
            message: `Pengguna telah diambil`,
            data: allData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findUserId = await prisma.user.findFirst({where: {id: Number(id)}})

        if(!findUserId) {
            res.status(404).json({
                message: "User tidak ditemukan"
            })
        }

        const { username, email, password, user_role } = req.body

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                username: username ?? findUserId?.username,
                email: email ?? findUserId?.email,
                password: password ? await bcrypt.hash(password, 12) : findUserId?.password,
            },
        })
        if(!updatedUser) {
            res.status(404).json({
                message: "User tidak ditemukan"
            })
        }
        res.status(200).json({
            message: "User diperbarui",
            data: updatedUser
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id
        const findUser = await prisma.user.findFirst({where: {id: Number(id)}})
        if(!findUser) {
            res.status(404).json({
                message: "User tidak ditemukan"
            })
        }

        await prisma.user.delete({where: {id: Number(id)}})
        res.status(200).json({
            message: "User dihapus"
        })
        
    } catch (error) {
        res.status(500).json(error)
    }
}

/** function for login(authentication) */ 
const authentication = async(req: Request, res: Response): Promise<void> => {
    try {
        const {username, password} = req.body
        
        /**check existing email*/
        const findUser = await prisma.user.findUnique({ where: {username} })
        if(!findUser){
            res.status(200).json({
                message: "username tidak terdaftar"
            })
            return
        }

        const isMatchPassword = await bcrypt.compare(password, findUser?.password)
        if(!isMatchPassword){
            res.status(200).json({
                message: "password salah"
            })
            return
        }

        /** prepare to generate token using JWT */
        const payload = {
            id: findUser?.id,
            username: findUser?.username,
            email: findUser?.email,
            UserRole: findUser?.role
        }
        const signature = process.env.SECRET || ``

        const token = jwt.sign(payload, signature)
        
        res.status(200).json({
            status: "success",
            message: `Login berhasil`,
            token,
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
export { createUser, readUser, updateUser, deleteUser, authentication }
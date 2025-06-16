
import { Request, Response, NextFunction } from "express"
import { getUserPermissions, verifyToken } from "../utils/userUtils"
import User from '../models/userModels'


export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const decoded = verifyToken(token)
        const user = await User.findById(decoded.userId)

        if (!user) {
            res.status(401).json({ message: 'User not found' })
            return
        }

        req.user = user
        req.userId = user._id.toString()

        next()

    } catch (error) {
        res.status(401).json({
            message: 'Invalid token', error: (error as Error).message
        })

        return
    }
}


export const roleBasedAccess = (
    requiredRoles: string[] = []) => {
    return async (
        req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized: User not found' })
                return
            }
            const userPermissions = await getUserPermissions(req.user)
            const hasAccess = requiredRoles.some((role) =>
                userPermissions.includes(role))

            if (!hasAccess) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
                return
            }

            next()
        } catch (error) {
            res.status(401).json({ message: 'Invalid permissions', error: (error as Error).message })
        }
    }
}



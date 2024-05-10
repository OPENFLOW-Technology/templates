import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Notification } from '../entity/notification';
import {sendBadRequest,sendNotFound,sendSuccess} from '../utils/response..util'
import { get_user_by_token } from '../routes/auth.router';
import WebSocketManager from '../websockets/manager';

class NotificationController {

    static async createNotification(user, title, description, link, state) {
        const notificationRepository = getRepository(Notification);
        const newNotification = notificationRepository.create({
            title,
            description, 
            link,
            state,
            seen: false,
            user
        });

        const savedNotification = await notificationRepository.save(newNotification);

        WebSocketManager.sendMessageToUser(user.uid, {
            type: "notifications",
            data: [{
                title, description, link, state
            }]
        })

        return savedNotification;
    }

    // Get all notifications
    static async getUnseen(userId: string) {
        const notificationRepository = getRepository(Notification);

        return await notificationRepository.createQueryBuilder('notification')
            .where('notification.user.uid = :uid', {uid: userId})
            .where('notification.seen = false')
            //.skip(offset)
            //.take(limit)
            .getMany()
            // add pagination
    }
    // Get all notifications
    async getAll(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const user = await get_user_by_token(authHeader);
        const notificationRepository = getRepository(Notification);

        try {
            const notifications = await notificationRepository.createQueryBuilder('notification')
                .where('notification.user.uid = :uid', {uid: user.user.uid})
                //.skip(offset)
                //.take(limit)
                .getManyAndCount()
                // add pagination

            return sendSuccess(res, 'Notifications fetched', notifications);
        } catch (error) {
            console.log(error);
            return sendBadRequest(res, 'Failed to fetch notifications');
        }
    }

    // Get all notifications
    async seeAll(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const user = await get_user_by_token(authHeader);

        try {
            const notificationRepository = getRepository(Notification);

            await notificationRepository
                .createQueryBuilder('notification')
                .innerJoin("notification.user", 'user')
                .update(Notification)
                .set({ seen: true })
                .where('user.uid = :userId', { userId: user.user.uid })
                .execute();
            return sendSuccess(res, "All notifications seen.")
        } catch (error) {
            console.log(error);
            return sendBadRequest(res, 'Failed to fetch notifications');
        }
    }

    /*
    // Get notification by ID
    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const notificationRepository = getRepository(Notification);

        try {
            const notification = await notificationRepository.findOne(id);

            if (!notification) {
                return sendNotFound(res, 'Notification not found');
            }

            return sendSuccess(res, 'Notification fetched', notification);
        } catch (error) {
            return sendBadRequest(res, 'Error while fetching notification');
        }
    }*/

    // Create a new notification
    async create(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const user = await get_user_by_token(authHeader);

        const { title, description, link, state } = req.body;

        try {
            return sendSuccess(res, 'Notification created', NotificationController.createNotification(
                user, title, description, link, state
            ));
        } catch (error) {
            return sendBadRequest(res, 'Failed to create a notification');
        }
    }
}

export default NotificationController;
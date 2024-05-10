import WebSocket from 'ws';
import NotificationController from '../controller/NotificationController';

interface WebSocketCollection {
    [userId: string]: Set<WebSocket>;
}

class WebSocketManager {
    private static connections: WebSocketCollection = {};

    static async addConnection(userId: string, connection: WebSocket) {
        if (!WebSocketManager.connections[userId]) {
        WebSocketManager.connections[userId] = new Set();
        }
        WebSocketManager.connections[userId].add(connection);

        // Send all new notifications when websocket connnects
        try {
            var newNotifications = await NotificationController.getUnseen(userId);
            connection.send(JSON.stringify({
                type: "notifications",
                data: newNotifications.map(n => ({
                    title: n.title,
                    description: n.description,
                    link: n.link,
                    state: n.state,
                    time: n.createdAt,
                    seen: n.seen
                }))
            }))
        } catch(e) {}
    }

    static removeConnection(userId: string, connection: WebSocket) {
        const connections = WebSocketManager.connections[userId];
        if (connections) {
            connections.delete(connection);
            if (connections.size === 0) {
                delete WebSocketManager.connections[userId];
            }
        }
    }

    static getConnections(userId: string): Set<WebSocket> | undefined {
        return WebSocketManager.connections[userId];
    }

    static sendMessageToUser(userId: string, message: object) {
        const connections = WebSocketManager.getConnections(userId)
        if (connections) {
            connections.forEach(conn => {
                conn.send(JSON.stringify(message))
            })
        }
    }
}

export default WebSocketManager;
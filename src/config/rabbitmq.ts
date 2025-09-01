import * as ampqlib from 'amqplib';
import { env } from "../env";
import { Logger } from '../lib/logger';


const logger = new Logger();
export async function rabbitMQConnection(){
    const context = 'RabbitMQConnection'; 
    
    try{
        const connection = await ampqlib.connect(env.RABBITMQ_URL)
        logger.info("✅  Connected to RabbitMQ", context);
        return connection;

    }catch(error){
        logger.error(`❌  Error connecting to RabbitMQ >> ${error}`);
    }
}

export async function rabbitMQChannel(){
    try {
        const connection = await rabbitMQConnection();
        const context = 'RabbitMQChannel';
        logger.info("✅  Connected to RabbitMQ Channel", context);
        if(connection){
            return connection.createChannel();
        }
        throw ("Rabbit connection failed");
    } catch(error) {
        logger.error(`❌  Error connecting to RabbitMQ Channel >> ${error}`);
    }
}

export const MAX_UNPROCESSED_QUEUE = 300;
export const rabbitMQConfig = {
  url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`,
  queues: {
    TAX_CALCULATION: 'tax_calculation_queue',
    PERMIT_APPROVAL: 'permit_approval_queue',
  },
};

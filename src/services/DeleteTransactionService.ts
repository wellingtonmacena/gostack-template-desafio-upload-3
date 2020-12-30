 import AppError from '../errors/AppError';
 import {getRepository} from 'typeorm'
 import Transaction from '../models/Transaction'

class DeleteTransactionService {
  public async execute(id : string): Promise<void> {
    let transactionsRepository = getRepository(Transaction);

    let transaction = await transactionsRepository.findOne(id)
    if(!transaction)
      throw new AppError("This transaction does not exists!")

    await transactionsRepository.remove(transaction)

    return;
  }
}

export default DeleteTransactionService;

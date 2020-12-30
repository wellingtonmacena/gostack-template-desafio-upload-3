// import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category'
import {getCustomRepository, getRepository} from 'typeorm'
import AppError from '../errors/AppError';

interface Itransaction {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string

}


class CreateTransactionService {
  public async execute({ title, value, type, category }: Itransaction): Promise<Transaction> {
    let categoryRepository = getRepository(Category)
    let transactionsRepository = getCustomRepository(TransactionsRepository)
   
    const {total} = await new TransactionsRepository().getBalance();

    if(type != 'outcome' && type != 'income')
    throw new AppError("type operation is not valid")

    if(type === 'outcome' && total < value){
      throw new AppError("You do not have enough balance")
    }

    let transactionCategory = await categoryRepository.findOne({
      where:{
        title : category
      }
    })

    if(!transactionCategory){
      transactionCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(transactionCategory);
    }


    let transaction = transactionsRepository.create({
      title,
      value,
      type,
      category : transactionCategory
    })

    await transactionsRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;

import { EntityRepository, Repository,getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    let transactionsRepository = getCustomRepository(TransactionsRepository)
    let transactions = await transactionsRepository.find();

    let balance: Balance = {
      total: 0,
      income: 0,
      outcome: 0
    };

    transactions.map(item => {

      if(item.type === "income")
        balance.income += Number(item.value)
      else if (item.type === "outcome")
        balance.outcome += Number(item.value)

      balance.total = balance.income - balance.outcome;

    });


    return balance;
  }
}

export default TransactionsRepository;

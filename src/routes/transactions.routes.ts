import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import configFile from '../config/config'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(configFile)

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  let transactionsRepository = getCustomRepository(TransactionsRepository);
  let transactions = await transactionsRepository.find();

  let balance = await new TransactionsRepository().getBalance();

  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  let { title, value, type, category } = request.body;

  let createTransaction = new CreateTransactionService();

  let transaction = await createTransaction.execute({
    title, value, type, category
  })

  response.status(200).json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  let deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(request.params.id)

  return response.status(204).send();

});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService();
  let transactions = await importTransactions.execute(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;

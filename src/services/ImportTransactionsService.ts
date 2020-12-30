import { getCustomRepository, getRepository, In, Not } from 'typeorm'

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import csvParse from 'csv-parse'
import fs from 'fs'

interface CSVTransaction {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string
}


class ImportTransactionsService {
  async execute(path: string) {
    let transactionsRepository = getCustomRepository(TransactionsRepository)
    let categoryRepository = getRepository(Category)
    let categories: string[] = [];
    let transactions: CSVTransaction[] = [];
    let contactsFileStream = fs.createReadStream(path);

    let parsers = csvParse({
      from_line: 2,
    })

    let parseCSV = contactsFileStream.pipe(parsers);

    parseCSV.on('data', async line => {
      let [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      )


      if (!title || !type || !value) return
      categories.push(category)
      transactions.push({ title, type, value, category })


    })

    await new Promise(resolve => parseCSV.on('end', resolve))
    const existentCategories = await categoryRepository.find({
      where: {
        title: In(categories)
      }
    }
    )

    let existentCategoriesTitles: string[] = 
    existentCategories.map(item => item.title)

   const addCategoriesTitles = categories.filter(
     category => !existentCategoriesTitles.includes(category)
   )
   .filter((value, index, self) => self.indexOf(value) === index)
    console.log(addCategoriesTitles);
    
    const newCategories = categoryRepository.create(
      addCategoriesTitles.map(title=>({
        title
      }))
    )

    await categoryRepository.save(newCategories);


    let finalCategories = [...newCategories, ...existentCategories]

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          categories => categories.title === transaction.category
        )
      }))
    )

    await transactionsRepository.save(createdTransactions)
  }
}

export default ImportTransactionsService;

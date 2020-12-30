import {Entity, Column, CreateDateColumn, UpdateDateColumn,
   PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'

import Category from './Category'


@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal')
  value: Number;

  @ManyToOne(()=>Category)
  @JoinColumn({name : 'category_id'})
  category : Category;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {

  }
}

export default Transaction;

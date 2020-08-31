import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ResultDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balances: Balance;

  private resultado: ResultDTO;

  constructor() {
    this.transactions = [];
    this.balances = { income: 0, outcome: 0, total: 0 };
    this.resultado = {
      transactions: this.transactions,
      balance: this.balances,
    };
  }

  public all(): ResultDTO {
    this.resultado.balance = this.getBalance();
    this.resultado.transactions = this.transactions;

    return this.resultado;
  }

  public getBalance(): Balance {
    return this.balances;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    if (type === 'outcome') {
      if (this.balances.total === 0 || this.balances.total - value < 0) {
        throw new Error('saldo insuficiente');
      }
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    if (type === 'income') {
      this.balances.income += value;
      this.balances.total += value;
    } else {
      this.balances.outcome += value;
      this.balances.total -= value;
    }

    return transaction;
  }
}

export default TransactionsRepository;

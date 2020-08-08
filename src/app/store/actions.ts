export class LoadLatestFunds {
  static readonly type = '[Funds] LoadLatestFund';
}

export class LoadFundsForDate {
  static readonly type = '[Funds] LoadFundsForDate';
  constructor(public readonly date: Date) {}
}

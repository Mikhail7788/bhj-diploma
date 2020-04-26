/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */
class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
      
    if (!element) {
      throw new Error('Элемент не существует');
    }
    this.element = element; 
    this.registerEvents();

  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
      
    const addMoney = this.element.querySelector('.create-income-button');
    const removeMoney = this.element.querySelector('.create-expense-button');

    addMoney.addEventListener('click', function() {
      const incomeWindow = App.getModal('newIncome');
      incomeWindow.open();
    });

    removeMoney.addEventListener('click', function() {
      const expenceWindow = App.getModal('newExpense');
      expenceWindow.open();
    });

  }
}

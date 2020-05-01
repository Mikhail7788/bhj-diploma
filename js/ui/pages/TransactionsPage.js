/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
      
    if (!element) {
      throw new Error('Элемент не существует');
    }
    this.element = element; 
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
      
    this.render(this.lastOptions);

  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
      
    const removeAccount = this.element.querySelector(".remove-account");

    removeAccount.addEventListener("click", () => {
      this.removeAccount();
    });

    this.element.addEventListener("click", event => {
      if (event.target.closest(".transaction__remove")) {
        let id = event.target.closest(".transaction__remove").dataset.id;
        this.removeTransaction(id);
      }
    });

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
      
    if(!this.lastOptions) {
      return
    }
    if (confirm('Вы действительно хотите удалить счёт?')) {
    this.clear();
    let id = document.querySelector('.active').dataset.id
    
    Account.remove( id, {_method: "DELETE"}, () => App.update());
    }

  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
      
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, {}, (err, response) => {
        if (response && response.success) {
          App.update();
        }
      });
    }

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
      
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, {}, (err, response) => {
        if (response && response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(options, (err, response) => {
        if (response && response.success) {
          this.renderTransactions(response.data)
        }
      });
    }

  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
      
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';

  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
      
    this.element.querySelector('.content-title').textContent = name;

  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
      
    let formDate = new Date(date);
    let months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    let month = months[formDate.getMonth()];
    let day = formDate.getDate();
    let year = formDate.getFullYear();
    let hours = formDate.getHours();
    let minutes = formDate.getMinutes();

    function format(e) {
      if (e < 10) {
        return "0" + e;
      } else {
        return e;
      }
    };
    return `${day} ${month} ${year} г. в ${format(hours)}:${format(minutes)}`;

  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
      
    const id = item.id;
    const name = item.name;
    const type = item.type;
    const sum = item.sum;
    let date = this.formatDate(item.created_at);
    let content = `<div class="transaction transaction_${type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${name}</h4>
          <div class="transaction__date">${date}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${id}">
          <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`;

    return content;

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
      
    let content = document.querySelector('.content');
    let html = '';
    for (let i=0; i < data.length; i++) {
      let item = this.getTransactionHTML(data[i]);
      html += item;
    }
    content.innerHTML = html;
  }

}

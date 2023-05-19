// імпорт реакту і компоненту реакту
import React, { Component } from 'react';

// імпорт стилізованих компонентів для App
import { Container } from './App.styled';

// імпорт компонентів
import ContactList from './ContactList';
import Filter from './Filter';
import ContactForm from './ContactForm';

// створення нашого компоненту-класу App
export class App extends Component {
  //наші стейти
  state = {
    contacts: [],
    filter: '',
    name: '',
    number: '',
  };

  // коли компонент замоунтився - створився
  // підтягуємо стейт з localStorage,парсимо, але перевіряємо, якщо приходить нулл
  // то в стейт контактс помістимо пустий масив
  componentDidMount() {
    let contactsFromStorage = localStorage.getItem('contacts');
    let parsedContacts = JSON.parse(contactsFromStorage);
    // console.log('parsedContacts', parsedContacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  // коли компонент оновився, перевіряємо умову оновлення стейт
  // і після цього записуємо нове значення в localStorage
  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  // метод, який видаляє наш контакт із стейту
  // в властивості contacts, що є масивом обʼєктів
  // отримавши айді елемента
  deleteContact = index => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(element => element.id !== index),
      };
    });
  };

  // метод, який додає новий контакт в стейт
  //в властивість contacts, що є масивом обʼєктів
  // отримавши обʼєкт нового контакту
  // робить зпрть гп функцію зодо повтору імені
  // якщо є збіг - показуєтсья повідомлення
  // якщо збігу немає, то додається новий контакт
  addContact = newContact => {
    if (this.checkNewNameRepeate(newContact.name)) {
      alert(`${newContact.name} is already in contacts!`);
    } else {
      this.setState(prevState => {
        return {
          contacts: [...prevState.contacts, newContact],
        };
      });
    }
  };

  //перевірка чи є контакт з таким іменем з врахуванням різних регістрів
  // повертає true або false
  checkNewNameRepeate = newName => {
    let arrayOfNamesInStateInLowerCase = this.state.contacts.map(item =>
      item.name.toLocaleLowerCase()
    );
    return arrayOfNamesInStateInLowerCase.includes(newName.toLocaleLowerCase());
  };

  // ф-ія обробник зміни в інфуті фільтра
  //перезаписує значення filter в state
  handleChangeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  // функція яка готує масив контактів для рендеру
  //  після відфільтровки за збігом значенням state.filter
  layOutFilteredContact = () => {
    return this.state.contacts.filter(item =>
      item.name
        .toLocaleLowerCase()
        .includes(this.state.filter.toLocaleLowerCase().trim())
    );
  };

  // рендер розмітки
  render() {
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm addContact={this.addContact} />
        <h2>Contacts</h2>
        <Filter
          handleChangeFilter={this.handleChangeFilter}
          value={this.state.filter}
        />
        <ContactList
          contacts={this.layOutFilteredContact()}
          deleteContact={this.deleteContact}
        />
      </Container>
    );
  }
}

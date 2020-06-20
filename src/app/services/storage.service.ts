/// <reference types="LocalForage"/>

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



export interface CounterItem {
  name: string;
  counter: number;
  id: string;
  limit: number;

}

const COUNTER_ELEMENTS = 'my-counters';


declare var require: Function;

const localForage: LocalForage = require('localforage');
@Injectable({
  providedIn: 'root'
})
export class StorageService {



  counterStore: LocalForage;

  constructor(public http: HttpClient) {
  }

  initializeDb() {
   console.log("here");
    this.counterStore = localForage.createInstance({
      name: "antiqueCounter",
      storeName: "antiqueCounterStore",
      driver: localForage.INDEXEDDB
    });
  }



  // add to do
  addItem(item: CounterItem) {
    return this.counterStore.getItem(COUNTER_ELEMENTS).then((todos: CounterItem[]) => {
      if(todos) {
        todos.push(item);
        console.log("non else");
        return this.counterStore.setItem(COUNTER_ELEMENTS, todos);
      } else {
        console.log("else");
        return this.counterStore.setItem(COUNTER_ELEMENTS, [item])
      }
    }).catch((error) => {
        console.log(error);
    })
  }


  // read to-do items
  getItems(): Promise<CounterItem[]>  {
    return this.counterStore.getItem(COUNTER_ELEMENTS);
  }

  //update to-do item
  updateItem(item: CounterItem) {
    return this.counterStore.getItem(COUNTER_ELEMENTS).then((todos: CounterItem[]) => {
      if(!todos || todos.length === 0) {
        return null;
      }
      let newTodos: CounterItem[] = [];
      // iterate the array of todos and push the same elements except for the one that we want to update
      for(let i of todos) {
        if(i.id === item.id) {
          newTodos.push(item);
        } else {
          newTodos.push(i);
        }
      }
      return this.counterStore.setItem(COUNTER_ELEMENTS, newTodos);
    })
  } 
  
 

  //delete to-do item
  deleteItem(id: string) {
    return this.counterStore.getItem(COUNTER_ELEMENTS).then((todos: CounterItem[]) => {
      if(!todos || todos.length === 0) {
        return null;
      }
      let toKeep: CounterItem[] = [];
      for (let i of todos) {
        if(i.id != id) {
          toKeep.push(i);
        }
      }
      return this.counterStore.setItem(COUNTER_ELEMENTS, toKeep);
    });
  }
 
}

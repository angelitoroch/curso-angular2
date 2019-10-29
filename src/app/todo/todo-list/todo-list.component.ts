import { Component, OnInit } from "@angular/core";
//Servicio de Ngbootstrap, por que se usara desde varios componentes
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TodoFormComponent } from "../todo-form/todo-form.component";
import { TodoService } from "../services/todo.service";
import { TodoViewModel } from "../models/todo-view-model";
import { doesNotThrow } from "assert";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"]
})
export class TodoListComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    //Se usa un servicio para obtener los datos de firebase
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  //Variable donde se guardaran todos los datos que nos arroje firebase al consultar
  todos: TodoViewModel[] = [];
  loadTodos() {
    this.todoService.getTodos().subscribe(response => {
      this.todos = [];
      //Por cada documento se le extran extrayendo la data,id
      response.docs.forEach(value => {
        const data = value.data();
        const id = value.id;
        //representamos lo que queremos mostrar al usuario
        const todo: TodoViewModel = {
          id: id,
          title: data.title,
          description: data.description,
          done: data.done,
          lastModifiedDate: data.lastModifiedDate.toDate()
        };
        //Empujar modelo a arreglo de todo
        this.todos.push(todo);
      });
    });
  }

  clickAddTodo() {
    //estamos usando el modalService para abrir el TodoFormComponent que vamos a crear
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    );
  }

  //Cuando el modal se cierra se ejecutara este codigo
  handleModalTodoFormClose(response) {
    //is response an object?
    if(response === Object(response)){
      if(response.createMode){
        response.todo.id = response.id;
        this.todos.unshift(response.todo);
      }else{
        let index = this.todos.findIndex(value => value.id == response.id);
        this.todos[index] = response.todo;
      }
    }
  }

  checkedDone(index: number) {
    const newDoneValue = !this.todos[index].done;
    this.todos[index].done = newDoneValue;
    const obj = { done: newDoneValue };
    const id = this.todos[index].id;
    //EditTotoPartial es un metodo del servicio de firebase
    this.todoService.editTodoPartial(id, obj);
  }

  handleEditClick(todo: TodoViewModel){
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
    //Se cambian los valores de los campos del componente que se abrira
    modal.componentInstance.createMode = false;
    modal.componentInstance.todo = todo;
  }

  handleDeleteClick(todoId: string, index: number){
    this.todoService.deleteTodo(todoId)
    .then(() => {
      this.todos.splice(index,1);
    }).catch(err => console.log(err));
}
}

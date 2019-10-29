import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TodoService } from "../services/todo.service";
import { Todo } from "../models/todo";
import { DocumentReference } from "@angular/fire/firestore";
import { TodoViewModel } from "../models/todo-view-model";

@Component({
  selector: "app-todo-form",
  templateUrl: "./todo-form.component.html",
  styleUrls: ["./todo-form.component.css"]
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;

  //Variables para la edicion de datos en el formulario
  createMode: boolean = true;
  todo: TodoViewModel;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    //Inyectamos el servicio para firebase
    private todoService: TodoService
  ) {}

  ngOnInit() {
    //Utilizamos el formBuilder para crear un formGroup y el formGroup tendra un objeto de tres propiedades
    //los cuales coinciden con los campos que pusimos en el html
    this.todoForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      done: false
    });

    //Si estamos editando
    if (!this.createMode) {
      this.loadTodo(this.todo);
    }
  }

  loadTodo(todo) {
    //Con patchValue podemos editar los valores de un formulario con un objeto que tengamos
    this.todoForm.patchValue(todo);
  }

  saveTodo() {
    //Validar el formulario
    if (this.todoForm.invalid) {
      //si es invalido detenemos la operacion de la funcion
      return;
    }

    //Crear un nuevo todo
    if (this.createMode) {
      let todo: Todo = this.todoForm.value;
      todo.lastModifiedDate = new Date();
      todo.createdDate = new Date();
      this.todoService
        .saveTodo(todo)
        .then(response => this.handleSuccessfulSaveTodo(response, todo))
        .catch(err => console.log(err));
    } else {
      //Editar todo
      let todo: TodoViewModel = this.todoForm.value;
      todo.id = this.todo.id;
      todo.lastModifiedDate = new Date();
      this.todoService
        .editTodo(todo)
        .then(() => this.handleSuccessFulEditTodo(todo))
        .catch(err => console.log(err));
    }

    //enviar informacion a firebase
    /*
    let todo: Todo = this.todoForm.value;
    todo.lastModifiedDate = new Date();
    todo.createdDate = new Date();
    this.todoService
      .saveTodo(todo)
      .then(response => this.handleSuccessfulSaveTodo(response, todo))
      .catch(err => console.error(err));
    */
  }

  //Pasamos la informacion a traves del dismis para retornar la informacion al todo.list.component
  handleSuccessFulEditTodo( todo: TodoViewModel) {
    this.activeModal.dismiss({
      todo: todo,
      id: todo.id,
      createMode: false
    });
  }

  handleSuccessfulSaveTodo(response: DocumentReference, todo: Todo) {
    //Enviar la informacion al todo
    this.activeModal.dismiss({ todo: todo, id: response.id, createMode: true });
  }
}

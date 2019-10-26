import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TodoService } from "../services/todo.service";
import { Todo } from "../models/todo";
import { DocumentReference } from "@angular/fire/firestore";

@Component({
  selector: "app-todo-form",
  templateUrl: "./todo-form.component.html",
  styleUrls: ["./todo-form.component.css"]
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
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
  }

  saveTodo() {
    //Validar el formulario
    if (this.todoForm.invalid) {
      //si es invalido detenemos la operacion de la funcion
      return;
    }
    //enviar informacion a firebase
    let todo: Todo = this.todoForm.value;
    todo.lastModifiedDate = new Date();
    todo.createdDate = new Date();
    this.todoService
      .saveTodo(todo)
      .then(response => this.handleSuccessfulSaveTodo(response, todo))
      .catch(err => console.error(err));
  }

  handleSuccessfulSaveTodo(response: DocumentReference, todo: Todo) {
    //Enviar la informacion al todo
    this.activeModal.dismiss({ todo: todo, id: response.id, createMode: true });
  }
}

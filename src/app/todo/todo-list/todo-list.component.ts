import { Component, OnInit } from "@angular/core";
//Servicio de Ngbootstrap, por que se usara desde varios componentes
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.css"]
})
export class TodoListComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  clickAddTodo() {
    //estamos usando el modalService para abrir el TodoFormComponent que vamos a crear
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
  }

  handleModalTodoFormClose()
  {
    
  }
}

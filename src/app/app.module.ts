import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

//Import de firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";

//Frameworks
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { TodoListComponent } from './todo/todo-list/todo-list.component';
import { TodoFormComponent } from './todo/todo-form/todo-form.component';

@NgModule({
  declarations: [AppComponent, TodoListComponent, TodoFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Importar el modulo de firebase, en donde se le pasa la configuracion de las credenciales
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    //Es el modulo del componente de bootstrap y se pone para poder usarlo
    NgbModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  //Este componente se va a crear de manera dinamica y se tiene que avisar a angular de esto
  entryComponents: [TodoFormComponent]
})
export class AppModule {}

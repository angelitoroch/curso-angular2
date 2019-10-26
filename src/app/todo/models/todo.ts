export interface Todo {
  //Campos que vamos a guardar en el documento de firebase
  title: string;
  description: string;
  done: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}

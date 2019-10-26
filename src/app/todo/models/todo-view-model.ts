export interface TodoViewModel {
  //Modelo para representar la data de una tarea
  id: string;
  title: string;
  description: string;
  done: boolean;
  lastModifiedDate: Date;
}


import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource,MatTable } from '@angular/material/table';

import {MatTableModule} from '@angular/material/table';;

import { MatSort } from '@angular/material/sort';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



import { peticiones_service } from './servicios';

export interface Personas {
  id:string;
  nombre:string;
  edad:string;
  sexo:string;
  documento:string;
}

let listaPersonas: Personas[];
var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styles: []
})
export class PersonasComponent implements OnInit {
  dataSource = new MatTableDataSource<Personas>(listaPersonas);
  displayedColumns: string[] = ['acciones','nombre','edad','sexo','documento'];
  display = 'none';
  newPersona : Personas = {id:"",nombre:"",edad:"",sexo:"",documento:""};
  editPersona = false;
  constructor(private objpeticiones_service: peticiones_service) { }
    @ViewChild(MatSort, {static: true}) sort!: MatSort;
  ngOnInit(): void {
    if( localStorage.getItem('listPersonas') === null){
      this.getList();
    }else{
      this.dataSource = new MatTableDataSource<Personas>( JSON.parse(localStorage.getItem('listPersonas') || '[]') );
      this.dataSource.sort = this.sort;
    }
  }
  ClearStorage(){
    localStorage.clear();
    this.getList();
  }
  getList(){
    this.objpeticiones_service.getListPersonas().subscribe((data)=>{
      this.dataSource = new MatTableDataSource<Personas>(data.results[0]);
      this.dataSource.sort = this.sort;
      localStorage.setItem('listPersonas', JSON.stringify(data.results[0]));
    });
  }
  closeModal() {
    this.display = 'none';
  }
  edit(row_obj:any){
    this.editPersona = true;
    this.newPersona = row_obj || {id:"",nombre:"",edad:"",sexo:"",documento:""};
    this.display = 'block';
  }
  viewPop(){
    this.editPersona = false;
    this.display = 'block';
  }//Endfuncion
  saveNewPersona(){
    let data = this.dataSource.data;
    if(this.editPersona){
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
         if(value.id == this.newPersona.id){
           value.nombre = this.newPersona.nombre;
         }
         return true;
       });
    }else{
      this.newPersona.id = ID();
      data.push(this.newPersona);
      this.dataSource.data = data;
    }
    localStorage.setItem('listPersonas', JSON.stringify(this.dataSource.data));
    this.display = 'none';
  }
  onFileSelected(event: any):void {
     var selectedFile = event.target.files[0];
     this.newPersona.documento =  selectedFile.name;
    }
  remove(row_obj:any){

    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
     return value.id != row_obj.id;
    });
    localStorage.setItem('listPersonas', JSON.stringify(this.dataSource.data));
  }
}

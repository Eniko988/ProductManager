import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
 
  qualityList = ["first","second"];
  productForm!: FormGroup;
  actionBtn:string = "Save"
  editData = inject(MAT_DIALOG_DATA);

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
  ){}
   
    //@Inject(MAT_DIALOG_DATA) public editData: any){}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['',Validators.required],
      category: ['',Validators.required],
      quality: ['',Validators.required],
      price: ['',Validators.required],
      date: ['',Validators.required]
    });

    // adott sor adata betöltődik a formba.
    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['quality'].setValue(this.editData.quality);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

    //console.log(this.editData);//az adott sor adatát adja meg az edit gombra kattintva
  }

  addProduct(){
  //console.log(this.productForm.value); devtools/consolba kiírja a formba beírt értékeket
   if(!this.editData){
     if(this.productForm.value){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next:(response)=>{ //bekerül az adat a db.json-ba
          console.log('res',response)
          alert("Product added!")
          this.productForm.reset();
          this.dialogRef.close('save');
      },
      error:()=>{
        alert("Error while adding the product!")
      }
    })
  }
   }else{
    this.updateProduct();
   }
}

updateProduct(){
  this.api.putProduct(this.productForm.value,this.editData.id)
  .subscribe({
    next:(res) =>{
      alert("Product updated sussessfully");
      this.productForm.reset();
      this.dialogRef.close('update');
  },
    error: ()=>{
      alert("error while recording value")
    }
  })
}
}
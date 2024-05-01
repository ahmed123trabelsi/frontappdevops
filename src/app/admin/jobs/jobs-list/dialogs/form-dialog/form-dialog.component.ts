import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { JobsListService } from '../../jobs-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { JobsList, Skill } from '../../jobs-list.model';
import { CommonModule, formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipGrid, MatChipInput, MatChipInputEvent, MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';

import { JobsListComponent } from '../../jobs-list.component';

export interface DialogData {
  id: number;
  action: string;
  jobsList: JobsList;
}

@Component({
    selector: 'app-form-dialog:not(f)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
    
    
    imports: [
      MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
      //  JobsListComponent,
        MatIconModule,
       
        MatChipGrid,
        CommonModule,
        MatChipInput,
       
       
    ],
})
export class FormDialogComponent {
  // predefinedSkills: string[] = ['HTML', 'CSS', 'JavaScript', 'Angular', 'React', 'Node.js','Java',
  // 'Python',
  // 'JavaScript',
  // 'C#',
  // 'C++',
  // 'Ruby',
  // 'Swift',
  // 'Kotlin'];
  predefinedSkills:Skill[]=[];
  skills: Skill[] = [];
 
  separatorKeysCodes: number[] = [ENTER, COMMA];
  enteredSkills: string[] = [];
  chipList: any;
  action: string;
  dialogTitle!: string;
  jobsListForm: UntypedFormGroup;
  jobsList!: JobsList;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public jobsListService: JobsListService,
    private fb: UntypedFormBuilder,
    // public JobsListComponent: JobsListComponent
    
  ) {
    // this.sortPredefinedSkills();
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.jobsList.title;
      this.jobsList = data.jobsList;
    } else if (this.action === 'add'){
      // this.dialogTitle = 'New JobsList';
      // const blankObject = {} as JobsList;
      // this.jobsList = new JobsList(blankObject);
      // this.jobsList = Object.assign(new JobsList(), blankObject);
      this.dialogTitle = 'New JobsList';
    this.jobsList = new JobsList();
    }
    this.jobsListForm = this.createContactForm();
  }
  ngOnInit(): void {
    this.loadSkills();
    this.jobsListForm = this.fb.group({
      // title: ['', Validators.required],
      // description: ['', Validators.required],
      // location: ['', Validators.required],
      // contractType: ['', Validators.required],
      // salary: ['', Validators.required],
      // applicationDeadline: ['', Validators.required],
      // status: ['', Validators.required],
      // publicationDate: ['', Validators.required],
      // requiredSkills: [[], Validators.required], // Définissez un tableau vide pour les compétences requises
      // recruitingManager: ['', Validators.required]
      id: [this.jobsList._id], // Assurez-vous que l'ID est initialisé correctement
      title: [this.jobsList.title, Validators.required],
      description: [this.jobsList.description, Validators.required],
      location: [this.jobsList.location, Validators.required],
      contractType: [this.jobsList.contractType, Validators.required],
      salary: [this.jobsList.salary, Validators.required],
      applicationDeadline: [this.jobsList.applicationDeadline, Validators.required],
      status: [this.jobsList.status, Validators.required],
      publicationDate: [this.jobsList.publicationDate, Validators.required],
      requiredSkills: [this.jobsList.requiredSkills, Validators.required],
      recruitingManager: [this.jobsList.recruitingManager, Validators.required]
    });
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.status,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('status')
      ? 'Not a valid status'
      : '';
  }
  loadSkills(): void {
    this.jobsListService.getSkills()
      .subscribe((skills: Skill[]) => {
        this.predefinedSkills = skills;
      }, (error) => {
     
        // Gérer l'erreur ici
      });
  }
  onSkillInput(event: any) {
  const value = event?.target?.value;
  // Vérifier si value est défini et non vide avant de l'ajouter
  if (value && value.trim() !== '' && !this.enteredSkills.includes(value)) {
    this.enteredSkills.push(value.trim());
  }
}

  
// sortPredefinedSkills() {
//   this.predefinedSkills.sort((a, b) => a.localeCompare(b));
// }

  
  

  removeSkill(skill: string) {
    // Supprimer une compétence du tableau enteredSkills lorsque l'utilisateur retire un tag
    const index = this.enteredSkills.indexOf(skill);
    if (index >= 0) {
      this.enteredSkills.splice(index, 1);
    }
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.jobsList._id],
      Title: [this.jobsList.title],
      requiredSkills: [this.jobsList.requiredSkills],
      applicationDeadline: [
        this.jobsList.applicationDeadline ? formatDate(this.jobsList.applicationDeadline, 'yyyy-MM-dd', 'en') : null,
        [Validators.required],
      ],
      Location: [this.jobsList.location],
      contractType: [this.jobsList.contractType],
      salary: [this.jobsList.salary],
      publicationDate: [
        this.jobsList.publicationDate ? formatDate(this.jobsList.publicationDate, 'yyyy-MM-dd', 'en') : null,
        [Validators.required],
      ],
     
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // public confirmAdd(): void {
  //   // this.jobsListService.addJobsList(this.jobsListForm.getRawValue());
  //   if (this.jobsListForm.valid) { // Vérifiez si le formulaire est valide
  //     const formData = this.jobsListForm.value; // Obtenez les données du formulaire
  
  //     // Créez une nouvelle instance de JobsList avec les données du formulaire
  //     const newJobsList: JobsList = {
  //       _id: formData.id,
  //       title: formData.title,
  //       description: formData.description, // Assurez-vous que la description est incluse dans le formulaire
  //       requiredSkills: formData.requiredSkills,
  //       location: formData.location,
  //       contractType: formData.contractType,
  //       salary: formData.salary,
  //       applicationDeadline: formData.applicationDeadline,
  //       status: formData.status,
  //       publicationDate: formData.publicationDate,
  //       recruitingManager: formData.recruitingManager,
  //       applicants: formData.applicants

  //     };
  
  //     // Appelez la méthode addJobsList du service pour ajouter le nouveau job
  //     this.jobsListService.addJob(newJobsList).subscribe(
  //       (response) => {
  //         // Gérer la réponse du service si nécessaire
  //         console.log('New job added successfully:', response);
  //         alert('Job added successfully!');
  //         this.dialogRef.close(); // Fermez le dialogue après l'ajout réussi
  //       },
  //       (error) => {
  //         // Gérer les erreurs s'il y en a lors de l'ajout
  //         console.error('Error adding new job:', error);
  //         // Vous pouvez également afficher un message d'erreur à l'utilisateur si nécessaire
  //       }
  //     );
  //   } else {
  //     // Affichez un message à l'utilisateur pour lui indiquer que le formulaire est invalide
  //     console.error('Invalid form data. Please check the form.');
  //   }
  // }
  public confirmAdd(): void {
    if (this.jobsListForm.valid) {
      const formData = this.jobsListForm.value;
  
      if (this.action === 'add') {
        // Logic to add a new job
        const newJobsList: JobsList = {
          _id: formData.id,
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills,
          location: formData.location,
          contractType: formData.contractType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
          status: formData.status,
          publicationDate: formData.publicationDate,
          recruitingManager: formData.recruitingManager,
          applicants: formData.applicants
        };
  
        // Call the service method to add the new job
        this.jobsListService.addJob(newJobsList).subscribe({
          next: (response) => {
         
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Job added successfully!',
              confirmButtonText: 'OK'
            });
            this.dialogRef.close(); // Close the dialog after successful addition
          },
          error: (error) => {
        
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add job. Please try again.',
              confirmButtonText: 'OK'
            });
          }
        });
      } else if (this.action === 'edit') {
        // Logic to edit an existing job
        const updatedJobsList: JobsList = {
          _id: formData.id,
          title: formData.title,
          description: formData.description,
          requiredSkills: formData.requiredSkills,
          location: formData.location,
          contractType: formData.contractType,
          salary: formData.salary,
          applicationDeadline: formData.applicationDeadline,
          status: formData.status,
          publicationDate: formData.publicationDate,
          recruitingManager: formData.recruitingManager,
          applicants: formData.applicants
        };
  
        // Call the service method to update the existing job
        this.jobsListService.updateJob(updatedJobsList).subscribe({
          next: (response) => {
        
            Swal.fire({
              icon: 'success',
              title: 'Updated',
              text: 'Job updated successfully!',
              confirmButtonText: 'OK'
            });
            this.dialogRef.close(); // Close the dialog after successful update
            // this.JobsListComponent.refresh(); 
          },
          error: (error) => {
         
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update job. Please try again.',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    } else {

      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please check the form and try again.',
        confirmButtonText: 'OK'
      });
    }
  }
  
 
  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
  
    // Add the skill
    if (value) {
      const skills = this.jobsListForm.get('requiredSkills') as FormArray;
      skills.push(this.fb.control(value));
    }
  
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  
  
}

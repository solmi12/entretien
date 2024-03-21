import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { Section } from '../../../core/models/section';
import { SectionService } from '../../../core/services/sections.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../../core/services/questions.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { QuestionSection } from 'src/app/core/models/question_section';
import { lineAddEditButton } from 'src/app/shared/line-actions/add-edit-button/add-edit-button.component';

@Component({
    selector: 'app-section-form',
    templateUrl: './section-form.component.html',
    styleUrls: ['./section-form.component.scss'],
})
export class SectionFomrComponent implements OnInit {
    @Input('initialValues') initialValuesProps: any;
    @Output('questionSubmit') sectionEvent = new EventEmitter<Section>();

    private edit_modals: QueryList<lineAddEditButton>;

    @ViewChild('add_modal') lineAdd: lineAddEditButton;
    @ViewChild('edit_modal') lineEdit: lineAddEditButton;
    defaul_etat = 'Activée';
    form: FormGroup;

    questions = [];
sectionsQuestions: QuestionSection[] = [];


    section :Section[]=[];
    constructor(
        private fb: FormBuilder,
        private sectionService: SectionService,
        private questionService: QuestionService
    ) {}
    ngOnInit(): void {
        this.initializeValues();
        console.log(this.initialValuesProps);
    }

    drop(event: CdkDragDrop<any[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            const sectionId: number = this.getSectionIdFromAnotherSource();
            const questionIds: number[] = event.container.data.map(question => question.id);

            questionIds.forEach(questionId => {
                this.sectionsQuestions.push({ questionId, sectionId });
            });
        }
        console.log(this.sectionsQuestions);
    }



    private getSectionIdFromAnotherSource(): number {
       return this.form.get('id').value;
    }

    private initializeValues() {
        this.questions = this.questionService.getQuestions();

        this.form = this.fb.group({
            etat: new FormControl(
                this.initialValuesProps.etat != null ? this.initialValuesProps.etat : this.defaul_etat
            ),
            titre: new FormControl(this.initialValuesProps?.titre, {
                validators: [Validators.required, Validators.maxLength(60)],
            }),
            type: new FormControl('', Validators.required),
            id: this.initialValuesProps?.id,
        });
    }

   
    save() {
        const sectionData = this.form.value;
        const sectionId = sectionData.id;
        
        const uniqueQuestions = this.sectionsQuestions.filter(item => item.sectionId === sectionId && item.questionId)
                                                       .map(item => item.questionId)
                                                       .filter((value, index, self) => self.indexOf(value) === index);
        
        const numberOfQuestions = uniqueQuestions.length;
    
        sectionData.numberOfQuestions = numberOfQuestions;
        
        this.sectionEvent.emit(sectionData);
    }
    
    
}
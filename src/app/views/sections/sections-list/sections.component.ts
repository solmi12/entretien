import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Section, getSectionColumns, getSectionStatus } from 'src/app/core/models/section';
import { lineAddEditButton } from 'src/app/shared/line-actions/add-edit-button/add-edit-button.component';
import { SectionService } from '../../../core/services/sections.service';

@Component({
    selector: 'app-sections',
    templateUrl: './sections.component.html',
    styleUrls: ['./sections.component.scss'],
})
export class SectionComponent implements OnInit, AfterViewInit {
    @ViewChild('add_modal') lineAdd: lineAddEditButton;
    @ViewChild('edit_modal') lineEdit: lineAddEditButton;

    @ViewChildren('edit_modal')
    private edit_modals: QueryList<lineAddEditButton>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    sectionColumns = getSectionColumns();
    sectionStatus = getSectionStatus();

    constructor(private sectionService: SectionService) {}

    length = this.sectionService.temp_question_section.length;

    sections: any = [];
    ngOnInit(): void {
        this.sections = new MatTableDataSource<Section>(this.sectionService.getSections());
        this.sections.paginator = this.paginator;
        this.sections.sort = this.sort;
        this.sections.filterPredicate = (data: Section, filter: string) => {
            const searchTerm = filter.toLowerCase();
            return data.titre.toLowerCase().includes(searchTerm) || data.etat.toLowerCase().includes(searchTerm);
        };
    }
    
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.sections.filter = filterValue;
    }
    

    ngAfterViewInit(): void {
        if (this.sections.data.length > 0) {
            this.sections.paginator = this.paginator;
            this.sections.sort = this.sort;
        }
    }


    save(section: Section) {
        if (!!!section.id) {
            this.sectionService.createSection(section);

            this.sections = new MatTableDataSource<Section>(this.sectionService.getSections());

            this.modalEditHide(section);
        } else {
            this.sectionService.updateSection(section);
            this.sections = new MatTableDataSource<Section>(this.sectionService.getSections());

            this.modalEditHide(section);
        }
    }

    onDeleteChauffeur(section: Section) {
      this.sectionService.deleteSection(section);
      this.sections = new MatTableDataSource<Section>(this.sectionService.getSections());
      console.log();
  }
  getNumberOfQuestions(sectionId: number): number {
    return this.sectionService.getTempQuestionSectionLength(sectionId);
}
    modalEditHide(data) {
        console.log("Inside modalEditHide method");
        console.log("data");
        console.log(data);
        if (this.lineAdd.editModal.isShown) {
            this.lineAdd.modalEditHide();
        } else {
            this.edit_modals.forEach((x) => {
                if (x.data['id'] === data['id']) {
                    x.modalEditHide();
                }
            });
        }
    }


}
import { Injectable } from '@angular/core';
import { question_section, sections } from './data';
import { Section } from '../models/section';
import { QuestionSection } from '../models/question_section';

@Injectable({
    providedIn: 'root',
})
export class SectionService {
    temp_sections = [...sections];
    temp_question_section = [...question_section];
    temp_questions = [];


    constructor() {}

    createSection(section: Section) {

      let id = this.temp_sections.length+ 1;


      let temp_section = {
          id: id,
          titre: section.titre,
          etat: section.etat,

      };
      this.temp_sections.push({ ...temp_section });

      this.temp_questions.forEach(question => {
          this.affecterQuestions(question.id, temp_section.id);
      });
      console.log(this.temp_question_section)




  }

    
    updateSection(section:Section) {
        var foundIndex = this.temp_sections.findIndex((x) => x.id == section.id);

        this.temp_sections[foundIndex] = section;
    }

    deleteSection(section: Section) {
      const newArr = this.temp_sections.filter((object) => {
        return object.id !== section.id;
    });

    this.temp_sections = newArr;
    }
  //   affecterQuestions(questionIds: number[], sectionId: number): QuestionSection[] {
  //       const newQuestionSections: QuestionSection[] = [];
  //       questionIds.forEach(questionId => {
  //           const newQuestionSection = { questionId, sectionId };
  //           this.temp_question_section.push(newQuestionSection);
  //           newQuestionSections.push(newQuestionSection);
  //       });
  //       return newQuestionSections;
  //   }
  //   getTempQuestionSectionLength(): number {
  //     return this.temp_question_section.length;
  // }
  affecterQuestions(questionIds: number[], sectionId: number): void {
    this.temp_question_section = this.temp_question_section.filter(questionSection => questionSection.sectionId !== sectionId);
    questionIds.forEach(questionId => {
        const newQuestionSection = { questionId, sectionId };
        this.temp_question_section.push(newQuestionSection);
    });
}

getTempQuestionSectionLength(sectionId: number): number {
    return this.temp_question_section.filter(questionSection => questionSection.sectionId === sectionId).length;
}

    getSections(): Section[] {
        return this.temp_sections;
    }
}

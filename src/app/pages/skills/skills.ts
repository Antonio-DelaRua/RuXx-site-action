import { Component } from '@angular/core';
import { TreeSkillsComponent } from "../../components/treeskills/treeskills";
import { ParticlesBackground } from "../../components/particles-background/particles-background"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TreeSkillsComponent, ParticlesBackground, CommonModule],
  templateUrl: 'skills.html',
  styleUrl: 'skills.css',
})
export class Skills {

}
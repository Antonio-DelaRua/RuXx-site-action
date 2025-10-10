import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { loadSlim } from "@tsparticles/slim";
import { CardComponent } from '../card/card';
import { ProjectService } from '../../services/project.service';


export interface SkillNode {
  name: string;
  level: number;
  icon?: string;
  children?: SkillNode[];
  description?: string;
}

@Component({
  selector: 'app-tree-skills',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: 'treeskills.html',
  styleUrls: ['treeskills.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInOut', [
      state('open', style({
        height: '*',
        opacity: 1
      })),
      state('closed', style({
        height: '0px',
        opacity: 0
      })),
      transition('open <=> closed', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ]),
    trigger('rotateIcon', [
      state('open', style({
        transform: 'rotate(90deg)'
      })),
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      transition('open <=> closed', [
        animate('250ms ease-in-out')
      ])
    ])
  ]
})
export class TreeSkillsComponent implements OnInit {
  @Input() skills: SkillNode[] = [];
  @Input() title: string = 'My Skills';
  projects: any[] = [];
  constructor(private projectService: ProjectService) {}

  expandedNodes: Set<string> = new Set();

  toggleNode(node: SkillNode): void {
    const nodeId = this.getNodeId(node);
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  isExpanded(node: SkillNode): boolean {
    return this.expandedNodes.has(this.getNodeId(node));
  }

  hasChildren(node: SkillNode): boolean {
    return !!node.children && node.children.length > 0;
  }

  private getNodeId(node: SkillNode): string {
    return node.name.toLowerCase().replace(/\s+/g, '-');
  }

  getLevelBars(level: number): boolean[] {
    return Array(5).fill(0).map((_, i) => i < level);
  }

  // Datos de ejemplo si no se proporcionan inputs
  ngOnInit() {
    if (this.skills.length === 0) {
      this.skills = this.getDefaultSkills();

    }
    this.projects = this.projectService.getProjects();
  }

  

  private getDefaultSkills(): SkillNode[] {
    return [
      {
        name: 'Frontend Development',
        level: 5,
        icon: '💻',
        children: [
          {
            name: 'Angular',
            level: 5,
            icon: '🅰️',
            children: [
              { name: 'Standalone Components', level: 5, description: 'Expert in modern Angular architecture' },
              { name: 'Signals', level: 4, description: 'Advanced reactive state management' },
              { name: 'Material UI', level: 5, description: 'Custom component development' }
            ]
          },
          {
            name: 'TypeScript',
            level: 5,
            icon: '📘',
            children: [
              { name: 'Advanced Types', level: 4 },
              { name: 'Decorators', level: 5 }
            ]
          },
          {
            name: 'React',
            level: 4,
            icon: '⚛️',
            children: [
              { name: 'Hooks', level: 4 },
              { name: 'Context API', level: 4 }
            ]
          }
        ]
      },
      {
        name: 'Backend Development',
        level: 4,
        icon: '⚙️',
        children: [
          {
            name: 'Node.js',
            level: 5,
            icon: '🟢',
            children: [
              { name: 'Express.js', level: 5 },
              { name: 'REST APIs', level: 5 }
            ]
          },
          { name: 'Python', level: 3, icon: '🐍' },
          { name: 'Databases', level: 4, icon: '🗄️' }
        ]
      },
      {
        name: 'DevOps & Tools',
        level: 4,
        icon: '🔧',
        children: [
          { name: 'Docker', level: 4, icon: '🐳' },
          { name: 'Git', level: 5, icon: '📚' },
          { name: 'CI/CD', level: 4, icon: '🔄' }
        ]
      }
    ];
  }

}
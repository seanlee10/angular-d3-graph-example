import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph, Tree, Node } from '../../d3';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g transform="translate(0, 0)"></g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @Input('nodes') nodes;
  @Input('links') links;
  graph: Tree;
  treeData = {
    'name': 'Khalid',
    'title': 'VP, Research',
    'children': [
      {
        'name': 'Afsaneh',
        'title': 'Director, Research',
        'children': [
          {
            'name': 'Kanika',
            'title': 'Research Engineer'
          },
          {
            'name': 'Julian',
            'title': 'Research Scientist'
          },
          {
            'name': 'Raheleh',
            'title': 'Research Engineer'
          }
        ]
      },
      {
        'name': 'Amir',
        'title': 'Director, Research',
        'children': [
          { 'name': 'Ali',
            'title': 'Research Scientist' },
          { 'name': 'Carter',
            'title': 'Research Engineer' },
          { 'name': 'Hector',
            'title': 'Research Scientist' }
        ]
      },
      {
        'name': 'Bill',
        'title': 'Sr Director, Technology',
        'children': [
          {
            'name': 'Arun',
            'children': [
              {'name': 'George'},
              {'name': 'Kajsa'},
              {'name': 'Ramdev'},
              {'name': 'Ronald'},
              {'name': 'Hiroko'},
              {'name': 'Wandee'}
            ]
          },
          {
            'name': 'Mike',
            'children': [
              { 'name': 'Lisa' },
              { 'name': 'Saro' },
              { 'name': 'Stephanie' },
              { 'name': 'Taeyon' },
              { 'name': 'Vince' },
              { 'name': 'Zack' }
            ]
          },
          { 'name': 'Domingo' },
          {
            'name': 'John',
            'children': [
              { 'name': 'Mark' },
              { 'name': 'Merine' },
              { 'name': 'Robert' },
              { 'name': 'Russ' },
              { 'name': 'Steven' },
              { 'name': 'Tom' }
            ]
          },
          {
            'name': 'Taimur',
            'children': [
              { 'name': 'Sean',
                'title': 'Web Application Developer' },
              { 'name': 'Jia' },
              { 'name': 'Luis' },
              { 'name': 'Luna' },
              { 'name': 'Sid' },
              { 'name': 'William' }
            ]
          }
        ]
      },
      {
        'name': 'Frank',
        'title': 'Director, Research',
        'children': [
          { 'name': 'Charese' },
          { 'name': 'Dezhao' },
          { 'name': 'Elnaz' },
          { 'name': 'Hugo' },
          { 'name': 'Jack' },
          { 'name': 'Thomas' }
        ]
      },
      {
        'name': 'Sameena',
        'title': 'Director, Research',
        'children': [
          { 'name': 'Armineh' },
          { 'name': 'Chong' },
          { 'name': 'Shawn' }
        ]
      },
      {
        'name': 'Jochen',
        'title': 'Director, Research',
        'children': [
          { 'name': 'Fabio' },
          { 'name': 'Natraj' },
          { 'name': 'Timothy' }
        ]
      },
      {
        'name': 'Tonya',
        'title': 'Director, Research',
        'children': [
          { 'name': 'Bob' },
          { 'name': 'Conner' },
          { 'name': 'Gayle' },
          { 'name': 'Fillipo' },
          { 'name': 'Sean' },
          { 'name': 'Don' },
          { 'name': 'Xin' }
        ]
      }
    ]
  };
  public root: any;
  private _options: { width, height } = { width: 800, height: 600 };

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.graph.initSimulation(this.options);
  // }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getTree(this.treeData, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    // this.graph.ticker.subscribe((d) => {
    //   this.ref.markForCheck();
    // });
  }

  ngAfterViewInit() {
    this.root = d3.hierarchy(this.treeData, (d: any) => d.children);
    this.root.x0 = this.options.width / 2;
    this.root.y0 = 0;

    this.root.children.forEach(this.graph.collapse);

    this.graph.update(this.root);
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}

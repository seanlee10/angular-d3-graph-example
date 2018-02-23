import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';

export class Tree {
  public tree: any;
  public nodes: Node[] = [];
  public links: Link[] = [];
  i = 0;
  duration = 750;

  constructor(treeData, options: { width, height }) {
    this.tree = d3.tree().size([options.width, options.height]);
  }

  update(root) {
    // Assigns the x and y position for the nodes
    const treeData = this.tree(root);
    const svg = d3.select('svg');

    // Compute the new tree layout.
    this.nodes = treeData.descendants();
    this.links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    this.nodes.forEach((d: any) => {
      d.x = d.x + 0;
      d.y = d.depth * 120 + 80;
    });

    // ****************** Nodes section ***************************

    const node = svg.selectAll('g.node')
      .data(this.nodes, (d: any) => d.id || (d.id = ++this.i));

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => 'translate(' + root.x0 + ',' + root.y0 + ')')
      .on('click', (d: any) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.update(root);
      })
      .on('mouseover', (d: any) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(d.data.title)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add Circle for the nodes
    nodeEnter.append('rect')
      .attr('class', 'node')
      .attr('width', 1e-6)
      .attr('height', 1e-6)
      .style('fill', (d: any) => {
        return d._children ? 'lightsteelblue' : '#e5e5e5';
      });

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr('dy', '1.25em')
      .attr('text-anchor', (d: any) => d.children || d._children ? 'middle' : 'middle')
      .text((d: any) => d.data.name);

    // Add labels for the nodes
    // nodeEnter.append('text')
    //   .attr('dy', '2.5em')
    //   .attr('text-anchor', (d: any) => d.children || d._children ? 'middle' : 'middle')
    //   .text((d: any) => 'Senior Software Developer');

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')');

    // Update the node attributes and style
    nodeUpdate.select('rect.node')
      .attr('x', -40)
      .attr('width', 80)
      .attr('height', 30)
      .style('fill', '#fff')
      .style('stroke', (d: any) => d._children ? 'lightsteelblue' : 'lightgray')
      .style('stroke-width', 2)
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', (d) => 'translate(' + root.x + ',' + root.y + ')')
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('rect')
      .attr('width', 1e-6)
      .attr('height', 1e-6)

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = svg.selectAll('path.link')
      .data(this.links, (d: any) => d.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = {x: root.x0, y: root.y0};
        return diagonal(o, o);
      });

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d: any) => diagonal(d, d.parent))
      .attr('stroke', 'lightgray')
      .attr('fill', 'transparent');

    // Remove any exiting links
    const linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        const o = {x: root.x, y: root.y};
        return diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    this.nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      // return `M ${s.x} ${s.y}
      //         S ${(s.x + d.x) / 2} ${d.y - 20},
      //         ${d.x} ${d.y}`
      return `M ${s.x} ${s.y}
            Q ${(s.x + d.x) / 2} ${(s.y + d.y) / 2},
              ${d.x} ${d.y + 30}`;
    }
  }

  collapse = (d) => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }


  // connectNodes(source, target) {
  //   let link;
  //
  //   if (!this.nodes[source] || !this.nodes[target]) {
  //     throw new Error('One of the nodes does not exist');
  //   }
  //
  //   link = new Link(source, target);
  //   this.simulation.stop();
  //   this.links.push(link);
  //   this.simulation.alphaTarget(0.3).restart();
  //
  //   this.initLinks();
  // }
  //
  // initNodes() {
  //   if (!this.simulation) {
  //     throw new Error('simulation was not initialized yet');
  //   }
  //
  //   this.simulation.nodes(this.nodes);
  // }
  //
  // initLinks() {
  //   if (!this.simulation) {
  //     throw new Error('simulation was not initialized yet');
  //   }
  //
  //   this.simulation.force('links',
  //     d3.forceLink(this.links)
  //       .id(d => d['id'])
  //       .strength(FORCES.LINKS)
  //   );
  // }
  //
  // initSimulation(options) {
  //   if (!options || !options.width || !options.height) {
  //     throw new Error('missing options when initializing simulation');
  //   }
  //
  //   /** Creating the simulation */
  //   if (!this.simulation) {
  //     const ticker = this.ticker;
  //
  //     this.simulation = d3.forceSimulation()
  //       .force('charge',
  //         d3.forceManyBody()
  //           .strength(d => FORCES.CHARGE * d['r'])
  //       )
  //       .force('collide',
  //         d3.forceCollide()
  //           .strength(FORCES.COLLISION)
  //           .radius(d => d['r'] + 5).iterations(2)
  //       );
  //
  //     // Connecting the d3 ticker to an angular event emitter
  //     this.simulation.on('tick', function () {
  //       ticker.emit(this);
  //     });
  //
  //     this.initNodes();
  //     this.initLinks();
  //   }
  //
  //   /** Updating the central force of the simulation */
  //   this.simulation.force('centers', d3.forceCenter(options.width / 2, options.height / 2));
  //
  //   /** Restarting the simulation internal timer */
  //   this.simulation.restart();
  // }
}

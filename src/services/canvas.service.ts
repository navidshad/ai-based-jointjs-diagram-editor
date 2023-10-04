import { waitUntil } from '@/helpers/promise'
import { dia, elementTools, linkTools } from 'jointjs'

import { HierarchyItem, ToolsViewItem } from '../model/hierarchy.model'

import { type CustomElementView } from '../types/general'
import { HierarchyStore } from './hierarchy-store.service'

export class CanvasService {
  private inited = false

  graph!: dia.Graph
  paper!: dia.Paper
  hierarchyStore: HierarchyStore

  constructor() {
    this.hierarchyStore = new HierarchyStore()
  }

  async afterInit() {
    return waitUntil(() => !this.inited)
  }

  setup(graph: dia.Graph, paper: dia.Paper) {
    this.graph = graph
    this.paper = paper
    this.inited = true
  }

  destroy() {
    this.graph.clear()
    // @ts-ignore
    this.paper.remove()
  }

  updateByJson(json: string) {
    try {
      this.graph.fromJSON(json)
      this.hierarchyStore.clear()

      this.graph.getElements().forEach((el) => {
        this.addStandardToolsViewsForElement(el)
      })

      this.graph.getLinks().forEach((el) => {
        this.addStandardToolsViewsForLink(el)
      })
    } catch (error) {
      console.error(error)
    }
  }

  addElement(element: dia.Element) {
    element.addTo(this.graph)
    this.addStandardToolsViewsForElement(element)
  }

  addStandardToolsViewsForElement(element: dia.Element) {
    const boundaryTool = new elementTools.Boundary()

    const toolsView = new dia.ToolsView({
      tools: [boundaryTool]
    })

    const elementView: CustomElementView = element.findView(this.paper) as CustomElementView

    elementView.addTools(toolsView)
    elementView.hideTools()

    elementView.id = element.id.toString()

    const hierarchyItem = new HierarchyItem({
      id: elementView.id,
      name: element.attr('label/text'),
      element: element,
      toolsViewList: [new ToolsViewItem('hover', toolsView)]
    })

    this.hierarchyStore.add(hierarchyItem)
  }

  addStandardToolsViewsForLink(link: dia.Link) {
    // Add remove button to the link.
    const tools = new dia.ToolsView({
      tools: [new linkTools.Remove()]
    })

    link.findView(this.paper).addTools(tools)
  }
}

export const canvas = new CanvasService()

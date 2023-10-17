import { defineStore } from 'pinia'
import type { CustomElementView, Diagram } from '@/types/general'
import { HierarchyStore } from '@/services/hierarchy-store.service'
import { dia, elementTools, linkTools, shapes } from 'jointjs'
import { useConfigStore } from './config'
import { HierarchyItem, ToolsViewItem } from '@/model/hierarchy.model'
import { ref } from 'vue'

export const useDiagramStore = defineStore('diagram', () => {
  const hierarchyStore = new HierarchyStore()
  const graph = new dia.Graph([], { cellNamespace: shapes })
  const paper = ref<dia.Paper>(new dia.Paper({}))

  function addPaper(options: dia.Paper.Options) {
    paper.value = new dia.Paper(options)
  }

  function inserDiagramData(data: Diagram | string) {
    if (typeof data == 'string') {
      data = JSON.parse(data)
    }

    try {
      graph.fromJSON(data)
      hierarchyStore.clear()

      graph.getElements().forEach((el) => {
        addStandardToolsViewsForElement(el)
      })

      graph.getLinks().forEach((el) => {
        addStandardToolsViewsForLink(el)
      })
    } catch (error) {
      console.error('Error while parsing diagram data', error)
    }

    // Update parent window with graph
    useConfigStore().updateParentWindowWithGraph(data as Diagram)
  }

  function addElement(element: dia.Element) {
    element.addTo(graph)
    addStandardToolsViewsForElement(element)
  }

  function addStandardToolsViewsForElement(element: dia.Element) {
    const boundaryTool = new elementTools.Boundary()

    const toolsView = new dia.ToolsView({
      tools: [boundaryTool]
    })

    const elementView: CustomElementView = element.findView(
      paper.value as dia.Paper
    ) as CustomElementView

    elementView.addTools(toolsView)
    elementView.hideTools()

    elementView.id = element.id.toString()

    const hierarchyItem = new HierarchyItem({
      id: elementView.id,
      name: element.attr('label/text'),
      element: element,
      toolsViewList: [new ToolsViewItem('hover', toolsView)]
    })

    hierarchyStore.add(hierarchyItem)
  }

  function addStandardToolsViewsForLink(link: dia.Link) {
    // Add remove button to the link.
    const tools = new dia.ToolsView({
      tools: [new linkTools.Remove()]
    })

    link.findView(paper.value as dia.Paper).addTools(tools)
  }

  return {
    graph,
    paper,
    hierarchyStore,

    inserDiagramData,
    addPaper,
    addElement,
    addStandardToolsViewsForElement,
    addStandardToolsViewsForLink
  }
})
